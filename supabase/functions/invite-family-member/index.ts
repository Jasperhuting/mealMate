import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type InviteRequest = {
  email?: string;
  name?: string;
};

const defaultKey = (jsonName: string, legacyName: string) => {
  const keySet = Deno.env.get(jsonName);
  if (keySet) {
    const parsed = JSON.parse(keySet) as Record<string, string>;
    if (parsed.default) return parsed.default;
  }
  return Deno.env.get(legacyName);
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const publishableKey = defaultKey('SUPABASE_PUBLISHABLE_KEYS', 'SUPABASE_ANON_KEY');
    const serviceRoleKey = defaultKey('SUPABASE_SECRET_KEYS', 'SUPABASE_SERVICE_ROLE_KEY');
    const authorization = request.headers.get('Authorization');
    if (!supabaseUrl || !publishableKey || !serviceRoleKey || !authorization) {
      throw new Error('De uitnodigingsservice is niet volledig geconfigureerd.');
    }

    const body = (await request.json()) as InviteRequest;
    const email = body.email?.trim().toLowerCase() ?? '';
    const name = body.name?.trim() ?? '';
    if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Vul een geldig e-mailadres in.');
    if (!name || name.length > 80) throw new Error('Vul een naam van maximaal 80 tekens in.');

    const userClient = createClient(supabaseUrl, publishableKey, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false },
    });
    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData.user) throw new Error('Log opnieuw in om iemand uit te nodigen.');

    const { data: preparedRows, error: prepareError } = await userClient.rpc(
      'prepare_household_email_invite',
      { invite_email: email, invite_name: name },
    );
    const prepared = Array.isArray(preparedRows) ? preparedRows[0] : preparedRows;
    if (prepareError || !prepared?.invite_id) {
      throw new Error(prepareError?.message ?? 'De uitnodiging kon niet worden voorbereid.');
    }

    const redirectTo = `mealmate://auth/callback?invite_id=${prepared.invite_id}`;
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      redirectTo,
      data: { display_name: name, mealmate_invite_id: prepared.invite_id },
    });

    if (inviteError) {
      const existingUser =
        inviteError.code === 'email_exists' ||
        inviteError.code === 'user_already_exists' ||
        /already.*registered|already.*exists/i.test(inviteError.message);
      if (!existingUser) throw inviteError;

      const emailClient = createClient(supabaseUrl, publishableKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const { error: magicLinkError } = await emailClient.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false, emailRedirectTo: redirectTo },
      });
      if (magicLinkError) throw magicLinkError;
    }

    return Response.json(
      { inviteId: prepared.invite_id, personId: prepared.person_id },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error('invite-family-member failed', {
      name: error instanceof Error ? error.name : 'UnknownError',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    return Response.json(
      { error: error instanceof Error ? error.message : 'De uitnodiging kon niet worden verstuurd.' },
      { status: 400, headers: corsHeaders },
    );
  }
});
