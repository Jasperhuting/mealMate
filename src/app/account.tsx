import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/mealmate/app-icon';
import { ModalScreenHeader } from '@/components/mealmate/modal-screen-header';
import { palette, radius, shadow, spacing } from '@/constants/mealmate-theme';
import { mealMateHaptics } from '@/lib/mealmate-haptics';
import { getUserInitial } from '@/lib/user-initial';
import { useAuth } from '@/state/auth-provider';
import { useHapticsSettings } from '@/state/haptics-provider';

export default function AccountScreen() {
  const { session, signOut, deleteAccount } = useAuth();
  const { hapticsEnabled, setHapticsEnabled } = useHapticsSettings();
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const avatarInitial = getUserInitial(session?.user);

  const removeAccount = async () => {
    setIsDeletingAccount(true);
    try {
      await deleteAccount();
      mealMateHaptics.destructive();
    } catch {
      mealMateHaptics.error();
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
      'Hiermee verwijder je jouw Tably-account en de recepten, planningen en boodschappen die jij hebt aangemaakt. Dit kan niet ongedaan worden gemaakt.',
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

  const confirmSignOut = () => {
    Alert.alert('Uitloggen?', 'Je kunt later opnieuw inloggen met e-mail, Apple of Google.', [
      { text: 'Annuleer', style: 'cancel' },
      { text: 'Log uit', style: 'destructive', onPress: () => void signOut() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ModalScreenHeader title="Account" closeLabel="Sluit account" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>JOUW TABLY</Text>
        <Text style={styles.title}>Jouw account</Text>
        <Text style={styles.subtitle}>
          Beheer hier je persoonlijke toegang en gegevens. Jullie gezin blijft op de gezinspagina.
        </Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarInitial}</Text>
          </View>
          <View style={styles.profileCopy}>
            <Text style={styles.profileLabel}>INGELOGD ALS</Text>
            <Text style={styles.email} numberOfLines={1}>
              {session?.user.email ?? 'Tably-account'}
            </Text>
          </View>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Actief</Text>
          </View>
        </View>

        {Platform.OS !== 'web' ? (
          <>
            <Text style={styles.sectionTitle}>Voorkeuren</Text>
            <View style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <AppIcon
                  name={{ ios: 'hand.tap', android: 'vibration', web: 'vibration' }}
                  tintColor={palette.sageDark}
                  size={19}
                />
              </View>
              <View style={styles.actionCopy}>
                <Text style={styles.actionTitle}>Haptische feedback</Text>
                <Text style={styles.actionText}>
                  Voel subtiele bevestigingen bij belangrijke acties.
                </Text>
              </View>
              <Switch
                value={hapticsEnabled}
                onValueChange={setHapticsEnabled}
                trackColor={{ false: palette.surfaceStrong, true: palette.sage }}
                thumbColor={palette.white}
                accessibilityLabel="Haptische feedback"
              />
            </View>
          </>
        ) : null}

        <Text style={styles.sectionTitle}>Toegang</Text>
        <Pressable
          onPress={confirmSignOut}
          accessibilityRole="button"
          accessibilityLabel="Uitloggen bij Tably"
          style={({ pressed }) => [styles.actionCard, pressed && styles.pressed]}>
          <View style={styles.actionIcon}>
            <AppIcon
              name={{ ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' }}
              tintColor={palette.sageDark}
              size={19}
            />
          </View>
          <View style={styles.actionCopy}>
            <Text style={styles.actionTitle}>Log uit</Text>
            <Text style={styles.actionText}>Je gegevens blijven bewaard voor de volgende keer.</Text>
          </View>
          <AppIcon
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            tintColor={palette.textSoft}
            size={17}
          />
        </Pressable>

        <Text style={styles.sectionTitle}>Gegevens en privacy</Text>
        <Pressable
          onPress={confirmAccountRemoval}
          disabled={isDeletingAccount}
          accessibilityRole="button"
          accessibilityLabel="Account definitief verwijderen"
          style={({ pressed }) => [
            styles.actionCard,
            styles.dangerCard,
            (pressed || isDeletingAccount) && styles.pressed,
          ]}>
          <View style={[styles.actionIcon, styles.dangerIcon]}>
            {isDeletingAccount ? (
              <ActivityIndicator color={palette.danger} size="small" />
            ) : (
              <AppIcon
                name={{ ios: 'trash', android: 'delete_outline', web: 'delete_outline' }}
                tintColor={palette.danger}
                size={19}
              />
            )}
          </View>
          <View style={styles.actionCopy}>
            <Text style={styles.dangerTitle}>Account verwijderen</Text>
            <Text style={styles.actionText}>Verwijder je account en gegevens definitief.</Text>
          </View>
          <AppIcon
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            tintColor={palette.danger}
            size={17}
          />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.xl },
  eyebrow: {
    color: palette.sage,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.3,
  },
  title: {
    color: palette.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.8,
    marginTop: spacing.xs,
  },
  subtitle: {
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  profileCard: {
    ...shadow.card,
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    flexDirection: 'row',
    marginTop: spacing.xl,
    padding: spacing.lg,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: palette.surfaceStrong,
    borderRadius: radius.pill,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  avatarText: { color: palette.sageDark, fontSize: 14, fontWeight: '800' },
  profileCopy: { flex: 1, marginLeft: spacing.md },
  profileLabel: { color: palette.textSoft, fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  email: { color: palette.text, fontSize: 14, fontWeight: '700', marginTop: 4 },
  statusPill: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  statusDot: { backgroundColor: palette.sageDark, borderRadius: radius.pill, height: 6, width: 6 },
  statusText: { color: palette.sageDark, fontSize: 10, fontWeight: '700' },
  sectionTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.md,
    marginTop: spacing.xl,
  },
  actionCard: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    flexDirection: 'row',
    minHeight: 76,
    padding: spacing.md,
  },
  actionIcon: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderRadius: radius.md,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  actionCopy: { flex: 1, marginHorizontal: spacing.md },
  actionTitle: { color: palette.text, fontSize: 15, fontWeight: '700' },
  actionText: { color: palette.textMuted, fontSize: 11, lineHeight: 16, marginTop: 4 },
  dangerCard: { borderColor: '#E5C9C6', borderWidth: 1 },
  dangerIcon: { backgroundColor: '#F4E5E3' },
  dangerTitle: { color: palette.danger, fontSize: 15, fontWeight: '700' },
  pressed: { opacity: 0.68 },
});
