import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  emptyRecipeFilters,
  getRecipeFilterCount,
  type RecipeFilters,
} from '@/lib/recipe-filters';

type RecipeFilterContextValue = {
  filters: RecipeFilters;
  activeFilterCount: number;
  setFilters: (filters: RecipeFilters) => void;
  clearFilters: () => void;
};

const RecipeFilterContext = createContext<RecipeFilterContextValue | null>(null);

export function RecipeFilterProvider({ children }: PropsWithChildren) {
  const [filters, setFilters] = useState<RecipeFilters>(emptyRecipeFilters);
  const activeFilterCount = getRecipeFilterCount(filters);

  const value = useMemo(
    () => ({
      filters,
      activeFilterCount,
      setFilters,
      clearFilters: () => setFilters(emptyRecipeFilters),
    }),
    [activeFilterCount, filters],
  );

  return <RecipeFilterContext.Provider value={value}>{children}</RecipeFilterContext.Provider>;
}

export function useRecipeFilters() {
  const value = useContext(RecipeFilterContext);
  if (!value) {
    throw new Error('useRecipeFilters moet binnen RecipeFilterProvider worden gebruikt.');
  }
  return value;
}
