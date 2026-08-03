import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import type { ComponentProps, RefObject } from 'react';
import { Pressable, StyleSheet, Text, View, type ColorValue } from 'react-native';

import { palette } from '@/constants/mealmate-theme';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

type MealMateTabBarProps = TabBarProps & {
  blurTarget: RefObject<View | null>;
};

const BAR_INSET = 8;

export function MealMateTabBar({
  state,
  descriptors,
  navigation,
  insets,
  blurTarget,
}: MealMateTabBarProps) {
  return (
    <View pointerEvents="box-none" style={[styles.container, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.shadow}>
        <View style={styles.glassBar}>
          <BlurView
            blurMethod="dimezisBlurViewSdk31Plus"
            blurTarget={blurTarget}
            intensity={68}
            tint="systemUltraThinMaterialLight"
            style={StyleSheet.absoluteFill}
          />
          <View pointerEvents="none" style={styles.glassTint} />

          <View style={styles.items}>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const isFocused = state.index === index;
              const color: ColorValue = isFocused ? palette.sageDark : palette.text;
              const label =
                typeof options.tabBarLabel === 'string'
                  ? options.tabBarLabel
                  : options.title ?? route.name;

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
                }
              };

              const onLongPress = () => {
                navigation.emit({ type: 'tabLongPress', target: route.key });
              };

              return (
                <Pressable
                  accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
                  accessibilityRole="tab"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  key={route.key}
                  onLongPress={onLongPress}
                  onPress={onPress}
                  style={({ pressed }) => [
                    styles.item,
                    isFocused && styles.itemActive,
                    pressed && styles.itemPressed,
                  ]}
                  testID={options.tabBarButtonTestID}>
                  {options.tabBarIcon?.({ focused: isFocused, color, size: 22 })}
                  <Text
                    adjustsFontSizeToFit
                    allowFontScaling={options.tabBarAllowFontScaling}
                    maxFontSizeMultiplier={1.2}
                    minimumFontScale={0.82}
                    numberOfLines={1}
                    style={[
                      styles.label,
                      { color },
                      label.length > 10 && styles.longLabel,
                      isFocused && styles.labelActive,
                    ]}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    bottom: 0,
    left: 0,
    paddingTop: 10,
    position: 'absolute',
    right: 0,
  },
  shadow: {
    borderRadius: 36,
    elevation: 8,
    height: 72,
    marginHorizontal: 16,
    shadowColor: '#252820',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
  },
  glassBar: {
    borderColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 36,
    borderWidth: 1,
    flex: 1,
    overflow: 'hidden',
  },
  glassTint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  items: {
    flex: 1,
    flexDirection: 'row',
    padding: BAR_INSET,
  },
  item: {
    alignItems: 'center',
    borderRadius: 18,
    flex: 1,
    gap: 3,
    justifyContent: 'center',
    minWidth: 0,
    paddingBottom: 4,
  },
  itemActive: {
    backgroundColor: 'rgba(221, 228, 216, 0.82)',
  },
  itemPressed: {
    opacity: 0.7,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
  },
  longLabel: {
    fontSize: 10,
    letterSpacing: -0.25,
  },
  labelActive: {
    fontWeight: '700',
  },
});
