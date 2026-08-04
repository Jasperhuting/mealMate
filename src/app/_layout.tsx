import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AuthLoadingScreen, LoginScreen } from '@/components/mealmate/login-screen';
import { palette } from '@/constants/mealmate-theme';
import { AuthProvider, useAuth } from '@/state/auth-provider';
import { HapticsProvider } from '@/state/haptics-provider';
import { MealMateProvider } from '@/state/meal-mate-provider';
import { RecipeFilterProvider } from '@/state/recipe-filter-provider';
import { ShoppingItemDraftProvider } from '@/state/shopping-item-draft-provider';
import { clearMealPlanWidgets } from '@/lib/meal-plan-widgets';

const mealMateTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: palette.background,
    card: palette.surface,
    text: palette.text,
    border: palette.border,
    primary: palette.sage,
  },
};

export default function RootLayout() {
  return (
    <HapticsProvider>
      <AuthProvider>
        <ThemeProvider value={mealMateTheme}>
          <StatusBar style="dark" />
          <AuthenticatedApp />
        </ThemeProvider>
      </AuthProvider>
    </HapticsProvider>
  );
}

function AuthenticatedApp() {
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !session) void clearMealPlanWidgets();
  }, [isLoading, session]);

  if (isLoading) return <AuthLoadingScreen />;
  if (!session) return <LoginScreen />;

  return (
    <MealMateProvider>
      <ShoppingItemDraftProvider>
        <RecipeFilterProvider>
          <Stack
            screenOptions={{
              headerShadowVisible: false,
              headerStyle: { backgroundColor: palette.background },
              headerTintColor: palette.text,
              contentStyle: { backgroundColor: palette.background },
            }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="add-recipe"
            options={{
              presentation: 'modal',
              title: 'Gerecht toevoegen',
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="add-meal"
            options={{
              presentation: 'modal',
              title: 'Gerecht plannen',
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="add-shopping-item"
            options={{
              presentation: 'modal',
              title: 'Product toevoegen',
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="change-shopping-department"
            options={{
              presentation: 'modal',
              title: 'Afdeling wijzigen',
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="select-shopping-department"
            options={{
              presentation: 'modal',
              title: 'Afdeling kiezen',
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="shopping-item-actions"
            options={{
              presentation: 'modal',
              title: 'Product',
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="meal-attendance"
            options={{
              presentation: 'modal',
              title: 'Aanwezigheid',
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="rate-recipe"
            options={{
              presentation: 'modal',
              title: 'Gerecht beoordelen',
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="recipe-detail"
            options={{
              presentation: 'modal',
              title: 'Gerecht',
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="recipe-filters"
            options={{
              presentation: 'modal',
              title: 'Recepten filteren',
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="family-sharing"
            options={{
              presentation: 'modal',
              title: 'Gezin delen',
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="account"
            options={{
              presentation: 'modal',
              title: 'Account',
              headerBackVisible: false,
            }}
          />
          </Stack>
        </RecipeFilterProvider>
      </ShoppingItemDraftProvider>
    </MealMateProvider>
  );
}
