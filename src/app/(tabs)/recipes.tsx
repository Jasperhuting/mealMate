import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/mealmate/app-icon';
import { RecipeImage } from '@/components/mealmate/recipe-image';
import { ScreenHeader } from '@/components/mealmate/screen-header';
import { palette, radius, shadow, spacing } from '@/constants/mealmate-theme';
import type { Recipe } from '@/data/mock-data';
import { useMealMate } from '@/state/meal-mate-provider';

export default function RecipesScreen() {
  const router = useRouter();
  const { recipes, ratings, familyMembers } = useMealMate();
  const [query, setQuery] = useState('');

  const filteredRecipes = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('nl');
    if (!normalized) return recipes;
    return recipes.filter((recipe) =>
      `${recipe.title} ${recipe.subtitle}`.toLocaleLowerCase('nl').includes(normalized),
    );
  }, [query, recipes]);

  const openRating = (recipe: Recipe) => {
    router.push({ pathname: '/rate-recipe', params: { recipeId: recipe.id } });
  };

  const editRecipe = (recipe: Recipe) => {
    router.push({ pathname: '/add-recipe', params: { recipeId: recipe.id } });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            <ScreenHeader
              eyebrow="JULLIE SMAAK"
              title="Recepten"
              subtitle="Bewaar wat jullie probeerden en onthoud wie welk gerecht lekker vond."
              action={
                <Pressable
                  onPress={() => router.push('/add-recipe')}
                  accessibilityRole="button"
                  accessibilityLabel="Nieuw recept toevoegen"
                  style={styles.addButton}>
                  <AppIcon
                    name={{ ios: 'plus', android: 'add', web: 'add' }}
                    tintColor={palette.white}
                  />
                </Pressable>
              }
            />

            <View style={styles.searchBox}>
              <AppIcon
                name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
                tintColor={palette.textSoft}
              />
              <TextInput
                defaultValue=""
                onChangeText={setQuery}
                placeholder="Zoek een gerecht..."
                placeholderTextColor={palette.textSoft}
                returnKeyType="search"
                style={styles.searchInput}
                accessibilityLabel="Recepten zoeken"
              />
            </View>

            <View style={styles.listHeading}>
              <Text style={styles.listTitle}>Alle gerechten</Text>
              <Text style={styles.listCount}>{filteredRecipes.length}</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {query.trim() ? 'Geen gerecht gevonden' : 'Nog geen gerechten'}
            </Text>
            <Text style={styles.emptyText}>
              {query.trim()
                ? 'Probeer een kortere zoekterm.'
                : 'Voeg jullie eerste gerecht toe met de plusknop.'}
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <View style={styles.recipeCard}>
            <Pressable
              onPress={() => openRating(item)}
              accessibilityRole="button"
              style={({ pressed }) => [styles.recipeMain, pressed && styles.pressed]}>
              <RecipeImage recipe={item} style={styles.recipeImage} />
              <View style={styles.recipeCopy}>
                <Text style={styles.recipeTitle}>{item.title}</Text>
                <Text style={styles.recipeMeta}>{item.minutes} min · {item.ingredients.length} ingrediënten</Text>
                <View style={styles.ratingRow}>
                  {familyMembers.map((member) => (
                    <View key={member.id} style={styles.ratingPill}>
                      <Text style={styles.memberInitial}>{member.initials.slice(0, 1)}</Text>
                      <Text style={styles.ratingText}>
                        ★ {ratings[item.id]?.[member.id] ?? '–'}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </Pressable>
            <Pressable
              onPress={() => editRecipe(item)}
              accessibilityRole="button"
              accessibilityLabel={`Bewerk ${item.title}`}
              hitSlop={6}
              style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}>
              <AppIcon
                name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
                tintColor={palette.sageDark}
                size={19}
              />
            </Pressable>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.xl, paddingBottom: 120 },
  addButton: {
    alignItems: 'center',
    backgroundColor: palette.sageDark,
    borderRadius: radius.pill,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  searchInput: { color: palette.text, flex: 1, fontSize: 16, height: 52, marginLeft: spacing.md },
  listHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
    marginTop: spacing.xxl,
  },
  listTitle: { color: palette.text, fontSize: 21, fontWeight: '700' },
  listCount: {
    backgroundColor: palette.surfaceStrong,
    borderRadius: radius.pill,
    color: palette.textMuted,
    fontSize: 12,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  separator: { height: spacing.md },
  recipeCard: {
    ...shadow.card,
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    flexDirection: 'row',
    padding: spacing.sm,
  },
  recipeMain: { alignItems: 'center', flex: 1, flexDirection: 'row' },
  editButton: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderRadius: radius.pill,
    height: 40,
    justifyContent: 'center',
    marginRight: spacing.sm,
    width: 40,
  },
  pressed: { opacity: 0.72 },
  recipeImage: { borderRadius: radius.md, height: 92, width: 92 },
  recipeCopy: { flex: 1, marginHorizontal: spacing.md },
  recipeTitle: { color: palette.text, fontSize: 16, fontWeight: '700' },
  recipeMeta: { color: palette.textMuted, fontSize: 12, marginTop: 5 },
  ratingRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  ratingPill: {
    alignItems: 'center',
    backgroundColor: palette.surfaceMuted,
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  memberInitial: { color: palette.sageDark, fontSize: 10, fontWeight: '800' },
  ratingText: { color: palette.textMuted, fontSize: 11, fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { color: palette.text, fontSize: 17, fontWeight: '700' },
  emptyText: { color: palette.textMuted, fontSize: 14, marginTop: spacing.sm },
});
