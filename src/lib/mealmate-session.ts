import { supabase } from '@/lib/supabase';

let sessionPromise: Promise<string> | null = null;
let householdPromise: Promise<string> | null = null;

export function ensureMealMateSession() {
  if (!supabase) return Promise.reject(new Error('Supabase is nog niet geconfigureerd.'));
  if (sessionPromise) return sessionPromise;

  sessionPromise = (async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (data.session && !data.session.user.is_anonymous) return data.session.user.id;
    throw new Error('Log eerst in bij MealMate.');
  })().catch((error) => {
    sessionPromise = null;
    throw error;
  });

  return sessionPromise;
}

export function ensureMealMateHousehold() {
  if (!supabase) return Promise.reject(new Error('Supabase is nog niet geconfigureerd.'));
  if (householdPromise) return householdPromise;

  householdPromise = (async () => {
    await ensureMealMateSession();
    const { data: householdId, error } = await supabase.rpc('ensure_current_user_household');
    if (error || !householdId) {
      throw error ?? new Error('Het huishouden kon niet worden aangemaakt.');
    }
    return householdId as string;
  })().catch((error) => {
    householdPromise = null;
    throw error;
  });

  return householdPromise;
}

export function clearMealMateHouseholdCache() {
  householdPromise = null;
}

export function clearMealMateSessionCache() {
  sessionPromise = null;
  householdPromise = null;
}
