import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, type PropsWithChildren, useContext, useEffect, useState } from 'react';

import { configureMealMateHaptics } from '@/lib/mealmate-haptics';

const hapticsStorageKey = 'mealmate.haptics-enabled.v1';

type HapticsContextValue = {
  hapticsEnabled: boolean;
  setHapticsEnabled: (enabled: boolean) => void;
};

const HapticsContext = createContext<HapticsContextValue | null>(null);

export function HapticsProvider({ children }: PropsWithChildren) {
  const [hapticsEnabled, setHapticsEnabledState] = useState(true);

  useEffect(() => {
    void AsyncStorage.getItem(hapticsStorageKey)
      .then((storedValue) => {
        if (storedValue !== null) setHapticsEnabledState(storedValue === 'true');
      })
      .catch((error) => {
        if (__DEV__) console.warn('Tably haptics preference could not be loaded', error);
      });
  }, []);

  useEffect(() => {
    configureMealMateHaptics(hapticsEnabled);
  }, [hapticsEnabled]);

  const setHapticsEnabled = (enabled: boolean) => {
    setHapticsEnabledState(enabled);
    void AsyncStorage.setItem(hapticsStorageKey, String(enabled)).catch((error) => {
      if (__DEV__) console.warn('Tably haptics preference could not be saved', error);
    });
  };

  return (
    <HapticsContext.Provider value={{ hapticsEnabled, setHapticsEnabled }}>
      {children}
    </HapticsContext.Provider>
  );
}

export function useHapticsSettings() {
  const context = useContext(HapticsContext);
  if (!context) throw new Error('useHapticsSettings must be used within HapticsProvider');
  return context;
}
