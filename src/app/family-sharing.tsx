import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
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
import { UserAvatar } from '@/components/mealmate/user-avatar';
import { palette, radius, shadow, spacing } from '@/constants/mealmate-theme';
import { inviteFamilyMember } from '@/lib/family-sharing';
import { mealMateHaptics } from '@/lib/mealmate-haptics';
import { useMealMate } from '@/state/meal-mate-provider';

export default function FamilySharingScreen() {
  const router = useRouter();
  const { familyMembers, reloadHousehold } = useMealMate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  const sendInvite = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanName) {
      Alert.alert('Naam ontbreekt', 'Vul alvast in hoe deze persoon in jullie gezin heet.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      Alert.alert('Controleer het e-mailadres', 'Vul een geldig e-mailadres in.');
      return;
    }

    setIsInviting(true);
    try {
      await inviteFamilyMember(cleanName, cleanEmail);
      await reloadHousehold();
      mealMateHaptics.success();
      Alert.alert(
        `${cleanName} is toegevoegd`,
        `De uitnodiging is verstuurd naar ${cleanEmail}. Tot de bevestiging staat het lid als in afwachting vermeld.`,
        [{ text: 'Klaar', onPress: () => router.back() }],
      );
    } catch (error) {
      mealMateHaptics.error();
      Alert.alert(
        'Uitnodigen mislukt',
        error instanceof Error ? error.message : 'Probeer het over een moment opnieuw.',
      );
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ModalScreenHeader title="Gezin instellen" closeLabel="Sluit gezin instellen" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={88}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text style={styles.eyebrow}>SAMEN IN TABLY</Text>
          <Text style={styles.title}>Nodig iemand uit</Text>
          <Text style={styles.subtitle}>
            Vul zelf alvast een naam in. Deze persoon verschijnt direct in jullie gezin en krijgt
            een e-mail om de uitnodiging te bevestigen en zo nodig een account te maken.
          </Text>

          <View style={styles.card}>
            <View style={styles.cardIcon}>
              <AppIcon
                name={{ ios: 'person.badge.plus', android: 'group_add', web: 'group_add' }}
                tintColor={palette.sageDark}
                fallback="+"
              />
            </View>
            <Text style={styles.label}>NAAM IN JULLIE GEZIN</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Bijvoorbeeld Lisanne"
              placeholderTextColor={palette.textSoft}
              autoCapitalize="words"
              autoComplete="name"
              returnKeyType="next"
              style={styles.input}
              accessibilityLabel="Naam van het gezinslid"
            />
            <Text style={styles.label}>E-MAILADRES</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="naam@voorbeeld.nl"
              placeholderTextColor={palette.textSoft}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              keyboardType="email-address"
              returnKeyType="send"
              onSubmitEditing={() => void sendInvite()}
              style={styles.input}
              accessibilityLabel="E-mailadres van het gezinslid"
            />
            <Pressable
              onPress={() => void sendInvite()}
              disabled={isInviting}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.primaryButton,
                (pressed || isInviting) && styles.pressed,
              ]}>
              {isInviting ? (
                <ActivityIndicator color={palette.white} />
              ) : (
                <>
                  <AppIcon
                    name={{ ios: 'paperplane.fill', android: 'send', web: 'send' }}
                    tintColor={palette.white}
                    size={18}
                  />
                  <Text style={styles.primaryText}>Voeg toe en verstuur uitnodiging</Text>
                </>
              )}
            </Pressable>
          </View>

          {familyMembers.length > 0 ? (
            <View style={styles.membersCard}>
              <Text style={styles.membersTitle}>Jullie gezin</Text>
              {familyMembers.map((member) => (
                <View key={member.id} style={styles.memberRow}>
                  <UserAvatar initial={member.initials} size={38} uri={member.avatarUrl} />
                  <View style={styles.memberCopy}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberEmail}>{member.email ?? 'Tably-lid'}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusPill,
                      member.invitationStatus === 'pending' && styles.statusPillPending,
                    ]}>
                    <Text style={styles.statusText}>
                      {member.invitationStatus === 'pending' ? 'Wacht op bevestiging' : 'Lid'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null}

          <Text style={styles.privacyText}>
            De uitnodiging is zeven dagen geldig. Alleen de ontvanger van dit e-mailadres kan hem
            bevestigen.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  keyboardView: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl },
  eyebrow: { color: palette.sage, fontSize: 11, fontWeight: '800', letterSpacing: 1.1 },
  title: { color: palette.text, fontSize: 28, fontWeight: '700', letterSpacing: -0.7, marginTop: 6 },
  subtitle: { color: palette.textMuted, fontSize: 15, lineHeight: 21, marginTop: 6 },
  card: {
    ...shadow.card,
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    marginTop: spacing.xl,
    padding: spacing.lg,
  },
  cardIcon: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderRadius: radius.md,
    height: 44,
    justifyContent: 'center',
    marginBottom: spacing.sm,
    width: 44,
  },
  label: { color: palette.textMuted, fontSize: 10, fontWeight: '800', letterSpacing: 0.9, marginTop: spacing.md },
  input: {
    backgroundColor: palette.background,
    borderColor: palette.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: palette.text,
    fontSize: 16,
    marginTop: spacing.sm,
    minHeight: 54,
    paddingHorizontal: spacing.lg,
  },
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
  primaryText: { color: palette.white, fontSize: 14, fontWeight: '700' },
  membersCard: { backgroundColor: palette.surface, borderRadius: radius.lg, marginTop: spacing.xl, padding: spacing.lg },
  membersTitle: { color: palette.text, fontSize: 17, fontWeight: '700', marginBottom: spacing.sm },
  memberRow: { alignItems: 'center', borderTopColor: palette.border, borderTopWidth: 1, flexDirection: 'row', minHeight: 66 },
  avatar: { alignItems: 'center', borderRadius: radius.pill, height: 38, justifyContent: 'center', width: 38 },
  avatarText: { color: palette.white, fontSize: 10, fontWeight: '800' },
  memberCopy: { flex: 1, marginLeft: spacing.md },
  memberName: { color: palette.text, fontSize: 14, fontWeight: '700' },
  memberEmail: { color: palette.textMuted, fontSize: 11, marginTop: 3 },
  statusPill: { backgroundColor: palette.sageSoft, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 6 },
  statusPillPending: { backgroundColor: palette.surfaceStrong },
  statusText: { color: palette.sageDark, fontSize: 9, fontWeight: '800' },
  privacyText: { color: palette.textSoft, fontSize: 12, lineHeight: 18, marginTop: spacing.xl, textAlign: 'center' },
  pressed: { opacity: 0.7 },
});
