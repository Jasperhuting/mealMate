import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/mealmate/app-icon';
import { ModalScreenHeader } from '@/components/mealmate/modal-screen-header';
import { UserAvatar } from '@/components/mealmate/user-avatar';
import { palette, radius, spacing } from '@/constants/mealmate-theme';
import { mealMateHaptics } from '@/lib/mealmate-haptics';
import { useAuth } from '@/state/auth-provider';
import { useMealMate } from '@/state/meal-mate-provider';

export default function MealAttendanceScreen() {
  const { dayId } = useLocalSearchParams<{ dayId?: string }>();
  const { session } = useAuth();
  const {
    weekDays,
    plannedMeals,
    getRecipe,
    familyMembers,
    mealAttendance,
    setMealAttendance,
  } = useMealMate();
  const [updatingMemberId, setUpdatingMemberId] = useState<string>();
  const day = weekDays.find(
    (weekDay) => weekDay.isoDate === (typeof dayId === 'string' ? dayId : undefined),
  );
  const recipe = day ? getRecipe(plannedMeals[day.isoDate]) : undefined;
  const currentMember = familyMembers.find(
    (member) =>
      member.linkedUserId === session?.user.id ||
      (Boolean(member.email) &&
        member.email?.trim().toLowerCase() === session?.user.email?.trim().toLowerCase()),
  );
  const orderedMembers = currentMember
    ? [currentMember, ...familyMembers.filter((member) => member.id !== currentMember.id)]
    : familyMembers;

  const toggleAttendance = async (memberId: string, isEating: boolean) => {
    if (!day || updatingMemberId) return;
    setUpdatingMemberId(memberId);
    try {
      await setMealAttendance(day.isoDate, memberId, !isEating);
      mealMateHaptics.selection();
    } catch {
      mealMateHaptics.error();
      Alert.alert('Aanwezigheid opslaan mislukt', 'Probeer het opnieuw.');
    } finally {
      setUpdatingMemberId(undefined);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ModalScreenHeader title="Aanwezigheid" closeLabel="Sluit aanwezigheid" />
      {day ? (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.eyebrow}>AANWEZIGHEID</Text>
          <Text style={styles.title}>Wie eet er mee op {day.label.toLowerCase()}?</Text>
          {recipe ? <Text style={styles.subtitle}>{recipe.title}</Text> : null}

          <View style={styles.options}>
            {orderedMembers.map((member) => {
              const isCurrentMember = member.id === currentMember?.id;
              const isEating = mealAttendance[day.isoDate]?.[member.id] !== false;
              const isUpdating = updatingMemberId === member.id;
              return (
                <Pressable
                  key={member.id}
                  disabled={Boolean(updatingMemberId)}
                  onPress={() => void toggleAttendance(member.id, isEating)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isEating, disabled: Boolean(updatingMemberId) }}
                  accessibilityLabel={`${isCurrentMember ? 'Jij' : member.name} eet ${isEating ? 'wel' : 'niet'} mee`}
                  style={({ pressed }) => [
                    styles.option,
                    isEating && styles.optionSelected,
                    pressed && styles.pressed,
                  ]}>
                  {member.avatarUrl ? (
                    <UserAvatar initial={member.initials.slice(0, 1)} size={30} uri={member.avatarUrl} />
                  ) : (
                    <View style={[styles.memberDot, { backgroundColor: member.color }]} />
                  )}
                  <View style={styles.optionCopy}>
                    <Text style={[styles.optionName, isEating && styles.optionNameSelected]}>
                      {isCurrentMember ? 'Jij' : member.name}
                    </Text>
                    <Text style={styles.optionStatus}>{isEating ? 'Eet mee' : 'Eet niet mee'}</Text>
                  </View>
                  {isUpdating ? (
                    <ActivityIndicator color={palette.sageDark} size="small" />
                  ) : (
                    <View style={[styles.checkbox, isEating && styles.checkboxSelected]}>
                      {isEating ? (
                        <AppIcon
                          name={{ ios: 'checkmark', android: 'check', web: 'check' }}
                          tintColor={palette.white}
                          size={14}
                        />
                      ) : null}
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Dag niet gevonden</Text>
          <Text style={styles.emptyText}>Deze dag staat niet meer in het geopende weekmenu.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xl },
  eyebrow: { color: palette.sage, fontSize: 11, fontWeight: '800', letterSpacing: 1.1 },
  title: { color: palette.text, fontSize: 28, fontWeight: '700', lineHeight: 34, marginTop: 6 },
  subtitle: { color: palette.textMuted, fontSize: 15, lineHeight: 20, marginTop: 6 },
  options: { gap: spacing.sm, marginTop: spacing.xl },
  option: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 64,
    paddingHorizontal: spacing.lg,
  },
  optionSelected: { backgroundColor: palette.sageSoft, borderColor: palette.sage },
  memberDot: { borderRadius: radius.pill, height: 10, width: 10 },
  optionCopy: { flex: 1, marginLeft: spacing.md },
  optionName: { color: palette.text, fontSize: 15, fontWeight: '700' },
  optionNameSelected: { color: palette.sageDark },
  optionStatus: { color: palette.textMuted, fontSize: 12, marginTop: 3 },
  checkbox: {
    alignItems: 'center',
    borderColor: palette.border,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  checkboxSelected: { backgroundColor: palette.sageDark, borderColor: palette.sageDark },
  pressed: { opacity: 0.7 },
  emptyState: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: spacing.xl },
  emptyTitle: { color: palette.text, fontSize: 18, fontWeight: '700' },
  emptyText: { color: palette.textMuted, fontSize: 14, marginTop: spacing.sm, textAlign: 'center' },
});
