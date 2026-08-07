import type { Recipe, RecipeCategory } from '@/data/mock-data';

export type RecipeFilters = {
  sortBy: RecipeSort | null;
  categories: RecipeCategory[];
  ingredientNames: string[];
  minimumHouseholdRating: number | null;
  memberId: string | null;
  minimumMemberRating: number | null;
  neverRated: boolean;
  maximumMinutes: number | null;
  quickAndEasy: boolean;
  showHidden: boolean;
};

export type RecipeRatings = Record<string, Record<string, number | undefined>>;
export type RecipeSort = 'newest' | 'alphabetical' | 'personal-rating' | 'household-rating';

export const emptyRecipeFilters: RecipeFilters = {
  sortBy: null,
  categories: [],
  ingredientNames: [],
  minimumHouseholdRating: null,
  memberId: null,
  minimumMemberRating: null,
  neverRated: false,
  maximumMinutes: null,
  quickAndEasy: false,
  showHidden: false,
};

const recipeTitleComparison = (a: Recipe, b: Recipe) =>
  a.title.localeCompare(b.title, 'nl', { sensitivity: 'base' });

const recipeTimestamp = (recipe: Recipe) => {
  if (!recipe.createdAt) return Number.NEGATIVE_INFINITY;
  const timestamp = new Date(recipe.createdAt).getTime();
  return Number.isFinite(timestamp) ? timestamp : Number.NEGATIVE_INFINITY;
};

const recipeHouseholdRating = (
  recipeId: string,
  ratings: RecipeRatings,
  householdMemberIds: string[],
) => {
  const scores = householdMemberIds
    .map((memberId) => ratings[recipeId]?.[memberId])
    .filter((score): score is number => typeof score === 'number');
  return scores.length
    ? scores.reduce((total, score) => total + score, 0) / scores.length
    : Number.NEGATIVE_INFINITY;
};

export function sortRecipes(
  recipes: Recipe[],
  sortBy: RecipeSort,
  ratings: RecipeRatings,
  householdMemberIds: string[],
  currentMemberId?: string,
) {
  return [...recipes].sort((a, b) => {
    if (sortBy === 'newest') {
      return recipeTimestamp(b) - recipeTimestamp(a) || recipeTitleComparison(a, b);
    }

    if (sortBy === 'personal-rating') {
      const ratingA = currentMemberId === undefined
        ? Number.NEGATIVE_INFINITY
        : ratings[a.id]?.[currentMemberId] ?? Number.NEGATIVE_INFINITY;
      const ratingB = currentMemberId === undefined
        ? Number.NEGATIVE_INFINITY
        : ratings[b.id]?.[currentMemberId] ?? Number.NEGATIVE_INFINITY;
      return ratingB - ratingA || recipeTitleComparison(a, b);
    }

    if (sortBy === 'household-rating') {
      return recipeHouseholdRating(b.id, ratings, householdMemberIds)
        - recipeHouseholdRating(a.id, ratings, householdMemberIds)
        || recipeTitleComparison(a, b);
    }

    return recipeTitleComparison(a, b);
  });
}

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
    filters.sortBy !== null,
    filters.categories.length > 0,
    filters.ingredientNames.length > 0,
    filters.minimumHouseholdRating !== null,
    filters.memberId !== null && filters.minimumMemberRating !== null,
    filters.neverRated,
    filters.maximumMinutes !== null,
    filters.quickAndEasy,
    filters.showHidden,
  ].filter(Boolean).length;
}

export function recipeMatchesFilters(
  recipe: Recipe,
  filters: RecipeFilters,
  ratings: RecipeRatings,
  eatingMemberIds: string[],
) {
  if (filters.categories.length > 0 && !filters.categories.includes(recipe.category)) {
    return false;
  }

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
