import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/mealmate/app-icon';
import { ModalScreenHeader } from '@/components/mealmate/modal-screen-header';
import { palette, radius, spacing } from '@/constants/mealmate-theme';
import { normalizeIngredientPreferenceName } from '@/lib/ingredient-preferences';
import { mealMateHaptics } from '@/lib/mealmate-haptics';
import { useMealMate } from '@/state/meal-mate-provider';

export default function DislikedIngredientsScreen() {
  const router = useRouter();
  const { recipes, dislikedIngredientNames, saveDislikedIngredientNames } = useMealMate();
  const [query, setQuery] = useState('');
  const [selectedNames, setSelectedNames] = useState(() => new Set(dislikedIngredientNames));
  const [isSaving, setIsSaving] = useState(false);
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

  const ingredientOptions = useMemo(() => {
    const names = new Map<string, string>();
    recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        const normalizedName = normalizeIngredientPreferenceName(ingredient.name);
        if (normalizedName && !names.has(normalizedName)) names.set(normalizedName, ingredient.name);
      });
    });
    return [...names].map(([value, label]) => ({ value, label })).sort((a, b) =>
      a.label.localeCompare(b.label, 'nl'),
    );
  }, [recipes]);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = normalizeIngredientPreferenceName(query);
    if (!normalizedQuery) return ingredientOptions;
    return ingredientOptions.filter((item) =>
      normalizeIngredientPreferenceName(item.label).includes(normalizedQuery),
    );
  }, [ingredientOptions, query]);

  const toggleIngredient = (name: string) => {
    setSelectedNames((current) => {
      const updated = new Set(current);
      if (updated.has(name)) updated.delete(name);
      else updated.add(name);
      return updated;
    });
  };

  const save = async () => {
    setIsSaving(true);
    try {
      await saveDislikedIngredientNames([...selectedNames]);
      mealMateHaptics.success();
      router.back();
    } catch {
      mealMateHaptics.error();
      Alert.alert(
        'Voorkeuren bewaren mislukt',
        'Je keuzes konden niet worden opgeslagen. Controleer je internetverbinding en probeer het opnieuw.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ModalScreenHeader title="Wat lust je niet?" closeLabel="Sluit ingrediënten kiezen" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          style={styles.list}
          data={filteredOptions}
          keyExtractor={(item) => item.value}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          contentContainerStyle={styles.content}
          ListHeaderComponent={
            <View>
              <Text style={styles.eyebrow}>JOUW SMAAK</Text>
              <Text style={styles.title}>Welke ingrediënten lust je niet?</Text>
              <Text style={styles.subtitle}>
                Kies uit de ingrediënten die al in jullie gerechten staan. Alleen jij ziet deze voorkeur.
              </Text>
              <View style={styles.searchBox}>
                <AppIcon
                  name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
                  tintColor={palette.textSoft}
                />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  onSubmitEditing={Keyboard.dismiss}
                  placeholder="Zoek een ingrediënt..."
                  placeholderTextColor={palette.textSoft}
                  clearButtonMode="while-editing"
                  returnKeyType="search"
                  accessibilityLabel="Ingrediënten zoeken"
                  style={styles.searchInput}
                />
              </View>
              <View style={styles.selectionHeading}>
                <Text style={styles.selectionTitle}>Alle ingrediënten</Text>
                <Text style={styles.selectionCount}>{selectedNames.size} gekozen</Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Geen ingrediënt gevonden</Text>
              <Text style={styles.emptyText}>Probeer een andere zoekterm.</Text>
            </View>
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => {
            const isSelected = selectedNames.has(item.value);
            return (
              <Pressable
                onPress={() => toggleIngredient(item.value)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={item.label}
                style={({ pressed }) => [
                  styles.ingredientRow,
                  isSelected && styles.ingredientRowSelected,
                  pressed && styles.pressed,
                ]}>
                <Text style={[styles.ingredientName, isSelected && styles.ingredientNameSelected]}>
                  {item.label}
                </Text>
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                  {isSelected ? (
                    <AppIcon
                      name={{ ios: 'checkmark', android: 'check', web: 'check' }}
                      tintColor={palette.white}
                      size={15}
                    />
                  ) : null}
                </View>
              </Pressable>
            );
          }}
        />
      </KeyboardAvoidingView>
      <View style={[styles.saveBar, { bottom: keyboardHeight }]}>
        <Pressable
          onPress={() => void save()}
          disabled={isSaving}
          accessibilityRole="button"
          accessibilityLabel="Ingrediëntvoorkeuren bewaren"
          style={({ pressed }) => [styles.saveButton, (pressed || isSaving) && styles.pressed]}>
          {isSaving ? (
            <ActivityIndicator color={palette.white} />
          ) : (
            <Text style={styles.saveButtonText}>Bewaar voorkeuren</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: palette.background, flex: 1 },
  keyboardView: { flex: 1 },
  list: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 104 },
  eyebrow: { color: palette.sage, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  title: {
    color: palette.text,
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: -0.7,
    lineHeight: 33,
    marginTop: spacing.xs,
  },
  subtitle: { color: palette.textMuted, fontSize: 14, lineHeight: 20, marginTop: spacing.sm },
  searchBox: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  searchInput: { color: palette.text, flex: 1, fontSize: 15, height: 52, marginLeft: spacing.md },
  selectionHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    marginTop: spacing.xl,
  },
  selectionTitle: { color: palette.text, fontSize: 18, fontWeight: '700' },
  selectionCount: { color: palette.sageDark, fontSize: 12, fontWeight: '700' },
  ingredientRow: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 54,
    paddingHorizontal: spacing.lg,
  },
  ingredientRowSelected: { backgroundColor: palette.sageSoft, borderColor: palette.sage },
  ingredientName: { color: palette.text, flex: 1, fontSize: 14, fontWeight: '600' },
  ingredientNameSelected: { color: palette.sageDark, fontWeight: '700' },
  checkbox: {
    borderColor: palette.border,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    height: 24,
    width: 24,
  },
  checkboxSelected: {
    alignItems: 'center',
    backgroundColor: palette.sageDark,
    borderColor: palette.sageDark,
    justifyContent: 'center',
  },
  separator: { height: spacing.sm },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxxl },
  emptyTitle: { color: palette.text, fontSize: 16, fontWeight: '700' },
  emptyText: { color: palette.textMuted, fontSize: 13, marginTop: spacing.xs },
  saveBar: {
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
  saveButton: {
    alignItems: 'center',
    backgroundColor: palette.sageDark,
    borderRadius: radius.pill,
    justifyContent: 'center',
    minHeight: 52,
  },
  saveButtonText: { color: palette.white, fontSize: 15, fontWeight: '800' },
  pressed: { opacity: 0.7 },
});
