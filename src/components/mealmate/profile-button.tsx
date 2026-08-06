import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { UserAvatar } from '@/components/mealmate/user-avatar';
import { radius } from '@/constants/mealmate-theme';
import { getInitial, getUserInitial } from '@/lib/user-initial';
import { useAuth } from '@/state/auth-provider';
import { useMealMate } from '@/state/meal-mate-provider';

export function ProfileButton() {
  const router = useRouter();
  const { session, avatarUrl } = useAuth();
  const { familyMembers } = useMealMate();
  const currentMember = familyMembers.find(
    (member) =>
      member.linkedUserId === session?.user.id ||
      (Boolean(member.email) &&
        member.email?.trim().toLowerCase() === session?.user.email?.trim().toLowerCase()),
  );
  const avatarInitial = getInitial(currentMember?.initials) ?? getUserInitial(session?.user);

  return (
    <Pressable
      onPress={() => router.push('/account')}
      accessibilityRole="button"
      accessibilityLabel="Open jouw profiel"
      hitSlop={6}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <UserAvatar initial={avatarInitial} size={38} uri={avatarUrl} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.pill,
    height: 38,
    width: 38,
  },
  pressed: { opacity: 0.7 },
});
