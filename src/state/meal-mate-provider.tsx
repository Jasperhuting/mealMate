import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';

import {
  createWeekDays,
  dateToIso,
  normalizeDepartment,
  normalizeRecipeCategory,
  weekDays as initialWeekDays,
  type Department,
  type FamilyMember,
  type Recipe,
  type WeekDay,
} from '@/data/mock-data';
import {
  createCloudRecipe,
  deleteCloudRecipe,
  ensureSeedRecipes,
  loadCloudHiddenRecipeIds,
  loadCloudRecipes,
  setCloudRecipeHidden,
  updateCloudRecipe,
} from '@/lib/recipe-repository';
import { removePersistedRecipeImage } from '@/lib/recipe-image-storage';
import { normalizeIngredientQuantity } from '@/lib/ingredient-parser';
import { normalizeIngredientPreferenceName } from '@/lib/ingredient-preferences';
import {
  addCloudShoppingItem,
  carryCloudShoppingItems,
  loadCloudShoppingState,
  loadCloudPlannedMeals,
  loadSharedState,
  moveCloudMealPlan,
  removeCloudMealPlan,
  removeCloudShoppingItem,
  saveCloudMealPlan,
  saveCloudMealAttendance,
  saveCloudRating,
  setCloudShoppingItemChecked,
  setCloudShoppingItemDepartment,
  subscribeToCloudShoppingChanges,
} from '@/lib/shared-state-repository';
import type {
  CloudShoppingState,
  LeftoverMeals,
  MealAttendance,
  MealPlans,
  PlannedMeals,
} from '@/lib/shared-state-repository';
import { updateMealPlanWidgets } from '@/lib/meal-plan-widgets';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/state/auth-provider';
import {
  loadCloudDislikedIngredientNamesByUser,
  saveCloudDislikedIngredientNames,
  type DislikedIngredientNamesByUser,
} from '@/lib/user-preferences-repository';

type Ratings = Record<string, Record<string, number | undefined>>;

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
  mealPlans: MealPlans;
  leftoverMeals: LeftoverMeals;
  ratings: Ratings;
  mealAttendance: MealAttendance;
  shoppingItems: ShoppingItem[];
  completedShoppingIds: string[];
  hiddenRecipeIds: string[];
  dislikedIngredientNames: string[];
  dislikedIngredientNamesByUser: DislikedIngredientNamesByUser;
  addShoppingItem: (item: NewShoppingItem) => Promise<void>;
  removeShoppingItem: (itemId: string) => Promise<void>;
  addRecipe: (recipe: NewRecipe) => Promise<Recipe>;
  updateRecipe: (recipeId: string, recipe: NewRecipe, imageChanged: boolean) => Promise<Recipe>;
  removeRecipe: (recipeId: string) => Promise<void>;
  setRecipeHidden: (recipeId: string, isHidden: boolean) => Promise<void>;
  saveDislikedIngredientNames: (ingredientNames: string[]) => Promise<void>;
  planMeal: (
    dayId: string,
    recipeId: string,
    atHomeIngredientIds: string[],
    memberIds: string[],
    leftoverFrom?: string,
  ) => Promise<void>;
  removeMeal: (dayId: string, mealPlanId?: string) => Promise<void>;
  moveMeal: (
    sourceDayId: string,
    targetDayId: string,
    sourceMealPlanId: string,
    targetMealPlanId?: string,
  ) => Promise<void>;
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
const hiddenRecipesStorageKey = 'mealmate.hidden-recipes.v1';
const dislikedIngredientsStorageKey = (userId?: string) =>
  `mealmate.disliked-ingredients.${userId ?? 'local'}.v1`;
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
  const currentUserId = session?.user.id;
  const personalDislikedIngredientsStorageKey = dislikedIngredientsStorageKey(currentUserId);
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>([]);
  const [hiddenRecipeIds, setHiddenRecipeIds] = useState<string[]>([]);
  const [dislikedIngredientNames, setDislikedIngredientNames] = useState<string[]>([]);
  const [dislikedIngredientNamesByUser, setDislikedIngredientNamesByUser] =
    useState<DislikedIngredientNamesByUser>({});
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [plannedMeals, setPlannedMeals] = useState<PlannedMeals>({});
  const [mealPlans, setMealPlans] = useState<MealPlans>({});
  const [leftoverMeals, setLeftoverMeals] = useState<LeftoverMeals>({});
  const [ratings, setRatings] = useState<Ratings>({});
  const [mealAttendance, setMealAttendanceState] = useState<MealAttendance>({});
  const [completedShoppingIds, setCompletedShoppingIds] = useState<string[]>([]);
  const [manualShoppingItems, setManualShoppingItems] = useState<ShoppingItem[]>([]);
  const [shoppingDepartments, setShoppingDepartments] = useState<Record<string, Department>>({});
  const [weekDays, setWeekDays] = useState<WeekDay[]>(initialWeekDays);
  const [currentDateIso, setCurrentDateIso] = useState(() => dateToIso(new Date()));
  const [isWidgetDataReady, setIsWidgetDataReady] = useState(false);
  const completedShoppingIdsRef = useRef(completedShoppingIds);
  const shoppingItemsRef = useRef<ShoppingItem[]>([]);
  const notifyShoppingChangeRef = useRef<(() => Promise<void>) | undefined>(undefined);

  useEffect(() => {
    let active = true;

    const initialiseRecipes = async () => {
      let localRecipes: Recipe[] = [];
      let localShoppingDepartments: Record<string, Department> = {};
      try {
        const [
          storedRecipes,
          storedShoppingDepartments,
          storedHiddenRecipes,
          storedDislikedIngredients,
        ] = await Promise.all([
          AsyncStorage.getItem(customRecipesStorageKey),
          AsyncStorage.getItem(shoppingDepartmentsStorageKey),
          AsyncStorage.getItem(hiddenRecipesStorageKey),
          AsyncStorage.getItem(personalDislikedIngredientsStorageKey),
        ]);
        if (storedRecipes) {
          const parsedRecipes = JSON.parse(storedRecipes) as Recipe[];
          if (Array.isArray(parsedRecipes)) {
            localRecipes = parsedRecipes.map((recipe) => ({
              ...recipe,
              category: normalizeRecipeCategory(recipe.category),
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
        if (storedHiddenRecipes) {
          const parsedHiddenRecipes = JSON.parse(storedHiddenRecipes) as unknown;
          if (active && Array.isArray(parsedHiddenRecipes)) {
            setHiddenRecipeIds(
              parsedHiddenRecipes.filter((id): id is string => typeof id === 'string'),
            );
          }
        }
        if (active && storedDislikedIngredients) {
          const parsedDislikedIngredients = JSON.parse(storedDislikedIngredients) as unknown;
          if (Array.isArray(parsedDislikedIngredients)) {
            const names = parsedDislikedIngredients.filter(
              (name): name is string => typeof name === 'string',
            );
            setDislikedIngredientNames(names);
            if (currentUserId) {
              setDislikedIngredientNamesByUser({ [currentUserId]: names });
            }
          }
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
        await ensureSeedRecipes();
        let cloudRecipes = await loadCloudRecipes();
        if (cloudRecipes.length === 0 && localRecipes.length > 0) {
          cloudRecipes = [];
          for (const { id: _localId, ...recipe } of localRecipes) {
            cloudRecipes.push(await createCloudRecipe(recipe));
          }
        }

        const [
          sharedState,
          widgetPlannedMeals,
          cloudHiddenRecipeIds,
          cloudDislikedIngredientNamesByUser,
        ] = await Promise.all([
          loadSharedState(initialWeekDays),
          loadCloudPlannedMeals(createWidgetPlanningDays()),
          loadCloudHiddenRecipeIds(),
          loadCloudDislikedIngredientNamesByUser(),
        ]);

        if (!active) return;
        setCustomRecipes(cloudRecipes);
        setFamilyMembers(sharedState.familyMembers);
        setPlannedMeals({ ...widgetPlannedMeals, ...sharedState.plannedMeals });
        setMealPlans(sharedState.mealPlans);
        setLeftoverMeals(sharedState.leftoverMeals);
        setRatings(sharedState.ratings);
        setHiddenRecipeIds(cloudHiddenRecipeIds);
        const cloudDislikedIngredientNames = currentUserId
          ? cloudDislikedIngredientNamesByUser[currentUserId] ?? []
          : [];
        setDislikedIngredientNames(cloudDislikedIngredientNames);
        setDislikedIngredientNamesByUser(cloudDislikedIngredientNamesByUser);
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
        await AsyncStorage.setItem(hiddenRecipesStorageKey, JSON.stringify(cloudHiddenRecipeIds));
        await AsyncStorage.setItem(
          personalDislikedIngredientsStorageKey,
          JSON.stringify(cloudDislikedIngredientNames),
        );
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
  }, [currentUserId, personalDislikedIngredientsStorageKey]);

  const reloadHousehold = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    const cloudRecipes = await loadCloudRecipes();
    const widgetPlanningDays = createWidgetPlanningDays();
    const [
      sharedState,
      widgetPlannedMeals,
      cloudHiddenRecipeIds,
      cloudDislikedIngredientNamesByUser,
    ] = await Promise.all([
      loadSharedState(weekDays),
      loadCloudPlannedMeals(widgetPlanningDays),
      loadCloudHiddenRecipeIds(),
      loadCloudDislikedIngredientNamesByUser(),
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
    setMealPlans((current) => ({ ...current, ...sharedState.mealPlans }));
    setLeftoverMeals(sharedState.leftoverMeals);
    setRatings(sharedState.ratings);
    setHiddenRecipeIds(cloudHiddenRecipeIds);
    const cloudDislikedIngredientNames = currentUserId
      ? cloudDislikedIngredientNamesByUser[currentUserId] ?? []
      : [];
    setDislikedIngredientNames(cloudDislikedIngredientNames);
    setDislikedIngredientNamesByUser(cloudDislikedIngredientNamesByUser);
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
    await AsyncStorage.setItem(hiddenRecipesStorageKey, JSON.stringify(cloudHiddenRecipeIds));
    await AsyncStorage.setItem(
      personalDislikedIngredientsStorageKey,
      JSON.stringify(cloudDislikedIngredientNames),
    );
  }, [currentUserId, personalDislikedIngredientsStorageKey, weekDays]);

  const applyCloudShoppingState = useCallback((shoppingState: CloudShoppingState) => {
    setCompletedShoppingIds(shoppingState.completedShoppingIds);
    setShoppingDepartments((current) => {
      const updated = { ...current, ...shoppingState.shoppingDepartments };
      void AsyncStorage.setItem(shoppingDepartmentsStorageKey, JSON.stringify(updated));
      return updated;
    });
    setManualShoppingItems(
      shoppingState.manualShoppingItems.map((item) => ({
        ...item,
        recipes: [],
        isManual: true,
        sources: [{ type: 'manual', title: 'Los toegevoegd', amount: item.amount }],
      })),
    );
  }, []);

  const refreshShoppingState = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    const shoppingState = await loadCloudShoppingState(weekDays);
    applyCloudShoppingState(shoppingState);
  }, [applyCloudShoppingState, weekDays]);

  useEffect(() => {
    if (!isSupabaseConfigured || !currentUserId) return;
    let active = true;
    let unsubscribe: (() => Promise<void>) | undefined;
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;

    const scheduleRefresh = () => {
      if (!active) return;
      if (refreshTimer) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        void refreshShoppingState().catch((error) => {
          if (__DEV__) console.warn('Tably shopping realtime refresh failed', error);
        });
      }, 150);
    };

    void subscribeToCloudShoppingChanges(scheduleRefresh)
      .then((connection) => {
        if (!active) {
          void connection.unsubscribe();
          return;
        }
        notifyShoppingChangeRef.current = connection.notify;
        unsubscribe = connection.unsubscribe;
      })
      .catch((error) => {
        if (__DEV__) console.warn('Tably shopping realtime setup failed', error);
      });

    return () => {
      active = false;
      if (refreshTimer) clearTimeout(refreshTimer);
      notifyShoppingChangeRef.current = undefined;
      if (unsubscribe) void unsubscribe();
    };
  }, [currentUserId, refreshShoppingState]);

  const changeWeek = useCallback(
    async (direction: -1 | 1) => {
      const nextMonday = new Date(`${weekDays[0].isoDate}T12:00:00`);
      nextMonday.setDate(nextMonday.getDate() + direction * 7);
      const nextWeekDays = createWeekDays(nextMonday);
      const outstandingItems = shoppingItemsRef.current.filter(
        (item) => !completedShoppingIdsRef.current.includes(item.id),
      );
      setWeekDays(nextWeekDays);
      setCompletedShoppingIds([]);

      if (!isSupabaseConfigured) {
        setManualShoppingItems(
          direction === 1
            ? outstandingItems.map((item) => ({
                ...item,
                recipes: [],
                isManual: true,
                sources: [{ type: 'manual', title: 'Los toegevoegd', amount: item.amount }],
              }))
            : [],
        );
        return;
      }
      try {
        if (direction === 1) {
          await carryCloudShoppingItems(
            outstandingItems,
            weekDays[0].isoDate,
            nextWeekDays[0].isoDate,
          );
        }
        const sharedState = await loadSharedState(nextWeekDays);
        setPlannedMeals((current) => {
          const updated = { ...current };
          nextWeekDays.forEach((day) => delete updated[day.isoDate]);
          return { ...updated, ...sharedState.plannedMeals };
        });
        setMealPlans((current) => {
          const updated = { ...current };
          nextWeekDays.forEach((day) => delete updated[day.isoDate]);
          return { ...updated, ...sharedState.mealPlans };
        });
        setLeftoverMeals((current) => {
          const updated = { ...current };
          nextWeekDays.forEach((day) => delete updated[day.isoDate]);
          return { ...updated, ...sharedState.leftoverMeals };
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
      const nextDateIso = dateToIso(new Date());
      if (nextDateIso !== currentDateIso) {
        setCurrentDateIso(nextDateIso);
        setCompletedShoppingIds([]);
        if (isSupabaseConfigured) {
          void reloadHousehold().catch((error) => {
            if (__DEV__) console.warn('Tably daily shopping refresh failed', error);
          });
        }
      } else if (isSupabaseConfigured) {
        void refreshShoppingState().catch((error) => {
          if (__DEV__) console.warn('Tably shopping resume refresh failed', error);
        });
      }
      void updateMealPlanWidgets(plannedMeals, recipes).catch((error) => {
        if (__DEV__) console.warn('Tably widget refresh failed', error);
      });
    });

    return () => subscription.remove();
  }, [
    currentDateIso,
    isWidgetDataReady,
    plannedMeals,
    recipes,
    refreshShoppingState,
    reloadHousehold,
  ]);

  const addRecipe = useCallback(async (input: NewRecipe) => {
    const recipe: Recipe = isSupabaseConfigured
      ? await createCloudRecipe(input)
      : {
          ...input,
          id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          createdAt: new Date().toISOString(),
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
          candidate.id === recipeId
            ? {
                ...recipe,
                clientKey: candidate.clientKey,
                createdAt: recipe.createdAt ?? candidate.createdAt,
              }
            : candidate,
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
    setMealPlans((current) =>
      Object.fromEntries(
        Object.entries(current).map(([day, plans]) => [
          day,
          plans.filter((plan) => plan.recipeId !== recipeId),
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
    setRatings((current) => {
      const updated = { ...current };
      delete updated[recipeId];
      return updated;
    });
    setHiddenRecipeIds((current) => {
      const updated = current.filter((id) => id !== recipeId);
      void AsyncStorage.setItem(hiddenRecipesStorageKey, JSON.stringify(updated));
      return updated;
    });
    setCompletedShoppingIds([]);
  }, [customRecipes, plannedMeals]);

  const setRecipeHidden = useCallback(async (recipeId: string, isHidden: boolean) => {
    if (isSupabaseConfigured) await setCloudRecipeHidden(recipeId, isHidden);
    setHiddenRecipeIds((current) => {
      const updated = isHidden
        ? [...new Set([...current, recipeId])]
        : current.filter((id) => id !== recipeId);
      void AsyncStorage.setItem(hiddenRecipesStorageKey, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const saveDislikedIngredientNames = useCallback(async (ingredientNames: string[]) => {
    const normalizedNames = [...new Set(
      ingredientNames.map(normalizeIngredientPreferenceName).filter(Boolean),
    )].sort((a, b) => a.localeCompare(b, 'nl'));
    if (isSupabaseConfigured) await saveCloudDislikedIngredientNames(normalizedNames);
    setDislikedIngredientNames(normalizedNames);
    if (currentUserId) {
      setDislikedIngredientNamesByUser((current) => ({
        ...current,
        [currentUserId]: normalizedNames,
      }));
    }
    await AsyncStorage.setItem(
      personalDislikedIngredientsStorageKey,
      JSON.stringify(normalizedNames),
    );
  }, [currentUserId, personalDislikedIngredientsStorageKey]);

  const getRecipe = useCallback(
    (recipeId?: string) => recipes.find((recipe) => recipe.id === recipeId),
    [recipes],
  );

  const planMeal = useCallback(
    async (
      dayId: string,
      recipeId: string,
      atHomeIngredientIds: string[],
      memberIds: string[],
      leftoverFrom?: string,
    ) => {
      const day = weekDays.find((item) => item.id === dayId || item.isoDate === dayId);
      if (!day) return;
      setPlannedMeals((current) => ({ ...current, [day.isoDate]: recipeId }));
      setMealPlans((current) => {
        const currentPlans = current[day.isoDate] ?? [];
        const existingPlan = currentPlans.find((plan) => plan.recipeId === recipeId);
        const updatedPlan = {
          id: existingPlan?.id ?? `local-${day.isoDate}-${recipeId}`,
          recipeId,
          memberIds,
          leftoverFrom,
          excludedIngredientIds: leftoverFrom ? [] : atHomeIngredientIds,
        };
        return {
          ...current,
          [day.isoDate]: [
            ...currentPlans
              .filter((plan) => plan.recipeId !== recipeId)
              .map((plan) => ({
                ...plan,
                memberIds: plan.memberIds.filter((memberId) => !memberIds.includes(memberId)),
              }))
              .filter((plan) => familyMembers.length === 0 || plan.memberIds.length > 0),
            updatedPlan,
          ],
        };
      });
      setLeftoverMeals((current) => ({ ...current, [day.isoDate]: leftoverFrom }));
      setMealAttendanceState((current) => ({
        ...current,
        [day.isoDate]: {
          ...current[day.isoDate],
          ...Object.fromEntries(memberIds.map((memberId) => [memberId, true])),
        },
      }));
      setCompletedShoppingIds([]);

      if (!isSupabaseConfigured) return;
      const recipe = recipes.find((item) => item.id === recipeId);
      if (!recipe) return;
      try {
        await saveCloudMealPlan(day, recipe, atHomeIngredientIds, memberIds, leftoverFrom);
        await Promise.all(
          memberIds.map((memberId) => saveCloudMealAttendance(day.isoDate, memberId, true)),
        );
      } catch (error) {
        if (__DEV__) console.warn('Tably weekmenu sync failed', error);
      }
    },
    [familyMembers.length, recipes, weekDays],
  );

  const removeMeal = useCallback(async (dayId: string, mealPlanId?: string) => {
    const day = weekDays.find((item) => item.id === dayId || item.isoDate === dayId);
    if (!day) return;
    setMealPlans((current) => {
      const remaining = mealPlanId
        ? (current[day.isoDate] ?? []).filter((plan) => plan.id !== mealPlanId)
        : [];
      setPlannedMeals((plannedCurrent) => ({
        ...plannedCurrent,
        [day.isoDate]: remaining[0]?.recipeId,
      }));
      setLeftoverMeals((leftoverCurrent) => ({
        ...leftoverCurrent,
        [day.isoDate]: remaining[0]?.leftoverFrom,
      }));
      return { ...current, [day.isoDate]: remaining };
    });
    if (!isSupabaseConfigured) return;
    try {
      await removeCloudMealPlan(day, mealPlanId);
    } catch (error) {
      if (__DEV__) console.warn('Tably weekmenu delete failed', error);
    }
  }, [weekDays]);

  const moveMeal = useCallback(async (
    sourceDayId: string,
    targetDayId: string,
    sourceMealPlanId: string,
    targetMealPlanId?: string,
  ) => {
    const sourceDay = weekDays.find(
      (item) => item.id === sourceDayId || item.isoDate === sourceDayId,
    );
    const targetDay = weekDays.find(
      (item) => item.id === targetDayId || item.isoDate === targetDayId,
    );
    if (!sourceDay || !targetDay || sourceDay.isoDate === targetDay.isoDate) return;

    const sourcePlans = mealPlans[sourceDay.isoDate] ?? [];
    const targetPlans = mealPlans[targetDay.isoDate] ?? [];
    const sourcePlan = sourcePlans.find((plan) => plan.id === sourceMealPlanId);
    const targetPlan = targetMealPlanId
      ? targetPlans.find((plan) => plan.id === targetMealPlanId)
      : undefined;
    if (!sourcePlan || (targetMealPlanId && !targetPlan)) {
      throw new Error('De weekplanning is intussen gewijzigd.');
    }
    if (targetPlan?.recipeId === sourcePlan.recipeId) {
      throw new Error('Dit gerecht staat al op de gekozen dag.');
    }
    const sourceRemainingMemberIds = new Set(
      sourcePlans
        .filter((plan) => plan.id !== sourceMealPlanId)
        .flatMap((plan) => plan.memberIds),
    );
    const targetRemainingMemberIds = new Set(
      targetPlans
        .filter((plan) => plan.id !== targetMealPlanId)
        .flatMap((plan) => plan.memberIds),
    );
    const createsOverlappingAssignments = targetPlan ? (
      targetPlan.memberIds.some((memberId) => sourceRemainingMemberIds.has(memberId)) ||
      sourcePlan.memberIds.some((memberId) => targetRemainingMemberIds.has(memberId))
    ) : false;
    if (createsOverlappingAssignments) {
      throw new Error('Deze dagen hebben verschillende gerechten per persoon. Wijzig ze eerst apart.');
    }

    if (isSupabaseConfigured) {
      await moveCloudMealPlan(
        sourceDay,
        targetDay,
        sourceMealPlanId,
        targetMealPlanId,
      );
    }

    const nextSourcePlans = [
      ...sourcePlans.filter((plan) => plan.id !== sourceMealPlanId),
      ...(targetPlan ? [targetPlan] : []),
    ];
    const nextTargetPlans = [
      ...targetPlans.filter((plan) => plan.id !== targetMealPlanId),
      sourcePlan,
    ];
    setMealPlans((current) => ({
      ...current,
      [sourceDay.isoDate]: nextSourcePlans,
      [targetDay.isoDate]: nextTargetPlans,
    }));
    setPlannedMeals((current) => ({
      ...current,
      [sourceDay.isoDate]: nextSourcePlans[0]?.recipeId,
      [targetDay.isoDate]: nextTargetPlans[0]?.recipeId,
    }));
    setLeftoverMeals((current) => ({
      ...current,
      [sourceDay.isoDate]: nextSourcePlans[0]?.leftoverFrom,
      [targetDay.isoDate]: nextTargetPlans[0]?.leftoverFrom,
    }));
    setCompletedShoppingIds([]);
  }, [mealPlans, weekDays]);

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
      if (day.isoDate < currentDateIso) continue;
      const plans = mealPlans[day.isoDate] ?? [];
      for (const plan of plans) {
        if (plan.leftoverFrom) continue;
        const recipe = getRecipe(plan.recipeId);
        if (!recipe) continue;

        for (const item of recipe.ingredients) {
          if (plan.excludedIngredientIds.includes(item.id)) continue;

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
  }, [currentDateIso, getRecipe, manualShoppingItems, mealPlans, shoppingDepartments, weekDays]);

  useEffect(() => {
    shoppingItemsRef.current = shoppingItems;
    completedShoppingIdsRef.current = completedShoppingIds;
  }, [completedShoppingIds, shoppingItems]);

  const addShoppingItem = useCallback(async (input: NewShoppingItem) => {
    const item: ShoppingItem = {
      ...input,
      id: shoppingId(input.name, input.unit),
      recipes: [],
      isManual: true,
      sources: [{ type: 'manual', title: 'Los toegevoegd', amount: input.amount }],
    };
    if (isSupabaseConfigured) await addCloudShoppingItem(input, weekDays[0].isoDate);
    setManualShoppingItems((current) => [
      ...current.filter((candidate) => candidate.id !== item.id),
      item,
    ]);
    setCompletedShoppingIds((current) => current.filter((id) => id !== item.id));
  }, [weekDays]);

  const removeShoppingItem = useCallback(
    async (itemId: string) => {
      const item = manualShoppingItems.find((candidate) => candidate.id === itemId);
      if (!item) return;
      const remainsOnListForRecipe = Boolean(
        shoppingItems.find((candidate) => candidate.id === itemId)?.recipes.length,
      );
      if (isSupabaseConfigured) {
        await removeCloudShoppingItem(item.name, item.unit, weekDays[0].isoDate);
      }
      setManualShoppingItems((current) => current.filter((candidate) => candidate.id !== itemId));
      if (!remainsOnListForRecipe) {
        setCompletedShoppingIds((current) => current.filter((id) => id !== itemId));
      }
    },
    [manualShoppingItems, shoppingItems, weekDays],
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
        await notifyShoppingChangeRef.current?.();
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
      mealPlans,
      leftoverMeals,
      ratings,
      mealAttendance,
      shoppingItems,
      completedShoppingIds,
      hiddenRecipeIds,
      dislikedIngredientNames,
      dislikedIngredientNamesByUser,
      addShoppingItem,
      removeShoppingItem,
      addRecipe,
      updateRecipe,
      removeRecipe,
      setRecipeHidden,
      saveDislikedIngredientNames,
      planMeal,
      removeMeal,
      moveMeal,
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
      mealPlans,
      leftoverMeals,
      displayedFamilyMembers,
      ratings,
      mealAttendance,
      shoppingItems,
      completedShoppingIds,
      hiddenRecipeIds,
      dislikedIngredientNames,
      dislikedIngredientNamesByUser,
      addShoppingItem,
      removeShoppingItem,
      addRecipe,
      updateRecipe,
      removeRecipe,
      setRecipeHidden,
      saveDislikedIngredientNames,
      planMeal,
      removeMeal,
      moveMeal,
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
