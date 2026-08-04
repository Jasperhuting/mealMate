import * as Haptics from 'expo-haptics';

let hapticsEnabled = true;

function play(effect: () => Promise<void>) {
  if (!hapticsEnabled) return;

  void effect().catch((error) => {
    if (__DEV__) console.warn('Tably haptic feedback failed', error);
  });
}

export function configureMealMateHaptics(enabled: boolean) {
  hapticsEnabled = enabled;
}

export const mealMateHaptics = {
  selection: () => play(Haptics.selectionAsync),
  success: () =>
    play(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  error: () => play(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),
  listComplete: () =>
    play(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  destructive: () => play(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)),
};
