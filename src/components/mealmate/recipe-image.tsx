import { Image } from 'expo-image';
import { StyleSheet, Text, View, type ImageStyle, type StyleProp } from 'react-native';

import { palette } from '@/constants/mealmate-theme';
import type { Recipe } from '@/data/mock-data';

type RecipeImageProps = {
  recipe: Recipe;
  style?: StyleProp<ImageStyle>;
};

export function RecipeImage({ recipe, style }: RecipeImageProps) {
  if (!recipe.image) {
    return (
      <View style={[styles.fallback, style]}>
        <Text style={styles.emoji}>🍽</Text>
      </View>
    );
  }

  return (
    <Image
      source={recipe.image}
      style={style}
      contentFit="cover"
      transition={180}
      accessibilityLabel={`Foto van ${recipe.title}`}
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 28,
  },
});
