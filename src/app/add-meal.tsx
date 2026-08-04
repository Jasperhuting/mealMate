import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/mealmate/app-icon';
import { ModalScreenHeader } from '@/components/mealmate/modal-screen-header';
import { RecipeImage } from '@/components/mealmate/recipe-image';
import { palette, radius, spacing } from '@/constants/mealmate-theme';
import type { Ingredient, Recipe } from '@/data/mock-data';
import { mealMateHaptics } from '@/lib/mealmate-haptics';
import { recipeMatchesFilters } from '@/lib/recipe-filters';
import { useMealMate } from '@/state/meal-mate-provider';
import { useRecipeFilters } from '@/state/recipe-filter-provider';

export default function AddMealScreen() {
  const { dayId } = useLocalSearchParams<{ dayId: string }>();
  const router = useRouter();
  const {
    recipes,
    weekDays,
    plannedMeals,
    leftoverMeals,
    planMeal,
    familyMembers,
    ratings,
    mealAttendance,
  } = useMealMate();
  const { filters, activeFilterCount, setFilters, clearFilters } = useRecipeFilters();
  const initialRecipeId = typeof dayId === 'string' ? plannedMeals[dayId] : undefined;
  const initialLeftoverFrom = typeof dayId === 'string' ? leftoverMeals[dayId] : undefined;
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | undefined>();
  const [leftoverFrom, setLeftoverFrom] = useState<string | undefined>();
  const [atHomeIds, setAtHomeIds] = useState<string[]>([]);
  const [leftoversExpanded, setLeftoversExpanded] = useState(false);
  const selectedRecipe = useMemo(
    () => recipes.find((recipe) => recipe.id === selectedRecipeId),
    [recipes, selectedRecipeId],
  );
  const day = weekDays.find((item) => item.id === dayId || item.isoDate === dayId);
  const leftoverOptions = useMemo(() => {
    if (!day) return [];
    const seenRecipes = new Set<string>();
    return weekDays
      .filter((candidate) => candidate.isoDate < day.isoDate && plannedMeals[candidate.isoDate])
      .reverse()
      .flatMap((candidate) => {
        const recipeId = plannedMeals[candidate.isoDate];
        if (!recipeId || seenRecipes.has(recipeId)) return [];
        const recipe = recipes.find((item) => item.id === recipeId);
        if (!recipe) return [];
        seenRecipes.add(recipeId);
        const sourceDate = leftoverMeals[candidate.isoDate] ?? candidate.isoDate;
        const sourceDay = weekDays.find((item) => item.isoDate === sourceDate) ?? candidate;
        return [{ recipe, sourceDate, sourceDay }];
      });
  }, [day, leftoverMeals, plannedMeals, recipes, weekDays]);
  const eatingMembers = useMemo(
    () => familyMembers.filter(
      (member) => mealAttendance[day?.isoDate ?? '']?.[member.id] !== false,
    ),
    [day?.isoDate, familyMembers, mealAttendance],
  );
  const absentMembers = useMemo(
    () => familyMembers.filter(
      (member) => mealAttendance[day?.isoDate ?? '']?.[member.id] === false,
    ),
    [day?.isoDate, familyMembers, mealAttendance],
  );
  const recipeScore = useCallback((recipe: Recipe) => {
    const scores = eatingMembers
      .map((member) => ratings[recipe.id]?.[member.id])
      .filter((score): score is number => typeof score === 'number');
    return scores.length ? scores.reduce((total, score) => total + score, 0) / scores.length : null;
  }, [eatingMembers, ratings]);
  const sortedRecipes = useMemo(
    () => recipes.filter((recipe) => recipeMatchesFilters(
      recipe,
      filters,
      ratings,
      eatingMembers.map((member) => member.id),
    )).sort((a, b) => {
      const aScore = recipeScore(a);
      const bScore = recipeScore(b);
      if (aScore === null && bScore === null) return a.title.localeCompare(b.title, 'nl');
      if (aScore === null) return 1;
      if (bScore === null) return -1;
      return bScore - aScore;
    }),
    [eatingMembers, filters, ratings, recipeScore, recipes],
  );

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

  const selectRecipe = (recipe: Recipe) => {
    setSelectedRecipeId(recipe.id);
    setLeftoverFrom(undefined);
    setAtHomeIds([]);
    mealMateHaptics.selection();
  };

  const selectLeftover = (recipe: Recipe, sourceDate: string) => {
    setSelectedRecipeId(recipe.id);
    setLeftoverFrom(sourceDate);
    setAtHomeIds([]);
    mealMateHaptics.selection();
  };

  const toggleAtHome = (ingredientId: string) => {
    setAtHomeIds((current) =>
      current.includes(ingredientId)
        ? current.filter((id) => id !== ingredientId)
        : [...current, ingredientId],
    );
    mealMateHaptics.selection();
  };

  const clearAtHome = () => {
    if (atHomeIds.length === 0) return;
    setAtHomeIds([]);
    mealMateHaptics.selection();
  };

  const confirm = async () => {
    if (!selectedRecipe || typeof dayId !== 'string') return;
    await planMeal(dayId, selectedRecipe.id, atHomeIds, leftoverFrom);
    mealMateHaptics.success();
    router.back();
  };

  if (selectedRecipe) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ModalScreenHeader
          title="Gerecht plannen"
          closeLabel="Sluit gerecht plannen"
          onBack={() => setSelectedRecipeId(undefined)}
          backLabel="Terug naar gerecht kiezen"
        />
        <FlatList
          data={leftoverFrom ? [] : selectedRecipe.ingredients}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              <View style={styles.stepRow}>
                <Text style={styles.stepActive}>1 Gerecht</Text>
                <View style={styles.stepLineActive} />
                <Text style={styles.stepActive}>2 Voorraad</Text>
              </View>
              <Text style={styles.eyebrow}>{day?.label.toUpperCase()} {day?.date} {day?.month.toUpperCase()}</Text>
              <Text style={styles.title}>
                {leftoverFrom ? 'Plan dit als restje' : 'Wat heb je al in huis?'}
              </Text>
              <Text style={styles.subtitle}>
                {leftoverFrom
                  ? 'Dit gerecht staat al eerder in de week. Er komen geen extra ingrediënten op je boodschappenlijst.'
                  : 'Vink ingrediënten aan die niet op de boodschappenlijst hoeven.'}
              </Text>
              <View style={styles.selectedRecipeCard}>
                <RecipeImage recipe={selectedRecipe} style={styles.selectedImage} />
                <View style={styles.selectedCopy}>
                  <Text style={styles.selectedTitle}>{selectedRecipe.title}</Text>
                  <Text style={styles.selectedMeta}>
                    {leftoverFrom
                      ? `Restje van ${weekDays.find((item) => item.isoDate === leftoverFrom)?.label.toLowerCase() ?? 'eerder'}`
                      : `${selectedRecipe.ingredients.length} ingrediënten`}
                  </Text>
                </View>
                <Pressable
                  onPress={() => {
                    setSelectedRecipeId(undefined);
                    setLeftoverFrom(undefined);
                  }}
                  accessibilityRole="button"
                  style={styles.changeButton}>
                  <Text style={styles.changeText}>Wijzig</Text>
                </Pressable>
              </View>
              {!leftoverFrom ? (
                <View style={styles.inventoryHeading}>
                  <Text style={styles.inventoryTitle}>Tik aan wat al aanwezig is</Text>
                  <Pressable
                    onPress={clearAtHome}
                    disabled={atHomeIds.length === 0}
                    accessibilityRole="button"
                    accessibilityLabel="Zet alle aanwezige ingrediënten uit"
                    accessibilityState={{ disabled: atHomeIds.length === 0 }}
                    style={({ pressed }) => [
                      styles.clearSelectionButton,
                      atHomeIds.length === 0 && styles.clearSelectionButtonDisabled,
                      pressed && styles.pressed,
                    ]}>
                    <Text
                      style={[
                        styles.clearSelectionText,
                        atHomeIds.length === 0 && styles.clearSelectionTextDisabled,
                      ]}>
                      Alles uitzetten
                    </Text>
                  </Pressable>
                </View>
              ) : null}
            </View>
          }
          renderItem={({ item }) => (
            <IngredientRow
              ingredient={item}
              selected={atHomeIds.includes(item.id)}
              onPress={() => toggleAtHome(item.id)}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={<View style={styles.footerSpace} />}
        />
        <View style={styles.bottomBar}>
          <View style={styles.bottomCopy}>
            <Text style={styles.bottomCount}>
              {leftoverFrom ? 'Geen extra boodschappen' : `${atHomeIds.length} al in huis`}
            </Text>
            <Text style={styles.bottomMeta}>
              {leftoverFrom
                ? 'Je gebruikt wat al bereid is'
                : `${selectedRecipe.ingredients.length - atHomeIds.length} naar boodschappen`}
            </Text>
          </View>
          <Pressable
            onPress={() => void confirm()}
            accessibilityRole="button"
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <Text style={styles.primaryButtonText}>
              {leftoverFrom ? 'Plan als restje' : 'Plan gerecht'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ModalScreenHeader title="Gerecht plannen" closeLabel="Sluit gerecht plannen" />
      <FlatList
        data={sortedRecipes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.stepRow}>
              <Text style={styles.stepActive}>1 Gerecht</Text>
              <View style={styles.stepLine} />
              <Text style={styles.stepInactive}>2 Voorraad</Text>
            </View>
            <Text style={styles.eyebrow}>{day?.label.toUpperCase()} {day?.date} {day?.month.toUpperCase()}</Text>
            <Text style={styles.title}>Kies een gerecht</Text>
            <Text style={styles.subtitle}>
              {initialRecipeId ? 'Vervang het huidige gerecht voor deze dag.' : 'Wat willen jullie deze dag eten?'}
            </Text>
            {absentMembers.length > 0 ? (
              <View style={styles.tasteHint}>
                <AppIcon
                  name={{ ios: 'person.crop.circle.badge.minus', android: 'person_remove', web: 'person_remove' }}
                  tintColor={palette.sageDark}
                  size={17}
                />
                <Text style={styles.tasteHintText}>
                  Gesorteerd voor wie mee-eet. {absentMembers.map((member) => member.name).join(', ')} telt niet mee.
                </Text>
              </View>
            ) : null}
            {leftoverOptions.length > 0 ? (
              <View style={styles.leftoverSection}>
                <Pressable
                  onPress={() => setLeftoversExpanded((current) => !current)}
                  accessibilityRole="button"
                  accessibilityLabel={`${leftoversExpanded ? 'Verberg' : 'Toon'} beschikbare restjes`}
                  accessibilityState={{ expanded: leftoversExpanded }}
                  style={({ pressed }) => [styles.leftoverHeading, pressed && styles.pressed]}>
                  <View style={styles.leftoverIcon}>
                    <AppIcon
                      name={{ ios: 'arrow.counterclockwise', android: 'history', web: 'history' }}
                      tintColor={palette.sageDark}
                      size={18}
                    />
                  </View>
                  <View style={styles.leftoverHeadingCopy}>
                    <Text style={styles.leftoverTitle}>Restje eten</Text>
                    <Text style={styles.leftoverSubtitle}>
                      {leftoversExpanded
                        ? 'Kies een gerecht van eerder deze week.'
                        : `${leftoverOptions.length} ${leftoverOptions.length === 1 ? 'restje' : 'restjes'} beschikbaar`}
                    </Text>
                  </View>
                  <AppIcon
                    name={{
                      ios: leftoversExpanded ? 'chevron.up' : 'chevron.down',
                      android: leftoversExpanded ? 'expand_less' : 'expand_more',
                      web: leftoversExpanded ? 'expand_less' : 'expand_more',
                    }}
                    tintColor={palette.sageDark}
                    size={18}
                  />
                </Pressable>
                {leftoversExpanded ? leftoverOptions.map(({ recipe, sourceDate, sourceDay }) => (
                  <Pressable
                    key={`${recipe.id}-${sourceDate}`}
                    onPress={() => selectLeftover(recipe, sourceDate)}
                    accessibilityRole="button"
                    accessibilityLabel={`Plan ${recipe.title} als restje van ${sourceDay.label}`}
                    style={({ pressed }) => [styles.leftoverRow, pressed && styles.pressed]}>
                    <RecipeImage recipe={recipe} style={styles.leftoverImage} />
                    <View style={styles.leftoverRowCopy}>
                      <Text style={styles.leftoverRecipeTitle}>{recipe.title}</Text>
                      <Text style={styles.leftoverDay}>Van {sourceDay.label.toLowerCase()}</Text>
                    </View>
                    <AppIcon
                      name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                      tintColor={palette.sageDark}
                      size={17}
                    />
                  </Pressable>
                )) : null}
              </View>
            ) : null}
            <Pressable
              onPress={() => router.push('/add-recipe')}
              accessibilityRole="button"
              style={({ pressed }) => [styles.newRecipeButton, pressed && styles.pressed]}>
              <View style={styles.newRecipeIcon}>
                <AppIcon
                  name={{ ios: 'plus', android: 'add', web: 'add' }}
                  tintColor={palette.sageDark}
                />
              </View>
              <View style={styles.newRecipeCopy}>
                <Text style={styles.newRecipeTitle}>Nieuw gerecht toevoegen</Text>
                <Text style={styles.newRecipeMeta}>Vul ingrediënten in en plan het daarna direct.</Text>
              </View>
              <AppIcon
                name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                tintColor={palette.textSoft}
                size={18}
              />
            </Pressable>
            <View style={styles.listHeading}>
              <View style={styles.listHeadingCopy}>
                <Text style={styles.listTitle}>
                  {activeFilterCount > 0 ? 'Gefilterde gerechten' : 'Jullie gerechten'}
                </Text>
                <Text style={styles.listCount}>{sortedRecipes.length}</Text>
              </View>
              <Pressable
                onPress={() => router.push({
                  pathname: '/recipe-filters',
                  params: { day: day?.isoDate ?? '' },
                })}
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
          </View>
        }
        ListEmptyComponent={
          activeFilterCount > 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Geen gerecht gevonden</Text>
              <Text style={styles.emptyText}>Pas je filters aan om meer gerechten te zien.</Text>
              <Pressable
                onPress={clearFilters}
                accessibilityRole="button"
                style={({ pressed }) => [styles.emptyButton, pressed && styles.pressed]}>
                <Text style={styles.emptyButtonText}>Wis alle filters</Text>
              </Pressable>
            </View>
          ) : null
        }
        ItemSeparatorComponent={() => <View style={styles.cardSeparator} />}
        renderItem={({ item }) => {
          const selected = initialRecipeId === item.id;
          return (
            <Pressable
              onPress={() => selectRecipe(item)}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.recipeRow,
                selected && styles.currentRecipeRow,
                pressed && styles.pressed,
              ]}>
              <RecipeImage recipe={item} style={styles.recipeImage} />
              <View style={styles.recipeCopy}>
                <Text style={styles.recipeTitle}>{item.title}</Text>
                <Text style={styles.recipeMeta}>{item.minutes} min · {item.ingredients.length} ingrediënten</Text>
                {recipeScore(item) !== null ? (
                  <Text style={styles.recipeScore}>★ {recipeScore(item)?.toFixed(1)} voor wie mee-eet</Text>
                ) : null}
                {selected ? (
                  <Text style={styles.currentLabel}>
                    {initialLeftoverFrom ? 'Nu gepland als restje' : 'Nu gepland'}
                  </Text>
                ) : null}
              </View>
              <AppIcon
                name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                tintColor={palette.textSoft}
                size={18}
              />
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

function IngredientRow({
  ingredient,
  selected,
  onPress,
}: {
  ingredient: Ingredient;
  selected: boolean;
  onPress: () => void;
}) {
  const amount = Number.isInteger(ingredient.amount)
    ? ingredient.amount
    : ingredient.amount.toFixed(1);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      style={({ pressed }) => [styles.ingredientRow, pressed && styles.pressed]}>
      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
        {selected ? (
          <AppIcon
            name={{ ios: 'checkmark', android: 'check', web: 'check' }}
            tintColor={palette.white}
            size={15}
          />
        ) : null}
      </View>
      <View style={styles.ingredientCopy}>
        <Text style={styles.ingredientName}>{ingredient.name}</Text>
        <Text style={styles.ingredientDepartment}>{ingredient.department}</Text>
      </View>
      <Text style={styles.ingredientAmount}>{amount} {ingredient.unit}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl },
  stepRow: { alignItems: 'center', flexDirection: 'row', marginBottom: spacing.xl },
  stepActive: { color: palette.sageDark, fontSize: 12, fontWeight: '700' },
  stepInactive: { color: palette.textSoft, fontSize: 12, fontWeight: '600' },
  stepLine: { backgroundColor: palette.border, flex: 1, height: 1, marginHorizontal: spacing.md },
  stepLineActive: { backgroundColor: palette.sage, flex: 1, height: 1, marginHorizontal: spacing.md },
  eyebrow: { color: palette.sage, fontSize: 11, fontWeight: '800', letterSpacing: 1.1 },
  title: { color: palette.text, fontSize: 28, fontWeight: '700', letterSpacing: -0.7, marginTop: 6 },
  subtitle: { color: palette.textMuted, fontSize: 15, lineHeight: 20, marginTop: 6 },
  tasteHint: { alignItems: 'center', backgroundColor: palette.sageSoft, borderRadius: radius.md, flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, padding: spacing.md },
  tasteHintText: { color: palette.sageDark, flex: 1, fontSize: 11, fontWeight: '600', lineHeight: 16 },
  leftoverSection: {
    backgroundColor: palette.sageSoft,
    borderRadius: radius.lg,
    marginTop: spacing.xl,
    padding: spacing.md,
  },
  leftoverHeading: { alignItems: 'center', flexDirection: 'row', minHeight: 44 },
  leftoverIcon: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: radius.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  leftoverHeadingCopy: { flex: 1, marginLeft: spacing.md },
  leftoverTitle: { color: palette.sageDark, fontSize: 15, fontWeight: '800' },
  leftoverSubtitle: { color: palette.textMuted, fontSize: 11, marginTop: 3 },
  leftoverRow: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: radius.md,
    flexDirection: 'row',
    marginTop: spacing.sm,
    minHeight: 58,
    padding: spacing.sm,
  },
  leftoverImage: { borderRadius: radius.pill, height: 42, width: 42 },
  leftoverRowCopy: { flex: 1, marginHorizontal: spacing.md },
  leftoverRecipeTitle: { color: palette.text, fontSize: 14, fontWeight: '700' },
  leftoverDay: { color: palette.sageDark, fontSize: 11, fontWeight: '700', marginTop: 3 },
  newRecipeButton: {
    alignItems: 'center',
    borderColor: palette.sage,
    borderRadius: radius.lg,
    borderStyle: 'dashed',
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: spacing.xl,
    padding: spacing.md,
  },
  newRecipeIcon: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderRadius: radius.md,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  newRecipeCopy: { flex: 1, marginHorizontal: spacing.md },
  newRecipeTitle: { color: palette.text, fontSize: 14, fontWeight: '700' },
  newRecipeMeta: { color: palette.textMuted, fontSize: 11, marginTop: 4 },
  listHeading: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md, marginTop: spacing.xl },
  listHeadingCopy: { alignItems: 'baseline', flex: 1, flexDirection: 'row', gap: spacing.sm },
  listTitle: { color: palette.text, fontSize: 19, fontWeight: '700' },
  listCount: { color: palette.textSoft, fontSize: 12, fontWeight: '700' },
  filterButton: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderColor: palette.sage,
    borderRadius: radius.md,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  filterButtonActive: { backgroundColor: palette.sageDark, borderColor: palette.sageDark },
  filterBadge: {
    alignItems: 'center',
    backgroundColor: palette.white,
    borderRadius: radius.pill,
    height: 17,
    justifyContent: 'center',
    position: 'absolute',
    right: 3,
    top: 3,
    width: 17,
  },
  filterBadgeText: { color: palette.sageDark, fontSize: 9, fontWeight: '800' },
  activeFiltersBlock: { marginBottom: spacing.md },
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
  emptyState: { alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.xxl },
  emptyTitle: { color: palette.text, fontSize: 17, fontWeight: '700' },
  emptyText: { color: palette.textMuted, fontSize: 13, marginTop: spacing.sm, textAlign: 'center' },
  emptyButton: { backgroundColor: palette.sageSoft, borderRadius: radius.pill, marginTop: spacing.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  emptyButtonText: { color: palette.sageDark, fontSize: 12, fontWeight: '800' },
  cardSeparator: { height: 10 },
  recipeRow: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    padding: spacing.sm,
  },
  currentRecipeRow: { borderColor: palette.sage },
  pressed: { opacity: 0.7 },
  recipeImage: { borderRadius: radius.md, height: 68, width: 68 },
  recipeCopy: { flex: 1, marginHorizontal: spacing.md },
  recipeTitle: { color: palette.text, fontSize: 15, fontWeight: '700' },
  recipeMeta: { color: palette.textMuted, fontSize: 12, marginTop: 5 },
  recipeScore: { color: palette.star, fontSize: 11, fontWeight: '700', marginTop: 5 },
  currentLabel: { color: palette.sage, fontSize: 11, fontWeight: '700', marginTop: 6 },
  selectedRecipeCard: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderRadius: radius.lg,
    flexDirection: 'row',
    marginTop: spacing.xl,
    padding: spacing.sm,
  },
  selectedImage: { borderRadius: radius.md, height: 64, width: 64 },
  selectedCopy: { flex: 1, marginLeft: spacing.md },
  selectedTitle: { color: palette.text, fontSize: 15, fontWeight: '700' },
  selectedMeta: { color: palette.textMuted, fontSize: 12, marginTop: 5 },
  changeButton: { padding: spacing.md },
  changeText: { color: palette.sageDark, fontSize: 12, fontWeight: '700' },
  inventoryHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    marginTop: spacing.xl,
  },
  inventoryTitle: { color: palette.text, flex: 1, fontSize: 19, fontWeight: '700' },
  clearSelectionButton: {
    backgroundColor: palette.sageSoft,
    borderRadius: radius.pill,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
  clearSelectionButtonDisabled: { backgroundColor: palette.surfaceMuted },
  clearSelectionText: { color: palette.sageDark, fontSize: 11, fontWeight: '800' },
  clearSelectionTextDisabled: { color: palette.textSoft },
  ingredientRow: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    flexDirection: 'row',
    minHeight: 62,
    paddingHorizontal: spacing.lg,
  },
  separator: { backgroundColor: palette.border, height: 1, marginLeft: 55 },
  checkbox: {
    alignItems: 'center',
    borderColor: palette.border,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    height: 25,
    justifyContent: 'center',
    width: 25,
  },
  checkboxSelected: { backgroundColor: palette.sageDark, borderColor: palette.sageDark },
  ingredientCopy: { flex: 1, marginHorizontal: spacing.md },
  ingredientName: { color: palette.text, fontSize: 15, fontWeight: '600' },
  ingredientDepartment: { color: palette.textSoft, fontSize: 11, marginTop: 4 },
  ingredientAmount: { color: palette.textMuted, fontSize: 12, fontWeight: '600' },
  footerSpace: { height: 96 },
  bottomBar: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderTopColor: palette.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    padding: spacing.md,
  },
  bottomCopy: { flex: 1 },
  bottomCount: { color: palette.text, fontSize: 14, fontWeight: '700' },
  bottomMeta: { color: palette.textMuted, fontSize: 11, marginTop: 4 },
  primaryButton: { backgroundColor: palette.sageDark, borderRadius: radius.pill, paddingHorizontal: spacing.xl, paddingVertical: 14 },
  primaryButtonText: { color: palette.white, fontSize: 14, fontWeight: '700' },
});
