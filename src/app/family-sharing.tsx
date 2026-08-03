import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/mealmate/app-icon';
import { palette, radius, shadow, spacing } from '@/constants/mealmate-theme';
import {
  createHouseholdInvite,
  joinHousehold,
  type HouseholdInvite,
} from '@/lib/family-sharing';
import { useMealMate } from '@/state/meal-mate-provider';

export default function FamilySharingScreen() {
  const router = useRouter();
  const { reloadHousehold } = useMealMate();
  const [invite, setInvite] = useState<HouseholdInvite | null>(null);
  const [joinCode, setJoinCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const createInvite = async () => {
    setIsCreating(true);
    try {
      setInvite(await createHouseholdInvite());
    } catch {
      Alert.alert('Uitnodiging mislukt', 'Probeer het over een moment opnieuw.');
    } finally {
      setIsCreating(false);
    }
  };

  const shareInvite = async () => {
    if (!invite) return;
    await Share.share({
      message: `Word lid van mijn gezin in MealMate. Open Gezin > Iemand uitnodigen en vul deze code in: ${invite.code}`,
    });
  };

  const join = async () => {
    const cleanCode = joinCode.trim();
    if (cleanCode.replace(/[^a-zA-Z0-9]/g, '').length !== 8) {
      Alert.alert('Controleer de code', 'Een uitnodigingscode bestaat uit acht tekens.');
      return;
    }
    setIsJoining(true);
    try {
      await joinHousehold(cleanCode);
      await reloadHousehold();
      Alert.alert(
        'Welkom in het gezin',
        'Het gedeelde weekmenu, de recepten en boodschappen staan nu op dit toestel.',
        [{ text: 'Bekijk gezin', onPress: () => router.back() }],
      );
    } catch (error) {
      Alert.alert(
        'Deelnemen mislukt',
        error instanceof Error ? error.message : 'Probeer het nog een keer.',
      );
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={88}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text style={styles.eyebrow}>SAMEN IN MEALMATE</Text>
          <Text style={styles.title}>Deel jullie gezin</Text>
          <Text style={styles.subtitle}>
            Met één code gebruiken jullie hetzelfde weekmenu, dezelfde recepten en dezelfde boodschappenlijst.
          </Text>

          <View style={styles.card}>
            <View style={styles.cardIcon}>
              <AppIcon
                name={{ ios: 'person.badge.plus', android: 'group_add', web: 'group_add' }}
                tintColor={palette.sageDark}
                fallback="+"
              />
            </View>
            <Text style={styles.cardTitle}>Nodig iemand uit</Text>
            <Text style={styles.cardText}>
              Maak een eenmalige code. De code blijft zeven dagen geldig.
            </Text>

            {invite ? (
              <>
                <View style={styles.codeCard}>
                  <Text style={styles.codeLabel}>JULLIE CODE</Text>
                  <Text selectable style={styles.code}>{invite.code}</Text>
                </View>
                <Pressable
                  onPress={() => void shareInvite()}
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
                  <AppIcon
                    name={{ ios: 'square.and.arrow.up', android: 'share', web: 'share' }}
                    tintColor={palette.white}
                    size={19}
                  />
                  <Text style={styles.primaryText}>Deel de code</Text>
                </Pressable>
              </>
            ) : (
              <Pressable
                onPress={() => void createInvite()}
                disabled={isCreating}
                accessibilityRole="button"
                style={({ pressed }) => [styles.primaryButton, (pressed || isCreating) && styles.pressed]}>
                {isCreating ? (
                  <ActivityIndicator color={palette.white} />
                ) : (
                  <Text style={styles.primaryText}>Maak uitnodigingscode</Text>
                )}
              </Pressable>
            )}
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OF</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.card}>
            <View style={styles.cardIcon}>
              <AppIcon
                name={{ ios: 'person.2', android: 'groups', web: 'groups' }}
                tintColor={palette.sageDark}
              />
            </View>
            <Text style={styles.cardTitle}>Word lid van een gezin</Text>
            <Text style={styles.cardText}>Vul de code in die je van je partner hebt gekregen.</Text>
            <TextInput
              value={joinCode}
              onChangeText={(value) => setJoinCode(value.toUpperCase())}
              placeholder="ABCD-EF12"
              placeholderTextColor={palette.textSoft}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={9}
              style={styles.codeInput}
              accessibilityLabel="Uitnodigingscode"
            />
            <Pressable
              onPress={() => void join()}
              disabled={isJoining}
              accessibilityRole="button"
              style={({ pressed }) => [styles.secondaryButton, (pressed || isJoining) && styles.pressed]}>
              {isJoining ? (
                <ActivityIndicator color={palette.sageDark} />
              ) : (
                <Text style={styles.secondaryText}>Word lid van dit gezin</Text>
              )}
            </Pressable>
          </View>

          <Text style={styles.privacyText}>
            Alleen mensen met een geldige code kunnen één keer deelnemen. Je eerdere MealMate-gegevens worden niet verwijderd.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  keyboardView: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  eyebrow: { color: palette.sage, fontSize: 11, fontWeight: '800', letterSpacing: 1.1 },
  title: { color: palette.text, fontSize: 30, fontWeight: '700', letterSpacing: -0.7, marginTop: spacing.sm },
  subtitle: { color: palette.textMuted, fontSize: 15, lineHeight: 21, marginTop: spacing.sm },
  card: {
    ...shadow.card,
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    marginTop: spacing.xxl,
    padding: spacing.xl,
  },
  cardIcon: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderRadius: radius.md,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  cardTitle: { color: palette.text, fontSize: 19, fontWeight: '700', marginTop: spacing.lg },
  cardText: { color: palette.textMuted, fontSize: 14, lineHeight: 20, marginTop: spacing.sm },
  codeCard: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderRadius: radius.md,
    marginTop: spacing.lg,
    padding: spacing.lg,
  },
  codeLabel: { color: palette.sage, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  code: { color: palette.text, fontSize: 28, fontWeight: '800', letterSpacing: 2, marginTop: spacing.sm },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: palette.sageDark,
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.lg,
    minHeight: 54,
    paddingHorizontal: spacing.lg,
  },
  primaryText: { color: palette.white, fontSize: 15, fontWeight: '700' },
  dividerRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, marginTop: spacing.xxl },
  divider: { backgroundColor: palette.border, flex: 1, height: 1 },
  dividerText: { color: palette.textSoft, fontSize: 10, fontWeight: '800' },
  codeInput: {
    backgroundColor: palette.background,
    borderColor: palette.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: palette.text,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: spacing.lg,
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    textAlign: 'center',
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: palette.sage,
    borderRadius: radius.pill,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: spacing.md,
    minHeight: 52,
  },
  secondaryText: { color: palette.sageDark, fontSize: 15, fontWeight: '700' },
  privacyText: { color: palette.textSoft, fontSize: 12, lineHeight: 18, marginTop: spacing.xl, textAlign: 'center' },
  pressed: { opacity: 0.7 },
});
