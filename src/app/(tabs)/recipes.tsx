import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/mealmate/app-icon';
import { getMealMateTabBarContentInset } from '@/components/mealmate/meal-mate-tab-bar';
import { RecipeImage } from '@/components/mealmate/recipe-image';
import { ScreenHeader } from '@/components/mealmate/screen-header';
import { palette, radius, shadow, spacing } from '@/constants/mealmate-theme';
import type { Recipe } from '@/data/mock-data';
import { recipeMatchesFilters } from '@/lib/recipe-filters';
import { useMealMate } from '@/state/meal-mate-provider';
import { useRecipeFilters } from '@/state/recipe-filter-provider';

export default function RecipesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { recipes, ratings, familyMembers, hiddenRecipeIds, setRecipeHidden } = useMealMate();
  const { filters, activeFilterCount, setFilters, clearFilters } = useRecipeFilters();
  const [query, setQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const isSearchActive = isSearchFocused || query.trim().length > 0;
  const filteredRecipes = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('nl');
    const hiddenIds = new Set(hiddenRecipeIds);
    const matches = recipes.filter((recipe) => {
      if (!isSearchActive && hiddenIds.has(recipe.id)) return false;
      const matchesQuery = !normalized
        || `${recipe.title} ${recipe.subtitle}`.toLocaleLowerCase('nl').includes(normalized);
      return matchesQuery && recipeMatchesFilters(
        recipe,
        filters,
        ratings,
        familyMembers.map((member) => member.id),
      );
    });
    return matches.sort((a, b) => a.title.localeCompare(b.title, 'nl'));
  }, [familyMembers, filters, hiddenRecipeIds, isSearchActive, query, ratings, recipes]);

  const activeFilterLabels = useMemo(() => {
    const labels: { key: string; label: string }[] = [];
    if (filters.ingredientNames.length > 0) {
      labels.push({
        key: 'ingredients',
        label: filters.ingredientNames.length === 1
          ? filters.ingredientNames[0]
          : `${filters.ingredientNames.length} ingrediënten`,
      });
    }
    if (filters.minimumHouseholdRating !== null) {
      labels.push({ key: 'household', label: `Samen ★ ${filters.minimumHouseholdRating}+` });
    }
    if (filters.memberId && filters.minimumMemberRating !== null) {
      const member = familyMembers.find((candidate) => candidate.id === filters.memberId);
      labels.push({
        key: 'member',
        label: `${member?.name ?? 'Persoon'} ★ ${filters.minimumMemberRating}+`,
      });
    }
    if (filters.maximumMinutes !== null) {
      labels.push({ key: 'minutes', label: `Tot ${filters.maximumMinutes} min` });
    }
    if (filters.quickAndEasy) labels.push({ key: 'easy', label: 'Snel & makkelijk' });
    if (filters.neverRated) labels.push({ key: 'unrated', label: 'Nog nooit beoordeeld' });
    return labels;
  }, [familyMembers, filters]);

  const removeFilter = (key: string) => {
    if (key === 'ingredients') setFilters({ ...filters, ingredientNames: [] });
    if (key === 'household') setFilters({ ...filters, minimumHouseholdRating: null });
    if (key === 'member') {
      setFilters({ ...filters, memberId: null, minimumMemberRating: null });
    }
    if (key === 'minutes') setFilters({ ...filters, maximumMinutes: null });
    if (key === 'easy') setFilters({ ...filters, quickAndEasy: false });
    if (key === 'unrated') setFilters({ ...filters, neverRated: false });
  };

  const openRating = (recipe: Recipe) => {
    if (familyMembers.length === 0) {
      router.push('/family-sharing');
      return;
    }

    router.push({ pathname: '/rate-recipe', params: { recipeId: recipe.id } });
  };

  const editRecipe = (recipe: Recipe) => {
    router.push({
      pathname: '/add-recipe',
      params: { recipeId: recipe.id, allowDelete: 'true' },
    });
  };

  const toggleRecipeHidden = async (recipe: Recipe) => {
    const isHidden = hiddenRecipeIds.includes(recipe.id);
    try {
      await setRecipeHidden(recipe.id, !isHidden);
    } catch {
      Alert.alert(
        'Niet gelukt',
        `We konden ${recipe.title} nu niet ${isHidden ? 'tonen' : 'verbergen'}. Probeer het opnieuw.`,
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: getMealMateTabBarContentInset(insets.bottom) },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        automaticallyAdjustKeyboardInsets
        ListHeaderComponent={
          <View>
            {!isSearchActive ? (
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
            ) : null}

            <View style={[styles.searchRow, isSearchActive && styles.searchRowActive]}>
              <View style={styles.searchBox}>
                <AppIcon
                  name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
                  tintColor={palette.textSoft}
                />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  onSubmitEditing={Keyboard.dismiss}
                  placeholder="Zoek een gerecht..."
                  placeholderTextColor={palette.textSoft}
                  returnKeyType="search"
                  clearButtonMode="while-editing"
                  style={styles.searchInput}
                  accessibilityLabel="Recepten zoeken"
                />
              </View>
              <Pressable
                onPress={() => router.push('/recipe-filters')}
                accessibilityRole="button"
                accessibilityLabel={activeFilterCount > 0
                  ? `Filters openen, ${activeFilterCount} actief`
                  : 'Filters openen'}
                style={({ pressed }) => [
                  styles.filterButton,
                  activeFilterCount > 0 && styles.filterButtonActive,
                  pressed && styles.pressed,
                ]}>
                <AppIcon
                  name={{ ios: 'line.3.horizontal.decrease', android: 'filter_alt', web: 'filter_alt' }}
                  tintColor={activeFilterCount > 0 ? palette.white : palette.sageDark}
                  size={20}
                />
                {activeFilterCount > 0 ? (
                  <View style={styles.filterBadge}>
                    <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                  </View>
                ) : null}
              </Pressable>
            </View>

            {activeFilterLabels.length > 0 ? (
              <View style={styles.activeFiltersBlock}>
                <View style={styles.activeFiltersHeading}>
                  <Text style={styles.activeFiltersTitle}>Actieve filters</Text>
                  <Pressable
                    onPress={clearFilters}
                    accessibilityRole="button"
                    accessibilityLabel="Alle filters wissen"
                    hitSlop={6}>
                    <Text style={styles.clearFiltersText}>Wis alles</Text>
                  </Pressable>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.activeFilterList}>
                  {activeFilterLabels.map((filter) => (
                    <Pressable
                      key={filter.key}
                      onPress={() => removeFilter(filter.key)}
                      accessibilityRole="button"
                      accessibilityLabel={`Filter ${filter.label} verwijderen`}
                      style={({ pressed }) => [styles.activeFilterChip, pressed && styles.pressed]}>
                      <Text style={styles.activeFilterChipText}>{filter.label}</Text>
                      <AppIcon
                        name={{ ios: 'xmark', android: 'close', web: 'close' }}
                        tintColor={palette.sageDark}
                        size={13}
                      />
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            ) : null}

            {familyMembers.length === 0 && !isSearchActive ? (
              <Pressable
                onPress={() => router.push('/family-sharing')}
                accessibilityRole="button"
                accessibilityLabel="Gezin instellen om recepten te beoordelen"
                style={({ pressed }) => [styles.familyBanner, pressed && styles.pressed]}>
                <View style={styles.familyBannerIcon}>
                  <AppIcon
                    name={{ ios: 'person.2.fill', android: 'groups', web: 'groups' }}
                    tintColor={palette.sageDark}
                    size={18}
                  />
                </View>
                <View style={styles.familyBannerCopy}>
                  <Text style={styles.familyBannerTitle}>Beoordelen met je gezin</Text>
                  <Text style={styles.familyBannerText} numberOfLines={2}>
                    Stel je gezin één keer in en onthoud wie wat lekker vindt.
                  </Text>
                </View>
                <View style={styles.familyBannerAction}>
                  <Text style={styles.familyBannerActionText}>Instellen</Text>
                  <AppIcon
                    name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                    tintColor={palette.sageDark}
                    size={15}
                  />
                </View>
              </Pressable>
            ) : null}

            <View style={styles.listHeading}>
              <Text style={styles.listTitle}>
                {isSearchActive || activeFilterCount > 0 ? 'Resultaten' : 'Alle gerechten'}
              </Text>
              <Text style={styles.listCount}>{filteredRecipes.length}</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {query.trim() || activeFilterCount > 0 ? 'Geen gerecht gevonden' : 'Nog geen gerechten'}
            </Text>
            <Text style={styles.emptyText}>
              {query.trim() || activeFilterCount > 0
                ? 'Pas je zoekopdracht of filters aan.'
                : 'Voeg jullie eerste gerecht toe met de plusknop.'}
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => {
          const isHidden = hiddenRecipeIds.includes(item.id);
          return (
            <View style={[styles.recipeCard, isHidden && styles.hiddenRecipeCard]}>
              <View style={styles.cardTop}>
                <View style={styles.recipeMain}>
                  <RecipeImage recipe={item} style={styles.recipeImage} />
                  <View style={styles.recipeCopy}>
                    <View style={styles.recipeTitleRow}>
                      <Text style={styles.recipeTitle}>{item.title}</Text>
                      {isHidden ? (
                        <View style={styles.hiddenBadge}>
                          <AppIcon
                            name={{
                              ios: 'eye.slash',
                              android: 'visibility_off',
                              web: 'visibility_off',
                            }}
                            tintColor={palette.textMuted}
                            size={12}
                          />
                          <Text style={styles.hiddenBadgeText}>Verborgen gerecht</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.recipeMeta}>
                      {item.minutes} min · {item.ingredients.length} ingrediënten
                    </Text>
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
                </View>
                <View style={styles.cardActions}>
                  <Pressable
                    onPress={() => void toggleRecipeHidden(item)}
                    accessibilityRole="button"
                    accessibilityLabel={`${item.title} ${isHidden ? 'weer tonen' : 'verbergen'}`}
                    hitSlop={4}
                    style={({ pressed }) => [styles.cardActionButton, pressed && styles.pressed]}>
                    <AppIcon
                      name={{
                        ios: isHidden ? 'eye' : 'eye.slash',
                        android: isHidden ? 'visibility' : 'visibility_off',
                        web: isHidden ? 'visibility' : 'visibility_off',
                      }}
                      tintColor={palette.sageDark}
                      size={18}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => editRecipe(item)}
                    accessibilityRole="button"
                    accessibilityLabel={`Bewerk ${item.title}`}
                    hitSlop={4}
                    style={({ pressed }) => [styles.cardActionButton, pressed && styles.pressed]}>
                    <AppIcon
                      name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
                      tintColor={palette.sageDark}
                      size={18}
                    />
                  </Pressable>
                </View>
              </View>
              {familyMembers.length > 0 ? (
                <Pressable
                  onPress={() => openRating(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`Beoordeel ${item.title}`}
                  style={({ pressed }) => [styles.ratingButton, pressed && styles.pressed]}>
                  <AppIcon
                    name={{ ios: 'star', android: 'star_outline', web: 'star_outline' }}
                    tintColor={palette.sageDark}
                    size={17}
                  />
                  <Text style={styles.ratingButtonText}>Beoordelen</Text>
                  <AppIcon
                    name={{
                      ios: 'chevron.right',
                      android: 'chevron_right',
                      web: 'chevron_right',
                    }}
                    tintColor={palette.sageDark}
                    size={16}
                  />
                </Pressable>
              ) : null}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.xl },
  addButton: {
    alignItems: 'center',
    backgroundColor: palette.sageDark,
    borderRadius: radius.pill,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  searchRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xl },
  searchRowActive: { marginTop: spacing.sm },
  searchBox: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
  },
  searchInput: { color: palette.text, flex: 1, fontSize: 16, height: 52, marginLeft: spacing.md },
  filterButton: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderColor: palette.sage,
    borderRadius: radius.lg,
    borderWidth: 1,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  filterButtonActive: { backgroundColor: palette.sageDark, borderColor: palette.sageDark },
  filterBadge: {
    alignItems: 'center',
    backgroundColor: palette.white,
    borderRadius: radius.pill,
    height: 18,
    justifyContent: 'center',
    position: 'absolute',
    right: 4,
    top: 4,
    width: 18,
  },
  filterBadgeText: { color: palette.sageDark, fontSize: 10, fontWeight: '800' },
  activeFiltersBlock: { marginTop: spacing.md },
  activeFiltersHeading: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  activeFiltersTitle: { color: palette.textMuted, fontSize: 11, fontWeight: '700' },
  clearFiltersText: { color: palette.sageDark, fontSize: 11, fontWeight: '700' },
  activeFilterList: { gap: spacing.sm, paddingTop: spacing.sm },
  activeFilterChip: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderColor: palette.sage,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    minHeight: 36,
    paddingHorizontal: 11,
  },
  activeFilterChipText: { color: palette.sageDark, fontSize: 11, fontWeight: '700' },
  familyBanner: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderColor: palette.sage,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
    minHeight: 72,
    padding: spacing.md,
  },
  familyBannerIcon: {
    alignItems: 'center',
    backgroundColor: palette.white,
    borderRadius: radius.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  familyBannerCopy: { flex: 1 },
  familyBannerTitle: { color: palette.text, fontSize: 14, fontWeight: '700' },
  familyBannerText: { color: palette.textMuted, fontSize: 11, lineHeight: 15, marginTop: 3 },
  familyBannerAction: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
    minHeight: 44,
  },
  familyBannerActionText: { color: palette.sageDark, fontSize: 12, fontWeight: '700' },
  listHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: 10,
    marginTop: spacing.xl,
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
  separator: { height: 10 },
  recipeCard: {
    ...shadow.card,
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: spacing.sm,
  },
  hiddenRecipeCard: { opacity: 0.82 },
  cardTop: { alignItems: 'center', flexDirection: 'row' },
  recipeMain: { alignItems: 'center', flex: 1, flexDirection: 'row' },
  cardActions: { gap: 6, marginRight: spacing.sm },
  cardActionButton: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderRadius: radius.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  pressed: { opacity: 0.72 },
  recipeImage: { borderRadius: radius.md, height: 80, width: 80 },
  recipeCopy: { flex: 1, marginHorizontal: spacing.md },
  recipeTitleRow: { alignItems: 'flex-start', gap: 5 },
  recipeTitle: { color: palette.text, fontSize: 16, fontWeight: '700' },
  hiddenBadge: {
    alignItems: 'center',
    backgroundColor: palette.surfaceMuted,
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  hiddenBadgeText: { color: palette.textMuted, fontSize: 10, fontWeight: '700' },
  recipeMeta: { color: palette.textMuted, fontSize: 12, marginTop: 5 },
  ratingRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: spacing.sm },
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
  ratingButton: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.sm,
    minHeight: 44,
    paddingHorizontal: spacing.md,
  },
  ratingButtonText: { color: palette.sageDark, flex: 1, fontSize: 13, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { color: palette.text, fontSize: 17, fontWeight: '700' },
  emptyText: { color: palette.textMuted, fontSize: 14, marginTop: spacing.sm },
});
