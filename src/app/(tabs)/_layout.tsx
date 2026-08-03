import { BlurTargetView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { useRef } from 'react';
import { View } from 'react-native';

import { AppIcon } from '@/components/mealmate/app-icon';
import { MealMateTabBar } from '@/components/mealmate/meal-mate-tab-bar';
import { palette } from '@/constants/mealmate-theme';

export default function TabsLayout() {
  const blurTarget = useRef<View | null>(null);

  return (
    <BlurTargetView ref={blurTarget} style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: palette.background },
          tabBarActiveTintColor: palette.sageDark,
          tabBarInactiveTintColor: palette.text,
        }}
        tabBar={(props) => <MealMateTabBar {...props} blurTarget={blurTarget} />}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Week',
          tabBarIcon: ({ color }) => (
            <AppIcon
              name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recepten',
          tabBarIcon: ({ color }) => (
            <AppIcon
              name={{ ios: 'book.closed', android: 'menu_book', web: 'menu_book' }}
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="shopping"
        options={{
          title: 'Boodschappen',
          tabBarIcon: ({ color }) => (
            <AppIcon
              name={{ ios: 'cart', android: 'shopping_cart', web: 'shopping_cart' }}
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="family"
        options={{
          title: 'Gezin',
          tabBarIcon: ({ color }) => (
            <AppIcon
              name={{ ios: 'person.2', android: 'groups', web: 'groups' }}
              tintColor={color}
            />
          ),
        }}
      />
      </Tabs>
    </BlurTargetView>
  );
}
