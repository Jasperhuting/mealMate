import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/mealmate/app-icon';
import { ModalScreenHeader } from '@/components/mealmate/modal-screen-header';
import { RecipeImage } from '@/components/mealmate/recipe-image';
import { palette, radius, spacing } from '@/constants/mealmate-theme';
import type { Ingredient, Recipe } from '@/data/mock-data';
import { useMealMate } from '@/state/meal-mate-provider';

export default function AddMealScreen() {
  const { dayId } = useLocalSearchParams<{ dayId: string }>();
  const router = useRouter();
  const { recipes, weekDays, plannedMeals, planMeal } = useMealMate();
  const initialRecipeId = typeof dayId === 'string' ? plannedMeals[dayId] : undefined;
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | undefined>();
  const [atHomeIds, setAtHomeIds] = useState<string[]>([]);
  const selectedRecipe = useMemo(
    () => recipes.find((recipe) => recipe.id === selectedRecipeId),
    [recipes, selectedRecipeId],
  );
  const day = weekDays.find((item) => item.id === dayId || item.isoDate === dayId);

  const selectRecipe = (recipe: Recipe) => {
    setSelectedRecipeId(recipe.id);
    setAtHomeIds([]);
  };

  const toggleAtHome = (ingredientId: string) => {
    setAtHomeIds((current) =>
      current.includes(ingredientId)
        ? current.filter((id) => id !== ingredientId)
        : [...current, ingredientId],
    );
  };

  const confirm = () => {
    if (!selectedRecipe || typeof dayId !== 'string') return;
    planMeal(dayId, selectedRecipe.id, atHomeIds);
    router.back();
  };

  if (selectedRecipe) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ModalScreenHeader
          title="Gerecht plannen"
          closeLabel="Sluit gerecht plannen"
          onBack={() => setSelectedRecipeId(undefined)}
          backLabel="Terug naar gerecht kiezen"
        />
        <FlatList
          data={selectedRecipe.ingredients}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              <View style={styles.stepRow}>
                <Text style={styles.stepActive}>1 Gerecht</Text>
                <View style={styles.stepLineActive} />
                <Text style={styles.stepActive}>2 Voorraad</Text>
              </View>
              <Text style={styles.eyebrow}>{day?.label.toUpperCase()} {day?.date} {day?.month.toUpperCase()}</Text>
              <Text style={styles.title}>Wat heb je al in huis?</Text>
              <Text style={styles.subtitle}>
                Vink ingrediënten aan die niet op de boodschappenlijst hoeven.
              </Text>
              <View style={styles.selectedRecipeCard}>
                <RecipeImage recipe={selectedRecipe} style={styles.selectedImage} />
                <View style={styles.selectedCopy}>
                  <Text style={styles.selectedTitle}>{selectedRecipe.title}</Text>
                  <Text style={styles.selectedMeta}>{selectedRecipe.ingredients.length} ingrediënten</Text>
                </View>
                <Pressable
                  onPress={() => setSelectedRecipeId(undefined)}
                  accessibilityRole="button"
                  style={styles.changeButton}>
                  <Text style={styles.changeText}>Wijzig</Text>
                </Pressable>
              </View>
              <Text style={styles.listTitle}>Tik aan wat al aanwezig is</Text>
            </View>
          }
          renderItem={({ item }) => (
            <IngredientRow
              ingredient={item}
              selected={atHomeIds.includes(item.id)}
              onPress={() => toggleAtHome(item.id)}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={<View style={styles.footerSpace} />}
        />
        <View style={styles.bottomBar}>
          <View style={styles.bottomCopy}>
            <Text style={styles.bottomCount}>{atHomeIds.length} al in huis</Text>
            <Text style={styles.bottomMeta}>
              {selectedRecipe.ingredients.length - atHomeIds.length} naar boodschappen
            </Text>
          </View>
          <Pressable
            onPress={confirm}
            accessibilityRole="button"
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <Text style={styles.primaryButtonText}>Plan gerecht</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ModalScreenHeader title="Gerecht plannen" closeLabel="Sluit gerecht plannen" />
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.stepRow}>
              <Text style={styles.stepActive}>1 Gerecht</Text>
              <View style={styles.stepLine} />
              <Text style={styles.stepInactive}>2 Voorraad</Text>
            </View>
            <Text style={styles.eyebrow}>{day?.label.toUpperCase()} {day?.date} {day?.month.toUpperCase()}</Text>
            <Text style={styles.title}>Kies een gerecht</Text>
            <Text style={styles.subtitle}>
              {initialRecipeId ? 'Vervang het huidige gerecht voor deze dag.' : 'Wat willen jullie deze dag eten?'}
            </Text>
            <Pressable
              onPress={() => router.push('/add-recipe')}
              accessibilityRole="button"
              style={({ pressed }) => [styles.newRecipeButton, pressed && styles.pressed]}>
              <View style={styles.newRecipeIcon}>
                <AppIcon
                  name={{ ios: 'plus', android: 'add', web: 'add' }}
                  tintColor={palette.sageDark}
                />
              </View>
              <View style={styles.newRecipeCopy}>
                <Text style={styles.newRecipeTitle}>Nieuw gerecht toevoegen</Text>
                <Text style={styles.newRecipeMeta}>Vul ingrediënten in en plan het daarna direct.</Text>
              </View>
              <AppIcon
                name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                tintColor={palette.textSoft}
                size={18}
              />
            </Pressable>
            <Text style={styles.listTitle}>Jullie recepten</Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.cardSeparator} />}
        renderItem={({ item }) => {
          const selected = initialRecipeId === item.id;
          return (
            <Pressable
              onPress={() => selectRecipe(item)}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.recipeRow,
                selected && styles.currentRecipeRow,
                pressed && styles.pressed,
              ]}>
              <RecipeImage recipe={item} style={styles.recipeImage} />
              <View style={styles.recipeCopy}>
                <Text style={styles.recipeTitle}>{item.title}</Text>
                <Text style={styles.recipeMeta}>{item.minutes} min · {item.ingredients.length} ingrediënten</Text>
                {selected ? <Text style={styles.currentLabel}>Nu gepland</Text> : null}
              </View>
              <AppIcon
                name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                tintColor={palette.textSoft}
                size={18}
              />
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

function IngredientRow({
  ingredient,
  selected,
  onPress,
}: {
  ingredient: Ingredient;
  selected: boolean;
  onPress: () => void;
}) {
  const amount = Number.isInteger(ingredient.amount)
    ? ingredient.amount
    : ingredient.amount.toFixed(1);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      style={({ pressed }) => [styles.ingredientRow, pressed && styles.pressed]}>
      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
        {selected ? (
          <AppIcon
            name={{ ios: 'checkmark', android: 'check', web: 'check' }}
            tintColor={palette.white}
            size={15}
          />
        ) : null}
      </View>
      <View style={styles.ingredientCopy}>
        <Text style={styles.ingredientName}>{ingredient.name}</Text>
        <Text style={styles.ingredientDepartment}>{ingredient.department}</Text>
      </View>
      <Text style={styles.ingredientAmount}>{amount} {ingredient.unit}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl },
  stepRow: { alignItems: 'center', flexDirection: 'row', marginBottom: spacing.xl },
  stepActive: { color: palette.sageDark, fontSize: 12, fontWeight: '700' },
  stepInactive: { color: palette.textSoft, fontSize: 12, fontWeight: '600' },
  stepLine: { backgroundColor: palette.border, flex: 1, height: 1, marginHorizontal: spacing.md },
  stepLineActive: { backgroundColor: palette.sage, flex: 1, height: 1, marginHorizontal: spacing.md },
  eyebrow: { color: palette.sage, fontSize: 11, fontWeight: '800', letterSpacing: 1.1 },
  title: { color: palette.text, fontSize: 28, fontWeight: '700', letterSpacing: -0.7, marginTop: 6 },
  subtitle: { color: palette.textMuted, fontSize: 15, lineHeight: 20, marginTop: 6 },
  newRecipeButton: {
    alignItems: 'center',
    borderColor: palette.sage,
    borderRadius: radius.lg,
    borderStyle: 'dashed',
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: spacing.xl,
    padding: spacing.md,
  },
  newRecipeIcon: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderRadius: radius.md,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  newRecipeCopy: { flex: 1, marginHorizontal: spacing.md },
  newRecipeTitle: { color: palette.text, fontSize: 14, fontWeight: '700' },
  newRecipeMeta: { color: palette.textMuted, fontSize: 11, marginTop: 4 },
  listTitle: { color: palette.text, fontSize: 19, fontWeight: '700', marginBottom: spacing.md, marginTop: spacing.xl },
  cardSeparator: { height: 10 },
  recipeRow: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    padding: spacing.sm,
  },
  currentRecipeRow: { borderColor: palette.sage },
  pressed: { opacity: 0.7 },
  recipeImage: { borderRadius: radius.md, height: 68, width: 68 },
  recipeCopy: { flex: 1, marginHorizontal: spacing.md },
  recipeTitle: { color: palette.text, fontSize: 15, fontWeight: '700' },
  recipeMeta: { color: palette.textMuted, fontSize: 12, marginTop: 5 },
  currentLabel: { color: palette.sage, fontSize: 11, fontWeight: '700', marginTop: 6 },
  selectedRecipeCard: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderRadius: radius.lg,
    flexDirection: 'row',
    marginTop: spacing.xl,
    padding: spacing.sm,
  },
  selectedImage: { borderRadius: radius.md, height: 64, width: 64 },
  selectedCopy: { flex: 1, marginLeft: spacing.md },
  selectedTitle: { color: palette.text, fontSize: 15, fontWeight: '700' },
  selectedMeta: { color: palette.textMuted, fontSize: 12, marginTop: 5 },
  changeButton: { padding: spacing.md },
  changeText: { color: palette.sageDark, fontSize: 12, fontWeight: '700' },
  ingredientRow: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    flexDirection: 'row',
    minHeight: 62,
    paddingHorizontal: spacing.lg,
  },
  separator: { backgroundColor: palette.border, height: 1, marginLeft: 55 },
  checkbox: {
    alignItems: 'center',
    borderColor: palette.border,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    height: 25,
    justifyContent: 'center',
    width: 25,
  },
  checkboxSelected: { backgroundColor: palette.sageDark, borderColor: palette.sageDark },
  ingredientCopy: { flex: 1, marginHorizontal: spacing.md },
  ingredientName: { color: palette.text, fontSize: 15, fontWeight: '600' },
  ingredientDepartment: { color: palette.textSoft, fontSize: 11, marginTop: 4 },
  ingredientAmount: { color: palette.textMuted, fontSize: 12, fontWeight: '600' },
  footerSpace: { height: 96 },
  bottomBar: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderTopColor: palette.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    padding: spacing.md,
  },
  bottomCopy: { flex: 1 },
  bottomCount: { color: palette.text, fontSize: 14, fontWeight: '700' },
  bottomMeta: { color: palette.textMuted, fontSize: 11, marginTop: 4 },
  primaryButton: { backgroundColor: palette.sageDark, borderRadius: radius.pill, paddingHorizontal: spacing.xl, paddingVertical: 14 },
  primaryButtonText: { color: palette.white, fontSize: 14, fontWeight: '700' },
});
