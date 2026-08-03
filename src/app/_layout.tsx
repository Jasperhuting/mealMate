import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AuthLoadingScreen, LoginScreen } from '@/components/mealmate/login-screen';
import { palette } from '@/constants/mealmate-theme';
import { AuthProvider, useAuth } from '@/state/auth-provider';
import { MealMateProvider } from '@/state/meal-mate-provider';

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
    <AuthProvider>
      <ThemeProvider value={mealMateTheme}>
        <StatusBar style="dark" />
        <AuthenticatedApp />
      </ThemeProvider>
    </AuthProvider>
  );
}

function AuthenticatedApp() {
  const { session, isLoading } = useAuth();
  if (isLoading) return <AuthLoadingScreen />;
  if (!session) return <LoginScreen />;

  return (
    <MealMateProvider>
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
              headerBackTitle: 'Annuleer',
            }}
          />
          <Stack.Screen
            name="add-meal"
            options={{
              presentation: 'modal',
              title: 'Gerecht plannen',
              headerBackTitle: 'Terug',
            }}
          />
          <Stack.Screen
            name="add-shopping-item"
            options={{
              presentation: 'modal',
              title: 'Product toevoegen',
              headerBackTitle: 'Annuleer',
            }}
          />
          <Stack.Screen
            name="rate-recipe"
            options={{
              presentation: 'modal',
              title: 'Gerecht beoordelen',
              headerBackTitle: 'Terug',
            }}
          />
          <Stack.Screen
            name="family-sharing"
            options={{
              presentation: 'modal',
              title: 'Gezin delen',
              headerBackTitle: 'Sluiten',
            }}
          />
        </Stack>
    </MealMateProvider>
  );
}
