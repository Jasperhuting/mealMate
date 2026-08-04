import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/mealmate/app-icon';
import { ModalScreenHeader } from '@/components/mealmate/modal-screen-header';
import { RecipeImage } from '@/components/mealmate/recipe-image';
import { palette, radius, spacing } from '@/constants/mealmate-theme';
import { mealMateHaptics } from '@/lib/mealmate-haptics';
import { useMealMate } from '@/state/meal-mate-provider';

export default function RecipeDetailScreen() {
  const { recipeId } = useLocalSearchParams<{ recipeId?: string }>();
  const router = useRouter();
  const { familyMembers, getRecipe, ratings, removeRecipe } = useMealMate();
  const [isDeleting, setIsDeleting] = useState(false);
  const recipe = getRecipe(typeof recipeId === 'string' ? recipeId : undefined);

  if (!recipe) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ModalScreenHeader title="Gerecht" closeLabel="Sluit gerechtdetails" />
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>Gerecht niet gevonden</Text>
          <Text style={styles.notFoundText}>Dit gerecht is mogelijk verwijderd.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const openRating = () => {
    if (familyMembers.length === 0) {
      router.push('/family-sharing');
      return;
    }
    router.push({ pathname: '/rate-recipe', params: { recipeId: recipe.id } });
  };

  const deleteRecipe = async () => {
    setIsDeleting(true);
    try {
      await removeRecipe(recipe.id);
      mealMateHaptics.destructive();
      router.replace('/recipes');
    } catch {
      mealMateHaptics.error();
      Alert.alert(
        'Gerecht verwijderen mislukt',
        'Het gerecht is niet verwijderd. Controleer je internetverbinding en probeer het opnieuw.',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmRecipeRemoval = () => {
    Alert.alert(
      'Gerecht verwijderen?',
      `${recipe.title} wordt definitief verwijderd. Eventuele planningen en bijbehorende boodschappen verdwijnen ook.`,
      [
        { text: 'Annuleer', style: 'cancel' },
        {
          text: 'Verwijder',
          style: 'destructive',
          onPress: () => void deleteRecipe(),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ModalScreenHeader title="Gerecht" closeLabel="Sluit gerechtdetails" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <RecipeImage recipe={recipe} style={styles.heroImage} />

        <Text style={styles.eyebrow}>GERECHT</Text>
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.subtitle}>{recipe.subtitle}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaPill}>
            <AppIcon
              name={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
              tintColor={palette.sageDark}
              size={16}
            />
            <Text style={styles.metaText}>{recipe.minutes} minuten</Text>
          </View>
          <View style={styles.metaPill}>
            <AppIcon
              name={{ ios: 'list.bullet', android: 'list', web: 'list' }}
              tintColor={palette.sageDark}
              size={16}
            />
            <Text style={styles.metaText}>{recipe.ingredients.length} ingrediënten</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={openRating}
            accessibilityRole="button"
            accessibilityLabel={`Beoordeel ${recipe.title}`}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <AppIcon
              name={{ ios: 'star.fill', android: 'star', web: 'star' }}
              tintColor={palette.white}
              size={17}
            />
            <Text style={styles.primaryButtonText}>Beoordelen</Text>
          </Pressable>
          <Pressable
            onPress={() =>
              router.push({ pathname: '/add-recipe', params: { recipeId: recipe.id } })
            }
            accessibilityRole="button"
            accessibilityLabel={`Pas het recept voor ${recipe.title} aan`}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
            <AppIcon
              name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
              tintColor={palette.sageDark}
              size={17}
            />
            <Text style={styles.secondaryButtonText}>Aanpassen</Text>
          </Pressable>
        </View>

        {recipe.sourceUrl ? (
          <Pressable
            onPress={() => void Linking.openURL(recipe.sourceUrl!)}
            accessibilityRole="link"
            accessibilityLabel={`Open het originele recept voor ${recipe.title}`}
            style={({ pressed }) => [styles.sourceLink, pressed && styles.pressed]}>
            <Text style={styles.sourceLinkText}>Bekijk het originele recept bij Peas Maker</Text>
            <AppIcon
              name={{ ios: 'arrow.up.right', android: 'open_in_new', web: 'open_in_new' }}
              tintColor={palette.sageDark}
              size={16}
            />
          </Pressable>
        ) : null}

        {familyMembers.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Jullie beoordelingen</Text>
            <View style={styles.ratingCard}>
              {familyMembers.map((member, index) => {
                const score = ratings[recipe.id]?.[member.id];
                return (
                  <View
                    key={member.id}
                    style={[styles.ratingRow, index > 0 && styles.ratingRowDivider]}>
                    <View style={[styles.avatar, { backgroundColor: member.color }]}>
                      <Text style={styles.avatarText}>{member.initials.slice(0, 1)}</Text>
                    </View>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <View
                      style={styles.memberStars}
                      accessible
                      accessibilityLabel={
                        score
                          ? `${member.name} gaf ${score} van 5 sterren`
                          : `${member.name} heeft nog niet beoordeeld`
                      }>
                      {[1, 2, 3, 4, 5].map((star) => {
                        const filled = star <= (score ?? 0);
                        return (
                          <AppIcon
                            key={star}
                            name={{
                              ios: filled ? 'star.fill' : 'star',
                              android: filled ? 'star' : 'star_outline',
                              web: filled ? 'star' : 'star_outline',
                            }}
                            tintColor={filled ? palette.star : palette.border}
                            size={17}
                            fallback={filled ? '★' : '☆'}
                          />
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingrediënten</Text>
          <View style={styles.ingredientCard}>
            {recipe.ingredients.map((ingredient, index) => (
              <View
                key={ingredient.id}
                style={[styles.ingredientRow, index > 0 && styles.ingredientRowDivider]}>
                <Text style={styles.ingredientName}>{ingredient.name}</Text>
                <Text style={styles.ingredientAmount}>
                  {ingredient.amount} {ingredient.unit}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable
          onPress={confirmRecipeRemoval}
          disabled={isDeleting}
          accessibilityRole="button"
          accessibilityLabel={`Verwijder ${recipe.title}`}
          accessibilityState={{ disabled: isDeleting }}
          style={({ pressed }) => [
            styles.deleteButton,
            (pressed || isDeleting) && styles.pressed,
          ]}>
          {isDeleting ? (
            <ActivityIndicator color={palette.danger} size="small" />
          ) : (
            <AppIcon
              name={{ ios: 'trash', android: 'delete_outline', web: 'delete_outline' }}
              tintColor={palette.danger}
              size={18}
            />
          )}
          <Text style={styles.deleteButtonText}>
            {isDeleting ? 'Gerecht verwijderen…' : 'Gerecht verwijderen'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: palette.background, flex: 1 },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  heroImage: { borderRadius: radius.lg, height: 190, width: '100%' },
  eyebrow: {
    color: palette.sage,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
    marginTop: spacing.xl,
  },
  title: {
    color: palette.text,
    fontSize: 29,
    fontWeight: '700',
    letterSpacing: -0.7,
    lineHeight: 34,
    marginTop: 6,
  },
  subtitle: { color: palette.textMuted, fontSize: 15, lineHeight: 21, marginTop: spacing.sm },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg },
  metaPill: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: 6,
    minHeight: 36,
    paddingHorizontal: spacing.md,
  },
  metaText: { color: palette.sageDark, fontSize: 12, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xl },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: palette.sageDark,
    borderRadius: radius.pill,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 50,
  },
  primaryButtonText: { color: palette.white, fontSize: 14, fontWeight: '800' },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.sageDark,
    borderRadius: radius.pill,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 50,
  },
  secondaryButtonText: { color: palette.sageDark, fontSize: 14, fontWeight: '800' },
  sourceLink: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 6,
    marginTop: spacing.lg,
  },
  sourceLinkText: { color: palette.sageDark, fontSize: 13, fontWeight: '700' },
  section: { marginTop: spacing.xxl },
  sectionTitle: { color: palette.text, fontSize: 19, fontWeight: '700', marginBottom: spacing.md },
  ratingCard: { backgroundColor: palette.surface, borderRadius: radius.lg, paddingHorizontal: spacing.lg },
  ratingRow: { alignItems: 'center', flexDirection: 'row', minHeight: 64 },
  ratingRowDivider: { borderTopColor: palette.border, borderTopWidth: 1 },
  avatar: {
    alignItems: 'center',
    borderRadius: radius.pill,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  avatarText: { color: palette.white, fontSize: 10, fontWeight: '800' },
  memberName: { color: palette.text, flex: 1, fontSize: 14, fontWeight: '700', marginLeft: spacing.md },
  memberStars: { flexDirection: 'row', gap: 3 },
  ingredientCard: { backgroundColor: palette.surface, borderRadius: radius.lg, paddingHorizontal: spacing.lg },
  ingredientRow: { alignItems: 'center', flexDirection: 'row', minHeight: 52 },
  ingredientRowDivider: { borderTopColor: palette.border, borderTopWidth: 1 },
  ingredientName: { color: palette.text, flex: 1, fontSize: 14, fontWeight: '600' },
  ingredientAmount: { color: palette.textMuted, fontSize: 13, fontWeight: '600', marginLeft: spacing.md },
  deleteButton: {
    alignItems: 'center',
    borderColor: palette.danger,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.xxl,
    minHeight: 50,
  },
  deleteButtonText: { color: palette.danger, fontSize: 14, fontWeight: '800' },
  pressed: { opacity: 0.7 },
  notFound: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: spacing.xl },
  notFoundTitle: { color: palette.text, fontSize: 22, fontWeight: '700' },
  notFoundText: { color: palette.textMuted, fontSize: 14, marginTop: spacing.sm },
});
