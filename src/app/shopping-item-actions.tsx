import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/mealmate/app-icon';
import { ModalScreenHeader } from '@/components/mealmate/modal-screen-header';
import { palette, radius, spacing } from '@/constants/mealmate-theme';
import { useMealMate } from '@/state/meal-mate-provider';

export default function ShoppingItemActionsScreen() {
  const router = useRouter();
  const { itemId, canRemove } = useLocalSearchParams<{
    itemId?: string;
    canRemove?: string;
  }>();
  const { shoppingItems, removeShoppingItem } = useMealMate();
  const item = shoppingItems.find(
    (shoppingItem) => shoppingItem.id === (typeof itemId === 'string' ? itemId : undefined),
  );

  const remove = () => {
    if (!item) return;
    Alert.alert(
      'Los product verwijderen?',
      `${item.name} wordt van de losse boodschappen verwijderd.${item.recipes.length ? ' Het deel voor jullie gerecht blijft staan.' : ''}`,
      [
        { text: 'Annuleer', style: 'cancel' },
        {
          text: 'Verwijder',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeShoppingItem(item.id);
              router.back();
            } catch {
              Alert.alert('Verwijderen mislukt', 'Probeer het opnieuw.');
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ModalScreenHeader title="Product" closeLabel="Sluit productacties" />
      {item ? (
        <View style={styles.content}>
          <Text style={styles.eyebrow}>PRODUCT</Text>
          <Text style={styles.title}>{item.name}</Text>
          <View style={styles.options}>
            <Pressable
              onPress={() =>
                router.replace({
                  pathname: '/change-shopping-department',
                  params: { itemId: item.id },
                })
              }
              accessibilityRole="button"
              accessibilityLabel={`Afdeling wijzigen van ${item.name}`}
              style={({ pressed }) => [styles.option, pressed && styles.pressed]}>
              <View style={styles.icon}>
                <AppIcon
                  name={{ ios: 'square.grid.2x2', android: 'grid_view', web: 'grid_view' }}
                  tintColor={palette.sageDark}
                  size={19}
                />
              </View>
              <View style={styles.optionCopy}>
                <Text style={styles.optionTitle}>Afdeling wijzigen</Text>
                <Text style={styles.optionSubtitle}>{item.department}</Text>
              </View>
              <AppIcon
                name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                tintColor={palette.textSoft}
                size={18}
              />
            </Pressable>

            {canRemove === 'true' ? (
              <Pressable
                onPress={remove}
                accessibilityRole="button"
                accessibilityLabel={`${item.name} van losse boodschappen verwijderen`}
                style={({ pressed }) => [styles.option, pressed && styles.pressed]}>
                <View style={[styles.icon, styles.dangerIcon]}>
                  <AppIcon
                    name={{ ios: 'trash', android: 'delete', web: 'delete' }}
                    tintColor={palette.danger}
                    size={19}
                  />
                </View>
                <Text style={[styles.optionTitle, styles.optionTitleStandalone, styles.dangerTitle]}>
                  Verwijderen
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>
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
  content: { padding: spacing.xl },
  eyebrow: { color: palette.sage, fontSize: 11, fontWeight: '800', letterSpacing: 1.1 },
  title: { color: palette.text, fontSize: 28, fontWeight: '700', marginTop: 6 },
  options: { gap: spacing.sm, marginTop: spacing.xl },
  option: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 64,
    paddingHorizontal: spacing.lg,
  },
  icon: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderRadius: radius.sm,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  optionCopy: { flex: 1, marginLeft: spacing.md },
  optionTitle: { color: palette.text, fontSize: 15, fontWeight: '700' },
  optionTitleStandalone: { flex: 1 },
  optionSubtitle: { color: palette.textMuted, fontSize: 12, marginTop: 2 },
  dangerIcon: { backgroundColor: '#F4E5E3' },
  dangerTitle: { color: palette.danger, marginLeft: spacing.md },
  pressed: { opacity: 0.7 },
  emptyState: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: spacing.xl },
  emptyTitle: { color: palette.text, fontSize: 18, fontWeight: '700' },
  emptyText: { color: palette.textMuted, fontSize: 14, marginTop: spacing.sm, textAlign: 'center' },
});
