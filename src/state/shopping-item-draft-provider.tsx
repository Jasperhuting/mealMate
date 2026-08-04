import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { defaultDepartment, type Department } from '@/data/mock-data';

type ShoppingItemDraftContextValue = {
  department: Department;
  resetDepartment: () => void;
  setDepartment: (department: Department) => void;
};

const ShoppingItemDraftContext = createContext<ShoppingItemDraftContextValue | undefined>(
  undefined,
);

export function ShoppingItemDraftProvider({ children }: PropsWithChildren) {
  const [department, setDepartment] = useState<Department>(defaultDepartment);
  const resetDepartment = useCallback(() => setDepartment(defaultDepartment), []);
  const value = useMemo(
    () => ({
      department,
      resetDepartment,
      setDepartment,
    }),
    [department, resetDepartment],
  );

  return (
    <ShoppingItemDraftContext.Provider value={value}>
      {children}
    </ShoppingItemDraftContext.Provider>
  );
}

export function useShoppingItemDraft() {
  const context = useContext(ShoppingItemDraftContext);
  if (!context) {
    throw new Error('useShoppingItemDraft must be used within ShoppingItemDraftProvider');
  }
  return context;
}
