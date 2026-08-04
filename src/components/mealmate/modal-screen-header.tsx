import { Stack, useRouter } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { AppIcon } from '@/components/mealmate/app-icon';
import { palette, radius, shadow } from '@/constants/mealmate-theme';

type ModalScreenHeaderProps = {
  title: string;
  closeLabel?: string;
  onBack?: () => void;
  backLabel?: string;
};

export function ModalScreenHeader({
  title,
  closeLabel = 'Sluit venster',
  onBack,
  backLabel = 'Terug naar de vorige stap',
}: ModalScreenHeaderProps) {
  const router = useRouter();

  const close = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/');
  };

  return (
    <Stack.Screen
      options={{
        title,
        headerBackVisible: false,
        headerTitleStyle: { fontSize: 16, fontWeight: '700' },
        headerLeft: () =>
          onBack ? (
            <HeaderButton
              accessibilityLabel={backLabel}
              icon={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
              onPress={onBack}
            />
          ) : null,
        headerRight: () => (
          <HeaderButton
            accessibilityLabel={closeLabel}
            icon={{ ios: 'xmark', android: 'close', web: 'close' }}
            onPress={close}
          />
        ),
      }}
    />
  );
}

function HeaderButton({
  accessibilityLabel,
  icon,
  onPress,
}: {
  accessibilityLabel: string;
  icon: ComponentProps<typeof AppIcon>['name'];
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
      <AppIcon name={icon} tintColor={palette.sageDark} size={17} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    ...shadow.card,
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: radius.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  buttonPressed: { opacity: 0.65 },
});
