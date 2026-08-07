import { useLocalSearchParams, useRouter } from 'expo-router';
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
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/mealmate/app-icon';
import { ModalScreenHeader } from '@/components/mealmate/modal-screen-header';
import { RecipeImage } from '@/components/mealmate/recipe-image';
import { palette, radius, spacing } from '@/constants/mealmate-theme';
import { mealMateHaptics } from '@/lib/mealmate-haptics';
import { useMealMate } from '@/state/meal-mate-provider';

export default function MoveMealScreen() {
  const router = useRouter();
  const { sourceDayId, sourceMealPlanId, mealMemberId } = useLocalSearchParams<{
    sourceDayId?: string;
    sourceMealPlanId?: string;
    mealMemberId?: string;
  }>();
  const { weekDays, mealPlans, getRecipe, moveMeal } = useMealMate();
  const [movingToDayId, setMovingToDayId] = useState<string>();
  const sourceDay = weekDays.find((day) => day.isoDate === sourceDayId);
  const sourcePlan = sourceDay
    ? (mealPlans[sourceDay.isoDate] ?? []).find((plan) => plan.id === sourceMealPlanId)
    : undefined;
  const sourceRecipe = getRecipe(sourcePlan?.recipeId);

  const chooseDay = async (targetDayId: string, targetMealPlanId?: string) => {
    if (!sourceDay || !sourcePlan || movingToDayId) return;
    setMovingToDayId(targetDayId);
    try {
      await moveMeal(sourceDay.isoDate, targetDayId, sourcePlan.id, targetMealPlanId);
      mealMateHaptics.success();
      router.back();
    } catch (error) {
      mealMateHaptics.error();
      Alert.alert(
        'Verplaatsen mislukt',
        error instanceof Error ? error.message : 'Probeer het opnieuw.',
      );
    } finally {
      setMovingToDayId(undefined);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ModalScreenHeader title="Gerecht verplaatsen" closeLabel="Sluit verplaatsen" />
      {sourceDay && sourcePlan && sourceRecipe ? (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.eyebrow}>VAN {sourceDay.label.toUpperCase()}</Text>
          <View style={styles.sourceCard}>
            <RecipeImage recipe={sourceRecipe} style={styles.sourceImage} />
            <View style={styles.sourceCopy}>
              <Text style={styles.sourceTitle} numberOfLines={2}>{sourceRecipe.title}</Text>
              <Text style={styles.sourceMeta}>{sourceDay.date} {sourceDay.month}</Text>
            </View>
          </View>

          <Text style={styles.title}>Naar welke dag?</Text>
          <Text style={styles.subtitle}>
            Kies een lege dag om te verplaatsen. Staat er al een gerecht, dan wisselen de dagen.
          </Text>

          <View style={styles.dayOptions}>
            {weekDays.filter((day) => day.isoDate !== sourceDay.isoDate).map((day) => {
              const dayPlans = mealPlans[day.isoDate] ?? [];
              const targetPlan = typeof mealMemberId === 'string'
                ? dayPlans.find((plan) => plan.memberIds.includes(mealMemberId))
                : dayPlans.length === 1
                  ? dayPlans[0]
                  : undefined;
              const targetRecipe = getRecipe(targetPlan?.recipeId);
              const hasAmbiguousPlans = dayPlans.length > 0 && !targetPlan;
              const sameRecipe = targetPlan?.recipeId === sourcePlan.recipeId;
              const sourceOtherMemberIds = new Set(
                (mealPlans[sourceDay.isoDate] ?? [])
                  .filter((plan) => plan.id !== sourcePlan.id)
                  .flatMap((plan) => plan.memberIds),
              );
              const targetOtherMemberIds = new Set(
                dayPlans
                  .filter((plan) => plan.id !== targetPlan?.id)
                  .flatMap((plan) => plan.memberIds),
              );
              const hasAssignmentConflict = targetPlan ? (
                targetPlan.memberIds.some((memberId) => sourceOtherMemberIds.has(memberId)) ||
                sourcePlan.memberIds.some((memberId) => targetOtherMemberIds.has(memberId))
              ) : false;
              const disabled = Boolean(movingToDayId) || hasAmbiguousPlans ||
                sameRecipe || hasAssignmentConflict;
              const isMovingHere = movingToDayId === day.isoDate;
              const status = hasAmbiguousPlans || hasAssignmentConflict
                ? 'Kies deze dag eerst in de planning'
                : sameRecipe
                  ? 'Dit gerecht staat hier al'
                  : targetRecipe
                    ? `Wissel met ${targetRecipe.title}`
                    : 'Verplaats naar deze dag';

              return (
                <Pressable
                  key={day.isoDate}
                  disabled={disabled}
                  onPress={() => void chooseDay(day.isoDate, targetPlan?.id)}
                  accessibilityRole="button"
                  accessibilityState={{ disabled }}
                  accessibilityLabel={`${day.label} ${day.date} ${day.month}. ${status}`}
                  style={({ pressed }) => [
                    styles.dayOption,
                    disabled && styles.dayOptionDisabled,
                    pressed && styles.pressed,
                  ]}>
                  <View style={styles.dateBadge}>
                    <Text style={styles.dateDay}>{day.short}</Text>
                    <Text style={styles.dateNumber}>{day.date}</Text>
                  </View>
                  {targetRecipe ? (
                    <RecipeImage recipe={targetRecipe} style={styles.targetImage} />
                  ) : (
                    <View style={styles.emptyTarget}>
                      <AppIcon
                        name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
                        tintColor={palette.sageDark}
                        size={18}
                      />
                    </View>
                  )}
                  <View style={styles.dayCopy}>
                    <Text style={styles.dayTitle}>{day.label}</Text>
                    <Text style={styles.dayStatus} numberOfLines={2}>{status}</Text>
                  </View>
                  {isMovingHere ? (
                    <ActivityIndicator color={palette.sageDark} size="small" />
                  ) : (
                    <AppIcon
                      name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                      tintColor={disabled ? palette.textSoft : palette.sageDark}
                      size={17}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Gerecht niet gevonden</Text>
          <Text style={styles.emptyText}>De weekplanning is intussen gewijzigd.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: palette.background, flex: 1 },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl },
  eyebrow: { color: palette.sage, fontSize: 11, fontWeight: '800', letterSpacing: 1.1 },
  sourceCard: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: spacing.sm,
    padding: spacing.sm,
  },
  sourceImage: { borderRadius: radius.md, height: 64, width: 64 },
  sourceCopy: { flex: 1, marginLeft: spacing.md },
  sourceTitle: { color: palette.text, fontSize: 16, fontWeight: '700', lineHeight: 21 },
  sourceMeta: { color: palette.textMuted, fontSize: 12, marginTop: 4 },
  title: { color: palette.text, fontSize: 25, fontWeight: '700', marginTop: spacing.xxl },
  subtitle: { color: palette.textMuted, fontSize: 14, lineHeight: 20, marginTop: 6 },
  dayOptions: { gap: spacing.sm, marginTop: spacing.xl },
  dayOption: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 70,
    padding: spacing.sm,
  },
  dayOptionDisabled: { opacity: 0.46 },
  dateBadge: { alignItems: 'center', justifyContent: 'center', width: 44 },
  dateDay: { color: palette.textMuted, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  dateNumber: { color: palette.text, fontSize: 20, fontWeight: '800', marginTop: 2 },
  targetImage: { borderRadius: radius.pill, height: 42, marginLeft: spacing.xs, width: 42 },
  emptyTarget: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderRadius: radius.pill,
    height: 42,
    justifyContent: 'center',
    marginLeft: spacing.xs,
    width: 42,
  },
  dayCopy: { flex: 1, marginHorizontal: spacing.md },
  dayTitle: { color: palette.text, fontSize: 14, fontWeight: '700' },
  dayStatus: { color: palette.textMuted, fontSize: 12, lineHeight: 16, marginTop: 3 },
  pressed: { opacity: 0.7 },
  emptyState: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: spacing.xl },
  emptyTitle: { color: palette.text, fontSize: 18, fontWeight: '700' },
  emptyText: { color: palette.textMuted, fontSize: 14, marginTop: spacing.sm, textAlign: 'center' },
});
