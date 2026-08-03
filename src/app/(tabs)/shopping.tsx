import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/mealmate/app-icon';
import { ScreenHeader } from '@/components/mealmate/screen-header';
import { palette, radius, shadow, spacing } from '@/constants/mealmate-theme';
import { jumboDepartments, type Department } from '@/data/mock-data';
import { type ShoppingItem, useMealMate } from '@/state/meal-mate-provider';

const departmentOrder: readonly Department[] = jumboDepartments;

type GroupMode = 'department' | 'recipe';

type ShoppingListItem = {
  key: string;
  item: ShoppingItem;
  amount: number;
  subtitle?: string;
  showRemove: boolean;
};

export default function ShoppingScreen() {
  const router = useRouter();
  const {
    shoppingItems,
    completedShoppingIds,
    recipes,
    plannedMeals,
    weekDays,
    toggleShoppingItem,
    removeShoppingItem,
    updateShoppingItemDepartment,
  } = useMealMate();
  const [groupMode, setGroupMode] = useState<GroupMode>('department');
  const [showCompleted, setShowCompleted] = useState(true);
  const [departmentItemId, setDepartmentItemId] = useState<string>();
  const [changingDepartment, setChangingDepartment] = useState<Department>();
  const departmentItem = shoppingItems.find((item) => item.id === departmentItemId);
  const completedCount = completedShoppingIds.filter((id) =>
    shoppingItems.some((item) => item.id === id),
  ).length;

  const sections = useMemo(() => {
    const visibleItems = showCompleted
      ? shoppingItems
      : shoppingItems.filter((item) => !completedShoppingIds.includes(item.id));

    if (groupMode === 'department') {
      return departmentOrder
        .map((department) => ({
          title: department,
          data: visibleItems
            .filter((item) => item.department === department)
            .map<ShoppingListItem>((item) => ({
              key: `department-${department}-${item.id}`,
              item,
              amount: item.amount,
              showRemove: item.isManual,
            })),
        }))
        .filter((section) => section.data.length > 0);
    }

    const grouped = new Map<string, ShoppingListItem[]>();
    for (const item of visibleItems) {
      for (const source of item.sources) {
        const group = grouped.get(source.title) ?? [];
        group.push({
          key: `${source.type}-${source.title}-${item.id}`,
          item,
          amount: source.amount,
          subtitle: source.type === 'recipe' ? item.department : 'Niet gekoppeld aan een gerecht',
          showRemove: source.type === 'manual',
        });
        grouped.set(source.title, group);
      }
    }

    const recipeOrder = new Map<string, number>();
    weekDays.forEach((day, index) => {
      const title = recipes.find((recipe) => recipe.id === plannedMeals[day.isoDate])?.title;
      if (title && !recipeOrder.has(title)) recipeOrder.set(title, index);
    });

    return Array.from(grouped, ([title, data]) => ({ title, data })).sort(
      (a, b) =>
        (recipeOrder.get(a.title) ?? Number.MAX_SAFE_INTEGER) -
        (recipeOrder.get(b.title) ?? Number.MAX_SAFE_INTEGER),
    );
  }, [completedShoppingIds, groupMode, plannedMeals, recipes, shoppingItems, showCompleted, weekDays]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <View>
            <ScreenHeader
              eyebrow="AUTOMATISCH GESORTEERD"
              title="Boodschappen"
              subtitle="Per product zie je voor welk gerecht het nodig is. Handig bij vervangen in de winkel."
            />
            <View style={styles.progressCard}>
              <View style={styles.progressIcon}>
                <AppIcon
                  name={{ ios: 'cart', android: 'shopping_cart', web: 'shopping_cart' }}
                  tintColor={palette.sageDark}
                />
              </View>
              <View style={styles.progressCopy}>
                <Text style={styles.progressTitle}>
                  {completedCount} van {shoppingItems.length} afgevinkt
                </Text>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${shoppingItems.length ? (completedCount / shoppingItems.length) * 100 : 0}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
            <View style={styles.controlsCard}>
              <Text style={styles.controlsLabel}>Groepeer op</Text>
              <View style={styles.segmentedControl}>
                <GroupButton
                  label="Afdeling"
                  selected={groupMode === 'department'}
                  onPress={() => setGroupMode('department')}
                />
                <GroupButton
                  label="Gerecht"
                  selected={groupMode === 'recipe'}
                  onPress={() => setGroupMode('recipe')}
                />
              </View>
              <Pressable
                onPress={() => setShowCompleted((current) => !current)}
                accessibilityRole="switch"
                accessibilityState={{ checked: showCompleted }}
                accessibilityLabel="Afgestreepte producten tonen"
                style={({ pressed }) => [styles.completedToggle, pressed && styles.pressed]}>
                <AppIcon
                  name={
                    showCompleted
                      ? { ios: 'eye', android: 'visibility', web: 'visibility' }
                      : { ios: 'eye.slash', android: 'visibility_off', web: 'visibility_off' }
                  }
                  tintColor={palette.sageDark}
                  size={19}
                />
                <Text style={styles.completedToggleText}>
                  {showCompleted ? 'Verberg afgestreept' : 'Toon afgestreept'}
                </Text>
              </Pressable>
            </View>
            <Pressable
              onPress={() => router.push('/add-shopping-item')}
              accessibilityRole="button"
              style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
              <View style={styles.addButtonIcon}>
                <AppIcon
                  name={{ ios: 'plus', android: 'add', web: 'add' }}
                  tintColor={palette.sageDark}
                />
              </View>
              <View style={styles.addButtonCopy}>
                <Text style={styles.addButtonTitle}>Los product toevoegen</Text>
                <Text style={styles.addButtonText}>Voor alles wat niet bij een gerecht hoort</Text>
              </View>
              <AppIcon
                name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                tintColor={palette.textSoft}
                size={18}
              />
            </Pressable>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionCount}>{section.data.length}</Text>
          </View>
        )}
        SectionSeparatorComponent={() => <View style={styles.sectionGap} />}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        renderItem={({ item: listItem }) => (
          <ShoppingRow
            item={listItem.item}
            amount={listItem.amount}
            subtitle={listItem.subtitle}
            showRemove={listItem.showRemove}
            completed={completedShoppingIds.includes(listItem.item.id)}
            onToggle={() => toggleShoppingItem(listItem.item.id)}
            onChangeDepartment={() => setDepartmentItemId(listItem.item.id)}
            onRemove={() => {
              const item = listItem.item;
              Alert.alert(
                'Los product verwijderen?',
                `${item.name} wordt van de losse boodschappen verwijderd.${item.recipes.length ? ' Het deel voor jullie gerecht blijft staan.' : ''}`,
                [
                  { text: 'Annuleer', style: 'cancel' },
                  {
                    text: 'Verwijder',
                    style: 'destructive',
                    onPress: () => void removeShoppingItem(item.id),
                  },
                ],
              );
            }}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {shoppingItems.length ? 'Alles is afgevinkt' : 'De lijst is nog leeg'}
            </Text>
            <Text style={styles.emptyText}>
              {shoppingItems.length
                ? 'Toon afgestreepte producten om ze weer te bekijken.'
                : 'Plan een gerecht om ingrediënten toe te voegen.'}
            </Text>
          </View>
        }
      />
      <Modal
        visible={Boolean(departmentItem)}
        transparent
        animationType="fade"
        onRequestClose={() => !changingDepartment && setDepartmentItemId(undefined)}>
        <View style={styles.modalOverlay}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Afdelingskiezer sluiten"
            style={StyleSheet.absoluteFill}
            onPress={() => !changingDepartment && setDepartmentItemId(undefined)}
          />
          <SafeAreaView style={styles.modalSheet} edges={['bottom']}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalEyebrow}>AFDELING WIJZIGEN</Text>
            <Text style={styles.modalTitle}>{departmentItem?.name}</Text>
            <Text style={styles.modalText}>Waar wil je dit product in de winkel terugvinden?</Text>
            <ScrollView
              style={styles.departmentScroll}
              contentContainerStyle={styles.departmentOptions}
              showsVerticalScrollIndicator={false}>
              {departmentOrder.map((department) => {
                const selected = departmentItem?.department === department;
                return (
                  <Pressable
                    key={department}
                    disabled={Boolean(changingDepartment)}
                    onPress={async () => {
                      if (!departmentItem) return;
                      if (selected) {
                        setDepartmentItemId(undefined);
                        return;
                      }
                      setChangingDepartment(department);
                      try {
                        await updateShoppingItemDepartment(departmentItem.id, department);
                        setDepartmentItemId(undefined);
                      } catch {
                        Alert.alert(
                          'Afdeling wijzigen mislukt',
                          'Controleer je internetverbinding en probeer het opnieuw.',
                        );
                      } finally {
                        setChangingDepartment(undefined);
                      }
                    }}
                    accessibilityRole="radio"
                    accessibilityState={{ selected, disabled: Boolean(changingDepartment) }}
                    style={({ pressed }) => [
                      styles.departmentOption,
                      selected && styles.departmentOptionSelected,
                      pressed && styles.pressed,
                    ]}>
                    <View style={[styles.departmentRadio, selected && styles.departmentRadioSelected]}>
                      {selected ? <View style={styles.departmentRadioDot} /> : null}
                    </View>
                    <Text
                      style={[
                        styles.departmentOptionText,
                        selected && styles.departmentOptionTextSelected,
                      ]}>
                      {department}
                    </Text>
                    {changingDepartment === department ? (
                      <ActivityIndicator color={palette.sageDark} size="small" />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function GroupButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      style={({ pressed }) => [
        styles.groupButton,
        selected && styles.groupButtonSelected,
        pressed && styles.pressed,
      ]}>
      <Text style={[styles.groupButtonText, selected && styles.groupButtonTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

function ShoppingRow({
  item,
  amount,
  subtitle,
  showRemove,
  completed,
  onToggle,
  onChangeDepartment,
  onRemove,
}: {
  item: ShoppingItem;
  amount: number;
  subtitle?: string;
  showRemove: boolean;
  completed: boolean;
  onToggle: () => void;
  onChangeDepartment: () => void;
  onRemove: () => void;
}) {
  const formattedAmount = Number.isInteger(amount) ? amount : amount.toFixed(1);

  return (
    <View style={styles.itemRow}>
      <Pressable
        onPress={onToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: completed }}
        style={({ pressed }) => [styles.itemMain, pressed && styles.pressed]}>
        <View style={[styles.checkbox, completed && styles.checkboxChecked]}>
          {completed ? (
            <AppIcon
              name={{ ios: 'checkmark', android: 'check', web: 'check' }}
              tintColor={palette.white}
              size={15}
            />
          ) : null}
        </View>
        <View style={styles.itemCopy}>
          <Text style={[styles.itemName, completed && styles.completedText]}>{item.name}</Text>
          <Text style={styles.itemSource} numberOfLines={2}>
            {subtitle ??
              (item.recipes.length
                ? `Voor: ${item.recipes.join(' · ')}${item.isManual ? ' · ook los toegevoegd' : ''}`
                : 'Los toegevoegd')}
          </Text>
        </View>
        <Text style={[styles.itemAmount, completed && styles.completedText]}>
          {formattedAmount} {item.unit}
        </Text>
      </Pressable>
      <View style={styles.rowActions}>
        <Pressable
          onPress={onChangeDepartment}
          accessibilityRole="button"
          accessibilityLabel={`Wijzig afdeling van ${item.name}`}
          hitSlop={6}
          style={({ pressed }) => [styles.rowActionButton, pressed && styles.pressed]}>
          <AppIcon
            name={{ ios: 'arrow.left.arrow.right', android: 'swap_horiz', web: 'swap_horiz' }}
            tintColor={palette.textSoft}
            size={18}
          />
        </Pressable>
        {showRemove ? (
          <Pressable
            onPress={onRemove}
            accessibilityRole="button"
            accessibilityLabel={`Verwijder ${item.name} van losse boodschappen`}
            hitSlop={8}
            style={({ pressed }) => [styles.rowActionButton, pressed && styles.pressed]}>
            <AppIcon
              name={{ ios: 'trash', android: 'delete', web: 'delete' }}
              tintColor={palette.textSoft}
              size={18}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.xl, paddingBottom: 120 },
  progressCard: {
    ...shadow.card,
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderRadius: radius.lg,
    flexDirection: 'row',
    marginTop: spacing.xxl,
    padding: spacing.lg,
  },
  progressIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: radius.md,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  progressCopy: { flex: 1, marginLeft: spacing.md },
  progressTitle: { color: palette.text, fontSize: 14, fontWeight: '700' },
  progressTrack: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: radius.pill,
    height: 6,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  progressFill: { backgroundColor: palette.sageDark, borderRadius: radius.pill, height: 6 },
  controlsCard: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  controlsLabel: {
    color: palette.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  segmentedControl: {
    backgroundColor: palette.surfaceMuted,
    borderRadius: radius.md,
    flexDirection: 'row',
    padding: spacing.xs,
  },
  groupButton: {
    alignItems: 'center',
    borderRadius: radius.sm,
    flex: 1,
    paddingVertical: spacing.sm,
  },
  groupButtonSelected: { backgroundColor: palette.surface },
  groupButtonText: { color: palette.textMuted, fontSize: 13, fontWeight: '600' },
  groupButtonTextSelected: { color: palette.sageDark, fontWeight: '800' },
  completedToggle: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    minHeight: 36,
    paddingHorizontal: spacing.xs,
  },
  completedToggleText: { color: palette.sageDark, fontSize: 13, fontWeight: '700' },
  addButton: {
    alignItems: 'center',
    borderColor: palette.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: spacing.md,
    padding: spacing.md,
  },
  addButtonIcon: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderRadius: radius.md,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  addButtonCopy: { flex: 1, marginHorizontal: spacing.md },
  addButtonTitle: { color: palette.text, fontSize: 14, fontWeight: '700' },
  addButtonText: { color: palette.textMuted, fontSize: 11, marginTop: 4 },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
    marginTop: spacing.xxl,
  },
  sectionTitle: { color: palette.text, fontSize: 19, fontWeight: '700' },
  sectionCount: { color: palette.textSoft, fontSize: 13, fontWeight: '600' },
  sectionGap: { height: spacing.xs },
  itemSeparator: { height: 1, backgroundColor: palette.border, marginLeft: 51 },
  itemRow: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    flexDirection: 'row',
    minHeight: 76,
  },
  itemMain: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowActions: { alignItems: 'center', flexDirection: 'row' },
  rowActionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: spacing.md,
  },
  pressed: { opacity: 0.7 },
  checkbox: {
    alignItems: 'center',
    borderColor: palette.border,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  checkboxChecked: { backgroundColor: palette.sageDark, borderColor: palette.sageDark },
  itemCopy: { flex: 1, marginHorizontal: spacing.md },
  itemName: { color: palette.text, fontSize: 15, fontWeight: '600' },
  itemSource: { color: palette.sage, fontSize: 11, lineHeight: 15, marginTop: 5 },
  itemAmount: { color: palette.textMuted, fontSize: 13, fontWeight: '600' },
  completedText: { color: palette.textSoft, textDecorationLine: 'line-through' },
  emptyState: { alignItems: 'center', paddingVertical: 70 },
  emptyTitle: { color: palette.text, fontSize: 17, fontWeight: '700' },
  emptyText: { color: palette.textMuted, fontSize: 14, marginTop: spacing.sm },
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
    height: 10,
    width: 10,
  },
  departmentOptionText: { color: palette.text, flex: 1, fontSize: 14, marginLeft: spacing.md },
  departmentOptionTextSelected: { color: palette.sageDark, fontWeight: '700' },
});
