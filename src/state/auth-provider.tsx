import type { Session } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AppleAuthentication from 'expo-apple-authentication';
import { makeRedirectUri } from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import * as WebBrowser from 'expo-web-browser';
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Platform } from 'react-native';

import { clearMealMateSessionCache } from '@/lib/mealmate-session';
import { supabase } from '@/lib/supabase';

WebBrowser.maybeCompleteAuthSession();

type AuthContextValue = {
  session: Session | null;
  isLoading: boolean;
  signInWithApple: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<{ needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      if (!supabase) {
        if (active) setIsLoading(false);
        return;
      }
      const { data } = await supabase.auth.getSession();
      const currentSession = data.session?.user.is_anonymous ? null : data.session;
      if (data.session?.user.is_anonymous) await supabase.auth.signOut({ scope: 'local' });
      if (active) {
        setSession(currentSession);
        setIsLoading(false);
      }
    };

    void loadSession();
    const listener = supabase?.auth.onAuthStateChange((_event, nextSession) => {
      const permanentSession = nextSession?.user.is_anonymous ? null : nextSession;
      clearMealMateSessionCache();
      setSession(permanentSession);
      setIsLoading(false);
    });

    return () => {
      active = false;
      listener?.data.subscription.unsubscribe();
    };
  }, []);

  const signInWithApple = useCallback(async () => {
    if (!supabase) throw new Error('MealMate kan de inlogservice niet bereiken.');
    if (Platform.OS !== 'ios' || !(await AppleAuthentication.isAvailableAsync())) {
      throw new Error('Inloggen met Apple is alleen beschikbaar op een geschikt Apple-apparaat.');
    }

    const rawNonce = Crypto.randomUUID();
    const hashedNonce = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      rawNonce,
    );
    const credential = await AppleAuthentication.signInAsync({
      nonce: hashedNonce,
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    if (!credential.identityToken) throw new Error('Apple heeft geen geldige aanmelding teruggegeven.');

    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: credential.identityToken,
      nonce: rawNonce,
    });
    if (error) throw error;

    const displayName = credential.fullName
      ? AppleAuthentication.formatFullName(credential.fullName).trim()
      : '';
    if (displayName) {
      const { data } = await supabase.auth.updateUser({ data: { display_name: displayName } });
      if (data.user) {
        await supabase.from('profiles').update({ display_name: displayName }).eq('id', data.user.id);
      }
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) throw new Error('MealMate kan de inlogservice niet bereiken.');
    const redirectTo = makeRedirectUri({ scheme: 'mealmate', path: 'auth/callback' });
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo, skipBrowserRedirect: true },
    });
    if (error) throw error;
    if (!data.url) throw new Error('Google kon niet worden geopend.');

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type !== 'success') {
      if (result.type === 'cancel' || result.type === 'dismiss') return;
      throw new Error('Google heeft de aanmelding niet afgerond.');
    }

    const callbackUrl = new URL(result.url);
    const callbackError = callbackUrl.searchParams.get('error_description');
    if (callbackError) throw new Error(callbackError);
    const code = callbackUrl.searchParams.get('code');
    if (!code) throw new Error('Google heeft geen geldige inlogcode teruggegeven.');
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) throw exchangeError;
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error('MealMate kan de inlogservice niet bereiken.');
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) throw error;
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error('MealMate kan de inlogservice niet bereiken.');
    const normalizedEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: { display_name: normalizedEmail.split('@')[0] },
      },
    });
    if (error) throw error;
    return { needsConfirmation: !data.session };
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    clearMealMateSessionCache();
  }, []);

  const deleteAccount = useCallback(async () => {
    if (!supabase) throw new Error('MealMate kan de accountservice niet bereiken.');

    const { error } = await supabase.rpc('delete_current_user_account');
    if (error) throw error;

    await Promise.allSettled([
      AsyncStorage.multiRemove([
        'mealmate.custom-recipes.v1',
        'mealmate.shopping-departments.v1',
      ]),
      supabase.auth.signOut({ scope: 'local' }),
    ]);
    clearMealMateSessionCache();
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      deleteAccount,
      isLoading,
      signInWithApple,
      signInWithEmail,
      signInWithGoogle,
      signOut,
      signUpWithEmail,
    }),
    [
      isLoading,
      session,
      deleteAccount,
      signInWithApple,
      signInWithEmail,
      signInWithGoogle,
      signOut,
      signUpWithEmail,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth moet binnen AuthProvider worden gebruikt.');
  return value;
}
