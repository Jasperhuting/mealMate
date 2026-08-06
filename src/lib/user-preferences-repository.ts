import { ensureMealMateSession } from '@/lib/mealmate-session';
import { supabase } from '@/lib/supabase';

export type DislikedIngredientNamesByUser = Record<string, string[]>;

export async function loadCloudDislikedIngredientNamesByUser(): Promise<DislikedIngredientNamesByUser> {
  if (!supabase) return {};
  await ensureMealMateSession();
  const { data, error } = await supabase
    .from('user_disliked_ingredients')
    .select('user_id, ingredient_name')
    .order('user_id')
    .order('ingredient_name');
  if (error) throw error;

  return (data ?? []).reduce<DislikedIngredientNamesByUser>((preferences, item) => {
    preferences[item.user_id] = [...(preferences[item.user_id] ?? []), item.ingredient_name];
    return preferences;
  }, {});
}

export async function loadCloudDislikedIngredientNames(): Promise<string[]> {
  if (!supabase) return [];
  const userId = await ensureMealMateSession();
  const { data, error } = await supabase
    .from('user_disliked_ingredients')
    .select('ingredient_name')
    .eq('user_id', userId)
    .order('ingredient_name');
  if (error) throw error;
  return (data ?? []).map((item) => item.ingredient_name);
}

export async function saveCloudDislikedIngredientNames(ingredientNames: string[]) {
  if (!supabase) return;
  const { error } = await supabase.rpc('set_user_disliked_ingredients', {
    preference_names: ingredientNames,
  });
  if (error) throw error;
}
