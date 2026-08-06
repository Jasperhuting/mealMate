import * as Application from 'expo-application';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
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
import { UserAvatar } from '@/components/mealmate/user-avatar';
import { palette, radius, shadow, spacing } from '@/constants/mealmate-theme';
import { mealMateHaptics } from '@/lib/mealmate-haptics';
import { getUserInitial } from '@/lib/user-initial';
import { useAuth } from '@/state/auth-provider';
import { useHapticsSettings } from '@/state/haptics-provider';
import { useMealMate } from '@/state/meal-mate-provider';

export default function AccountScreen() {
  const router = useRouter();
  const { session, avatarUrl, signOut, uploadAvatar, deleteAccount } = useAuth();
  const { dislikedIngredientNames } = useMealMate();
  const { hapticsEnabled, setHapticsEnabled } = useHapticsSettings();
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInitial = getUserInitial(session?.user);
  const appVersion = Constants.expoConfig?.version ?? Application.nativeApplicationVersion ?? '—';
  const buildInfo =
    Platform.OS === 'web'
      ? `Versie ${appVersion} · web`
      : Constants.executionEnvironment === ExecutionEnvironment.StoreClient
        ? `Versie ${appVersion} · Expo Go`
        : `Versie ${appVersion} · build ${Application.nativeBuildVersion ?? 'development'}`;

  const chooseAvatar = async () => {
    if (isUploadingAvatar) return;
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });
      if (result.canceled) return;

      setIsUploadingAvatar(true);
      const asset = result.assets[0];
      const squareSize = Math.min(asset.width, asset.height);
      const context = ImageManipulator.manipulate(asset.uri);
      context.crop({
        originX: Math.round((asset.width - squareSize) / 2),
        originY: Math.round((asset.height - squareSize) / 2),
        width: squareSize,
        height: squareSize,
      });
      context.resize({ width: 512, height: 512 });
      const rendered = await context.renderAsync();
      const prepared = await rendered.saveAsync({ compress: 0.82, format: SaveFormat.JPEG });
      await uploadAvatar(prepared.uri);
      mealMateHaptics.success();
    } catch (error) {
      if (__DEV__) console.warn('Tably profielfoto uploaden mislukt', error);
      mealMateHaptics.error();
      Alert.alert(
        'Profielfoto uploaden mislukt',
        'De foto kon niet worden opgeslagen. Probeer het opnieuw. Blijft dit gebeuren, log dan opnieuw in.',
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  };

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
          <Pressable
            onPress={() => void chooseAvatar()}
            disabled={isUploadingAvatar}
            accessibilityRole="button"
            accessibilityLabel={avatarUrl ? 'Wijzig je profielfoto' : 'Upload een profielfoto'}
            style={({ pressed }) => [styles.avatarButton, pressed && styles.pressed]}>
            <UserAvatar initial={avatarInitial} size={52} uri={avatarUrl} />
            <View style={styles.avatarBadge}>
              {isUploadingAvatar ? (
                <ActivityIndicator color={palette.white} size="small" />
              ) : (
                <AppIcon
                  name={{ ios: 'camera.fill', android: 'photo_camera', web: 'photo_camera' }}
                  tintColor={palette.white}
                  size={12}
                />
              )}
            </View>
          </Pressable>
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

        <Text style={styles.sectionTitle}>Voorkeuren</Text>
        <View style={styles.preferenceList}>
          <Pressable
            onPress={() => router.push('/disliked-ingredients')}
            accessibilityRole="button"
            accessibilityLabel="Ingrediënten kiezen die je niet lust"
            style={({ pressed }) => [styles.actionCard, pressed && styles.pressed]}>
            <View style={styles.actionIcon}>
              <AppIcon
                name={{ ios: 'fork.knife', android: 'restaurant', web: 'restaurant' }}
                tintColor={palette.sageDark}
                size={19}
              />
            </View>
            <View style={styles.actionCopy}>
              <Text style={styles.actionTitle}>Ingrediënten die ik niet lust</Text>
              <Text style={styles.actionText}>
                {dislikedIngredientNames.length === 0
                  ? 'Nog niets gekozen'
                  : `${dislikedIngredientNames.length} ${
                      dislikedIngredientNames.length === 1 ? 'ingrediënt' : 'ingrediënten'
                    } gekozen`}
              </Text>
            </View>
            <AppIcon
              name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
              tintColor={palette.textSoft}
              size={17}
            />
          </Pressable>

          {Platform.OS !== 'web' ? (
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
          ) : null}
        </View>

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

        <Text accessibilityLabel={buildInfo} style={styles.buildInfo}>
          {buildInfo}
        </Text>
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
  avatarButton: { height: 56, width: 56 },
  avatarBadge: {
    alignItems: 'center',
    backgroundColor: palette.sageDark,
    borderColor: palette.surface,
    borderRadius: radius.pill,
    borderWidth: 2,
    bottom: 0,
    height: 23,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    width: 23,
  },
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
  preferenceList: { gap: spacing.sm },
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
  buildInfo: {
    color: palette.textSoft,
    fontSize: 11,
    fontWeight: '600',
    marginTop: spacing.xl,
    textAlign: 'center',
  },
  pressed: { opacity: 0.68 },
});
