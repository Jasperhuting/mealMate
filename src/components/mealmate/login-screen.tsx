import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
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
import { BrandLogo } from '@/components/mealmate/brand-logo';
import { palette, radius, shadow, spacing } from '@/constants/mealmate-theme';
import { useAuth } from '@/state/auth-provider';

type Provider = 'apple' | 'google';
type EmailMode = 'login' | 'register';

const friendlyAuthError = (provider: Provider, error: unknown) => {
  const message = error instanceof Error ? error.message : '';
  if ((error as { code?: string })?.code === 'ERR_REQUEST_CANCELED') return null;
  if (/provider.*not enabled|unsupported provider/i.test(message)) {
    return `${provider === 'apple' ? 'Apple' : 'Google'} is nog niet geactiveerd voor Tably.`;
  }
  return message || 'Inloggen is niet gelukt. Probeer het opnieuw.';
};

const friendlyEmailError = (error: unknown) => {
  const message = error instanceof Error ? error.message : '';
  if (/invalid login credentials/i.test(message)) return 'Het e-mailadres of wachtwoord klopt niet.';
  if (/user already registered/i.test(message)) return 'Er bestaat al een account met dit e-mailadres.';
  if (/password should be at least/i.test(message)) return 'Kies een wachtwoord van minimaal 6 tekens.';
  if (/email.*invalid|invalid.*email/i.test(message)) return 'Vul een geldig e-mailadres in.';
  return message || 'Inloggen is niet gelukt. Probeer het opnieuw.';
};

export function LoginScreen() {
  const { signInWithApple, signInWithEmail, signInWithGoogle, signUpWithEmail } = useAuth();
  const [activeProvider, setActiveProvider] = useState<Provider | null>(null);
  const [email, setEmail] = useState('');
  const [emailMode, setEmailMode] = useState<EmailMode>('login');
  const [isEmailBusy, setIsEmailBusy] = useState(false);
  const [password, setPassword] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillChangeFrame' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const signIn = async (provider: Provider) => {
    setActiveProvider(provider);
    try {
      await (provider === 'apple' ? signInWithApple() : signInWithGoogle());
    } catch (error) {
      const message = friendlyAuthError(provider, error);
      if (message) Alert.alert('Inloggen mislukt', message);
    } finally {
      setActiveProvider(null);
    }
  };

  const submitEmail = async () => {
    const normalizedEmail = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      Alert.alert('Controleer je e-mailadres', 'Vul een geldig e-mailadres in.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Wachtwoord te kort', 'Kies een wachtwoord van minimaal 6 tekens.');
      return;
    }

    setIsEmailBusy(true);
    try {
      if (emailMode === 'login') {
        await signInWithEmail(normalizedEmail, password);
      } else {
        const { needsConfirmation } = await signUpWithEmail(normalizedEmail, password);
        if (needsConfirmation) {
          Alert.alert(
            'Controleer je inbox',
            'Je account is aangemaakt. Bevestig je e-mailadres en log daarna in.',
          );
          setEmailMode('login');
        }
      }
    } catch (error) {
      Alert.alert(
        emailMode === 'login' ? 'Inloggen mislukt' : 'Account maken mislukt',
        friendlyEmailError(error),
      );
    } finally {
      setIsEmailBusy(false);
    }
  };

  const isBusy = activeProvider !== null || isEmailBusy;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoider}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.brandBlock}>
            <BrandLogo width={132} />
            <Text style={styles.tagline}>Save it. Plan it. Shop for it.</Text>
          </View>

          <View style={styles.hero}>
            <Text style={styles.eyebrow}>SAMEN ETEN, SLIM GEPLAND</Text>
            <Text style={styles.title}>Alles voor jullie weekmenu op één plek.</Text>
            <Text style={styles.subtitle}>
              Bewaar recepten, plan gerechten en laat Tably automatisch jullie boodschappenlijst maken.
            </Text>
          </View>

          <View style={styles.previewCard}>
            <View style={styles.previewIcon}>
              <AppIcon
                name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
                tintColor={palette.sageDark}
                size={28}
              />
            </View>
            <View style={styles.previewCopy}>
              <Text style={styles.previewTitle}>Van idee naar boodschappen</Text>
              <Text style={styles.previewText}>Recepten · weekplanning · samen afvinken</Text>
            </View>
          </View>

          <View style={styles.authCard}>
            <Text style={styles.authTitle}>Begin met Tably</Text>
            <Text style={styles.authText}>Log in met e-mail om de app direct te kunnen testen.</Text>

            <View style={styles.modeSwitch}>
              {(['login', 'register'] as const).map((mode) => {
                const selected = emailMode === mode;
                return (
                  <Pressable
                    key={mode}
                    accessibilityRole="button"
                    disabled={isBusy}
                    onPress={() => setEmailMode(mode)}
                    style={[styles.modeButton, selected && styles.modeButtonSelected]}>
                    <Text style={[styles.modeText, selected && styles.modeTextSelected]}>
                      {mode === 'login' ? 'Inloggen' : 'Account maken'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <TextInput
              accessibilityLabel="E-mailadres"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              defaultValue=""
              editable={!isBusy}
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="E-mailadres"
              placeholderTextColor={palette.textSoft}
              returnKeyType="next"
              style={styles.input}
              textContentType="username"
            />
            <TextInput
              accessibilityLabel="Wachtwoord"
              autoCapitalize="none"
              autoComplete={emailMode === 'login' ? 'current-password' : 'new-password'}
              autoCorrect={false}
              defaultValue=""
              editable={!isBusy}
              onChangeText={setPassword}
              onSubmitEditing={() => void submitEmail()}
              placeholder="Wachtwoord (minimaal 6 tekens)"
              placeholderTextColor={palette.textSoft}
              returnKeyType="go"
              secureTextEntry
              style={styles.input}
              textContentType={emailMode === 'login' ? 'password' : 'newPassword'}
            />

            {keyboardHeight === 0 ? (
              <EmailSubmitButton
                emailMode={emailMode}
                isBusy={isBusy}
                isEmailBusy={isEmailBusy}
                onPress={() => void submitEmail()}
              />
            ) : null}

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OF GA VERDER MET</Text>
              <View style={styles.divider} />
            </View>

            {Platform.OS === 'ios' ? (
              <View style={styles.appleButtonWrap}>
                <Pressable
                  onPress={() => void signIn('apple')}
                  disabled={isBusy}
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.appleButton, pressed && styles.pressed]}>
                  {activeProvider === 'apple' ? (
                    <ActivityIndicator color={palette.white} />
                  ) : (
                    <>
                      <AppIcon
                        name={{ ios: 'apple.logo', android: 'circle', web: 'circle' }}
                        tintColor={palette.white}
                        size={20}
                        fallback="●"
                      />
                      <Text style={styles.appleText}>Ga verder met Apple</Text>
                    </>
                  )}
                </Pressable>
              </View>
            ) : null}

            <Pressable
              onPress={() => void signIn('google')}
              disabled={isBusy}
              accessibilityRole="button"
              style={({ pressed }) => [styles.googleButton, pressed && styles.pressed]}>
              {activeProvider === 'google' ? (
                <ActivityIndicator color={palette.text} />
              ) : (
                <>
                  <Text style={styles.googleMark}>G</Text>
                  <Text style={styles.googleText}>Ga verder met Google</Text>
                </>
              )}
            </Pressable>
          </View>

          <Text style={styles.legal}>
            Door verder te gaan ga je akkoord met de voorwaarden en het privacybeleid van Tably.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
      {keyboardHeight > 0 ? (
        <View style={[styles.floatingFooter, { bottom: keyboardHeight }]}>
          <EmailSubmitButton
            emailMode={emailMode}
            floating
            isBusy={isBusy}
            isEmailBusy={isEmailBusy}
            onPress={() => void submitEmail()}
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

function EmailSubmitButton({
  emailMode,
  floating = false,
  isBusy,
  isEmailBusy,
  onPress,
}: {
  emailMode: EmailMode;
  floating?: boolean;
  isBusy: boolean;
  isEmailBusy: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={isBusy}
      onPress={onPress}
      style={({ pressed }) => [
        styles.emailButton,
        floating && styles.floatingEmailButton,
        (pressed || isBusy) && styles.pressed,
      ]}>
      {isEmailBusy ? (
        <ActivityIndicator color={palette.white} />
      ) : (
        <Text style={styles.emailButtonText}>
          {emailMode === 'login' ? 'Inloggen met e-mail' : 'Testaccount maken'}
        </Text>
      )}
    </Pressable>
  );
}

export function AuthLoadingScreen() {
  return (
    <SafeAreaView style={styles.loadingScreen}>
      <BrandLogo width={168} />
      <ActivityIndicator color={palette.sageDark} style={styles.loadingIndicator} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  keyboardAvoider: { flex: 1 },
  content: { flexGrow: 1, padding: spacing.xl, paddingBottom: 104 },
  brandBlock: { alignItems: 'flex-start' },
  tagline: { color: palette.textMuted, fontSize: 11, fontWeight: '600', marginTop: 2 },
  hero: { marginTop: 58 },
  eyebrow: { color: palette.sage, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: palette.text, fontSize: 37, fontWeight: '700', letterSpacing: -1.2, lineHeight: 43, marginTop: spacing.md },
  subtitle: { color: palette.textMuted, fontSize: 16, lineHeight: 23, marginTop: spacing.lg },
  previewCard: { ...shadow.card, alignItems: 'center', backgroundColor: palette.sageSoft, borderRadius: radius.lg, flexDirection: 'row', marginTop: spacing.xxl, padding: spacing.lg },
  previewIcon: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: radius.md, height: 52, justifyContent: 'center', width: 52 },
  previewCopy: { flex: 1, marginLeft: spacing.md },
  previewTitle: { color: palette.text, fontSize: 15, fontWeight: '700' },
  previewText: { color: palette.textMuted, fontSize: 12, marginTop: 5 },
  authCard: { marginTop: 50 },
  authTitle: { color: palette.text, fontSize: 20, fontWeight: '700', textAlign: 'center' },
  authText: { color: palette.textMuted, fontSize: 13, lineHeight: 19, marginTop: spacing.sm, textAlign: 'center' },
  appleButtonWrap: { height: 56, marginTop: spacing.lg },
  appleButton: { alignItems: 'center', backgroundColor: '#000000', borderRadius: radius.pill, flexDirection: 'row', gap: spacing.md, height: 56, justifyContent: 'center', width: '100%' },
  appleText: { color: palette.white, fontSize: 15, fontWeight: '700' },
  googleButton: { alignItems: 'center', backgroundColor: palette.surface, borderColor: palette.border, borderRadius: radius.pill, borderWidth: 1, flexDirection: 'row', justifyContent: 'center', marginTop: spacing.md, minHeight: 56 },
  googleMark: { color: '#4285F4', fontSize: 20, fontWeight: '800', marginRight: spacing.md },
  googleText: { color: palette.text, fontSize: 15, fontWeight: '700' },
  dividerRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, marginVertical: spacing.xl },
  divider: { backgroundColor: palette.border, flex: 1, height: StyleSheet.hairlineWidth },
  dividerText: { color: palette.textSoft, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  modeSwitch: { backgroundColor: palette.surfaceMuted, borderRadius: radius.pill, flexDirection: 'row', marginBottom: spacing.md, padding: spacing.xs },
  modeButton: { alignItems: 'center', borderRadius: radius.pill, flex: 1, justifyContent: 'center', minHeight: 40 },
  modeButtonSelected: { ...shadow.card, backgroundColor: palette.surface },
  modeText: { color: palette.textMuted, fontSize: 13, fontWeight: '700' },
  modeTextSelected: { color: palette.text },
  input: { backgroundColor: palette.surface, borderColor: palette.border, borderRadius: radius.md, borderWidth: 1, color: palette.text, fontSize: 15, marginTop: spacing.md, minHeight: 54, paddingHorizontal: spacing.lg },
  emailButton: { alignItems: 'center', backgroundColor: palette.sageDark, borderRadius: radius.pill, justifyContent: 'center', marginTop: spacing.lg, minHeight: 56 },
  floatingEmailButton: { marginTop: 0 },
  emailButtonText: { color: palette.white, fontSize: 15, fontWeight: '700' },
  floatingFooter: {
    backgroundColor: palette.background,
    borderTopColor: palette.border,
    borderTopWidth: 1,
    left: 0,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    position: 'absolute',
    right: 0,
    zIndex: 10,
  },
  legal: { color: palette.textSoft, fontSize: 10, lineHeight: 15, marginTop: spacing.xl, textAlign: 'center' },
  pressed: { opacity: 0.7 },
  loadingScreen: { alignItems: 'center', backgroundColor: palette.background, flex: 1, justifyContent: 'center' },
  loadingIndicator: { marginTop: spacing.lg },
});
