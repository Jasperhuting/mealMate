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
import { UserAvatar } from '@/components/mealmate/user-avatar';
import { palette, radius, shadow, spacing } from '@/constants/mealmate-theme';
import { mealMateHaptics } from '@/lib/mealmate-haptics';
import { useAuth } from '@/state/auth-provider';
import { useMealMate } from '@/state/meal-mate-provider';

export default function RateRecipeScreen() {
  const { recipeId } = useLocalSearchParams<{ recipeId: string }>();
  const router = useRouter();
  const { session } = useAuth();
  const { getRecipe, ratings, familyMembers, rateRecipe } = useMealMate();
  const recipe = getRecipe(typeof recipeId === 'string' ? recipeId : undefined);
  const currentMember = familyMembers.find(
    (member) =>
      member.linkedUserId === session?.user.id ||
      (Boolean(member.email) &&
        member.email?.trim().toLowerCase() === session?.user.email?.trim().toLowerCase()),
  );
  const otherMembers = familyMembers.filter((member) => member.id !== currentMember?.id);
  const savedScore = currentMember ? ratings[recipe?.id ?? '']?.[currentMember.id] ?? 0 : 0;
  const [draftScore, setDraftScore] = useState(savedScore);
  const [isSaving, setIsSaving] = useState(false);

  if (!recipe) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ModalScreenHeader title="Gerecht beoordelen" closeLabel="Sluit gerecht beoordelen" />
        <Text style={styles.notFound}>Dit gerecht kon niet worden gevonden.</Text>
      </SafeAreaView>
    );
  }

  if (familyMembers.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ModalScreenHeader title="Gerecht beoordelen" closeLabel="Sluit gerecht beoordelen" />
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <AppIcon
              name={{ ios: 'person.2.fill', android: 'groups', web: 'groups' }}
              tintColor={palette.sageDark}
              size={26}
            />
          </View>
          <Text style={styles.emptyTitle}>Stel eerst je gezin in</Text>
          <Text style={styles.emptyText}>
            Voeg gezinsleden toe om iedereen een eigen beoordeling te laten geven.
          </Text>
          <Pressable
            onPress={() => router.replace('/family-sharing')}
            accessibilityRole="button"
            accessibilityLabel="Gezin instellen"
            style={({ pressed }) => [styles.emptyButton, pressed && styles.pressed]}>
            <Text style={styles.saveText}>Gezin instellen</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentMember) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ModalScreenHeader title="Gerecht beoordelen" closeLabel="Sluit gerecht beoordelen" />
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <AppIcon
              name={{ ios: 'person.crop.circle.badge.exclamationmark', android: 'person_alert', web: 'person_alert' }}
              tintColor={palette.sageDark}
              size={28}
            />
          </View>
          <Text style={styles.emptyTitle}>Jouw profiel is nog niet gekoppeld</Text>
          <Text style={styles.emptyText}>
            Accepteer eerst je gezinsuitnodiging om je eigen beoordeling te kunnen geven.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const save = async () => {
    if (!draftScore || isSaving) return;
    setIsSaving(true);
    try {
      await rateRecipe(recipe.id, currentMember.id, draftScore);
      mealMateHaptics.success();
      router.back();
    } catch {
      mealMateHaptics.error();
      Alert.alert(
        'Beoordeling niet opgeslagen',
        'Alleen je eigen beoordeling kan worden aangepast. Probeer het opnieuw.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ModalScreenHeader title="Gerecht beoordelen" closeLabel="Sluit gerecht beoordelen" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <RecipeImage recipe={recipe} style={styles.heroImage} />
        <Text style={styles.eyebrow}>JOUW SMAAK</Text>
        <Text style={styles.title}>Hoe vond jij {recipe.title}?</Text>
        <Text style={styles.subtitle}>
          Je beoordeling is persoonlijk. Andere gezinsleden beheren alleen hun eigen score.
        </Text>

        <View style={styles.ownRating}>
          <UserAvatar initial={currentMember.initials} size={52} uri={currentMember.avatarUrl} />
          <Text style={styles.ownLabel}>Jouw beoordeling</Text>
          <Text style={styles.scoreHint}>
            {draftScore ? `${draftScore} van 5 sterren` : 'Kies het aantal sterren'}
          </Text>
          <View style={styles.stars} accessibilityRole="radiogroup">
            {[1, 2, 3, 4, 5].map((score) => {
              const selected = score <= draftScore;
              return (
                <Pressable
                  key={score}
                  onPress={() => {
                    setDraftScore(score);
                    mealMateHaptics.selection();
                  }}
                  hitSlop={5}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: draftScore === score }}
                  accessibilityLabel={`${score} sterren voor ${recipe.title}`}>
                  <AppIcon
                    name={{
                      ios: selected ? 'star.fill' : 'star',
                      android: selected ? 'star' : 'star_outline',
                      web: selected ? 'star' : 'star_outline',
                    }}
                    tintColor={selected ? palette.star : palette.border}
                    size={30}
                    fallback={selected ? '★' : '☆'}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>

        {otherMembers.length > 0 ? (
          <View style={styles.otherSection}>
            <Text style={styles.sectionTitle}>Beoordelingen van anderen</Text>
            <Text style={styles.sectionText}>Deze scores kunnen alleen zijzelf aanpassen.</Text>
            <View style={styles.otherCard}>
              {otherMembers.map((member, index) => {
                const score = ratings[recipe.id]?.[member.id];
                const isPending = member.invitationStatus === 'pending';
                return (
                  <View
                    key={member.id}
                    style={[styles.otherRow, index > 0 && styles.otherRowDivider]}>
                    <UserAvatar
                      initial={member.initials.slice(0, 1)}
                      size={34}
                      uri={member.avatarUrl}
                    />
                    <View style={styles.otherCopy}>
                      <Text style={styles.otherName}>{member.name}</Text>
                      <Text style={styles.otherStatus}>
                        {isPending
                          ? 'Kan beoordelen na accepteren'
                          : score
                            ? 'Persoonlijke beoordeling'
                            : 'Nog niet beoordeeld'}
                      </Text>
                    </View>
                    <View style={styles.readOnlyScore}>
                      <AppIcon
                        name={{ ios: 'star.fill', android: 'star', web: 'star' }}
                        tintColor={score ? palette.star : palette.textSoft}
                        size={16}
                      />
                      <Text style={[styles.readOnlyScoreText, !score && styles.readOnlyScoreEmpty]}>
                        {score ?? '–'}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.stickyFooter}>
        <Pressable
          onPress={() => void save()}
          disabled={!draftScore || isSaving}
          accessibilityRole="button"
          accessibilityState={{ disabled: !draftScore || isSaving }}
          style={({ pressed }) => [
            styles.saveButton,
            (!draftScore || isSaving) && styles.saveButtonDisabled,
            pressed && styles.pressed,
          ]}>
          {isSaving ? (
            <ActivityIndicator color={palette.white} />
          ) : (
            <Text style={styles.saveText}>Beoordeling bewaren</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: palette.background, flex: 1 },
  scrollView: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl },
  heroImage: { borderRadius: radius.lg, height: 150, width: '100%' },
  eyebrow: {
    color: palette.sage,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
    marginTop: spacing.xl,
  },
  title: {
    color: palette.text,
    fontSize: 27,
    fontWeight: '700',
    letterSpacing: -0.6,
    lineHeight: 32,
    marginTop: 6,
  },
  subtitle: { color: palette.textMuted, fontSize: 15, lineHeight: 20, marginTop: spacing.sm },
  ownRating: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    marginTop: spacing.xl,
    padding: spacing.lg,
  },
  avatar: {
    alignItems: 'center',
    borderRadius: radius.pill,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  avatarText: { color: palette.white, fontSize: 12, fontWeight: '800' },
  ownLabel: { color: palette.text, fontSize: 17, fontWeight: '700', marginTop: spacing.sm },
  scoreHint: { color: palette.textMuted, fontSize: 12, marginTop: 4 },
  stars: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  otherSection: { marginTop: spacing.xxl },
  sectionTitle: { color: palette.text, fontSize: 19, fontWeight: '700' },
  sectionText: { color: palette.textMuted, fontSize: 13, marginTop: 4 },
  otherCard: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  otherRow: { alignItems: 'center', flexDirection: 'row', minHeight: 66 },
  otherRowDivider: { borderTopColor: palette.border, borderTopWidth: 1 },
  smallAvatar: {
    alignItems: 'center',
    borderRadius: radius.pill,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  smallAvatarText: { color: palette.white, fontSize: 10, fontWeight: '800' },
  otherCopy: { flex: 1, marginLeft: spacing.md },
  otherName: { color: palette.text, fontSize: 14, fontWeight: '700' },
  otherStatus: { color: palette.textMuted, fontSize: 11, marginTop: 3 },
  readOnlyScore: {
    alignItems: 'center',
    backgroundColor: palette.surfaceMuted,
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: 4,
    minWidth: 52,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  readOnlyScoreText: { color: palette.star, fontSize: 12, fontWeight: '800' },
  readOnlyScoreEmpty: { color: palette.textSoft },
  stickyFooter: {
    ...shadow.card,
    backgroundColor: palette.background,
    borderTopColor: palette.border,
    borderTopWidth: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: palette.sageDark,
    borderRadius: radius.pill,
    justifyContent: 'center',
    minHeight: 50,
  },
  saveButtonDisabled: { backgroundColor: palette.textSoft },
  saveText: { color: palette.white, fontSize: 15, fontWeight: '800' },
  pressed: { opacity: 0.72 },
  notFound: { color: palette.text, fontSize: 16, padding: spacing.xl },
  emptyState: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: spacing.xl },
  emptyIcon: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderRadius: radius.pill,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  emptyTitle: { color: palette.text, fontSize: 22, fontWeight: '700', marginTop: spacing.lg, textAlign: 'center' },
  emptyText: {
    color: palette.textMuted,
    fontSize: 15,
    lineHeight: 21,
    marginTop: spacing.sm,
    maxWidth: 310,
    textAlign: 'center',
  },
  emptyButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: palette.sageDark,
    borderRadius: radius.pill,
    marginTop: spacing.xl,
    paddingVertical: 16,
  },
});
