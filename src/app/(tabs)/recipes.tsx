import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
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
import { dateToIso, type Recipe } from '@/data/mock-data';
import { useMealMate } from '@/state/meal-mate-provider';

export default function RecipesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { recipes, ratings, familyMembers, weekDays, mealAttendance } = useMealMate();
  const [query, setQuery] = useState('');
  const [selectedDayIso, setSelectedDayIso] = useState(() => {
    const todayIso = dateToIso(new Date());
    return weekDays.some((day) => day.isoDate === todayIso) ? todayIso : weekDays[0]?.isoDate ?? '';
  });
  const [sortDirection, setSortDirection] = useState<'high' | 'low'>('high');

  const selectedDay = weekDays.find((day) => day.isoDate === selectedDayIso) ?? weekDays[0];
  const eatingMembers = useMemo(
    () => familyMembers.filter(
      (member) => mealAttendance[selectedDay?.isoDate]?.[member.id] !== false,
    ),
    [familyMembers, mealAttendance, selectedDay?.isoDate],
  );
  const absentMembers = useMemo(
    () => familyMembers.filter(
      (member) => mealAttendance[selectedDay?.isoDate]?.[member.id] === false,
    ),
    [familyMembers, mealAttendance, selectedDay?.isoDate],
  );

  const recipeScore = useCallback((recipe: Recipe) => {
    const scores = eatingMembers
      .map((member) => ratings[recipe.id]?.[member.id])
      .filter((score): score is number => typeof score === 'number');
    return scores.length ? scores.reduce((total, score) => total + score, 0) / scores.length : null;
  }, [eatingMembers, ratings]);

  const filteredRecipes = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('nl');
    const matches = normalized
      ? recipes.filter((recipe) =>
          `${recipe.title} ${recipe.subtitle}`.toLocaleLowerCase('nl').includes(normalized),
        )
      : [...recipes];
    return matches.sort((a, b) => {
      const aScore = recipeScore(a);
      const bScore = recipeScore(b);
      if (aScore === null && bScore === null) return a.title.localeCompare(b.title, 'nl');
      if (aScore === null) return 1;
      if (bScore === null) return -1;
      return sortDirection === 'high' ? bScore - aScore : aScore - bScore;
    });
  }, [query, recipeScore, recipes, sortDirection]);

  const openRating = (recipe: Recipe) => {
    if (familyMembers.length === 0) {
      router.push('/family-sharing');
      return;
    }

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
        contentContainerStyle={[
          styles.content,
          { paddingBottom: getMealMateTabBarContentInset(insets.bottom) },
        ]}
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

            {familyMembers.length === 0 ? (
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

            {familyMembers.length > 0 ? (
              <View style={styles.tasteFilters}>
                <View style={styles.filterHeading}>
                  <View>
                    <Text style={styles.filterTitle}>Beste keuze voor wie mee-eet</Text>
                    <Text style={styles.filterMeta}>
                      {absentMembers.length > 0
                        ? `${absentMembers.map((member) => member.name).join(', ')} eet niet mee en telt niet mee`
                        : 'Iedereen eet mee en telt mee in het cijfer'}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => setSortDirection((current) => current === 'high' ? 'low' : 'high')}
                    accessibilityRole="button"
                    accessibilityLabel={`Sorteer van ${sortDirection === 'high' ? 'laag naar hoog' : 'hoog naar laag'} cijfer`}
                    style={({ pressed }) => [styles.sortButton, pressed && styles.pressed]}>
                    <AppIcon
                      name={{ ios: 'arrow.up.arrow.down', android: 'sort', web: 'sort' }}
                      tintColor={palette.sageDark}
                      size={16}
                    />
                    <Text style={styles.sortButtonText}>{sortDirection === 'high' ? 'Hoogste' : 'Laagste'}</Text>
                  </Pressable>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.dayFilters}>
                  {weekDays.map((day) => {
                    const selected = day.isoDate === selectedDay?.isoDate;
                    const absentCount = familyMembers.filter(
                      (member) => mealAttendance[day.isoDate]?.[member.id] === false,
                    ).length;
                    return (
                      <Pressable
                        key={day.isoDate}
                        onPress={() => setSelectedDayIso(day.isoDate)}
                        accessibilityRole="button"
                        accessibilityState={{ selected }}
                        style={[styles.dayFilter, selected && styles.dayFilterSelected]}>
                        <Text style={[styles.dayFilterText, selected && styles.dayFilterTextSelected]}>
                          {day.short} {day.date}{absentCount > 0 ? ` · ${absentCount} niet` : ''}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
                <View style={styles.eatingRow}>
                  {familyMembers.map((member) => {
                    const isEating = eatingMembers.some((candidate) => candidate.id === member.id);
                    return (
                      <View key={member.id} style={[styles.eatingPill, !isEating && styles.absentPill]}>
                        <Text style={[styles.eatingPillText, !isEating && styles.absentPillText]}>
                          {member.name} · {isEating ? 'eet mee' : 'eet niet mee'}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            ) : null}

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
            <View style={styles.cardTop}>
              <View style={styles.recipeMain}>
                <RecipeImage recipe={item} style={styles.recipeImage} />
                <View style={styles.recipeCopy}>
                  <Text style={styles.recipeTitle}>{item.title}</Text>
                  <Text style={styles.recipeMeta}>{item.minutes} min · {item.ingredients.length} ingrediënten</Text>
                  {recipeScore(item) !== null ? (
                    <Text style={styles.matchScore}>★ {recipeScore(item)?.toFixed(1)} voor wie mee-eet</Text>
                  ) : null}
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
                  name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                  tintColor={palette.sageDark}
                  size={16}
                />
              </Pressable>
            ) : null}
          </View>
        )}
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
  searchBox: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  searchInput: { color: palette.text, flex: 1, fontSize: 16, height: 52, marginLeft: spacing.md },
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
  tasteFilters: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  filterHeading: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between' },
  filterTitle: { color: palette.text, fontSize: 14, fontWeight: '700' },
  filterMeta: { color: palette.textMuted, fontSize: 10, lineHeight: 14, marginTop: 3, maxWidth: 210 },
  sortButton: { alignItems: 'center', backgroundColor: palette.sageSoft, borderRadius: radius.pill, flexDirection: 'row', gap: 5, minHeight: 40, paddingHorizontal: 10 },
  sortButtonText: { color: palette.sageDark, fontSize: 11, fontWeight: '700' },
  dayFilters: { gap: 6, paddingTop: spacing.md },
  dayFilter: { backgroundColor: palette.surfaceMuted, borderRadius: radius.pill, minHeight: 34, paddingHorizontal: 10, justifyContent: 'center' },
  dayFilterSelected: { backgroundColor: palette.sageDark },
  dayFilterText: { color: palette.textMuted, fontSize: 10, fontWeight: '700' },
  dayFilterTextSelected: { color: palette.white },
  eatingRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: spacing.sm },
  eatingPill: { backgroundColor: palette.sageSoft, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 5 },
  absentPill: { backgroundColor: palette.surfaceMuted },
  eatingPillText: { color: palette.sageDark, fontSize: 9, fontWeight: '700' },
  absentPillText: { color: palette.textMuted, textDecorationLine: 'line-through' },
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
  cardTop: { alignItems: 'center', flexDirection: 'row' },
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
  recipeImage: { borderRadius: radius.md, height: 80, width: 80 },
  recipeCopy: { flex: 1, marginHorizontal: spacing.md },
  recipeTitle: { color: palette.text, fontSize: 16, fontWeight: '700' },
  recipeMeta: { color: palette.textMuted, fontSize: 12, marginTop: 5 },
  matchScore: { color: palette.star, fontSize: 11, fontWeight: '700', marginTop: 5 },
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
