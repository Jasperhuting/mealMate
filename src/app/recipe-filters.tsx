import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/mealmate/app-icon';
import { ModalScreenHeader } from '@/components/mealmate/modal-screen-header';
import { palette, radius, shadow, spacing } from '@/constants/mealmate-theme';
import {
  formatIngredientName,
  normalizeIngredientName,
  recipeMatchesFilters,
} from '@/lib/recipe-filters';
import { useMealMate } from '@/state/meal-mate-provider';
import { useRecipeFilters } from '@/state/recipe-filter-provider';

const ratingOptions = [2, 3, 4, 5];
const timeOptions = [15, 30, 45, 60];

type IngredientOption = {
  count: number;
  label: string;
  value: string;
};

export default function RecipeFiltersScreen() {
  const router = useRouter();
  const { day } = useLocalSearchParams<{ day?: string }>();
  const { recipes, ratings, familyMembers, mealAttendance } = useMealMate();
  const { filters, setFilters } = useRecipeFilters();
  const [draft, setDraft] = useState(filters);
  const [ingredientQuery, setIngredientQuery] = useState('');

  const ingredientOptions = useMemo(() => {
    const unique = new Map<string, IngredientOption>();
    recipes.forEach((recipe) => {
      const recipeIngredients = new Set<string>();
      recipe.ingredients.forEach((ingredient) => {
        const normalized = normalizeIngredientName(ingredient.name);
        if (!normalized || recipeIngredients.has(normalized)) return;

        recipeIngredients.add(normalized);
        const existing = unique.get(normalized);
        if (existing) {
          existing.count += 1;
        } else {
          unique.set(normalized, {
            count: 1,
            label: formatIngredientName(ingredient.name),
            value: normalized,
          });
        }
      });
    });
    return [...unique.values()].sort((a, b) =>
      b.count - a.count || a.label.localeCompare(b.label, 'nl'));
  }, [recipes]);

  const visibleIngredients = useMemo(() => {
    const query = normalizeIngredientName(ingredientQuery);
    if (!query) {
      const selected = ingredientOptions.filter(({ value }) => draft.ingredientNames.includes(value));
      const suggestions = ingredientOptions
        .filter(({ value }) => !draft.ingredientNames.includes(value))
        .slice(0, Math.max(0, 30 - selected.length));
      return [...selected, ...suggestions];
    }
    return ingredientOptions.filter(({ label }) => normalizeIngredientName(label).includes(query));
  }, [draft.ingredientNames, ingredientOptions, ingredientQuery]);

  const eatingMemberIds = useMemo(
    () => familyMembers
      .filter((member) => !day || mealAttendance[day]?.[member.id] !== false)
      .map((member) => member.id),
    [day, familyMembers, mealAttendance],
  );

  const resultCount = useMemo(
    () => recipes.filter((recipe) =>
      recipeMatchesFilters(
        recipe,
        draft,
        ratings,
        eatingMemberIds,
      ),
    ).length,
    [draft, eatingMemberIds, ratings, recipes],
  );

  const toggleIngredient = (ingredient: string) => {
    setDraft((current) => ({
      ...current,
      ingredientNames: current.ingredientNames.includes(ingredient)
        ? current.ingredientNames.filter((name) => name !== ingredient)
        : [...current.ingredientNames, ingredient],
    }));
  };

  const clear = () => setDraft({
    ingredientNames: [],
    minimumHouseholdRating: null,
    memberId: null,
    minimumMemberRating: null,
    neverRated: false,
    maximumMinutes: null,
    quickAndEasy: false,
  });

  const apply = () => {
    setFilters(draft);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ModalScreenHeader title="Recepten filteren" closeLabel="Filteren sluiten" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.introRow}>
          <View style={styles.introCopy}>
            <Text style={styles.title}>Waar hebben jullie zin in?</Text>
            <Text style={styles.subtitle}>Combineer filters om sneller bij een passend gerecht te komen.</Text>
          </View>
          <Pressable
            onPress={clear}
            accessibilityRole="button"
            accessibilityLabel="Alle gekozen filters wissen"
            style={({ pressed }) => [styles.clearButton, pressed && styles.pressed]}>
            <Text style={styles.clearButtonText}>Wis alles</Text>
          </Pressable>
        </View>

        <FilterSection
          title="Ingrediënten"
          subtitle="Alle gekozen ingrediënten moeten erin zitten. Het getal toont het aantal recepten.">
          <View style={styles.searchBox}>
            <AppIcon
              name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
              tintColor={palette.textSoft}
              size={18}
            />
            <TextInput
              value={ingredientQuery}
              onChangeText={setIngredientQuery}
              placeholder="Zoek een ingrediënt..."
              placeholderTextColor={palette.textSoft}
              style={styles.searchInput}
              accessibilityLabel="Ingrediënt zoeken"
            />
          </View>
          <View style={styles.optionWrap}>
            {visibleIngredients.map(({ value, label, count }) => (
              <ChoicePill
                key={value}
                label={label}
                count={count}
                selected={draft.ingredientNames.includes(value)}
                onPress={() => toggleIngredient(value)}
              />
            ))}
          </View>
          {!ingredientQuery.trim() && ingredientOptions.length > visibleIngredients.length ? (
            <Text style={styles.moreIngredientsText}>
              Zoek om alle {ingredientOptions.length} ingrediënten te bekijken.
            </Text>
          ) : null}
        </FilterSection>

        {familyMembers.length > 0 ? (
          <>
            <FilterSection
              title="Gezamenlijk cijfer"
              subtitle="Gemiddelde van de gezinsleden die meetellen.">
              <View style={styles.optionWrap}>
                {ratingOptions.map((rating) => (
                  <ChoicePill
                    key={rating}
                    label={`★ ${rating} of hoger`}
                    selected={draft.minimumHouseholdRating === rating}
                    onPress={() => setDraft((current) => ({
                      ...current,
                      minimumHouseholdRating:
                        current.minimumHouseholdRating === rating ? null : rating,
                    }))}
                  />
                ))}
              </View>
            </FilterSection>

            <FilterSection
              title="Cijfer van één persoon"
              subtitle="Kies eerst een persoon en daarna het minimumcijfer.">
              <View style={styles.optionWrap}>
                {familyMembers.map((member) => (
                  <ChoicePill
                    key={member.id}
                    label={member.name}
                    selected={draft.memberId === member.id}
                    onPress={() => setDraft((current) => ({
                      ...current,
                      memberId: current.memberId === member.id ? null : member.id,
                      minimumMemberRating:
                        current.memberId === member.id ? null : current.minimumMemberRating ?? 3,
                    }))}
                  />
                ))}
              </View>
              {draft.memberId ? (
                <View style={[styles.optionWrap, styles.subOptions]}>
                  {ratingOptions.map((rating) => (
                    <ChoicePill
                      key={rating}
                      label={`★ ${rating}+`}
                      selected={draft.minimumMemberRating === rating}
                      onPress={() => setDraft((current) => ({
                        ...current,
                        minimumMemberRating: rating,
                      }))}
                    />
                  ))}
                </View>
              ) : null}
            </FilterSection>
          </>
        ) : null}

        <FilterSection title="Tijd en moeite" subtitle="Kies een maximale bereidingstijd.">
          <View style={styles.optionWrap}>
            {timeOptions.map((minutes) => (
              <ChoicePill
                key={minutes}
                label={`Tot ${minutes} min`}
                selected={draft.maximumMinutes === minutes}
                onPress={() => setDraft((current) => ({
                  ...current,
                  maximumMinutes: current.maximumMinutes === minutes ? null : minutes,
                }))}
              />
            ))}
          </View>
          <ToggleRow
            title="Snel & makkelijk"
            description="Maximaal 30 minuten en 8 ingrediënten."
            selected={draft.quickAndEasy}
            onPress={() => setDraft((current) => ({
              ...current,
              quickAndEasy: !current.quickAndEasy,
            }))}
          />
        </FilterSection>

        <FilterSection
          title="Iets nieuws"
          subtitle="Eetgeschiedenis wordt nog niet apart bijgehouden.">
          <ToggleRow
            title="Nog nooit beoordeeld"
            description="Toont gerechten waar nog niemand een cijfer aan gaf."
            selected={draft.neverRated}
            onPress={() => setDraft((current) => ({
              ...current,
              neverRated: !current.neverRated,
            }))}
          />
        </FilterSection>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={apply}
          accessibilityRole="button"
          accessibilityLabel={`${resultCount} recepten met deze filters tonen`}
          style={({ pressed }) => [styles.applyButton, pressed && styles.pressed]}>
          <Text style={styles.applyButtonText}>
            Toon {resultCount} {resultCount === 1 ? 'recept' : 'recepten'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function FilterSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

function ChoicePill({
  label,
  count,
  selected,
  onPress,
}: {
  label: string;
  count?: number;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={count === undefined
        ? label
        : `${label}, ${count} ${count === 1 ? 'recept' : 'recepten'}`}
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.choicePill,
        selected && styles.choicePillSelected,
        pressed && styles.pressed,
      ]}>
      {selected ? (
        <AppIcon
          name={{ ios: 'checkmark', android: 'check', web: 'check' }}
          tintColor={palette.white}
          size={14}
        />
      ) : null}
      <Text style={[styles.choicePillText, selected && styles.choicePillTextSelected]}>{label}</Text>
      {count !== undefined ? (
        <Text style={[styles.choicePillCount, selected && styles.choicePillCountSelected]}>
          {count}
        </Text>
      ) : null}
    </Pressable>
  );
}

function ToggleRow({
  title,
  description,
  selected,
  onPress,
}: {
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="switch"
      accessibilityState={{ checked: selected }}
      style={({ pressed }) => [styles.toggleRow, pressed && styles.pressed]}>
      <View style={styles.toggleCopy}>
        <Text style={styles.toggleTitle}>{title}</Text>
        <Text style={styles.toggleDescription}>{description}</Text>
      </View>
      <View style={[styles.toggle, selected && styles.toggleSelected]}>
        <View style={[styles.toggleKnob, selected && styles.toggleKnobSelected]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: palette.background, flex: 1 },
  content: { gap: spacing.md, padding: spacing.xl, paddingBottom: spacing.xxxl },
  introRow: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.md },
  introCopy: { flex: 1 },
  title: { color: palette.text, fontSize: 24, fontWeight: '800' },
  subtitle: { color: palette.textMuted, fontSize: 14, lineHeight: 20, marginTop: spacing.xs },
  clearButton: { justifyContent: 'center', minHeight: 44, paddingHorizontal: spacing.sm },
  clearButtonText: { color: palette.sageDark, fontSize: 13, fontWeight: '700' },
  section: {
    ...shadow.card,
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  sectionTitle: { color: palette.text, fontSize: 17, fontWeight: '800' },
  sectionSubtitle: { color: palette.textMuted, fontSize: 12, lineHeight: 17, marginTop: 3 },
  sectionContent: { marginTop: spacing.md },
  searchBox: {
    alignItems: 'center',
    backgroundColor: palette.surfaceMuted,
    borderRadius: radius.md,
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
  },
  searchInput: { color: palette.text, flex: 1, fontSize: 14, height: 44, marginLeft: spacing.sm },
  optionWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  moreIngredientsText: { color: palette.textSoft, fontSize: 11, marginTop: spacing.md },
  subOptions: { borderTopColor: palette.border, borderTopWidth: 1, marginTop: spacing.md, paddingTop: spacing.md },
  choicePill: {
    alignItems: 'center',
    backgroundColor: palette.surfaceMuted,
    borderColor: palette.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    minHeight: 40,
    paddingHorizontal: 12,
  },
  choicePillSelected: { backgroundColor: palette.sageDark, borderColor: palette.sageDark },
  choicePillText: { color: palette.textMuted, fontSize: 12, fontWeight: '700' },
  choicePillTextSelected: { color: palette.white },
  choicePillCount: { color: palette.textSoft, fontSize: 11, fontWeight: '800' },
  choicePillCountSelected: { color: palette.white },
  toggleRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, minHeight: 54 },
  toggleCopy: { flex: 1 },
  toggleTitle: { color: palette.text, fontSize: 14, fontWeight: '700' },
  toggleDescription: { color: palette.textMuted, fontSize: 11, lineHeight: 16, marginTop: 2 },
  toggle: {
    backgroundColor: palette.surfaceStrong,
    borderRadius: radius.pill,
    height: 30,
    justifyContent: 'center',
    paddingHorizontal: 3,
    width: 50,
  },
  toggleSelected: { backgroundColor: palette.sageDark },
  toggleKnob: { backgroundColor: palette.white, borderRadius: radius.pill, height: 24, width: 24 },
  toggleKnobSelected: { alignSelf: 'flex-end' },
  footer: {
    backgroundColor: palette.surface,
    borderTopColor: palette.border,
    borderTopWidth: 1,
    padding: spacing.lg,
  },
  applyButton: {
    alignItems: 'center',
    backgroundColor: palette.sageDark,
    borderRadius: radius.md,
    justifyContent: 'center',
    minHeight: 52,
  },
  applyButtonText: { color: palette.white, fontSize: 15, fontWeight: '800' },
  pressed: { opacity: 0.7 },
});
