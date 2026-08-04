import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/mealmate/app-icon';
import { getMealMateTabBarContentInset } from '@/components/mealmate/meal-mate-tab-bar';
import { ScreenHeader } from '@/components/mealmate/screen-header';
import { palette, radius, shadow, spacing } from '@/constants/mealmate-theme';
import { useAuth } from '@/state/auth-provider';
import { useMealMate } from '@/state/meal-mate-provider';

export default function FamilyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session, signOut, deleteAccount } = useAuth();
  const { familyMembers, ratings, recipes, plannedMeals, weekDays, getRecipe } = useMealMate();
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const hasFamilyMembers = familyMembers.length > 0;

  const removeAccount = async () => {
    setIsDeletingAccount(true);
    try {
      await deleteAccount();
    } catch {
      Alert.alert(
        'Account verwijderen mislukt',
        'Je account is niet verwijderd. Controleer je internetverbinding en probeer het opnieuw.',
      );
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const confirmAccountRemoval = () => {
    Alert.alert(
      'Account verwijderen?',
      'Hiermee verwijder je jouw MealMate-account en de recepten, planningen en boodschappen die jij hebt aangemaakt. Dit kan niet ongedaan worden gemaakt.',
      [
        { text: 'Annuleer', style: 'cancel' },
        {
          text: 'Ga door',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Definitief verwijderen?',
              'Weet je zeker dat je jouw account permanent wilt verwijderen?',
              [
                { text: 'Toch behouden', style: 'cancel' },
                {
                  text: 'Verwijder account',
                  style: 'destructive',
                  onPress: () => void removeAccount(),
                },
              ],
            );
          },
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
        showsVerticalScrollIndicator={false}>
        <ScreenHeader
          eyebrow="SAMEN PLANNEN"
          title="Ons gezin"
          subtitle="Deel één weekmenu, boodschappenlijst en receptencollectie met je gezin."
        />

        {hasFamilyMembers ? (
          <>
            <View style={styles.householdCard}>
              <View style={styles.familyAvatars}>
                {familyMembers.map((member, index) => (
                  <View
                    key={member.id}
                    style={[
                      styles.bigAvatar,
                      { backgroundColor: member.color, marginLeft: index ? -12 : 0 },
                    ]}>
                    <Text style={styles.bigAvatarText}>{member.initials}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.householdTitle}>Ons MealMate-gezin</Text>
              <Text style={styles.householdMeta}>
                {familyMembers.length} {familyMembers.length === 1 ? 'lid' : 'leden'} · {recipes.length} gedeelde recepten
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Persoonlijke smaak</Text>
            <View style={styles.memberList}>
              {familyMembers.map((member) => {
                const scores = recipes
                  .map((recipe) => ratings[recipe.id]?.[member.id])
                  .filter((score): score is number => typeof score === 'number');
                const average = scores.length
                  ? (scores.reduce((total, score) => total + score, 0) / scores.length).toFixed(1)
                  : '–';
                return (
                  <View key={member.id} style={styles.memberCard}>
                    <View style={[styles.memberAvatar, { backgroundColor: member.color }]}>
                      <Text style={styles.memberAvatarText}>{member.initials}</Text>
                    </View>
                    <View style={styles.memberCopy}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      <Text style={styles.memberMeta}>{scores.length} gerechten beoordeeld</Text>
                    </View>
                    <View style={styles.averagePill}>
                      <Text style={styles.averageText}>★ {average}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        ) : (
          <View style={styles.onboardingCard}>
            <View style={styles.onboardingIcon}>
              <AppIcon
                name={{ ios: 'person.2.fill', android: 'groups', web: 'groups' }}
                tintColor={palette.sageDark}
              />
            </View>
            <Text style={styles.onboardingEyebrow}>SAMEN BEGINNEN</Text>
            <Text style={styles.onboardingTitle}>Eet samen in MealMate</Text>
            <Text style={styles.onboardingText}>
              Nodig iemand uit of word lid met een code. Daarna delen jullie het weekmenu,
              recepten en de boodschappenlijst.
            </Text>
            <Text style={styles.onboardingMeta}>{recipes.length} recepten staan al klaar</Text>
            <Pressable
              onPress={() => router.push('/family-sharing')}
              accessibilityRole="button"
              style={({ pressed }) => [styles.onboardingButton, pressed && styles.pressed]}>
              <Text style={styles.onboardingButtonText}>Gezin instellen</Text>
              <AppIcon
                name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
                tintColor={palette.white}
                size={18}
              />
            </Pressable>
          </View>
        )}

        <Text style={styles.sectionTitle}>Deze week samen</Text>
        <View style={styles.timelineCard}>
          {weekDays
            .filter((day) => plannedMeals[day.isoDate])
            .map((day, index, plannedDays) => {
              const recipe = getRecipe(plannedMeals[day.isoDate]);
              return (
                <View key={day.id} style={styles.timelineRow}>
                  <View style={styles.timelineRail}>
                    <View style={styles.timelineDot} />
                    {index < plannedDays.length - 1 ? <View style={styles.timelineLine} /> : null}
                  </View>
                  <View style={styles.timelineCopy}>
                    <Text style={styles.timelineDay}>{day.label}</Text>
                    <Text style={styles.timelineMeal}>{recipe?.title}</Text>
                  </View>
                  <AppIcon
                    name={{ ios: 'person.2.fill', android: 'groups', web: 'groups' }}
                    tintColor={palette.textSoft}
                    size={18}
                  />
                </View>
              );
            })}
        </View>

        {hasFamilyMembers ? (
          <Pressable
            onPress={() => router.push('/family-sharing')}
            accessibilityRole="button"
            style={({ pressed }) => [styles.inviteCard, pressed && styles.pressed]}>
            <AppIcon
              name={{ ios: 'person.badge.plus', android: 'group_add', web: 'group_add' }}
              tintColor={palette.sageDark}
              fallback="+"
            />
            <View style={styles.inviteCopy}>
              <Text style={styles.inviteTitle}>Gezin beheren</Text>
              <Text style={styles.inviteText}>Nodig iemand uit of word lid met een code.</Text>
            </View>
            <AppIcon
              name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
              tintColor={palette.textSoft}
              size={18}
            />
          </Pressable>
        ) : null}

        <View style={styles.accountCard}>
          <View style={styles.accountIcon}>
            <AppIcon
              name={{ ios: 'person.crop.circle', android: 'account_circle', web: 'account_circle' }}
              tintColor={palette.sageDark}
            />
          </View>
          <View style={styles.accountCopy}>
            <Text style={styles.accountTitle}>Jouw account</Text>
            <Text style={styles.accountText}>{session?.user.email ?? 'Ingelogd bij MealMate'}</Text>
          </View>
          <Pressable
            onPress={() => {
              Alert.alert('Uitloggen?', 'Je kunt later opnieuw inloggen met e-mail, Apple of Google.', [
                { text: 'Annuleer', style: 'cancel' },
                { text: 'Log uit', style: 'destructive', onPress: () => void signOut() },
              ]);
            }}
            accessibilityRole="button"
            style={({ pressed }) => [styles.signOutButton, pressed && styles.pressed]}>
            <Text style={styles.signOutText}>Log uit</Text>
          </Pressable>
        </View>

        <View style={styles.dangerCard}>
          <View style={styles.dangerIcon}>
            <AppIcon
              name={{ ios: 'trash', android: 'delete_outline', web: 'delete_outline' }}
              tintColor={palette.danger}
              size={20}
            />
          </View>
          <View style={styles.dangerCopy}>
            <Text style={styles.dangerTitle}>Account verwijderen</Text>
            <Text style={styles.dangerText}>Verwijder je account en jouw gegevens definitief.</Text>
          </View>
          <Pressable
            onPress={confirmAccountRemoval}
            disabled={isDeletingAccount}
            accessibilityRole="button"
            accessibilityLabel="Account definitief verwijderen"
            style={({ pressed }) => [
              styles.deleteButton,
              (pressed || isDeletingAccount) && styles.pressed,
            ]}>
            {isDeletingAccount ? (
              <ActivityIndicator color={palette.danger} size="small" />
            ) : (
              <Text style={styles.deleteButtonText}>Verwijder</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.xl },
  onboardingCard: {
    ...shadow.card,
    backgroundColor: palette.sageSoft,
    borderRadius: radius.lg,
    marginTop: spacing.xl,
    padding: spacing.lg,
  },
  onboardingIcon: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: radius.md,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  onboardingEyebrow: {
    color: palette.sage,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1,
    marginTop: spacing.lg,
  },
  onboardingTitle: {
    color: palette.text,
    fontSize: 21,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginTop: spacing.xs,
  },
  onboardingText: {
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  onboardingMeta: {
    color: palette.sageDark,
    fontSize: 12,
    fontWeight: '700',
    marginTop: spacing.md,
  },
  onboardingButton: {
    alignItems: 'center',
    backgroundColor: palette.sageDark,
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.lg,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
  },
  onboardingButtonText: { color: palette.white, fontSize: 15, fontWeight: '700' },
  householdCard: {
    ...shadow.card,
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderRadius: radius.lg,
    marginTop: spacing.xl,
    padding: spacing.xl,
  },
  familyAvatars: { flexDirection: 'row', marginBottom: spacing.md },
  bigAvatar: {
    alignItems: 'center',
    borderColor: palette.sageSoft,
    borderRadius: radius.pill,
    borderWidth: 3,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  bigAvatarText: { color: palette.white, fontSize: 13, fontWeight: '800' },
  householdTitle: { color: palette.text, fontSize: 19, fontWeight: '700' },
  householdMeta: { color: palette.textMuted, fontSize: 13, marginTop: spacing.sm },
  sectionTitle: { color: palette.text, fontSize: 19, fontWeight: '700', marginBottom: spacing.md, marginTop: spacing.xl },
  memberList: { gap: spacing.md },
  memberCard: {
    ...shadow.card,
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    flexDirection: 'row',
    padding: spacing.lg,
  },
  memberAvatar: { alignItems: 'center', borderRadius: radius.pill, height: 46, justifyContent: 'center', width: 46 },
  memberAvatarText: { color: palette.white, fontSize: 12, fontWeight: '800' },
  memberCopy: { flex: 1, marginLeft: spacing.md },
  memberName: { color: palette.text, fontSize: 16, fontWeight: '700' },
  memberMeta: { color: palette.textMuted, fontSize: 12, marginTop: 4 },
  averagePill: { backgroundColor: palette.surfaceMuted, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 6 },
  averageText: { color: palette.star, fontSize: 13, fontWeight: '700' },
  timelineCard: { ...shadow.card, backgroundColor: palette.surface, borderRadius: radius.lg, padding: spacing.md },
  timelineRow: { alignItems: 'flex-start', flexDirection: 'row', minHeight: 50 },
  timelineRail: { alignItems: 'center', alignSelf: 'stretch', width: 24 },
  timelineDot: { backgroundColor: palette.sage, borderRadius: radius.pill, height: 9, marginTop: 5, width: 9 },
  timelineLine: { backgroundColor: palette.border, flex: 1, marginVertical: 4, width: 1 },
  timelineCopy: { flex: 1, marginLeft: spacing.md },
  timelineDay: { color: palette.sage, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  timelineMeal: { color: palette.text, fontSize: 15, fontWeight: '600', marginTop: 4 },
  inviteCard: {
    alignItems: 'center',
    borderColor: palette.border,
    borderRadius: radius.lg,
    borderStyle: 'dashed',
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: spacing.xl,
    padding: spacing.md,
  },
  inviteCopy: { flex: 1, marginLeft: spacing.md },
  inviteTitle: { color: palette.text, fontSize: 15, fontWeight: '700' },
  inviteText: { color: palette.textMuted, fontSize: 12, marginTop: 4 },
  accountCard: { alignItems: 'center', backgroundColor: palette.surface, borderRadius: radius.lg, flexDirection: 'row', marginTop: spacing.md, padding: spacing.lg },
  accountIcon: { alignItems: 'center', backgroundColor: palette.sageSoft, borderRadius: radius.md, height: 42, justifyContent: 'center', width: 42 },
  accountCopy: { flex: 1, marginLeft: spacing.md },
  accountTitle: { color: palette.text, fontSize: 14, fontWeight: '700' },
  accountText: { color: palette.textMuted, fontSize: 11, marginTop: 4 },
  signOutButton: { paddingHorizontal: spacing.sm, paddingVertical: spacing.md },
  signOutText: { color: palette.danger, fontSize: 13, fontWeight: '700' },
  dangerCard: {
    alignItems: 'center',
    borderColor: '#E5C9C6',
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: spacing.md,
    padding: spacing.lg,
  },
  dangerIcon: {
    alignItems: 'center',
    backgroundColor: '#F4E5E3',
    borderRadius: radius.md,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  dangerCopy: { flex: 1, marginLeft: spacing.md },
  dangerTitle: { color: palette.danger, fontSize: 14, fontWeight: '700' },
  dangerText: { color: palette.textMuted, fontSize: 11, lineHeight: 16, marginTop: 4 },
  deleteButton: { minWidth: 68, paddingHorizontal: spacing.sm, paddingVertical: spacing.md },
  deleteButtonText: { color: palette.danger, fontSize: 13, fontWeight: '700', textAlign: 'center' },
  pressed: { opacity: 0.7 },
});
