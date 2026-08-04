import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';

import {
  createWeekDays,
  normalizeDepartment,
  weekDays as initialWeekDays,
  type Department,
  type FamilyMember,
  type Recipe,
  type WeekDay,
} from '@/data/mock-data';
import {
  createCloudRecipe,
  deleteCloudRecipe,
  ensurePeasMakerRecipes,
  loadCloudRecipes,
  updateCloudRecipe,
} from '@/lib/recipe-repository';
import { removePersistedRecipeImage } from '@/lib/recipe-image-storage';
import { normalizeIngredientQuantity } from '@/lib/ingredient-parser';
import {
  addCloudShoppingItem,
  loadCloudPlannedMeals,
  loadSharedState,
  removeCloudMealPlan,
  removeCloudShoppingItem,
  saveCloudMealPlan,
  saveCloudMealAttendance,
  saveCloudRating,
  setCloudShoppingItemChecked,
  setCloudShoppingItemDepartment,
} from '@/lib/shared-state-repository';
import type { LeftoverMeals, MealAttendance } from '@/lib/shared-state-repository';
import { updateMealPlanWidgets } from '@/lib/meal-plan-widgets';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/state/auth-provider';

type PlannedMeals = Record<string, string | undefined>;
type Ratings = Record<string, Record<string, number | undefined>>;
type ExcludedIngredients = Record<string, string[]>;

export type NewRecipe = Omit<Recipe, 'id'>;

export type ShoppingItem = {
  id: string;
  name: string;
  amount: number;
  unit: string;
  department: Department;
  recipes: string[];
  isManual: boolean;
  sources: ShoppingItemSource[];
};

export type ShoppingItemSource =
  | { type: 'recipe'; title: string; amount: number }
  | { type: 'manual'; title: 'Los toegevoegd'; amount: number };

export type NewShoppingItem = Pick<ShoppingItem, 'name' | 'amount' | 'unit' | 'department'>;

type MealMateContextValue = {
  recipes: Recipe[];
  weekDays: WeekDay[];
  familyMembers: FamilyMember[];
  plannedMeals: PlannedMeals;
  leftoverMeals: LeftoverMeals;
  ratings: Ratings;
  mealAttendance: MealAttendance;
  shoppingItems: ShoppingItem[];
  completedShoppingIds: string[];
  addShoppingItem: (item: NewShoppingItem) => Promise<void>;
  removeShoppingItem: (itemId: string) => Promise<void>;
  addRecipe: (recipe: NewRecipe) => Promise<Recipe>;
  updateRecipe: (recipeId: string, recipe: NewRecipe, imageChanged: boolean) => Promise<Recipe>;
  removeRecipe: (recipeId: string) => Promise<void>;
  planMeal: (
    dayId: string,
    recipeId: string,
    atHomeIngredientIds: string[],
    leftoverFrom?: string,
  ) => Promise<void>;
  removeMeal: (dayId: string) => Promise<void>;
  rateRecipe: (recipeId: string, memberId: string, score: number) => Promise<void>;
  setMealAttendance: (dayId: string, memberId: string, isEating: boolean) => Promise<void>;
  toggleShoppingItem: (itemId: string) => Promise<void>;
  updateShoppingItemDepartment: (itemId: string, department: Department) => Promise<void>;
  changeWeek: (direction: -1 | 1) => Promise<void>;
  reloadHousehold: () => Promise<void>;
  getRecipe: (recipeId?: string) => Recipe | undefined;
};

const MealMateContext = createContext<MealMateContextValue | null>(null);

const shoppingId = (name: string, unit: string) =>
  `${name}-${unit}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const customRecipesStorageKey = 'mealmate.custom-recipes.v1';
const shoppingDepartmentsStorageKey = 'mealmate.shopping-departments.v1';

const createWidgetPlanningDays = () => {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  return [0, 1, 2].flatMap((weekOffset) => {
    const weekStart = new Date(monday);
    weekStart.setDate(monday.getDate() + weekOffset * 7);
    return createWeekDays(weekStart);
  });
};

export function MealMateProvider({ children }: PropsWithChildren) {
  const { avatarUrl, session } = useAuth();
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [plannedMeals, setPlannedMeals] = useState<PlannedMeals>({});
  const [leftoverMeals, setLeftoverMeals] = useState<LeftoverMeals>({});
  const [excludedIngredients, setExcludedIngredients] = useState<ExcludedIngredients>({});
  const [ratings, setRatings] = useState<Ratings>({});
  const [mealAttendance, setMealAttendanceState] = useState<MealAttendance>({});
  const [completedShoppingIds, setCompletedShoppingIds] = useState<string[]>([]);
  const [manualShoppingItems, setManualShoppingItems] = useState<ShoppingItem[]>([]);
  const [shoppingDepartments, setShoppingDepartments] = useState<Record<string, Department>>({});
  const [weekDays, setWeekDays] = useState<WeekDay[]>(initialWeekDays);
  const [isWidgetDataReady, setIsWidgetDataReady] = useState(false);

  useEffect(() => {
    let active = true;

    const initialiseRecipes = async () => {
      let localRecipes: Recipe[] = [];
      let localShoppingDepartments: Record<string, Department> = {};
      try {
        const [storedRecipes, storedShoppingDepartments] = await Promise.all([
          AsyncStorage.getItem(customRecipesStorageKey),
          AsyncStorage.getItem(shoppingDepartmentsStorageKey),
        ]);
        if (storedRecipes) {
          const parsedRecipes = JSON.parse(storedRecipes) as Recipe[];
          if (Array.isArray(parsedRecipes)) {
            localRecipes = parsedRecipes.map((recipe) => ({
              ...recipe,
              ingredients: recipe.ingredients.map((ingredient) =>
                normalizeIngredientQuantity({
                  ...ingredient,
                  department: normalizeDepartment(ingredient.department),
                }),
              ),
            }));
          }
        }
        if (storedShoppingDepartments) {
          localShoppingDepartments = Object.fromEntries(
            Object.entries(JSON.parse(storedShoppingDepartments) as Record<string, string>).map(
              ([itemId, department]) => [itemId, normalizeDepartment(department)],
            ),
          );
        }
      } catch {
        // Een beschadigde lokale cache mag de app niet blokkeren.
      }

      if (active) setCustomRecipes(localRecipes);
      if (active) setShoppingDepartments(localShoppingDepartments);
      if (!isSupabaseConfigured) {
        if (active) setIsWidgetDataReady(true);
        return;
      }

      try {
        await ensurePeasMakerRecipes();
        let cloudRecipes = await loadCloudRecipes();
        if (cloudRecipes.length === 0 && localRecipes.length > 0) {
          cloudRecipes = [];
          for (const { id: _localId, ...recipe } of localRecipes) {
            cloudRecipes.push(await createCloudRecipe(recipe));
          }
        }

        const [sharedState, widgetPlannedMeals] = await Promise.all([
          loadSharedState(initialWeekDays),
          loadCloudPlannedMeals(createWidgetPlanningDays()),
        ]);

        if (!active) return;
        setCustomRecipes(cloudRecipes);
        setFamilyMembers(sharedState.familyMembers);
        setPlannedMeals({ ...widgetPlannedMeals, ...sharedState.plannedMeals });
        setLeftoverMeals(sharedState.leftoverMeals);
        setExcludedIngredients(sharedState.excludedIngredients);
        setRatings(sharedState.ratings);
        setMealAttendanceState(sharedState.mealAttendance);
        setCompletedShoppingIds(sharedState.completedShoppingIds);
        const syncedDepartments = {
          ...localShoppingDepartments,
          ...sharedState.shoppingDepartments,
        };
        setShoppingDepartments(syncedDepartments);
        setManualShoppingItems(
          sharedState.manualShoppingItems.map((item) => ({
            ...item,
            recipes: [],
            isManual: true,
            sources: [{ type: 'manual', title: 'Los toegevoegd', amount: item.amount }],
          })),
        );
        await AsyncStorage.setItem(customRecipesStorageKey, JSON.stringify(cloudRecipes));
        await AsyncStorage.setItem(
          shoppingDepartmentsStorageKey,
          JSON.stringify(syncedDepartments),
        );
      } catch (error) {
        // Bij geen internet blijft de laatst opgeslagen lokale cache beschikbaar.
        if (__DEV__) console.warn('Tably cloud sync failed', error);
      } finally {
        if (active) setIsWidgetDataReady(true);
      }
    };

    void initialiseRecipes();

    return () => {
      active = false;
    };
  }, []);

  const reloadHousehold = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    const cloudRecipes = await loadCloudRecipes();
    const widgetPlanningDays = createWidgetPlanningDays();
    const [sharedState, widgetPlannedMeals] = await Promise.all([
      loadSharedState(weekDays),
      loadCloudPlannedMeals(widgetPlanningDays),
    ]);
    setCustomRecipes(cloudRecipes);
    setFamilyMembers(sharedState.familyMembers);
    setPlannedMeals((current) => ({
      ...Object.fromEntries(
        Object.entries(current).filter(
          ([isoDate]) =>
            !widgetPlanningDays.some((day) => day.isoDate === isoDate) &&
            !weekDays.some((day) => day.isoDate === isoDate),
        ),
      ),
      ...widgetPlannedMeals,
      ...sharedState.plannedMeals,
    }));
    setLeftoverMeals(sharedState.leftoverMeals);
    setExcludedIngredients(sharedState.excludedIngredients);
    setRatings(sharedState.ratings);
    setMealAttendanceState(sharedState.mealAttendance);
    setCompletedShoppingIds(sharedState.completedShoppingIds);
    setShoppingDepartments((current) => {
      const updated = { ...current, ...sharedState.shoppingDepartments };
      void AsyncStorage.setItem(shoppingDepartmentsStorageKey, JSON.stringify(updated));
      return updated;
    });
    setManualShoppingItems(
      sharedState.manualShoppingItems.map((item) => ({
        ...item,
        recipes: [],
        isManual: true,
        sources: [{ type: 'manual', title: 'Los toegevoegd', amount: item.amount }],
      })),
    );
    await AsyncStorage.setItem(customRecipesStorageKey, JSON.stringify(cloudRecipes));
  }, [weekDays]);

  const changeWeek = useCallback(
    async (direction: -1 | 1) => {
      const nextMonday = new Date(`${weekDays[0].isoDate}T12:00:00`);
      nextMonday.setDate(nextMonday.getDate() + direction * 7);
      const nextWeekDays = createWeekDays(nextMonday);
      setWeekDays(nextWeekDays);
      setCompletedShoppingIds([]);

      if (!isSupabaseConfigured) return;
      try {
        const sharedState = await loadSharedState(nextWeekDays);
        setPlannedMeals((current) => {
          const updated = { ...current };
          nextWeekDays.forEach((day) => delete updated[day.isoDate]);
          return { ...updated, ...sharedState.plannedMeals };
        });
        setLeftoverMeals((current) => {
          const updated = { ...current };
          nextWeekDays.forEach((day) => delete updated[day.isoDate]);
          return { ...updated, ...sharedState.leftoverMeals };
        });
        setExcludedIngredients((current) => {
          const updated = { ...current };
          nextWeekDays.forEach((day) => delete updated[day.isoDate]);
          return { ...updated, ...sharedState.excludedIngredients };
        });
        setRatings(sharedState.ratings);
        setMealAttendanceState((current) => {
          const updated = { ...current };
          nextWeekDays.forEach((day) => delete updated[day.isoDate]);
          return { ...updated, ...sharedState.mealAttendance };
        });
        setFamilyMembers(sharedState.familyMembers);
        setCompletedShoppingIds(sharedState.completedShoppingIds);
        setShoppingDepartments((current) => ({
          ...current,
          ...sharedState.shoppingDepartments,
        }));
        setManualShoppingItems(
          sharedState.manualShoppingItems.map((item) => ({
            ...item,
            recipes: [],
            isManual: true,
            sources: [{ type: 'manual', title: 'Los toegevoegd', amount: item.amount }],
          })),
        );
      } catch (error) {
        setWeekDays(weekDays);
        throw error;
      }
    },
    [weekDays],
  );

  const recipes = useMemo(() => customRecipes, [customRecipes]);
  const displayedFamilyMembers = useMemo(
    () =>
      familyMembers.map((member) =>
        member.linkedUserId === session?.user.id && avatarUrl
          ? { ...member, avatarUrl }
          : member,
      ),
    [avatarUrl, familyMembers, session?.user.id],
  );

  useEffect(() => {
    if (!isWidgetDataReady) return;

    void updateMealPlanWidgets(plannedMeals, recipes).catch((error) => {
      if (__DEV__) console.warn('Tably widget update failed', error);
    });

    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') return;
      void updateMealPlanWidgets(plannedMeals, recipes).catch((error) => {
        if (__DEV__) console.warn('Tably widget refresh failed', error);
      });
    });

    return () => subscription.remove();
  }, [isWidgetDataReady, plannedMeals, recipes]);

  const addRecipe = useCallback(async (input: NewRecipe) => {
    const recipe: Recipe = isSupabaseConfigured
      ? await createCloudRecipe(input)
      : {
          ...input,
          id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        };

    setCustomRecipes((current) => {
      const updated = [...current, recipe];
      void AsyncStorage.setItem(customRecipesStorageKey, JSON.stringify(updated));
      return updated;
    });

    return recipe;
  }, []);

  const updateRecipe = useCallback(
    async (recipeId: string, input: NewRecipe, imageChanged: boolean) => {
      const recipe = isSupabaseConfigured
        ? await updateCloudRecipe(recipeId, input, imageChanged)
        : { ...input, id: recipeId };

      setCustomRecipes((current) => {
        const updated = current.map((candidate) =>
          candidate.id === recipeId ? { ...recipe, clientKey: candidate.clientKey } : candidate,
        );
        void AsyncStorage.setItem(customRecipesStorageKey, JSON.stringify(updated));
        return updated;
      });

      setCompletedShoppingIds([]);
      return recipe;
    },
    [],
  );

  const removeRecipe = useCallback(async (recipeId: string) => {
    const recipe = customRecipes.find((candidate) => candidate.id === recipeId);
    if (!recipe) return;

    if (isSupabaseConfigured) await deleteCloudRecipe(recipeId);

    const localImageUri =
      recipe.image && typeof recipe.image !== 'number' && 'uri' in recipe.image
        ? recipe.image.uri ?? null
        : null;
    removePersistedRecipeImage(localImageUri);

    setCustomRecipes((current) => {
      const updated = current.filter((candidate) => candidate.id !== recipeId);
      void AsyncStorage.setItem(customRecipesStorageKey, JSON.stringify(updated));
      return updated;
    });
    setPlannedMeals((current) =>
      Object.fromEntries(
        Object.entries(current).map(([day, plannedRecipeId]) => [
          day,
          plannedRecipeId === recipeId ? undefined : plannedRecipeId,
        ]),
      ),
    );
    setLeftoverMeals((current) => {
      const updated = { ...current };
      Object.entries(plannedMeals).forEach(([day, plannedRecipeId]) => {
        if (plannedRecipeId === recipeId) updated[day] = undefined;
      });
      return updated;
    });
    setExcludedIngredients((current) => {
      const updated = { ...current };
      Object.entries(plannedMeals).forEach(([day, plannedRecipeId]) => {
        if (plannedRecipeId === recipeId) updated[day] = [];
      });
      return updated;
    });
    setRatings((current) => {
      const updated = { ...current };
      delete updated[recipeId];
      return updated;
    });
    setCompletedShoppingIds([]);
  }, [customRecipes, plannedMeals]);

  const getRecipe = useCallback(
    (recipeId?: string) => recipes.find((recipe) => recipe.id === recipeId),
    [recipes],
  );

  const planMeal = useCallback(
    async (
      dayId: string,
      recipeId: string,
      atHomeIngredientIds: string[],
      leftoverFrom?: string,
    ) => {
      const day = weekDays.find((item) => item.id === dayId || item.isoDate === dayId);
      if (!day) return;
      setPlannedMeals((current) => ({ ...current, [day.isoDate]: recipeId }));
      setExcludedIngredients((current) => ({
        ...current,
        [day.isoDate]: leftoverFrom ? [] : atHomeIngredientIds,
      }));
      setLeftoverMeals((current) => ({ ...current, [day.isoDate]: leftoverFrom }));
      setCompletedShoppingIds([]);

      if (!isSupabaseConfigured) return;
      const recipe = recipes.find((item) => item.id === recipeId);
      if (!recipe) return;
      try {
        await saveCloudMealPlan(day, recipe, atHomeIngredientIds, leftoverFrom);
      } catch (error) {
        if (__DEV__) console.warn('Tably weekmenu sync failed', error);
      }
    },
    [recipes, weekDays],
  );

  const removeMeal = useCallback(async (dayId: string) => {
    const day = weekDays.find((item) => item.id === dayId || item.isoDate === dayId);
    if (!day) return;
    setPlannedMeals((current) => ({ ...current, [day.isoDate]: undefined }));
    setLeftoverMeals((current) => ({ ...current, [day.isoDate]: undefined }));
    setExcludedIngredients((current) => ({ ...current, [day.isoDate]: [] }));
    if (!isSupabaseConfigured) return;
    try {
      await removeCloudMealPlan(day);
    } catch (error) {
      if (__DEV__) console.warn('Tably weekmenu delete failed', error);
    }
  }, [weekDays]);

  const rateRecipe = useCallback(async (recipeId: string, memberId: string, score: number) => {
    if (isSupabaseConfigured) await saveCloudRating(recipeId, memberId, score);
    setRatings((current) => ({
      ...current,
      [recipeId]: { ...current[recipeId], [memberId]: score },
    }));
  }, []);

  const setMealAttendance = useCallback(
    async (dayId: string, memberId: string, isEating: boolean) => {
      const day = weekDays.find((item) => item.id === dayId || item.isoDate === dayId);
      if (!day) return;
      setMealAttendanceState((current) => ({
        ...current,
        [day.isoDate]: { ...current[day.isoDate], [memberId]: isEating },
      }));
      if (!isSupabaseConfigured) return;
      try {
        await saveCloudMealAttendance(day.isoDate, memberId, isEating);
      } catch (error) {
        setMealAttendanceState((current) => ({
          ...current,
          [day.isoDate]: { ...current[day.isoDate], [memberId]: !isEating },
        }));
        throw error;
      }
    },
    [weekDays],
  );

  const shoppingItems = useMemo(() => {
    const items = new Map<string, ShoppingItem>();

    for (const day of weekDays) {
      if (leftoverMeals[day.isoDate]) continue;
      const recipe = getRecipe(plannedMeals[day.isoDate]);
      if (!recipe) continue;

      const excludedForDay = excludedIngredients[day.isoDate] ?? [];
      for (const item of recipe.ingredients) {
        if (excludedForDay.includes(item.id)) continue;

        const id = shoppingId(item.name, item.unit);
        const existing = items.get(id);
        if (existing) {
          existing.amount += item.amount;
          const existingSource = existing.sources.find(
            (source) => source.type === 'recipe' && source.title === recipe.title,
          );
          if (existingSource) {
            existingSource.amount += item.amount;
          } else {
            existing.recipes.push(recipe.title);
            existing.sources.push({ type: 'recipe', title: recipe.title, amount: item.amount });
          }
        } else {
          items.set(id, {
            id,
            name: item.name,
            amount: item.amount,
            unit: item.unit,
            department: item.department,
            recipes: [recipe.title],
            isManual: false,
            sources: [{ type: 'recipe', title: recipe.title, amount: item.amount }],
          });
        }
      }
    }

    for (const manualItem of manualShoppingItems) {
      const existing = items.get(manualItem.id);
      if (existing) {
        existing.amount += manualItem.amount;
        existing.isManual = true;
        existing.sources.push({
          type: 'manual',
          title: 'Los toegevoegd',
          amount: manualItem.amount,
        });
      } else {
        items.set(manualItem.id, { ...manualItem });
      }
    }

    return Array.from(items.values())
      .map((item) => ({
        ...item,
        department: shoppingDepartments[item.id] ?? item.department,
      }))
      .sort((a, b) =>
        a.department === b.department
          ? a.name.localeCompare(b.name, 'nl')
          : a.department.localeCompare(b.department, 'nl'),
      );
  }, [excludedIngredients, getRecipe, leftoverMeals, manualShoppingItems, plannedMeals, shoppingDepartments, weekDays]);

  const addShoppingItem = useCallback(async (input: NewShoppingItem) => {
    const item: ShoppingItem = {
      ...input,
      id: shoppingId(input.name, input.unit),
      recipes: [],
      isManual: true,
      sources: [{ type: 'manual', title: 'Los toegevoegd', amount: input.amount }],
    };
    if (isSupabaseConfigured) await addCloudShoppingItem(input);
    setManualShoppingItems((current) => [
      ...current.filter((candidate) => candidate.id !== item.id),
      item,
    ]);
    setCompletedShoppingIds((current) => current.filter((id) => id !== item.id));
  }, []);

  const removeShoppingItem = useCallback(
    async (itemId: string) => {
      const item = manualShoppingItems.find((candidate) => candidate.id === itemId);
      if (!item) return;
      const remainsOnListForRecipe = Boolean(
        shoppingItems.find((candidate) => candidate.id === itemId)?.recipes.length,
      );
      if (isSupabaseConfigured) await removeCloudShoppingItem(item.name, item.unit);
      setManualShoppingItems((current) => current.filter((candidate) => candidate.id !== itemId));
      if (!remainsOnListForRecipe) {
        setCompletedShoppingIds((current) => current.filter((id) => id !== itemId));
      }
    },
    [manualShoppingItems, shoppingItems],
  );

  const toggleShoppingItem = useCallback(
    async (itemId: string) => {
      const item = shoppingItems.find((candidate) => candidate.id === itemId);
      if (!item) return;
      const checked = !completedShoppingIds.includes(itemId);
      setCompletedShoppingIds((current) =>
        checked ? [...current, itemId] : current.filter((id) => id !== itemId),
      );
      if (!isSupabaseConfigured) return;
      try {
        await setCloudShoppingItemChecked(item.name, item.unit, checked, weekDays);
      } catch (error) {
        if (__DEV__) console.warn('Tably shopping sync failed', error);
      }
    },
    [completedShoppingIds, shoppingItems, weekDays],
  );

  const updateShoppingItemDepartment = useCallback(
    async (itemId: string, department: Department) => {
      const item = shoppingItems.find((candidate) => candidate.id === itemId);
      if (!item || item.department === department) return;
      const previousDepartment = shoppingDepartments[itemId];

      const saveDepartments = (departments: Record<string, Department>) => {
        setShoppingDepartments(departments);
        void AsyncStorage.setItem(shoppingDepartmentsStorageKey, JSON.stringify(departments));
      };

      saveDepartments({ ...shoppingDepartments, [itemId]: department });
      if (!isSupabaseConfigured) return;

      try {
        await setCloudShoppingItemDepartment(item.name, item.unit, department);
      } catch (error) {
        const reverted = { ...shoppingDepartments };
        if (previousDepartment) reverted[itemId] = previousDepartment;
        else delete reverted[itemId];
        saveDepartments(reverted);
        throw error;
      }
    },
    [shoppingDepartments, shoppingItems],
  );

  const value = useMemo<MealMateContextValue>(
    () => ({
      recipes,
      weekDays,
      familyMembers: displayedFamilyMembers,
      plannedMeals,
      leftoverMeals,
      ratings,
      mealAttendance,
      shoppingItems,
      completedShoppingIds,
      addShoppingItem,
      removeShoppingItem,
      addRecipe,
      updateRecipe,
      removeRecipe,
      planMeal,
      removeMeal,
      rateRecipe,
      setMealAttendance,
      toggleShoppingItem,
      updateShoppingItemDepartment,
      changeWeek,
      reloadHousehold,
      getRecipe,
    }),
    [
      recipes,
      weekDays,
      plannedMeals,
      leftoverMeals,
      displayedFamilyMembers,
      ratings,
      mealAttendance,
      shoppingItems,
      completedShoppingIds,
      addShoppingItem,
      removeShoppingItem,
      addRecipe,
      updateRecipe,
      removeRecipe,
      planMeal,
      removeMeal,
      rateRecipe,
      setMealAttendance,
      toggleShoppingItem,
      updateShoppingItemDepartment,
      changeWeek,
      reloadHousehold,
      getRecipe,
    ],
  );

  return <MealMateContext.Provider value={value}>{children}</MealMateContext.Provider>;
}

export function useMealMate() {
  const value = useContext(MealMateContext);
  if (!value) throw new Error('useMealMate moet binnen MealMateProvider worden gebruikt.');
  return value;
}
