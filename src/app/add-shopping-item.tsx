import { Stack, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
  const [isSaving, setIsSaving] = useState(false);

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
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Pressable
              onPress={close}
              accessibilityRole="button"
              accessibilityLabel="Terug naar boodschappen"
              hitSlop={12}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
              <AppIcon
                name={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
                tintColor={palette.sageDark}
                size={18}
              />
              <Text style={styles.backText}>Terug</Text>
            </Pressable>
          ),
        }}
      />
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={88}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
          <Text style={styles.eyebrow}>LOSSE BOODSCHAP</Text>
          <Text style={styles.title}>Wat wil je toevoegen?</Text>
          <Text style={styles.subtitle}>
            Voor producten die niet uit een gepland gerecht komen, zoals koffie of fruit voor tussendoor.
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
            <View style={styles.departmentList}>
              {jumboDepartments.map((option) => {
                const selected = option === department;
                return (
                  <Pressable
                    key={option}
                    onPress={() => setDepartment(option)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    style={({ pressed }) => [
                      styles.departmentButton,
                      selected && styles.departmentButtonSelected,
                      pressed && styles.pressed,
                    ]}>
                    <View style={[styles.radio, selected && styles.radioSelected]}>
                      {selected ? <View style={styles.radioDot} /> : null}
                    </View>
                    <Text style={[styles.departmentText, selected && styles.departmentTextSelected]}>
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Pressable
            onPress={() => void save()}
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
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  keyboardView: { flex: 1 },
  backButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  backText: { color: palette.sageDark, fontSize: 16 },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  eyebrow: { color: palette.sage, fontSize: 11, fontWeight: '800', letterSpacing: 1.1 },
  title: {
    color: palette.text,
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.7,
    marginTop: spacing.sm,
  },
  subtitle: { color: palette.textMuted, fontSize: 15, lineHeight: 21, marginTop: spacing.sm },
  formCard: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    marginTop: spacing.xxl,
    padding: spacing.lg,
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
  amountRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  amountField: { flex: 1 },
  unitField: { flex: 1.35 },
  departmentList: { gap: spacing.sm },
  departmentLabel: { marginTop: spacing.lg },
  departmentButton: {
    alignItems: 'center',
    borderColor: palette.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  departmentButtonSelected: { backgroundColor: palette.sageSoft, borderColor: palette.sage },
  radio: {
    alignItems: 'center',
    borderColor: palette.textSoft,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  radioSelected: { borderColor: palette.sageDark },
  radioDot: { backgroundColor: palette.sageDark, borderRadius: radius.pill, height: 10, width: 10 },
  departmentText: { color: palette.textMuted, flex: 1, fontSize: 14, marginLeft: spacing.md },
  departmentTextSelected: { color: palette.text, fontWeight: '600' },
  saveButton: {
    alignItems: 'center',
    backgroundColor: palette.sageDark,
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.xl,
    minHeight: 56,
  },
  saveText: { color: palette.white, fontSize: 16, fontWeight: '700' },
  pressed: { opacity: 0.7 },
});
