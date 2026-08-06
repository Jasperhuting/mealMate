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

const mealMemberName = (name: string) => {
  const shortName = name.split(/[.@]/)[0] || name;
  return `${shortName.charAt(0).toUpperCase()}${shortName.slice(1)}`;
};

export default function WeekScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session, avatarUrl } = useAuth();
  const {
    weekDays,
    plannedMeals,
    mealPlans,
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
  const [selectedMealMemberId, setSelectedMealMemberId] = useState('all');
  const today = new Date();
  const todayIso = dateToIso(today);
  const todayLabel = today.toLocaleDateString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const currentMember = familyMembers.find(
    (member) =>
      member.linkedUserId === session?.user.id ||
      (Boolean(member.email) &&
        member.email?.trim().toLowerCase() === session?.user.email?.trim().toLowerCase()),
  );
  const showingEveryone = selectedMealMemberId === 'all';
  const activeMealMemberId = showingEveryone
    ? undefined
    : (familyMembers.some((member) => member.id === selectedMealMemberId)
        ? selectedMealMemberId
        : currentMember?.id) ?? familyMembers[0]?.id;
  const activeMealMember = familyMembers.find((member) => member.id === activeMealMemberId);
  const activeMealMemberName = showingEveryone
    ? 'iedereen'
    : activeMealMember
    ? mealMemberName(activeMealMember.name)
    : 'jullie';
  const selectedDay =
    weekDays.find((day) => day.isoDate === selectedDayId) ?? weekDays[0];
  const plannedCount = weekDays.filter((day) => {
    const dayPlans = mealPlans[day.isoDate] ?? [];
    if (dayPlans.length === 0) return Boolean(plannedMeals[day.isoDate]);
    return showingEveryone
      ? dayPlans.length > 0
      : activeMealMemberId
      ? dayPlans.some((plan) => plan.memberIds.includes(activeMealMemberId))
      : dayPlans.length > 0;
  }).length;
  const avatarInitial = getInitial(currentMember?.initials) ?? getUserInitial(session?.user);

  const openPlanner = (day: WeekDay, replaceCurrent = false) => {
    const dayPlans = mealPlans[day.isoDate] ?? [];
    const planToReplace = activeMealMemberId
      ? dayPlans.find((plan) => plan.memberIds.includes(activeMealMemberId))
      : dayPlans.length === 1
        ? dayPlans[0]
        : undefined;
    router.push({
      pathname: '/add-meal',
      params: {
        dayId: day.isoDate,
        ...(activeMealMemberId ? { mealMemberId: activeMealMemberId } : {}),
        ...(replaceCurrent && planToReplace
          ? { replaceRecipeId: planToReplace.recipeId }
          : {}),
      },
    });
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

  const confirmRemove = ({
    day,
    mealPlanId,
    memberIds,
    recipeTitle,
  }: {
    day: WeekDay;
    mealPlanId?: string;
    memberIds?: string[];
    recipeTitle: string;
  }) => {
    const assignedMemberNames = familyMembers
      .filter((member) => memberIds?.includes(member.id))
      .map((member) => mealMemberName(member.name));
    const assignment =
      assignedMemberNames.length === familyMembers.length
        ? 'iedereen'
        : assignedMemberNames.join(' en ') || activeMealMemberName;
    Alert.alert(
      'Uit weekplanning halen?',
      `${recipeTitle} wordt voor ${assignment} bij ${day.label.toLowerCase()} weggehaald. Het recept blijft bewaard.`,
      [
        { text: 'Annuleer', style: 'cancel' },
        {
          text: 'Haal weg',
          style: 'destructive',
          onPress: () => void removeMeal(day.isoDate, mealPlanId),
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
            const dayPlans = mealPlans[day.isoDate] ?? [];
            const memberPlan = showingEveryone
              ? dayPlans[0]
              : activeMealMemberId
              ? dayPlans.find((plan) => plan.memberIds.includes(activeMealMemberId))
              : dayPlans[0];
            const recipe = getRecipe(
              memberPlan?.recipeId ??
                (dayPlans.length === 0 ? plannedMeals[day.isoDate] : undefined),
            );
            const leftoverFrom = memberPlan?.leftoverFrom ?? leftoverMeals[day.isoDate];
            const selected = selectedDay.isoDate === day.isoDate;
            const isToday = day.isoDate === todayIso;
            const isPast = day.isoDate < todayIso;
            return (
              <Pressable
                key={day.isoDate}
                onPress={() => setSelectedDayId(day.isoDate)}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                accessibilityLabel={`${day.label} ${day.date} ${day.month}${isPast ? ', voorbij' : ''}${recipe ? showingEveryone && dayPlans.length > 1 ? `, ${dayPlans.length} gerechten gepland` : `, ${recipe.title}${leftoverFrom ? ' als restje' : ''} gepland voor ${activeMealMemberName}` : `, nog leeg voor ${activeMealMemberName}`}`}
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
          <Text style={styles.listMeta}>
            {showingEveryone
              ? `${plannedCount} van 7 gepland`
              : `${plannedCount} van 7 voor ${activeMealMemberName}`}
          </Text>
        </View>

        {familyMembers.length > 1 ? (
          <View style={styles.personSwitcher} accessibilityRole="tablist">
            <Pressable
              onPress={() => setSelectedMealMemberId('all')}
              accessibilityRole="tab"
              accessibilityState={{ selected: showingEveryone }}
              accessibilityLabel="Bekijk de weekplanning van iedereen"
              style={({ pressed }) => [
                styles.personSwitcherOption,
                showingEveryone && styles.personSwitcherOptionSelected,
                pressed && styles.pressed,
              ]}>
              <View
                style={[
                  styles.personSwitcherInitial,
                  showingEveryone && styles.personSwitcherInitialSelected,
                ]}>
                <AppIcon
                  name={{ ios: 'person.2.fill', android: 'group', web: 'group' }}
                  tintColor={palette.sageDark}
                  size={12}
                />
              </View>
              <Text
                style={[
                  styles.personSwitcherText,
                  showingEveryone && styles.personSwitcherTextSelected,
                ]}>
                Iedereen
              </Text>
            </Pressable>
            {familyMembers.map((member) => {
              const selected = member.id === activeMealMemberId;
              const isCurrentMember = member.id === currentMember?.id;
              const name = mealMemberName(member.name);
              return (
                <Pressable
                  key={member.id}
                  onPress={() => setSelectedMealMemberId(member.id)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`Bekijk de weekplanning van ${name}`}
                  style={({ pressed }) => [
                    styles.personSwitcherOption,
                    selected && styles.personSwitcherOptionSelected,
                    pressed && styles.pressed,
                  ]}>
                  <View
                    style={[
                      styles.personSwitcherInitial,
                      selected && styles.personSwitcherInitialSelected,
                    ]}>
                    <Text
                      style={[
                        styles.personSwitcherInitialText,
                        selected && styles.personSwitcherInitialTextSelected,
                      ]}>
                      {name.charAt(0)}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.personSwitcherText,
                      selected && styles.personSwitcherTextSelected,
                      showingEveryone && isCurrentMember && styles.personSwitcherTextCurrent,
                    ]}>
                    {name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        <View style={styles.weekList}>
          {weekDays.map((day, index) => {
              const dayPlans = mealPlans[day.isoDate] ?? [];
              const dayRecipes = dayPlans.flatMap((plan) => {
                const plannedRecipe = getRecipe(plan.recipeId);
                return plannedRecipe ? [{ plan, recipe: plannedRecipe }] : [];
              });
              const memberPlan = showingEveryone
                ? dayPlans[0]
                : activeMealMemberId
                ? dayPlans.find((plan) => plan.memberIds.includes(activeMealMemberId))
                : dayPlans[0];
              const recipe = getRecipe(
                memberPlan?.recipeId ??
                  (dayPlans.length === 0 ? plannedMeals[day.isoDate] : undefined),
              );
              const leftoverFrom = memberPlan?.leftoverFrom ?? leftoverMeals[day.isoDate];
              const leftoverSourceDay = leftoverFrom
                ? weekDays.find((candidate) => candidate.isoDate === leftoverFrom)
                : undefined;
              const selected = day.isoDate === selectedDay.isoDate;
              const isPast = day.isoDate < todayIso;
              const multipleRecipes = showingEveryone && dayRecipes.length > 1;
              const assignmentLabels = dayRecipes.map(({ plan, recipe: plannedRecipe }) => {
                const memberNames = familyMembers
                  .filter((member) => plan.memberIds.includes(member.id))
                  .map((member) => mealMemberName(member.name));
                const people =
                  familyMembers.length > 0 && memberNames.length === familyMembers.length
                    ? 'Iedereen'
                    : memberNames.join(' en ') || 'Nog niemand';
                return `${people} · ${plannedRecipe.title}`;
              });
              const absentMembers = familyMembers.filter(
                (member) => mealAttendance[day.isoDate]?.[member.id] === false,
              );
              const activeMemberIsAbsent = activeMealMemberId
                ? mealAttendance[day.isoDate]?.[activeMealMemberId] === false
                : false;
              const attendanceSummary = showingEveryone
                ? absentMembers.length === 0
                  ? 'Iedereen eet mee'
                  : `${familyMembers.length - absentMembers.length} van ${familyMembers.length} eten mee`
                : activeMemberIsAbsent
                  ? `${activeMealMemberName} eet niet mee`
                  : `${activeMealMemberName} eet mee`;
              const attendanceIsImportant = showingEveryone
                ? absentMembers.length > 0
                : activeMemberIsAbsent;
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
                          if (multipleRecipes) {
                            setSelectedDayId(day.isoDate);
                            return;
                          }
                          if (recipe) {
                            openRecipe(day, recipe.id);
                            return;
                          }
                          setSelectedDayId(day.isoDate);
                          openPlanner(day);
                        }}
                        accessibilityRole="button"
                        accessibilityLabel={
                          multipleRecipes
                            ? `${day.label}: ${assignmentLabels.join('. ')}`
                            : recipe
                            ? `Open details van ${recipe.title}`
                            : `Plan een gerecht voor ${day.label}`
                        }
                        style={({ pressed }) => [styles.weekRecipeLink, pressed && styles.pressed]}>
                        {multipleRecipes ? (
                          <View style={styles.weekRowImageStack}>
                            {dayRecipes.slice(0, 2).map(({ plan, recipe: plannedRecipe }, imageIndex) => (
                              <RecipeImage
                                key={plan.id}
                                recipe={plannedRecipe}
                                style={[
                                  styles.weekRowStackedImage,
                                  imageIndex > 0 && styles.weekRowStackedImageOverlap,
                                ]}
                              />
                            ))}
                          </View>
                        ) : recipe ? (
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
                            {multipleRecipes
                              ? assignmentLabels[0]
                              : recipe?.title ?? (selected ? 'Nog niets gepland' : 'Gerecht kiezen')}
                          </Text>
                          {multipleRecipes ? (
                            <Text style={styles.weekRowMeta} numberOfLines={1}>
                              {assignmentLabels.slice(1).join(' · ')}
                            </Text>
                          ) : recipe ? (
                            <Text
                              style={[
                                styles.weekRowMeta,
                                activeMemberIsAbsent && styles.weekRowMetaImportant,
                              ]}
                              numberOfLines={1}>
                              {leftoverFrom
                                ? `Restje van ${leftoverSourceDay?.label.toLowerCase() ?? 'eerder'} · voor ${activeMealMemberName}`
                                : `${recipe.minutes} min · voor ${activeMealMemberName}`}
                            </Text>
                          ) : (
                            <Text style={styles.weekRowMeta}>
                              {selected
                                ? `Kies een gerecht voor ${activeMealMemberName}`
                                : `Nog niets voor ${activeMealMemberName}`}
                            </Text>
                          )}
                        </View>
                        <AppIcon
                          name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                          tintColor={palette.textSoft}
                          size={17}
                        />
                      </Pressable>
                    {recipe && familyMembers.length > 0 ? (
                      <Pressable
                        onPress={() =>
                          router.push({
                            pathname: '/meal-attendance',
                            params: { dayId: day.isoDate },
                          })
                        }
                        accessibilityRole="button"
                        accessibilityLabel={`${attendanceSummary}. Aanwezigheid wijzigen voor ${day.label}`}
                        hitSlop={6}
                        style={({ pressed }) => [
                          styles.weekAttendanceButton,
                          attendanceIsImportant && styles.weekAttendanceButtonImportant,
                          pressed && styles.pressed,
                        ]}>
                        <AppIcon
                          name={{ ios: 'person.2.fill', android: 'group', web: 'group' }}
                          tintColor={attendanceIsImportant ? palette.danger : palette.sageDark}
                          size={17}
                        />
                      </Pressable>
                    ) : null}
                  </View>
                  {selected ? (
                    <>
                      {recipe ? (
                        <>
                          {multipleRecipes ? (
                            <View style={styles.multipleMealActions}>
                              <Text style={styles.multipleMealActionsTitle}>
                                Kies een gerecht om te verwijderen
                              </Text>
                              {dayRecipes.map(({ plan, recipe: plannedRecipe }) => {
                                const assignedNames = familyMembers
                                  .filter((member) => plan.memberIds.includes(member.id))
                                  .map((member) => mealMemberName(member.name));
                                const assignedTo =
                                  assignedNames.length === familyMembers.length
                                    ? 'Iedereen'
                                    : assignedNames.join(' en ') || 'Nog niemand';
                                return (
                                  <View key={plan.id} style={styles.multipleMealActionRow}>
                                    <Pressable
                                      onPress={() => openRecipe(day, plannedRecipe.id)}
                                      accessibilityRole="button"
                                      accessibilityLabel={`Open ${plannedRecipe.title}`}
                                      style={({ pressed }) => [
                                        styles.multipleMealRecipe,
                                        pressed && styles.pressed,
                                      ]}>
                                      <RecipeImage
                                        recipe={plannedRecipe}
                                        style={styles.multipleMealImage}
                                      />
                                      <View style={styles.multipleMealCopy}>
                                        <Text style={styles.multipleMealTitle} numberOfLines={1}>
                                          {plannedRecipe.title}
                                        </Text>
                                        <Text style={styles.multipleMealMeta} numberOfLines={1}>
                                          {assignedTo}
                                        </Text>
                                      </View>
                                    </Pressable>
                                    <Pressable
                                      onPress={() =>
                                        confirmRemove({
                                          day,
                                          mealPlanId: plan.id,
                                          memberIds: plan.memberIds,
                                          recipeTitle: plannedRecipe.title,
                                        })
                                      }
                                      accessibilityRole="button"
                                      accessibilityLabel={`${plannedRecipe.title} uit de weekplanning van ${day.label} halen`}
                                      hitSlop={6}
                                      style={({ pressed }) => [
                                        styles.multipleMealRemove,
                                        pressed && styles.pressed,
                                      ]}>
                                      <AppIcon
                                        name={{ ios: 'trash', android: 'delete', web: 'delete' }}
                                        tintColor={palette.danger}
                                        size={17}
                                      />
                                    </Pressable>
                                  </View>
                                );
                              })}
                            </View>
                          ) : null}
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
                                  attendanceIsImportant && styles.attendanceActionImportant,
                                  pressed && styles.pressed,
                                ]}>
                                <AppIcon
                                  name={
                                    showingEveryone
                                      ? { ios: 'person.2.fill', android: 'group', web: 'group' }
                                      : { ios: 'person.fill', android: 'person', web: 'person' }
                                  }
                                  tintColor={
                                    attendanceIsImportant ? palette.danger : palette.sageDark
                                  }
                                  size={16}
                                />
                                <Text
                                  style={[
                                    styles.attendanceActionText,
                                    attendanceIsImportant && styles.attendanceActionTextImportant,
                                  ]}
                                  numberOfLines={1}>
                                  {attendanceSummary}
                                </Text>
                              </Pressable>
                            ) : (
                              <View style={styles.actionSpacer} />
                            )}
                            {multipleRecipes ? null : (
                              <Pressable
                                onPress={() =>
                                  confirmRemove({
                                    day,
                                    mealPlanId: memberPlan?.id,
                                    memberIds: memberPlan?.memberIds,
                                    recipeTitle: recipe.title,
                                  })
                                }
                                accessibilityRole="button"
                                accessibilityLabel={`${recipe.title} uit de weekplanning van ${day.label} halen`}
                                hitSlop={6}
                                style={({ pressed }) => [
                                  styles.removeLink,
                                  pressed && styles.pressed,
                                ]}>
                                <AppIcon
                                  name={{ ios: 'trash', android: 'delete', web: 'delete' }}
                                  tintColor={palette.textMuted}
                                  size={17}
                                />
                              </Pressable>
                            )}
                            <Pressable
                              onPress={() => openPlanner(day, true)}
                              accessibilityRole="button"
                              accessibilityLabel={`${multipleRecipes ? 'Wijzig de gerechten' : 'Kies een ander gerecht'} voor ${day.label}`}
                              style={({ pressed }) => [styles.changeButton, pressed && styles.pressed]}>
                              <Text style={styles.changeButtonText}>
                                {multipleRecipes ? 'Planning wijzigen' : 'Gerecht wijzigen'}
                              </Text>
                            </Pressable>
                          </View>
                        </>
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
  personSwitcher: {
    alignSelf: 'flex-start',
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 3,
    marginTop: spacing.sm,
    padding: 3,
  },
  personSwitcherOption: {
    alignItems: 'center',
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: 6,
    minHeight: 36,
    paddingHorizontal: spacing.sm,
  },
  personSwitcherOptionSelected: { backgroundColor: palette.sageDark },
  personSwitcherInitial: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderRadius: radius.pill,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  personSwitcherInitialSelected: { backgroundColor: palette.white },
  personSwitcherInitialText: { color: palette.sageDark, fontSize: 10, fontWeight: '800' },
  personSwitcherInitialTextSelected: { color: palette.sageDark },
  personSwitcherText: { color: palette.textMuted, fontSize: 12, fontWeight: '600' },
  personSwitcherTextCurrent: { fontWeight: '800' },
  personSwitcherTextSelected: { color: palette.white, fontWeight: '700' },
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
  weekRowImageStack: {
    alignItems: 'center',
    flexDirection: 'row',
    width: 50,
  },
  weekRowStackedImage: {
    borderColor: palette.surface,
    borderRadius: radius.pill,
    borderWidth: 2,
    height: 34,
    width: 34,
  },
  weekRowStackedImageOverlap: { marginLeft: -18 },
  weekRowPlus: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderRadius: radius.pill,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  weekRecipeLink: { alignItems: 'center', flex: 1, flexDirection: 'row', minHeight: 50 },
  weekAttendanceButton: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderRadius: radius.pill,
    height: 38,
    justifyContent: 'center',
    marginLeft: spacing.xs,
    width: 38,
  },
  weekAttendanceButtonImportant: { backgroundColor: '#F4E5E3' },
  weekRowCopy: { flex: 1, marginHorizontal: spacing.md },
  weekRowTitle: { color: palette.text, fontSize: 14, fontWeight: '700' },
  weekRowTitleEmpty: { color: palette.sageDark },
  weekRowMeta: { color: palette.textMuted, fontSize: 11, marginTop: 4 },
  weekRowMetaImportant: { color: palette.danger, fontWeight: '800' },
  multipleMealActions: {
    borderTopColor: palette.border,
    borderTopWidth: 1,
    gap: spacing.xs,
    marginHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  multipleMealActionsTitle: {
    color: palette.textMuted,
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: spacing.sm,
  },
  multipleMealActionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 46,
  },
  multipleMealRecipe: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    minHeight: 44,
    paddingHorizontal: spacing.sm,
  },
  multipleMealImage: { borderRadius: radius.pill, height: 32, width: 32 },
  multipleMealCopy: { flex: 1, marginLeft: spacing.sm },
  multipleMealTitle: { color: palette.text, fontSize: 12, fontWeight: '700' },
  multipleMealMeta: { color: palette.textMuted, fontSize: 10, marginTop: 2 },
  multipleMealRemove: {
    alignItems: 'center',
    borderColor: palette.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    marginRight: spacing.sm,
    width: 36,
  },
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
