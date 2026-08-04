import type { Department, FamilyMember, Recipe, WeekDay } from '@/data/mock-data';
import { normalizeDepartment, weekDays as initialWeekDays } from '@/data/mock-data';
import { ensureMealMateHousehold, ensureMealMateSession } from '@/lib/mealmate-session';
import { getAvatarPublicUrl } from '@/lib/avatar-repository';
import { supabase } from '@/lib/supabase';

export type PlannedMeals = Record<string, string | undefined>;
export type LeftoverMeals = Record<string, string | undefined>;
type Ratings = Record<string, Record<string, number | undefined>>;
type ExcludedIngredients = Record<string, string[]>;
export type MealAttendance = Record<string, Record<string, boolean | undefined>>;

export type SharedState = {
  plannedMeals: PlannedMeals;
  leftoverMeals: LeftoverMeals;
  excludedIngredients: ExcludedIngredients;
  ratings: Ratings;
  familyMembers: FamilyMember[];
  mealAttendance: MealAttendance;
  completedShoppingIds: string[];
  manualShoppingItems: ManualShoppingItem[];
  shoppingDepartments: Record<string, Department>;
};

export type ManualShoppingItem = {
  id: string;
  name: string;
  amount: number;
  unit: string;
  department: Department;
};

const shoppingId = (name: string, unit: string) =>
  `${name}-${unit}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const isMissingLeftoverColumn = (error: { code?: string; message?: string }) =>
  error.code === '42703' || Boolean(error.message?.includes('leftover_from'));

async function loadHouseholdPeople(householdId: string) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('household_people')
    .select('id, display_name, initials, color, email, invitation_status, linked_user_id')
    .eq('household_id', householdId)
    .order('created_at');
  if (error) throw error;
  const people = data ?? [];
  const linkedUserIds = people
    .map((person) => person.linked_user_id)
    .filter((id): id is string => Boolean(id));
  if (linkedUserIds.length === 0) {
    return people.map((person) => ({ ...person, avatar_url: null }));
  }

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, avatar_url')
    .in('id', linkedUserIds);
  if (profilesError) throw profilesError;
  const avatars = new Map(
    (profiles ?? []).map((profile) => [profile.id, getAvatarPublicUrl(profile.avatar_url)]),
  );

  return people.map((person) => ({
    ...person,
    avatar_url: person.linked_user_id ? avatars.get(person.linked_user_id) ?? null : null,
  }));
}

const queryPlans = async (householdId: string, days: WeekDay[] = initialWeekDays) => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('meal_plans')
    .select('id, recipe_id, planned_for, leftover_from, meal_plan_exclusions(ingredient_id)')
    .eq('household_id', householdId)
    .gte('planned_for', days[0].isoDate)
    .lte('planned_for', days[days.length - 1].isoDate)
    .order('planned_for');
  if (!error) return data ?? [];
  if (!isMissingLeftoverColumn(error)) throw error;

  // Tijdens een gefaseerde uitrol kan de app al nieuwer zijn dan het databaseschema.
  // Blijf bestaande week- en gezinsgegevens laden totdat de restjesmigratie is toegepast.
  const { data: legacyData, error: legacyError } = await supabase
    .from('meal_plans')
    .select('id, recipe_id, planned_for, meal_plan_exclusions(ingredient_id)')
    .eq('household_id', householdId)
    .gte('planned_for', days[0].isoDate)
    .lte('planned_for', days[days.length - 1].isoDate)
    .order('planned_for');
  if (legacyError) throw legacyError;
  return (legacyData ?? []).map((plan) => ({ ...plan, leftover_from: null }));
};

export async function loadCloudPlannedMeals(
  days: WeekDay[] = initialWeekDays,
): Promise<PlannedMeals> {
  if (!supabase || days.length === 0) return {};
  const householdId = await ensureMealMateHousehold();
  const plans = await queryPlans(householdId, days);

  return Object.fromEntries(
    plans.map((plan) => [plan.planned_for, plan.recipe_id]),
  );
}

export async function saveCloudMealPlan(
  day: WeekDay,
  recipe: Recipe,
  excludedIngredientIds: string[],
  leftoverFrom?: string,
) {
  if (!supabase) return;
  const [householdId, userId] = await Promise.all([
    ensureMealMateHousehold(),
    ensureMealMateSession(),
  ]);

  let { data: plan, error: planError } = await supabase
    .from('meal_plans')
    .upsert(
      {
        household_id: householdId,
        recipe_id: recipe.id,
        planned_for: day.isoDate,
        leftover_from: leftoverFrom ?? null,
        servings: 2,
        added_by: userId,
      },
      { onConflict: 'household_id,planned_for' },
    )
    .select('id')
    .single();

  if (planError && isMissingLeftoverColumn(planError)) {
    const legacyResult = await supabase
      .from('meal_plans')
      .upsert(
        {
          household_id: householdId,
          recipe_id: recipe.id,
          planned_for: day.isoDate,
          servings: 2,
          added_by: userId,
        },
        { onConflict: 'household_id,planned_for' },
      )
      .select('id')
      .single();
    plan = legacyResult.data;
    planError = legacyResult.error;
  }
  if (planError || !plan) throw planError ?? new Error('Het weekmenu kon niet worden bewaard.');

  const { error: exclusionDeleteError } = await supabase
    .from('meal_plan_exclusions')
    .delete()
    .eq('meal_plan_id', plan.id);
  if (exclusionDeleteError) throw exclusionDeleteError;

  if (!leftoverFrom && excludedIngredientIds.length > 0) {
    const { error } = await supabase.from('meal_plan_exclusions').insert(
      excludedIngredientIds.map((ingredientId) => ({
        meal_plan_id: plan.id,
        ingredient_id: ingredientId,
        excluded_by: userId,
      })),
    );
    if (error) throw error;
  }

  const { error: shoppingDeleteError } = await supabase
    .from('shopping_items')
    .delete()
    .eq('meal_plan_id', plan.id);
  if (shoppingDeleteError) throw shoppingDeleteError;

  const shoppingIngredients = leftoverFrom ? [] : recipe.ingredients.filter(
    (ingredient) => !excludedIngredientIds.includes(ingredient.id),
  );
  if (shoppingIngredients.length > 0) {
    const { error } = await supabase.from('shopping_items').insert(
      shoppingIngredients.map((ingredient) => ({
        household_id: householdId,
        name: ingredient.name,
        quantity: ingredient.amount,
        unit: ingredient.unit,
        department: ingredient.department,
        recipe_id: recipe.id,
        meal_plan_id: plan.id,
        added_by: userId,
      })),
    );
    if (error) throw error;
  }
}

export async function removeCloudMealPlan(day: WeekDay) {
  if (!supabase) return;
  const householdId = await ensureMealMateHousehold();
  const { error } = await supabase
    .from('meal_plans')
    .delete()
    .eq('household_id', householdId)
    .eq('planned_for', day.isoDate);
  if (error) throw error;
}

export async function saveCloudRating(recipeId: string, personId: string, score: number) {
  if (!supabase) return;
  const { error } = await supabase.from('household_recipe_ratings').upsert(
    {
      recipe_id: recipeId,
      person_id: personId,
      score,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'recipe_id,person_id' },
  );
  if (error) throw error;
}

export async function saveCloudMealAttendance(
  plannedFor: string,
  personId: string,
  isEating: boolean,
) {
  if (!supabase) return;
  const [householdId, userId] = await Promise.all([
    ensureMealMateHousehold(),
    ensureMealMateSession(),
  ]);
  const { error } = await supabase.from('meal_attendance').upsert(
    {
      household_id: householdId,
      planned_for: plannedFor,
      person_id: personId,
      is_eating: isEating,
      updated_by: userId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'household_id,planned_for,person_id' },
  );
  if (error) throw error;
}

export async function setCloudShoppingItemChecked(
  name: string,
  unit: string,
  checked: boolean,
  days: WeekDay[] = initialWeekDays,
) {
  if (!supabase) return;
  const householdId = await ensureMealMateHousehold();
  const plans = await queryPlans(householdId, days);

  let manualQuery = supabase
    .from('shopping_items')
    .update({ is_checked: checked })
    .eq('household_id', householdId)
    .eq('name', name)
    .is('meal_plan_id', null);
  manualQuery = unit ? manualQuery.eq('unit', unit) : manualQuery.is('unit', null);
  const { error: manualError } = await manualQuery;
  if (manualError) throw manualError;

  if (plans.length > 0) {
    let plannedQuery = supabase
      .from('shopping_items')
      .update({ is_checked: checked })
      .eq('household_id', householdId)
      .eq('name', name)
      .in('meal_plan_id', plans.map((plan) => plan.id));
    plannedQuery = unit ? plannedQuery.eq('unit', unit) : plannedQuery.is('unit', null);
    const { error: plannedError } = await plannedQuery;
    if (plannedError) throw plannedError;
  }
}

export async function setCloudShoppingItemDepartment(
  name: string,
  unit: string,
  department: Department,
) {
  if (!supabase) return;
  const householdId = await ensureMealMateHousehold();
  let query = supabase
    .from('shopping_items')
    .update({ department })
    .eq('household_id', householdId)
    .eq('name', name);
  query = unit ? query.eq('unit', unit) : query.is('unit', null);
  const { error } = await query;
  if (error) throw error;
}

export async function addCloudShoppingItem(item: Omit<ManualShoppingItem, 'id'>) {
  if (!supabase) return;
  const [householdId, userId] = await Promise.all([
    ensureMealMateHousehold(),
    ensureMealMateSession(),
  ]);

  let existingQuery = supabase
    .from('shopping_items')
    .select('id')
    .eq('household_id', householdId)
    .eq('name', item.name)
    .is('meal_plan_id', null)
    .limit(1);
  existingQuery = item.unit ? existingQuery.eq('unit', item.unit) : existingQuery.is('unit', null);
  const { data: existingRows, error: existingError } = await existingQuery;
  if (existingError) throw existingError;

  if (existingRows?.[0]) {
    const { error } = await supabase
      .from('shopping_items')
      .update({
        quantity: item.amount,
        department: item.department,
        is_checked: false,
      })
      .eq('id', existingRows[0].id);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from('shopping_items').insert({
    household_id: householdId,
    name: item.name,
    quantity: item.amount,
    unit: item.unit || null,
    department: item.department,
    added_by: userId,
  });
  if (error) throw error;
}

export async function removeCloudShoppingItem(name: string, unit: string) {
  if (!supabase) return;
  const householdId = await ensureMealMateHousehold();
  let query = supabase
    .from('shopping_items')
    .delete()
    .eq('household_id', householdId)
    .eq('name', name)
    .is('meal_plan_id', null);
  query = unit ? query.eq('unit', unit) : query.is('unit', null);
  const { error } = await query;
  if (error) throw error;
}

export async function loadSharedState(days: WeekDay[] = initialWeekDays): Promise<SharedState> {
  if (!supabase) {
    return {
      plannedMeals: {},
      leftoverMeals: {},
      excludedIngredients: {},
      ratings: {},
      familyMembers: [],
      mealAttendance: {},
      completedShoppingIds: [],
      manualShoppingItems: [],
      shoppingDepartments: {},
    };
  }

  const householdId = await ensureMealMateHousehold();
  const people = await loadHouseholdPeople(householdId);
  const plans = await queryPlans(householdId, days);

  const { data: attendanceRows, error: attendanceError } = await supabase
    .from('meal_attendance')
    .select('planned_for, person_id, is_eating')
    .eq('household_id', householdId)
    .gte('planned_for', days[0].isoDate)
    .lte('planned_for', days[days.length - 1].isoDate);
  if (attendanceError) throw attendanceError;
  const mealAttendance: MealAttendance = {};
  for (const row of attendanceRows ?? []) {
    mealAttendance[row.planned_for] = {
      ...mealAttendance[row.planned_for],
      [row.person_id]: row.is_eating,
    };
  }

  const plannedMeals: PlannedMeals = {};
  const leftoverMeals: LeftoverMeals = {};
  const excludedIngredients: ExcludedIngredients = {};
  for (const plan of plans) {
    const day = days.find((item) => item.isoDate === plan.planned_for);
    if (!day) continue;
    plannedMeals[day.isoDate] = plan.recipe_id;
    leftoverMeals[day.isoDate] = plan.leftover_from ?? undefined;
    excludedIngredients[day.isoDate] = (plan.meal_plan_exclusions ?? []).map(
      (item) => item.ingredient_id,
    );
  }

  const { data: ratingRows, error: ratingError } = await supabase
    .from('household_recipe_ratings')
    .select('recipe_id, person_id, score');
  if (ratingError) throw ratingError;
  const ratings: Ratings = {};
  for (const row of ratingRows ?? []) {
    ratings[row.recipe_id] = { ...ratings[row.recipe_id], [row.person_id]: row.score };
  }

  const planIds = plans.map((plan) => plan.id);
  const checkedGroups = new Map<string, boolean[]>();
  const shoppingDepartments: Record<string, Department> = {};
  if (planIds.length > 0) {
    const { data: shoppingRows, error: shoppingError } = await supabase
      .from('shopping_items')
      .select('name, unit, department, is_checked')
      .in('meal_plan_id', planIds);
    if (shoppingError) throw shoppingError;
    for (const item of shoppingRows ?? []) {
      const id = shoppingId(item.name, item.unit || '');
      checkedGroups.set(id, [...(checkedGroups.get(id) ?? []), item.is_checked]);
      shoppingDepartments[id] = normalizeDepartment(item.department);
    }
  }

  const { data: manualRows, error: manualError } = await supabase
    .from('shopping_items')
    .select('name, quantity, unit, department, is_checked')
    .eq('household_id', householdId)
    .is('meal_plan_id', null)
    .order('created_at');
  if (manualError) throw manualError;
  for (const item of manualRows ?? []) {
    const id = shoppingId(item.name, item.unit || '');
    checkedGroups.set(id, [...(checkedGroups.get(id) ?? []), item.is_checked]);
    shoppingDepartments[id] = normalizeDepartment(item.department);
  }

  return {
    plannedMeals,
    leftoverMeals,
    excludedIngredients,
    ratings,
    familyMembers: people.map((person) => ({
      id: person.id,
      name: person.display_name,
      initials: person.initials,
      color: person.color,
      email: person.email ?? undefined,
      invitationStatus: person.invitation_status,
      linkedUserId: person.linked_user_id ?? undefined,
      avatarUrl: person.avatar_url ?? undefined,
    })),
    mealAttendance,
    completedShoppingIds: Array.from(checkedGroups.entries())
      .filter(([, values]) => values.length > 0 && values.every(Boolean))
      .map(([id]) => id),
    manualShoppingItems: (manualRows ?? []).map((item) => ({
      id: shoppingId(item.name, item.unit || ''),
      name: item.name,
      amount: Number(item.quantity) || 1,
      unit: item.unit || '',
      department: normalizeDepartment(item.department),
    })),
    shoppingDepartments,
  };
}
