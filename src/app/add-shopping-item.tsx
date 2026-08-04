import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
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
import { palette, radius, spacing } from '@/constants/mealmate-theme';
import { defaultDepartment, jumboDepartments, type Department } from '@/data/mock-data';
import { useMealMate } from '@/state/meal-mate-provider';

export default function AddShoppingItemScreen() {
  const router = useRouter();
  const { addShoppingItem } = useMealMate();
  const nameInput = useRef<TextInput>(null);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('1');
  const [unit, setUnit] = useState('stuk');
  const [department, setDepartment] = useState<Department>(defaultDepartment);
  const [departmentPickerOpen, setDepartmentPickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardWillShow', (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const close = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/shopping');
  };

  const save = async () => {
    const cleanName = name.trim();
    const parsedAmount = Number.parseFloat(amount.replace(',', '.'));
    if (!cleanName) {
      Alert.alert('Product ontbreekt', 'Vul eerst in wat je nodig hebt.');
      nameInput.current?.focus();
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Controleer de hoeveelheid', 'Vul een hoeveelheid groter dan nul in.');
      return;
    }

    setIsSaving(true);
    try {
      await addShoppingItem({
        name: cleanName,
        amount: parsedAmount,
        unit: unit.trim(),
        department,
      });
      close();
    } catch {
      Alert.alert(
        'Product toevoegen mislukt',
        'MealMate kon het product niet bewaren. Controleer je internetverbinding en probeer het opnieuw.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <ModalScreenHeader title="Product toevoegen" closeLabel="Sluit product toevoegen" />
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}>
          <ScrollView
            style={styles.formScroll}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <Text style={styles.eyebrow}>LOSSE BOODSCHAP</Text>
            <Text style={styles.title}>Wat wil je toevoegen?</Text>
            <Text style={styles.subtitle}>
              Voor producten die niet uit een gepland gerecht komen, zoals koffie of fruit voor
              tussendoor.
            </Text>

            <View style={styles.formCard}>
              <Text style={styles.label}>Product</Text>
              <TextInput
                ref={nameInput}
                value={name}
                onChangeText={setName}
                placeholder="Bijvoorbeeld: koffie"
                placeholderTextColor={palette.textSoft}
                returnKeyType="next"
                autoFocus
                style={styles.input}
              />

              <View style={styles.amountRow}>
                <View style={styles.amountField}>
                  <Text style={styles.label}>Hoeveelheid</Text>
                  <TextInput
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="decimal-pad"
                    placeholder="1"
                    placeholderTextColor={palette.textSoft}
                    style={styles.input}
                  />
                </View>
                <View style={styles.unitField}>
                  <Text style={styles.label}>Eenheid</Text>
                  <TextInput
                    value={unit}
                    onChangeText={setUnit}
                    placeholder="stuk"
                    placeholderTextColor={palette.textSoft}
                    style={styles.input}
                  />
                </View>
              </View>

              <Text style={[styles.label, styles.departmentLabel]}>Afdeling</Text>
              <Pressable
                onPress={() => {
                  Keyboard.dismiss();
                  setDepartmentPickerOpen(true);
                }}
                accessibilityRole="button"
                accessibilityLabel="Afdeling kiezen"
                accessibilityValue={{ text: department }}
                accessibilityHint="Opent de lijst met winkelafdelingen"
                style={({ pressed }) => [styles.departmentField, pressed && styles.pressed]}>
                <View style={styles.departmentFieldIcon}>
                  <AppIcon
                    name={{ ios: 'square.grid.2x2', android: 'category', web: 'category' }}
                    tintColor={palette.sageDark}
                    size={18}
                  />
                </View>
                <Text style={styles.departmentFieldText} numberOfLines={2}>
                  {department}
                </Text>
                <AppIcon
                  name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                  tintColor={palette.textSoft}
                  size={17}
                />
              </Pressable>
            </View>
          </ScrollView>
          {Platform.OS !== 'ios' || keyboardHeight === 0 ? (
            <SaveFooter isSaving={isSaving} onPress={() => void save()} />
          ) : null}
        </KeyboardAvoidingView>
        {Platform.OS === 'ios' && keyboardHeight > 0 ? (
          <View style={[styles.keyboardFooterContainer, { bottom: keyboardHeight }]}>
            <SaveFooter
              isSaving={isSaving}
              keyboardAccessory
              onPress={() => void save()}
            />
          </View>
        ) : null}
      </SafeAreaView>
      <Modal
        visible={departmentPickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDepartmentPickerOpen(false)}>
        <View style={styles.modalOverlay}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Afdelingskiezer sluiten"
            style={StyleSheet.absoluteFill}
            onPress={() => setDepartmentPickerOpen(false)}
          />
          <SafeAreaView style={styles.modalSheet} edges={['bottom']}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalEyebrow}>AFDELING KIEZEN</Text>
            <Text style={styles.modalTitle}>Waar vind je dit product?</Text>
            <Text style={styles.modalText}>Kies de plek waar je het in de winkel verwacht.</Text>
            <ScrollView
              style={styles.departmentScroll}
              contentContainerStyle={styles.departmentOptions}
              showsVerticalScrollIndicator={false}>
              {jumboDepartments.map((option) => {
                const selected = option === department;
                return (
                  <Pressable
                    key={option}
                    onPress={() => {
                      setDepartment(option);
                      setDepartmentPickerOpen(false);
                    }}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    style={({ pressed }) => [
                      styles.departmentOption,
                      selected && styles.departmentOptionSelected,
                      pressed && styles.pressed,
                    ]}>
                    <View
                      style={[
                        styles.departmentRadio,
                        selected && styles.departmentRadioSelected,
                      ]}>
                      {selected ? <View style={styles.departmentRadioDot} /> : null}
                    </View>
                    <Text
                      style={[
                        styles.departmentOptionText,
                        selected && styles.departmentOptionTextSelected,
                      ]}>
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
}

function SaveFooter({
  isSaving,
  keyboardAccessory = false,
  onPress,
}: {
  isSaving: boolean;
  keyboardAccessory?: boolean;
  onPress: () => void;
}) {
  return (
    <View style={[styles.footer, keyboardAccessory && styles.keyboardFooter]}>
      <Pressable
        onPress={onPress}
        disabled={isSaving}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.saveButton,
          (pressed || isSaving) && styles.pressed,
        ]}>
        {isSaving ? (
          <ActivityIndicator color={palette.white} />
        ) : (
          <>
            <AppIcon
              name={{ ios: 'plus', android: 'add', web: 'add' }}
              tintColor={palette.white}
              size={19}
            />
            <Text style={styles.saveText}>Voeg toe aan lijst</Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  keyboardView: { flex: 1 },
  formScroll: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: spacing.lg },
  eyebrow: { color: palette.sage, fontSize: 11, fontWeight: '800', letterSpacing: 1.1 },
  title: {
    color: palette.text,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.7,
    marginTop: 6,
  },
  subtitle: { color: palette.textMuted, fontSize: 15, lineHeight: 20, marginTop: 6 },
  formCard: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    marginTop: spacing.xl,
    padding: spacing.md,
  },
  label: { color: palette.text, fontSize: 13, fontWeight: '700', marginBottom: spacing.sm },
  input: {
    backgroundColor: palette.background,
    borderColor: palette.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: palette.text,
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
  },
  amountRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  amountField: { flex: 1 },
  unitField: { flex: 1.35 },
  departmentLabel: { marginTop: spacing.md },
  departmentField: {
    alignItems: 'center',
    backgroundColor: palette.background,
    borderColor: palette.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 56,
    paddingHorizontal: spacing.md,
  },
  departmentFieldIcon: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderRadius: radius.sm,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  departmentFieldText: {
    color: palette.text,
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    marginHorizontal: spacing.md,
  },
  footer: {
    backgroundColor: palette.background,
    borderTopColor: palette.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  keyboardFooter: { paddingBottom: spacing.sm },
  keyboardFooterContainer: {
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 2,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: palette.sageDark,
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 56,
  },
  saveText: { color: palette.white, fontSize: 16, fontWeight: '700' },
  pressed: { opacity: 0.7 },
  modalOverlay: {
    backgroundColor: 'rgba(24, 28, 23, 0.38)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: palette.background,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    maxHeight: '88%',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  modalHandle: {
    alignSelf: 'center',
    backgroundColor: palette.border,
    borderRadius: radius.pill,
    height: 4,
    marginBottom: spacing.lg,
    width: 44,
  },
  modalEyebrow: { color: palette.sage, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  modalTitle: { color: palette.text, fontSize: 24, fontWeight: '700', marginTop: spacing.sm },
  modalText: { color: palette.textMuted, fontSize: 14, marginTop: spacing.sm },
  departmentScroll: { marginTop: spacing.lg },
  departmentOptions: { gap: spacing.sm, paddingBottom: spacing.xl },
  departmentOption: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 54,
    paddingHorizontal: spacing.lg,
  },
  departmentOptionSelected: { backgroundColor: palette.sageSoft, borderColor: palette.sage },
  departmentRadio: {
    alignItems: 'center',
    borderColor: palette.border,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  departmentRadioSelected: { borderColor: palette.sageDark },
  departmentRadioDot: {
    backgroundColor: palette.sageDark,
    borderRadius: radius.pill,
    height: 11,
    width: 11,
  },
  departmentOptionText: { color: palette.textMuted, flex: 1, fontSize: 14, marginLeft: spacing.md },
  departmentOptionTextSelected: { color: palette.text, fontWeight: '700' },
});
