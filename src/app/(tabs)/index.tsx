import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/mealmate/app-icon';
import { BrandLogo } from '@/components/mealmate/brand-logo';
import { getMealMateTabBarContentInset } from '@/components/mealmate/meal-mate-tab-bar';
import { RecipeImage } from '@/components/mealmate/recipe-image';
import { UserAvatar } from '@/components/mealmate/user-avatar';
import { palette, radius, spacing } from '@/constants/mealmate-theme';
import { dateToIso, getWeekRangeLabel, type WeekDay } from '@/data/mock-data';
import { getInitial, getUserInitial } from '@/lib/user-initial';
import { useAuth } from '@/state/auth-provider';
import { useMealMate } from '@/state/meal-mate-provider';

export default function WeekScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session, avatarUrl } = useAuth();
  const {
    weekDays,
    plannedMeals,
    leftoverMeals,
    getRecipe,
    removeMeal,
    changeWeek,
    familyMembers,
    mealAttendance,
  } = useMealMate();
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
  const currentMember = familyMembers.find(
    (member) =>
      member.linkedUserId === session?.user.id ||
      (Boolean(member.email) &&
        member.email?.trim().toLowerCase() === session?.user.email?.trim().toLowerCase()),
  );
  const avatarInitial = getInitial(currentMember?.initials) ?? getUserInitial(session?.user);

  const openPlanner = (day: WeekDay) => {
    router.push({ pathname: '/add-meal', params: { dayId: day.isoDate } });
  };

  const openRecipe = (day: WeekDay, recipeId: string) => {
    setSelectedDayId(day.isoDate);
    router.push({ pathname: '/recipe-detail', params: { recipeId } });
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
      'Uit weekplanning halen?',
      `${selectedRecipe.title} wordt alleen bij ${selectedDay.label.toLowerCase()} weggehaald. Het recept blijft bewaard.`,
      [
        { text: 'Annuleer', style: 'cancel' },
        {
          text: 'Haal weg',
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
        contentInsetAdjustmentBehavior="never">
        <View style={styles.brandRow}>
          <View>
            <BrandLogo width={112} />
            <Text style={styles.brandTagline}>Save it. Plan it. Shop for it.</Text>
            <View style={styles.todayLine}>
              <View style={styles.todayDot} />
              <Text style={styles.todayText}>Vandaag · {todayLabel}</Text>
            </View>
          </View>
          <Pressable
            onPress={() => router.push('/account')}
            accessibilityRole="button"
            accessibilityLabel="Open jouw account"
            hitSlop={6}
            style={({ pressed }) => [styles.avatar, pressed && styles.pressed]}>
            <UserAvatar initial={avatarInitial} size={38} uri={avatarUrl} />
          </Pressable>
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
            const leftoverFrom = leftoverMeals[day.isoDate];
            const selected = selectedDay.isoDate === day.isoDate;
            const isToday = day.isoDate === todayIso;
            const isPast = day.isoDate < todayIso;
            return (
              <Pressable
                key={day.isoDate}
                onPress={() => setSelectedDayId(day.isoDate)}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                accessibilityLabel={`${day.label} ${day.date} ${day.month}${isPast ? ', voorbij' : ''}${recipe ? `, ${recipe.title}${leftoverFrom ? ' als restje' : ''} gepland` : ', nog leeg'}`}
                style={({ pressed }) => [
                  styles.dayButton,
                  isPast && !selected && styles.dayButtonPast,
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

        <View style={styles.listHeading}>
          <Text style={styles.listTitle}>Weekplanning</Text>
          <Text style={styles.listMeta}>{plannedCount} van 7 gepland</Text>
        </View>

        <View style={styles.weekList}>
          {weekDays.map((day, index) => {
              const recipe = getRecipe(plannedMeals[day.isoDate]);
              const leftoverFrom = leftoverMeals[day.isoDate];
              const leftoverSourceDay = leftoverFrom
                ? weekDays.find((candidate) => candidate.isoDate === leftoverFrom)
                : undefined;
              const selected = day.isoDate === selectedDay.isoDate;
              const isPast = day.isoDate < todayIso;
              const absentMembers = familyMembers.filter(
                (member) => mealAttendance[day.isoDate]?.[member.id] === false,
              );
              const currentMemberIsAbsent = currentMember
                ? mealAttendance[day.isoDate]?.[currentMember.id] === false
                : false;
              const eatingCount = familyMembers.length - absentMembers.length;
              const attendanceSummary = currentMemberIsAbsent
                ? 'Jij eet niet mee'
                : absentMembers.length === 0
                  ? 'Iedereen eet mee'
                  : `${eatingCount} van ${familyMembers.length} eten mee`;
              return (
                <View
                  key={day.isoDate}
                  style={[
                    styles.weekRowWrapper,
                    isPast && !selected && styles.weekRowWrapperPast,
                    selected && styles.weekRowWrapperSelected,
                    index < weekDays.length - 1 && !selected && styles.weekRowDivider,
                  ]}>
                  <View style={styles.weekRow}>
                    <Pressable
                      onPress={() => setSelectedDayId(day.isoDate)}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      accessibilityLabel={`Selecteer ${day.label} ${day.date} ${day.month}${isPast ? ', voorbij' : ''}`}
                      style={({ pressed }) => [styles.weekRowDate, pressed && styles.pressed]}>
                      <Text style={[styles.weekRowDay, selected && styles.weekRowDaySelected]}>
                        {day.label}
                      </Text>
                      <Text style={styles.weekRowDateText}>{day.date} {day.monthShort}</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        if (recipe) {
                          openRecipe(day, recipe.id);
                          return;
                        }
                        setSelectedDayId(day.isoDate);
                        openPlanner(day);
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={
                        recipe
                          ? `Open details van ${recipe.title}`
                          : `Plan een gerecht voor ${day.label}`
                      }
                      style={({ pressed }) => [styles.weekRecipeLink, pressed && styles.pressed]}>
                      {recipe ? (
                        <RecipeImage recipe={recipe} style={styles.weekRowImage} />
                      ) : (
                        <View style={styles.weekRowPlus}>
                          <AppIcon
                            name={{ ios: 'plus', android: 'add', web: 'add' }}
                            tintColor={palette.sageDark}
                            size={17}
                          />
                        </View>
                      )}
                      <View style={styles.weekRowCopy}>
                        <Text style={[styles.weekRowTitle, !recipe && styles.weekRowTitleEmpty]} numberOfLines={1}>
                          {recipe?.title ?? (selected ? 'Nog niets gepland' : 'Gerecht kiezen')}
                        </Text>
                        {recipe ? (
                          <Text
                            style={[
                              styles.weekRowMeta,
                              currentMemberIsAbsent && styles.weekRowMetaImportant,
                            ]}
                            numberOfLines={1}>
                            {leftoverFrom
                              ? `Restje van ${leftoverSourceDay?.label.toLowerCase() ?? 'eerder'} · ${attendanceSummary.toLowerCase()}`
                              : `${recipe.minutes} min · ${attendanceSummary.toLowerCase()}`}
                          </Text>
                        ) : (
                          <Text style={styles.weekRowMeta}>
                            {selected ? 'Kies een gerecht voor deze dag' : 'Nog niets gepland'}
                          </Text>
                        )}
                      </View>
                      <AppIcon
                        name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                        tintColor={palette.textSoft}
                        size={17}
                      />
                    </Pressable>
                  </View>
                  {selected ? (
                    <>
                      {recipe ? (
                        <View style={styles.selectedRowActions}>
                          {familyMembers.length > 0 ? (
                            <Pressable
                              onPress={() =>
                                router.push({
                                  pathname: '/meal-attendance',
                                  params: { dayId: day.isoDate },
                                })
                              }
                              accessibilityRole="button"
                              accessibilityLabel={`${attendanceSummary}. Aanwezigheid wijzigen voor ${day.label}`}
                              style={({ pressed }) => [
                                styles.attendanceAction,
                                currentMemberIsAbsent && styles.attendanceActionImportant,
                                pressed && styles.pressed,
                              ]}>
                              <AppIcon
                                name={{ ios: 'person.2.fill', android: 'group', web: 'group' }}
                                tintColor={
                                  currentMemberIsAbsent ? palette.danger : palette.sageDark
                                }
                                size={16}
                              />
                              <Text
                                style={[
                                  styles.attendanceActionText,
                                  currentMemberIsAbsent && styles.attendanceActionTextImportant,
                                ]}
                                numberOfLines={1}>
                                {attendanceSummary}
                              </Text>
                            </Pressable>
                          ) : (
                            <View style={styles.actionSpacer} />
                          )}
                          <Pressable
                            onPress={confirmRemove}
                            accessibilityRole="button"
                            accessibilityLabel={`${recipe.title} uit de weekplanning van ${day.label} halen`}
                            hitSlop={6}
                            style={({ pressed }) => [styles.removeLink, pressed && styles.pressed]}>
                            <AppIcon
                              name={{ ios: 'trash', android: 'delete', web: 'delete' }}
                              tintColor={palette.textMuted}
                              size={17}
                            />
                          </Pressable>
                          <Pressable
                            onPress={() => openPlanner(day)}
                            accessibilityRole="button"
                            accessibilityLabel={`Kies een ander gerecht voor ${day.label}`}
                            style={({ pressed }) => [styles.changeButton, pressed && styles.pressed]}>
                            <Text style={styles.changeButtonText}>Ander gerecht</Text>
                          </Pressable>
                        </View>
                      ) : (
                        <Pressable
                          onPress={() => openPlanner(day)}
                          accessibilityRole="button"
                          accessibilityLabel={`Plan een gerecht voor ${day.label}`}
                          style={({ pressed }) => [styles.planSelectedDay, pressed && styles.pressed]}>
                          <Text style={styles.planSelectedDayText}>Gerecht kiezen</Text>
                          <AppIcon
                            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                            tintColor={palette.sageDark}
                            size={16}
                          />
                        </Pressable>
                      )}
                    </>
                  ) : null}
                </View>
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
        size={18}
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
  brandTagline: { color: palette.textMuted, fontSize: 10, fontWeight: '600', marginTop: 1 },
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
  weekPager: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
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
    marginTop: spacing.md,
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
  dayButtonPast: { opacity: 0.48 },
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
  changeButton: {
    borderColor: palette.sageDark,
    borderRadius: radius.pill,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: spacing.md,
  },
  changeButtonText: { color: palette.sageDark, fontSize: 12, fontWeight: '700' },
  removeLink: { alignItems: 'center', justifyContent: 'center', minHeight: 44, width: 40 },
  listHeading: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
  },
  listTitle: { color: palette.text, fontSize: 19, fontWeight: '700' },
  listMeta: { color: palette.textSoft, fontSize: 12, fontWeight: '600' },
  weekList: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  weekRowWrapper: { backgroundColor: palette.surface },
  weekRowWrapperPast: { opacity: 0.52 },
  weekRowWrapperSelected: {
    backgroundColor: palette.sageSoft,
    borderColor: palette.sage,
    borderRadius: radius.md,
    borderWidth: 1,
    margin: 4,
  },
  weekRow: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 62,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  weekRowDivider: { borderBottomColor: palette.border, borderBottomWidth: 1 },
  weekRowDate: { justifyContent: 'center', minHeight: 50, width: 80 },
  weekRowDay: { color: palette.text, fontSize: 13, fontWeight: '600' },
  weekRowDaySelected: { color: palette.sageDark, fontWeight: '800' },
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
  weekRecipeLink: { alignItems: 'center', flex: 1, flexDirection: 'row', minHeight: 50 },
  weekRowCopy: { flex: 1, marginHorizontal: spacing.md },
  weekRowTitle: { color: palette.text, fontSize: 14, fontWeight: '700' },
  weekRowTitleEmpty: { color: palette.sageDark },
  weekRowMeta: { color: palette.textMuted, fontSize: 11, marginTop: 4 },
  weekRowMetaImportant: { color: palette.danger, fontWeight: '800' },
  selectedRowActions: {
    alignItems: 'center',
    borderTopColor: palette.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    marginHorizontal: spacing.sm,
    minHeight: 54,
    paddingVertical: 5,
  },
  attendanceAction: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 7,
    minHeight: 44,
    paddingHorizontal: spacing.md,
  },
  attendanceActionImportant: {
    backgroundColor: '#F4E5E3',
    borderColor: '#E5C9C6',
  },
  attendanceActionText: { color: palette.sageDark, flex: 1, fontSize: 11, fontWeight: '700' },
  attendanceActionTextImportant: { color: palette.danger, fontWeight: '800' },
  actionSpacer: { flex: 1 },
  planSelectedDay: {
    alignItems: 'center',
    borderTopColor: palette.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.sm,
    minHeight: 48,
    paddingHorizontal: spacing.sm,
  },
  planSelectedDayText: { color: palette.sageDark, fontSize: 13, fontWeight: '700' },
  pressed: { opacity: 0.7 },
});
