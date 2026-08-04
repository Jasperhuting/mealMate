import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ModalScreenHeader } from '@/components/mealmate/modal-screen-header';
import { palette, radius, spacing } from '@/constants/mealmate-theme';
import { jumboDepartments } from '@/data/mock-data';
import { mealMateHaptics } from '@/lib/mealmate-haptics';
import { useShoppingItemDraft } from '@/state/shopping-item-draft-provider';

export default function SelectShoppingDepartmentScreen() {
  const router = useRouter();
  const { department, setDepartment } = useShoppingItemDraft();

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ModalScreenHeader title="Afdeling kiezen" closeLabel="Sluit afdeling kiezen" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>AFDELING KIEZEN</Text>
        <Text style={styles.title}>Waar vind je dit product?</Text>
        <Text style={styles.subtitle}>Kies de plek waar je het in de winkel verwacht.</Text>

        <View style={styles.options} accessibilityRole="radiogroup">
          {jumboDepartments.map((option) => {
            const selected = option === department;
            return (
              <Pressable
                key={option}
                onPress={() => {
                  setDepartment(option);
                  if (!selected) mealMateHaptics.selection();
                  router.back();
                }}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                style={({ pressed }) => [
                  styles.option,
                  selected && styles.optionSelected,
                  pressed && styles.pressed,
                ]}>
                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected ? <View style={styles.radioDot} /> : null}
                </View>
                <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xl },
  eyebrow: { color: palette.sage, fontSize: 11, fontWeight: '800', letterSpacing: 1.1 },
  title: { color: palette.text, fontSize: 28, fontWeight: '700', marginTop: 6 },
  subtitle: { color: palette.textMuted, fontSize: 15, lineHeight: 20, marginTop: 6 },
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
  optionSelected: { backgroundColor: palette.sageSoft, borderColor: palette.sage },
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
  optionText: { color: palette.text, flex: 1, fontSize: 14, marginLeft: spacing.md },
  optionTextSelected: { color: palette.sageDark, fontWeight: '700' },
  pressed: { opacity: 0.7 },
});
