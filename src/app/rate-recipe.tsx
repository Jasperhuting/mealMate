import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/mealmate/app-icon';
import { RecipeImage } from '@/components/mealmate/recipe-image';
import { palette, radius, spacing } from '@/constants/mealmate-theme';
import { useMealMate } from '@/state/meal-mate-provider';

export default function RateRecipeScreen() {
  const { recipeId } = useLocalSearchParams<{ recipeId: string }>();
  const router = useRouter();
  const { getRecipe, ratings, familyMembers, rateRecipe } = useMealMate();
  const recipe = getRecipe(typeof recipeId === 'string' ? recipeId : undefined);
  const [draftRatings, setDraftRatings] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      familyMembers.map((member) => [member.id, ratings[recipe?.id ?? '']?.[member.id] ?? 0]),
    ),
  );

  if (!recipe) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.notFound}>Dit gerecht kon niet worden gevonden.</Text>
      </SafeAreaView>
    );
  }

  const save = () => {
    for (const member of familyMembers) {
      const score = draftRatings[member.id];
      if (score) rateRecipe(recipe.id, member.id, score);
    }
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <RecipeImage recipe={recipe} style={styles.heroImage} />
        <Text style={styles.eyebrow}>NA HET ETEN</Text>
        <Text style={styles.title}>Hoe vonden jullie {recipe.title}?</Text>
        <Text style={styles.subtitle}>
          Iedereen geeft een eigen beoordeling. Zo zien jullie later precies wat in de smaak viel.
        </Text>

        <View style={styles.ratingList}>
          {familyMembers.map((member) => (
            <View key={member.id} style={styles.memberRating}>
              <View style={[styles.avatar, { backgroundColor: member.color }]}>
                <Text style={styles.avatarText}>{member.initials}</Text>
              </View>
              <Text style={styles.memberName}>{member.name}</Text>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((score) => {
                  const selected = score <= draftRatings[member.id];
                  return (
                    <Pressable
                      key={score}
                      onPress={() =>
                        setDraftRatings((current) => ({ ...current, [member.id]: score }))
                      }
                      hitSlop={6}
                      accessibilityRole="button"
                      accessibilityLabel={`${member.name}: ${score} sterren`}>
                      <AppIcon
                        name={{
                          ios: selected ? 'star.fill' : 'star',
                          android: selected ? 'star' : 'star_outline',
                          web: selected ? 'star' : 'star_outline',
                        }}
                        tintColor={selected ? palette.star : palette.border}
                        size={26}
                        fallback={selected ? '★' : '☆'}
                      />
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        <Pressable
          onPress={save}
          accessibilityRole="button"
          style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}>
          <Text style={styles.saveText}>Beoordelingen bewaren</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  heroImage: { borderRadius: radius.lg, height: 190, width: '100%' },
  eyebrow: { color: palette.sage, fontSize: 11, fontWeight: '800', letterSpacing: 1.1, marginTop: spacing.xxl },
  title: { color: palette.text, fontSize: 28, fontWeight: '700', letterSpacing: -0.6, lineHeight: 34, marginTop: spacing.sm },
  subtitle: { color: palette.textMuted, fontSize: 15, lineHeight: 22, marginTop: spacing.md },
  ratingList: { gap: spacing.md, marginTop: spacing.xxl },
  memberRating: { alignItems: 'center', backgroundColor: palette.surface, borderRadius: radius.lg, padding: spacing.xl },
  avatar: { alignItems: 'center', borderRadius: radius.pill, height: 48, justifyContent: 'center', width: 48 },
  avatarText: { color: palette.white, fontSize: 12, fontWeight: '800' },
  memberName: { color: palette.text, fontSize: 16, fontWeight: '700', marginTop: spacing.sm },
  stars: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  saveButton: { alignItems: 'center', backgroundColor: palette.sageDark, borderRadius: radius.pill, marginTop: spacing.xxl, paddingVertical: 16 },
  saveText: { color: palette.white, fontSize: 15, fontWeight: '700' },
  pressed: { opacity: 0.72 },
  notFound: { color: palette.text, fontSize: 16, padding: spacing.xl },
});
