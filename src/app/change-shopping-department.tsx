import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ModalScreenHeader } from '@/components/mealmate/modal-screen-header';
import { palette, radius, spacing } from '@/constants/mealmate-theme';
import { jumboDepartments, type Department } from '@/data/mock-data';
import { mealMateHaptics } from '@/lib/mealmate-haptics';
import { useMealMate } from '@/state/meal-mate-provider';

export default function ChangeShoppingDepartmentScreen() {
  const router = useRouter();
  const { itemId } = useLocalSearchParams<{ itemId?: string }>();
  const { shoppingItems, updateShoppingItemDepartment } = useMealMate();
  const [changingDepartment, setChangingDepartment] = useState<Department>();
  const item = shoppingItems.find(
    (shoppingItem) => shoppingItem.id === (typeof itemId === 'string' ? itemId : undefined),
  );

  const close = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/shopping');
  };

  const selectDepartment = async (department: Department) => {
    if (!item || changingDepartment) return;
    if (item.department === department) {
      close();
      return;
    }

    setChangingDepartment(department);
    try {
      await updateShoppingItemDepartment(item.id, department);
      mealMateHaptics.selection();
      close();
    } catch {
      mealMateHaptics.error();
      Alert.alert(
        'Afdeling wijzigen mislukt',
        'Controleer je internetverbinding en probeer het opnieuw.',
      );
    } finally {
      setChangingDepartment(undefined);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ModalScreenHeader title="Afdeling wijzigen" closeLabel="Sluit afdeling wijzigen" />
      {item ? (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.eyebrow}>WINKELAFDELING</Text>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subtitle}>Waar wil je dit product in de winkel terugvinden?</Text>

          <View style={styles.options} accessibilityRole="radiogroup">
            {jumboDepartments.map((department) => {
              const selected = item.department === department;
              const isChanging = changingDepartment === department;

              return (
                <Pressable
                  key={department}
                  disabled={Boolean(changingDepartment)}
                  onPress={() => void selectDepartment(department)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected, disabled: Boolean(changingDepartment) }}
                  style={({ pressed }) => [
                    styles.option,
                    selected && styles.optionSelected,
                    pressed && styles.pressed,
                  ]}>
                  <View style={[styles.radio, selected && styles.radioSelected]}>
                    {selected ? <View style={styles.radioDot} /> : null}
                  </View>
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                    {department}
                  </Text>
                  {isChanging ? (
                    <ActivityIndicator color={palette.sageDark} size="small" />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Product niet gevonden</Text>
          <Text style={styles.emptyText}>Dit product staat niet meer op je boodschappenlijst.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xl },
  eyebrow: {
    color: palette.sage,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  title: {
    color: palette.text,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.7,
    marginTop: 6,
  },
  subtitle: {
    color: palette.textMuted,
    fontSize: 15,
    lineHeight: 20,
    marginTop: 6,
  },
  options: { gap: spacing.sm, marginTop: spacing.xl },
  option: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 56,
    paddingHorizontal: spacing.lg,
  },
  optionSelected: {
    backgroundColor: palette.sageSoft,
    borderColor: palette.sage,
  },
  radio: {
    alignItems: 'center',
    borderColor: palette.border,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  radioSelected: { borderColor: palette.sageDark },
  radioDot: {
    backgroundColor: palette.sageDark,
    borderRadius: radius.pill,
    height: 10,
    width: 10,
  },
  optionText: {
    color: palette.text,
    flex: 1,
    fontSize: 14,
    marginLeft: spacing.md,
  },
  optionTextSelected: { color: palette.sageDark, fontWeight: '700' },
  pressed: { opacity: 0.7 },
  emptyState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyTitle: { color: palette.text, fontSize: 18, fontWeight: '700' },
  emptyText: {
    color: palette.textMuted,
    fontSize: 14,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
