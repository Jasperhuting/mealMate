import { clearMealMateHouseholdCache, ensureMealMateSession } from '@/lib/mealmate-session';
import { supabase } from '@/lib/supabase';

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
