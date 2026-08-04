import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/mealmate/app-icon';
import { getMealMateTabBarContentInset } from '@/components/mealmate/meal-mate-tab-bar';
import { RecipeImage } from '@/components/mealmate/recipe-image';
import { palette, radius, shadow, spacing } from '@/constants/mealmate-theme';
import { dateToIso, getWeekRangeLabel, type WeekDay } from '@/data/mock-data';
import { useMealMate } from '@/state/meal-mate-provider';

export default function WeekScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { weekDays, plannedMeals, getRecipe, removeMeal, changeWeek } = useMealMate();
  const [selectedDayId, setSelectedDayId] = useState(() => {
    const currentDayId = dateToIso(new Date());
    return weekDays.some((day) => day.isoDate === currentDayId)
      ? currentDayId
      : weekDays[0].isoDate;
  });
  const [isChangingWeek, setIsChangingWeek] = useState(false);
  const today = new Date();
  const todayIso = dateToIso(today);
  const todayLabel = today.toLocaleDateString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const selectedDay =
    weekDays.find((day) => day.isoDate === selectedDayId) ?? weekDays[0];
  const selectedRecipe = getRecipe(plannedMeals[selectedDay.isoDate]);
  const plannedCount = weekDays.filter((day) => plannedMeals[day.isoDate]).length;

  const openPlanner = (day: WeekDay) => {
    router.push({ pathname: '/add-meal', params: { dayId: day.isoDate } });
  };

  const showAdjacentWeek = async (direction: -1 | 1) => {
    if (isChangingWeek) return;
    const selectedIndex = Math.max(
      0,
      weekDays.findIndex((day) => day.isoDate === selectedDay.isoDate),
    );
    const nextSelectedDate = new Date(`${selectedDay.isoDate}T12:00:00`);
    nextSelectedDate.setDate(nextSelectedDate.getDate() + direction * 7);
    const nextSelectedIso = [
      nextSelectedDate.getFullYear(),
      String(nextSelectedDate.getMonth() + 1).padStart(2, '0'),
      String(nextSelectedDate.getDate()).padStart(2, '0'),
    ].join('-');

    setIsChangingWeek(true);
    setSelectedDayId(nextSelectedIso);
    try {
      await changeWeek(direction);
    } catch {
      setSelectedDayId(weekDays[selectedIndex].isoDate);
      Alert.alert(
        'Week laden mislukt',
        'Controleer je internetverbinding en probeer het opnieuw.',
      );
    } finally {
      setIsChangingWeek(false);
    }
  };

  const confirmRemove = () => {
    if (!selectedRecipe) return;
    Alert.alert(
      'Gerecht verwijderen?',
      `${selectedRecipe.title} wordt van ${selectedDay.label.toLowerCase()} verwijderd.`,
      [
        { text: 'Annuleer', style: 'cancel' },
        {
          text: 'Verwijder',
          style: 'destructive',
          onPress: () => void removeMeal(selectedDay.isoDate),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: getMealMateTabBarContentInset(insets.bottom) },
        ]}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic">
        <View style={styles.brandRow}>
          <View>
            <Text style={styles.brand}>MealMate</Text>
            <View style={styles.todayLine}>
              <View style={styles.todayDot} />
              <Text style={styles.todayText}>Vandaag · {todayLabel}</Text>
            </View>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MM</Text>
          </View>
        </View>

        <View style={styles.weekPager}>
          <WeekButton
            direction="previous"
            disabled={isChangingWeek}
            onPress={() => void showAdjacentWeek(-1)}
          />
          {isChangingWeek ? (
            <ActivityIndicator color={palette.sageDark} />
          ) : (
            <Text style={styles.weekRange}>{getWeekRangeLabel(weekDays)}</Text>
          )}
          <WeekButton
            direction="next"
            disabled={isChangingWeek}
            onPress={() => void showAdjacentWeek(1)}
          />
        </View>

        <View style={styles.dayStrip} accessibilityRole="tablist">
          {weekDays.map((day) => {
            const recipe = getRecipe(plannedMeals[day.isoDate]);
            const selected = selectedDay.isoDate === day.isoDate;
            const isToday = day.isoDate === todayIso;
            return (
              <Pressable
                key={day.isoDate}
                onPress={() => setSelectedDayId(day.isoDate)}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                accessibilityLabel={`${day.label} ${day.date} ${day.month}${recipe ? `, ${recipe.title} gepland` : ', nog leeg'}`}
                style={({ pressed }) => [
                  styles.dayButton,
                  selected && styles.dayButtonSelected,
                  pressed && styles.pressed,
                ]}>
                <Text style={[styles.dayShort, selected && styles.dayTextSelected]}>
                  {day.short.slice(0, 1)}{day.short.slice(1).toLowerCase()}
                </Text>
                <View
                  style={[
                    styles.dayDateBadge,
                    isToday && styles.dayDateBadgeToday,
                    isToday && selected && styles.dayDateBadgeTodaySelected,
                  ]}>
                  <Text
                    style={[
                      styles.dayDate,
                      selected && styles.dayTextSelected,
                      isToday && selected && styles.dayDateTodaySelectedText,
                    ]}>
                    {day.date}
                  </Text>
                </View>
                {recipe ? (
                  <View style={[styles.dayStatus, selected && styles.dayStatusSelected]}>
                    {recipe.image ? (
                      <RecipeImage recipe={recipe} style={styles.dayThumbnail} />
                    ) : (
                      <View style={[styles.plannedDot, selected && styles.plannedDotSelected]} />
                    )}
                  </View>
                ) : (
                  <Pressable
                    onPress={(event) => {
                      event.stopPropagation();
                      setSelectedDayId(day.isoDate);
                      openPlanner(day);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Plan een gerecht voor ${day.label}`}
                    hitSlop={4}
                    style={({ pressed }) => [
                      styles.dayStatus,
                      selected && styles.dayStatusSelected,
                      pressed && styles.pressed,
                    ]}>
                    <AppIcon
                      name={{ ios: 'plus', android: 'add', web: 'add' }}
                      tintColor={selected ? palette.sageDark : palette.textMuted}
                      size={15}
                    />
                  </Pressable>
                )}
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.selectedDate}>
          {selectedDay.label} {selectedDay.date} {selectedDay.month}
        </Text>

        {selectedRecipe ? (
          <View style={styles.selectedMealCard}>
            <RecipeImage recipe={selectedRecipe} style={styles.selectedMealImage} />
            <View style={styles.selectedMealCopy}>
              <Text style={styles.selectedMealTitle} numberOfLines={2}>
                {selectedRecipe.title}
              </Text>
              <Text style={styles.selectedMealMeta}>
                {selectedRecipe.minutes} min · voor 2 personen
              </Text>
              <View style={styles.selectedMealActions}>
                <View style={styles.plannedLabel}>
                  <View style={styles.plannedCheck}>
                    <AppIcon
                      name={{ ios: 'checkmark', android: 'check', web: 'check' }}
                      tintColor={palette.white}
                      size={13}
                    />
                  </View>
                  <Text style={styles.plannedLabelText}>Gepland</Text>
                </View>
                <Pressable
                  onPress={() => openPlanner(selectedDay)}
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.changeButton, pressed && styles.pressed]}>
                  <Text style={styles.changeButtonText}>Wijzig</Text>
                </Pressable>
              </View>
              <Pressable
                onPress={confirmRemove}
                accessibilityRole="button"
                hitSlop={8}
                style={({ pressed }) => [styles.removeLink, pressed && styles.pressed]}>
                <Text style={styles.removeLinkText}>Verwijder uit week</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            onPress={() => openPlanner(selectedDay)}
            accessibilityRole="button"
            style={({ pressed }) => [styles.emptyMealCard, pressed && styles.pressed]}>
            <View style={styles.emptyMealIcon}>
              <AppIcon
                name={{ ios: 'plus', android: 'add', web: 'add' }}
                tintColor={palette.sageDark}
              />
            </View>
            <View style={styles.emptyMealCopy}>
              <Text style={styles.emptyMealTitle}>Nog niets gepland</Text>
              <Text style={styles.emptyMealText}>Kies een gerecht voor deze dag</Text>
            </View>
            <AppIcon
              name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
              tintColor={palette.sageDark}
              size={18}
            />
          </Pressable>
        )}

        <View style={styles.listHeading}>
          <Text style={styles.listTitle}>Deze week</Text>
          <Text style={styles.listMeta}>{plannedCount} van 7 gepland</Text>
        </View>

        <View style={styles.weekList}>
          {weekDays
            .filter((day) => day.isoDate !== selectedDay.isoDate)
            .map((day, index, otherDays) => {
              const recipe = getRecipe(plannedMeals[day.isoDate]);
              return (
                <Pressable
                  key={day.isoDate}
                  onPress={() => setSelectedDayId(day.isoDate)}
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.weekRow,
                    index < otherDays.length - 1 && styles.weekRowDivider,
                    pressed && styles.pressed,
                  ]}>
                  <View style={styles.weekRowDate}>
                    <Text style={styles.weekRowDay}>{day.label}</Text>
                    <Text style={styles.weekRowDateText}>{day.date} {day.monthShort}</Text>
                  </View>
                  {recipe ? (
                    <RecipeImage recipe={recipe} style={styles.weekRowImage} />
                  ) : (
                    <Pressable
                      onPress={(event) => {
                        event.stopPropagation();
                        setSelectedDayId(day.isoDate);
                        openPlanner(day);
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`Plan een gerecht voor ${day.label}`}
                      hitSlop={6}
                      style={({ pressed }) => [styles.weekRowPlus, pressed && styles.pressed]}>
                      <AppIcon
                        name={{ ios: 'plus', android: 'add', web: 'add' }}
                        tintColor={palette.sageDark}
                        size={17}
                      />
                    </Pressable>
                  )}
                  <View style={styles.weekRowCopy}>
                    <Text style={[styles.weekRowTitle, !recipe && styles.weekRowTitleEmpty]} numberOfLines={1}>
                      {recipe?.title ?? 'Gerecht kiezen'}
                    </Text>
                    {recipe ? (
                      <Text style={styles.weekRowMeta}>{recipe.minutes} min · voor 2 personen</Text>
                    ) : null}
                  </View>
                  <AppIcon
                    name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                    tintColor={palette.textSoft}
                    size={17}
                  />
                </Pressable>
              );
            })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function WeekButton({
  direction,
  disabled,
  onPress,
}: {
  direction: 'previous' | 'next';
  disabled: boolean;
  onPress: () => void;
}) {
  const previous = direction === 'previous';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={previous ? 'Vorige week' : 'Volgende week'}
      style={({ pressed }) => [
        styles.weekButton,
        (pressed || disabled) && styles.pressed,
      ]}>
      <AppIcon
        name={
          previous
            ? { ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }
            : { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }
        }
        tintColor={palette.sageDark}
        size={20}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  content: { paddingHorizontal: spacing.xl },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  brand: { color: palette.sageDark, fontSize: 25, fontWeight: '800', letterSpacing: -0.7 },
  todayLine: { alignItems: 'center', flexDirection: 'row', gap: 6, marginTop: 3 },
  todayDot: {
    backgroundColor: palette.sage,
    borderRadius: radius.pill,
    height: 7,
    width: 7,
  },
  todayText: { color: palette.textMuted, fontSize: 11, fontWeight: '600' },
  avatar: {
    alignItems: 'center',
    backgroundColor: palette.surfaceStrong,
    borderRadius: radius.pill,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  avatarText: { color: palette.sageDark, fontSize: 12, fontWeight: '800' },
  weekPager: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
  },
  weekButton: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  weekRange: { color: palette.text, fontSize: 18, fontWeight: '700' },
  dayStrip: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    flexDirection: 'row',
    gap: 3,
    marginTop: spacing.xl,
    padding: spacing.xs,
  },
  dayButton: {
    alignItems: 'center',
    borderRadius: radius.md,
    flex: 1,
    minHeight: 88,
    paddingHorizontal: 2,
    paddingVertical: spacing.sm,
  },
  dayButtonSelected: {
    backgroundColor: palette.sageDark,
  },
  dayShort: { color: palette.textMuted, fontSize: 11, fontWeight: '600' },
  dayDateBadge: {
    alignItems: 'center',
    borderRadius: radius.pill,
    height: 28,
    justifyContent: 'center',
    marginTop: 1,
    width: 28,
  },
  dayDateBadgeToday: {
    backgroundColor: palette.sageSoft,
    borderColor: palette.sage,
    borderWidth: 1.5,
  },
  dayDateBadgeTodaySelected: {
    backgroundColor: palette.white,
    borderColor: palette.white,
  },
  dayDate: { color: palette.text, fontSize: 18, fontWeight: '700' },
  dayDateTodaySelectedText: { color: palette.sageDark },
  dayTextSelected: { color: palette.white },
  dayStatus: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderRadius: radius.pill,
    height: 26,
    justifyContent: 'center',
    marginTop: 6,
    overflow: 'hidden',
    width: 26,
  },
  dayStatusSelected: { backgroundColor: palette.white },
  dayThumbnail: { height: 26, width: 26 },
  plannedDot: { backgroundColor: palette.sage, borderRadius: radius.pill, height: 10, width: 10 },
  plannedDotSelected: { backgroundColor: palette.sageDark },
  selectedDate: {
    color: palette.text,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginTop: spacing.xl,
  },
  selectedMealCard: {
    ...shadow.card,
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    flexDirection: 'row',
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  selectedMealImage: { borderRadius: radius.md, height: 92, width: 92 },
  selectedMealCopy: { flex: 1, marginLeft: spacing.md, paddingRight: spacing.sm },
  selectedMealTitle: { color: palette.text, fontSize: 17, fontWeight: '700', lineHeight: 21 },
  selectedMealMeta: { color: palette.textMuted, fontSize: 12, marginTop: 5 },
  selectedMealActions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  plannedLabel: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  plannedCheck: {
    alignItems: 'center',
    backgroundColor: palette.sageDark,
    borderRadius: radius.pill,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  plannedLabelText: { color: palette.sageDark, fontSize: 12, fontWeight: '700' },
  changeButton: {
    borderColor: palette.sageDark,
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
  },
  changeButtonText: { color: palette.sageDark, fontSize: 12, fontWeight: '700' },
  removeLink: { alignSelf: 'flex-start', marginTop: spacing.sm, paddingVertical: 3 },
  removeLinkText: { color: palette.textSoft, fontSize: 10, fontWeight: '600' },
  emptyMealCard: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderRadius: radius.lg,
    flexDirection: 'row',
    marginTop: spacing.lg,
    padding: spacing.lg,
  },
  emptyMealIcon: {
    alignItems: 'center',
    backgroundColor: palette.white,
    borderRadius: radius.md,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  emptyMealCopy: { flex: 1, marginHorizontal: spacing.md },
  emptyMealTitle: { color: palette.text, fontSize: 15, fontWeight: '700' },
  emptyMealText: { color: palette.textMuted, fontSize: 12, marginTop: 4 },
  listHeading: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
  },
  listTitle: { color: palette.text, fontSize: 19, fontWeight: '700' },
  listMeta: { color: palette.textSoft, fontSize: 12, fontWeight: '600' },
  weekList: { marginTop: spacing.md },
  weekRow: { alignItems: 'center', flexDirection: 'row', minHeight: 64, paddingVertical: 6 },
  weekRowDivider: { borderBottomColor: palette.border, borderBottomWidth: 1 },
  weekRowDate: { width: 80 },
  weekRowDay: { color: palette.text, fontSize: 13, fontWeight: '600' },
  weekRowDateText: { color: palette.textMuted, fontSize: 11, marginTop: 3 },
  weekRowImage: { borderRadius: radius.pill, height: 38, width: 38 },
  weekRowPlus: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderRadius: radius.pill,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  weekRowCopy: { flex: 1, marginHorizontal: spacing.md },
  weekRowTitle: { color: palette.text, fontSize: 14, fontWeight: '700' },
  weekRowTitleEmpty: { color: palette.sageDark },
  weekRowMeta: { color: palette.textMuted, fontSize: 11, marginTop: 4 },
  pressed: { opacity: 0.7 },
});
