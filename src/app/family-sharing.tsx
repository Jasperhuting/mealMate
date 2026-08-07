import { useRouter } from 'expo-router';
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
import { ModalScreenHeader } from '@/components/mealmate/modal-screen-header';
import { UserAvatar } from '@/components/mealmate/user-avatar';
import { palette, radius, shadow, spacing } from '@/constants/mealmate-theme';
import {
  inviteFamilyMember,
  removeFamilyMember,
  updateFamilyMember,
} from '@/lib/family-sharing';
import { mealMateHaptics } from '@/lib/mealmate-haptics';
import { useAuth } from '@/state/auth-provider';
import { useMealMate } from '@/state/meal-mate-provider';

export default function FamilySharingScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { familyMembers, reloadHousehold } = useMealMate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [busyMemberId, setBusyMemberId] = useState<string | null>(null);
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

  const startEditing = (memberId: string, memberName: string) => {
    setEditingMemberId(memberId);
    setEditingName(memberName);
  };

  const saveMember = async () => {
    const cleanName = editingName.trim();
    if (!editingMemberId || !cleanName) {
      Alert.alert('Naam ontbreekt', 'Vul een naam in voor dit gezinslid.');
      return;
    }

    setBusyMemberId(editingMemberId);
    try {
      await updateFamilyMember(editingMemberId, cleanName);
      await reloadHousehold();
      mealMateHaptics.success();
      setEditingMemberId(null);
      setEditingName('');
    } catch (error) {
      mealMateHaptics.error();
      Alert.alert(
        'Aanpassen mislukt',
        error instanceof Error ? error.message : 'Probeer het over een moment opnieuw.',
      );
    } finally {
      setBusyMemberId(null);
    }
  };

  const confirmRemoveMember = (memberId: string, memberName: string) => {
    Alert.alert(
      `${memberName} verwijderen?`,
      `De beoordelingen, aanwezigheid en uitnodiging van ${memberName} worden verwijderd. Een gekoppeld account verliest toegang tot dit gezin.`,
      [
        { text: 'Annuleer', style: 'cancel' },
        {
          text: 'Verwijder',
          style: 'destructive',
          onPress: async () => {
            setBusyMemberId(memberId);
            try {
              await removeFamilyMember(memberId);
              await reloadHousehold();
              mealMateHaptics.success();
              if (editingMemberId === memberId) {
                setEditingMemberId(null);
                setEditingName('');
              }
            } catch (error) {
              mealMateHaptics.error();
              Alert.alert(
                'Verwijderen mislukt',
                error instanceof Error ? error.message : 'Probeer het over een moment opnieuw.',
              );
            } finally {
              setBusyMemberId(null);
            }
          },
        },
      ],
    );
  };

  const sendInvite = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanName) {
      Alert.alert('Naam ontbreekt', 'Vul alvast in hoe deze persoon in jullie gezin heet.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      Alert.alert('Controleer het e-mailadres', 'Vul een geldig e-mailadres in.');
      return;
    }

    setIsInviting(true);
    try {
      await inviteFamilyMember(cleanName, cleanEmail);
      await reloadHousehold();
      mealMateHaptics.success();
      Alert.alert(
        `${cleanName} is toegevoegd`,
        `De uitnodiging is verstuurd naar ${cleanEmail}. Tot de bevestiging staat het lid als in afwachting vermeld.`,
        [{ text: 'Klaar', onPress: () => router.back() }],
      );
    } catch (error) {
      mealMateHaptics.error();
      Alert.alert(
        'Uitnodigen mislukt',
        error instanceof Error ? error.message : 'Probeer het over een moment opnieuw.',
      );
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ModalScreenHeader title="Gezin instellen" closeLabel="Sluit gezin instellen" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text style={styles.eyebrow}>SAMEN IN TABLY</Text>
          <Text style={styles.title}>Nodig iemand uit</Text>
          <Text style={styles.subtitle}>
            Vul zelf alvast een naam in. Deze persoon verschijnt direct in jullie gezin en krijgt
            een e-mail om de uitnodiging te bevestigen en zo nodig een account te maken.
          </Text>

          <View style={styles.card}>
            <View style={styles.cardIcon}>
              <AppIcon
                name={{ ios: 'person.badge.plus', android: 'group_add', web: 'group_add' }}
                tintColor={palette.sageDark}
                fallback="+"
              />
            </View>
            <Text style={styles.label}>NAAM IN JULLIE GEZIN</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Bijvoorbeeld Lisanne"
              placeholderTextColor={palette.textSoft}
              autoCapitalize="words"
              autoComplete="name"
              returnKeyType="next"
              style={styles.input}
              accessibilityLabel="Naam van het gezinslid"
            />
            <Text style={styles.label}>E-MAILADRES</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="naam@voorbeeld.nl"
              placeholderTextColor={palette.textSoft}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              keyboardType="email-address"
              returnKeyType="send"
              onSubmitEditing={() => void sendInvite()}
              style={styles.input}
              accessibilityLabel="E-mailadres van het gezinslid"
            />
            {keyboardHeight === 0 ? (
              <InviteButton isInviting={isInviting} onPress={() => void sendInvite()} />
            ) : null}
          </View>

          {familyMembers.length > 0 ? (
            <View style={styles.membersCard}>
              <Text style={styles.membersTitle}>Jullie gezin</Text>
              {familyMembers.map((member) => {
                const isEditing = editingMemberId === member.id;
                const isBusy = busyMemberId === member.id;
                const isCurrentUser = member.linkedUserId === session?.user.id;

                return (
                  <View key={member.id} style={styles.memberItem}>
                    <View style={styles.memberRow}>
                      <UserAvatar initial={member.initials} size={38} uri={member.avatarUrl} />
                      <View style={styles.memberCopy}>
                        <Text style={styles.memberName}>{member.name}</Text>
                        <Text style={styles.memberEmail}>{member.email ?? 'Tably-lid'}</Text>
                      </View>
                      <View
                        style={[
                          styles.statusPill,
                          member.invitationStatus === 'pending' && styles.statusPillPending,
                        ]}>
                        <Text style={styles.statusText}>
                          {isCurrentUser
                            ? 'Jij'
                            : member.invitationStatus === 'pending'
                              ? 'In afwachting'
                              : 'Lid'}
                        </Text>
                      </View>
                    </View>

                    {isEditing ? (
                      <View style={styles.editPanel}>
                        <Text style={styles.editLabel}>NAAM</Text>
                        <TextInput
                          value={editingName}
                          onChangeText={setEditingName}
                          autoFocus
                          autoCapitalize="words"
                          returnKeyType="done"
                          onSubmitEditing={() => void saveMember()}
                          accessibilityLabel={`Naam van ${member.name} aanpassen`}
                          style={styles.editInput}
                        />
                        <View style={styles.editActions}>
                          <Pressable
                            onPress={() => {
                              setEditingMemberId(null);
                              setEditingName('');
                            }}
                            disabled={isBusy}
                            accessibilityRole="button"
                            style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}>
                            <Text style={styles.cancelButtonText}>Annuleer</Text>
                          </Pressable>
                          {keyboardHeight === 0 ? (
                            <MemberSaveButton isBusy={isBusy} onPress={() => void saveMember()} />
                          ) : null}
                        </View>
                      </View>
                    ) : (
                      <View style={styles.memberActions}>
                        <Pressable
                          onPress={() => startEditing(member.id, member.name)}
                          disabled={Boolean(busyMemberId)}
                          accessibilityRole="button"
                          accessibilityLabel={`${member.name} aanpassen`}
                          style={({ pressed }) => [styles.memberActionButton, pressed && styles.pressed]}>
                          <AppIcon
                            name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
                            tintColor={palette.sageDark}
                            size={16}
                          />
                          <Text style={styles.memberActionText}>Aanpassen</Text>
                        </Pressable>
                        {!isCurrentUser ? (
                          <Pressable
                            onPress={() => confirmRemoveMember(member.id, member.name)}
                            disabled={Boolean(busyMemberId)}
                            accessibilityRole="button"
                            accessibilityLabel={`${member.name} uit het gezin verwijderen`}
                            style={({ pressed }) => [styles.memberActionButton, pressed && styles.pressed]}>
                            {isBusy ? (
                              <ActivityIndicator color={palette.danger} size="small" />
                            ) : (
                              <AppIcon
                                name={{ ios: 'trash', android: 'delete', web: 'delete' }}
                                tintColor={palette.danger}
                                size={16}
                              />
                            )}
                            <Text style={styles.removeActionText}>Verwijderen</Text>
                          </Pressable>
                        ) : null}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          ) : null}

          <Text style={styles.privacyText}>
            De uitnodiging is zeven dagen geldig. Alleen de ontvanger van dit e-mailadres kan hem
            bevestigen.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
      {keyboardHeight > 0 ? (
        <View style={[styles.floatingFooter, { bottom: keyboardHeight }]}>
          {editingMemberId ? (
            <MemberSaveButton isBusy={Boolean(busyMemberId)} onPress={() => void saveMember()} floating />
          ) : (
            <InviteButton isInviting={isInviting} onPress={() => void sendInvite()} />
          )}
        </View>
      ) : null}
    </SafeAreaView>
  );
}

function InviteButton({ isInviting, onPress }: { isInviting: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isInviting}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.primaryButton,
        (pressed || isInviting) && styles.pressed,
      ]}>
      {isInviting ? (
        <ActivityIndicator color={palette.white} />
      ) : (
        <>
          <AppIcon
            name={{ ios: 'paperplane.fill', android: 'send', web: 'send' }}
            tintColor={palette.white}
            size={18}
          />
          <Text style={styles.primaryText}>Voeg toe en verstuur uitnodiging</Text>
        </>
      )}
    </Pressable>
  );
}

function MemberSaveButton({
  floating = false,
  isBusy,
  onPress,
}: {
  floating?: boolean;
  isBusy: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isBusy}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.saveButton,
        floating && styles.floatingSaveButton,
        (pressed || isBusy) && styles.pressed,
      ]}>
      {isBusy ? (
        <ActivityIndicator color={palette.white} size="small" />
      ) : (
        <Text style={styles.saveButtonText}>Bewaar</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  keyboardView: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 104 },
  eyebrow: { color: palette.sage, fontSize: 11, fontWeight: '800', letterSpacing: 1.1 },
  title: { color: palette.text, fontSize: 28, fontWeight: '700', letterSpacing: -0.7, marginTop: 6 },
  subtitle: { color: palette.textMuted, fontSize: 15, lineHeight: 21, marginTop: 6 },
  card: {
    ...shadow.card,
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    marginTop: spacing.xl,
    padding: spacing.lg,
  },
  cardIcon: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderRadius: radius.md,
    height: 44,
    justifyContent: 'center',
    marginBottom: spacing.sm,
    width: 44,
  },
  label: { color: palette.textMuted, fontSize: 10, fontWeight: '800', letterSpacing: 0.9, marginTop: spacing.md },
  input: {
    backgroundColor: palette.background,
    borderColor: palette.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: palette.text,
    fontSize: 16,
    marginTop: spacing.sm,
    minHeight: 54,
    paddingHorizontal: spacing.lg,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: palette.sageDark,
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.lg,
    minHeight: 54,
    paddingHorizontal: spacing.lg,
  },
  primaryText: { color: palette.white, fontSize: 14, fontWeight: '700' },
  membersCard: { backgroundColor: palette.surface, borderRadius: radius.lg, marginTop: spacing.xl, padding: spacing.lg },
  membersTitle: { color: palette.text, fontSize: 17, fontWeight: '700', marginBottom: spacing.sm },
  memberItem: { borderTopColor: palette.border, borderTopWidth: 1, paddingVertical: spacing.sm },
  memberRow: { alignItems: 'center', flexDirection: 'row', minHeight: 54 },
  avatar: { alignItems: 'center', borderRadius: radius.pill, height: 38, justifyContent: 'center', width: 38 },
  avatarText: { color: palette.white, fontSize: 10, fontWeight: '800' },
  memberCopy: { flex: 1, marginLeft: spacing.md },
  memberName: { color: palette.text, fontSize: 14, fontWeight: '700' },
  memberEmail: { color: palette.textMuted, fontSize: 11, marginTop: 3 },
  statusPill: { backgroundColor: palette.sageSoft, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 6 },
  statusPillPending: { backgroundColor: palette.surfaceStrong },
  statusText: { color: palette.sageDark, fontSize: 9, fontWeight: '800' },
  memberActions: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-end', paddingBottom: spacing.xs },
  memberActionButton: { alignItems: 'center', flexDirection: 'row', gap: 5, minHeight: 36, paddingHorizontal: spacing.sm },
  memberActionText: { color: palette.sageDark, fontSize: 12, fontWeight: '700' },
  removeActionText: { color: palette.danger, fontSize: 12, fontWeight: '700' },
  editPanel: { backgroundColor: palette.background, borderRadius: radius.md, marginBottom: spacing.xs, padding: spacing.md },
  editLabel: { color: palette.textMuted, fontSize: 10, fontWeight: '800', letterSpacing: 0.9 },
  editInput: { backgroundColor: palette.surface, borderColor: palette.border, borderRadius: radius.sm, borderWidth: 1, color: palette.text, fontSize: 15, marginTop: spacing.sm, minHeight: 46, paddingHorizontal: spacing.md },
  editActions: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-end', marginTop: spacing.md },
  cancelButton: { alignItems: 'center', borderColor: palette.border, borderRadius: radius.pill, borderWidth: 1, justifyContent: 'center', minHeight: 40, paddingHorizontal: spacing.lg },
  cancelButtonText: { color: palette.textMuted, fontSize: 13, fontWeight: '700' },
  saveButton: { alignItems: 'center', backgroundColor: palette.sageDark, borderRadius: radius.pill, justifyContent: 'center', minHeight: 40, minWidth: 86, paddingHorizontal: spacing.lg },
  floatingSaveButton: { flex: 1, minHeight: 54 },
  saveButtonText: { color: palette.white, fontSize: 13, fontWeight: '700' },
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
  privacyText: { color: palette.textSoft, fontSize: 12, lineHeight: 18, marginTop: spacing.xl, textAlign: 'center' },
  pressed: { opacity: 0.7 },
});
