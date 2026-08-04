import { File } from 'expo-file-system';

import { supabase } from '@/lib/supabase';

const AVATAR_BUCKET = 'avatars';

export const getAvatarPublicUrl = (path: string | null) => {
  if (!path || !supabase) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path).data.publicUrl;
};

export async function loadAvatarUrl(userId: string) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;

  return getAvatarPublicUrl(data?.avatar_url ?? null);
}

export async function uploadAvatarImage(userId: string, uri: string) {
  if (!supabase) throw new Error('Tably kan de opslag niet bereiken.');

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('id', userId)
    .single();
  if (profileError) throw profileError;

  const path = `${userId}/avatar-${Date.now()}.jpg`;
  const imageData = uri.startsWith('data:')
    ? await (await fetch(uri)).arrayBuffer()
    : await new File(uri).arrayBuffer();
  const { error: uploadError } = await supabase.storage.from(AVATAR_BUCKET).upload(path, imageData, {
    contentType: 'image/jpeg',
    upsert: false,
  });
  if (uploadError) throw uploadError;

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: path })
    .eq('id', userId);
  if (updateError) {
    await supabase.storage.from(AVATAR_BUCKET).remove([path]);
    throw updateError;
  }

  const previousPath = profile.avatar_url;
  if (previousPath && !/^https?:\/\//i.test(previousPath)) {
    await supabase.storage.from(AVATAR_BUCKET).remove([previousPath]);
  }

  return getAvatarPublicUrl(path);
}

export async function removeAvatarImage(userId: string) {
  if (!supabase) return;

  const { data } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('id', userId)
    .maybeSingle();
  const path = data?.avatar_url;
  if (path && !/^https?:\/\//i.test(path)) {
    await supabase.storage.from(AVATAR_BUCKET).remove([path]);
  }
}
