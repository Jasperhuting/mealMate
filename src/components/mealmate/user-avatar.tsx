import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { palette, radius } from '@/constants/mealmate-theme';

type UserAvatarProps = {
  initial: string;
  size: number;
  uri?: string | null;
};

export function UserAvatar({ initial, size, uri }: UserAvatarProps) {
  return (
    <View
      style={[styles.avatar, { height: size, width: size }]}
      accessibilityElementsHidden>
      {uri ? (
        <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" transition={180} />
      ) : (
        <Text style={[styles.initial, { fontSize: Math.round(size * 0.3) }]}>{initial}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: palette.surfaceStrong,
    borderRadius: radius.pill,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initial: { color: palette.sageDark, fontWeight: '800' },
});
