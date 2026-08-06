import { clearMealMateHouseholdCache, ensureMealMateSession } from '@/lib/mealmate-session';
import { supabase } from '@/lib/supabase';
import { FunctionsFetchError, FunctionsHttpError, FunctionsRelayError } from '@supabase/supabase-js';

export type HouseholdInvite = {
  code: string;
  expiresAt: string;
};

const formatInviteCode = (code: string) => `${code.slice(0, 4)}-${code.slice(4)}`;

export async function createHouseholdInvite(): Promise<HouseholdInvite> {
  if (!supabase) throw new Error('Supabase is nog niet geconfigureerd.');
  await ensureMealMateSession();
  const { data, error } = await supabase.rpc('create_household_invite');
  const invite = Array.isArray(data) ? data[0] : data;
  if (error || !invite) {
    throw error ?? new Error('De uitnodiging kon niet worden gemaakt.');
  }
  return {
    code: formatInviteCode(invite.code),
    expiresAt: invite.expires_at,
  };
}

export async function joinHousehold(inviteCode: string) {
  if (!supabase) throw new Error('Supabase is nog niet geconfigureerd.');
  await ensureMealMateSession();
  const { error } = await supabase.rpc('join_household_with_code', {
    invite_code: inviteCode,
  });
  if (error) {
    if (error.message.includes('ongeldig') || error.message.includes('verlopen')) {
      throw new Error('Deze uitnodigingscode is ongeldig of verlopen.');
    }
    throw error;
  }
  clearMealMateHouseholdCache();
}

export async function inviteFamilyMember(name: string, email: string) {
  if (!supabase) throw new Error('Supabase is nog niet geconfigureerd.');
  await ensureMealMateSession();
  const { data, error } = await supabase.functions.invoke('invite-family-member', {
    body: { name: name.trim(), email: email.trim().toLowerCase() },
  });
  if (error instanceof FunctionsHttpError) {
    let message = 'De uitnodigingsservice gaf een fout terug.';
    try {
      const payload = (await error.context.json()) as { error?: string };
      if (payload.error) message = payload.error;
    } catch {
      // De gateway kan een lege foutrespons geven; gebruik dan de Nederlandse fallback.
    }
    throw new Error(message);
  }
  if (error instanceof FunctionsRelayError || error instanceof FunctionsFetchError) {
    throw new Error('De uitnodigingsservice is tijdelijk niet bereikbaar. Probeer het opnieuw.');
  }
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data as { inviteId: string; personId: string };
}

export async function updateFamilyMember(personId: string, name: string) {
  if (!supabase) throw new Error('Supabase is nog niet geconfigureerd.');
  await ensureMealMateSession();
  const { error } = await supabase.rpc('update_household_person', {
    target_person_id: personId,
    new_display_name: name.trim(),
  });
  if (error) throw error;
}

export async function removeFamilyMember(personId: string) {
  if (!supabase) throw new Error('Supabase is nog niet geconfigureerd.');
  await ensureMealMateSession();
  const { error } = await supabase.rpc('remove_household_person', {
    target_person_id: personId,
  });
  if (error) throw error;
}
