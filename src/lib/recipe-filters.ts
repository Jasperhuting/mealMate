import type { Recipe } from '@/data/mock-data';

export type RecipeFilters = {
  ingredientNames: string[];
  minimumHouseholdRating: number | null;
  memberId: string | null;
  minimumMemberRating: number | null;
  neverRated: boolean;
  maximumMinutes: number | null;
  quickAndEasy: boolean;
};

export type RecipeRatings = Record<string, Record<string, number | undefined>>;

export const emptyRecipeFilters: RecipeFilters = {
  ingredientNames: [],
  minimumHouseholdRating: null,
  memberId: null,
  minimumMemberRating: null,
  neverRated: false,
  maximumMinutes: null,
  quickAndEasy: false,
};

export const normalizeIngredientName = (name: string) =>
  name
    .normalize('NFKC')
    .trim()
    .toLocaleLowerCase('nl')
    .replace(/\s+/g, '');

export const formatIngredientName = (name: string) =>
  name
    .normalize('NFKC')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s+%/g, '%');

export function getRecipeFilterCount(filters: RecipeFilters) {
  return [
    filters.ingredientNames.length > 0,
    filters.minimumHouseholdRating !== null,
    filters.memberId !== null && filters.minimumMemberRating !== null,
    filters.neverRated,
    filters.maximumMinutes !== null,
    filters.quickAndEasy,
  ].filter(Boolean).length;
}

export function recipeMatchesFilters(
  recipe: Recipe,
  filters: RecipeFilters,
  ratings: RecipeRatings,
  eatingMemberIds: string[],
) {
  if (filters.ingredientNames.length > 0) {
    const recipeIngredients = new Set(
      recipe.ingredients.map((ingredient) => normalizeIngredientName(ingredient.name)),
    );
    if (!filters.ingredientNames.every((ingredient) =>
      recipeIngredients.has(normalizeIngredientName(ingredient)))) {
      return false;
    }
  }

  if (filters.minimumHouseholdRating !== null) {
    const scores = eatingMemberIds
      .map((memberId) => ratings[recipe.id]?.[memberId])
      .filter((score): score is number => typeof score === 'number');
    const average = scores.length
      ? scores.reduce((total, score) => total + score, 0) / scores.length
      : null;
    if (average === null || average < filters.minimumHouseholdRating) return false;
  }

  if (filters.memberId !== null && filters.minimumMemberRating !== null) {
    const score = ratings[recipe.id]?.[filters.memberId];
    if (typeof score !== 'number' || score < filters.minimumMemberRating) return false;
  }

  if (filters.neverRated) {
    const hasRating = Object.values(ratings[recipe.id] ?? {}).some(
      (score) => typeof score === 'number',
    );
    if (hasRating) return false;
  }

  if (filters.maximumMinutes !== null && recipe.minutes > filters.maximumMinutes) return false;

  if (filters.quickAndEasy && (recipe.minutes > 30 || recipe.ingredients.length > 8)) return false;

  return true;
}
