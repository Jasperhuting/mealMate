import type { User } from '@supabase/supabase-js';

export function getInitial(value: string | null | undefined) {
  const normalizedValue = value?.trim();
  if (!normalizedValue) return undefined;

  return Array.from(normalizedValue)[0]?.toLocaleUpperCase('nl-NL');
}

export function getUserInitial(user: User | null | undefined) {
  const metadata = user?.user_metadata;
  const name = [metadata?.display_name, metadata?.full_name, metadata?.name].find(
    (value): value is string => typeof value === 'string' && Boolean(value.trim()),
  );

  return getInitial(name) ?? getInitial(user?.email?.split('@')[0]) ?? '?';
}
