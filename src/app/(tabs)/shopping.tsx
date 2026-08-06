import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/mealmate/app-icon';
import { getMealMateTabBarContentInset } from '@/components/mealmate/meal-mate-tab-bar';
import { ScreenHeader } from '@/components/mealmate/screen-header';
import { palette, radius, spacing } from '@/constants/mealmate-theme';
import {
  dateToIso,
  getWeekRangeLabel,
  jumboDepartments,
  type Department,
} from '@/data/mock-data';
import { mealMateHaptics } from '@/lib/mealmate-haptics';
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
  const insets = useSafeAreaInsets();
  const {
    shoppingItems,
    completedShoppingIds,
    recipes,
    plannedMeals,
    mealPlans,
    weekDays,
    changeWeek,
    toggleShoppingItem,
  } = useMealMate();
  const [groupMode, setGroupMode] = useState<GroupMode>('department');
  const [showCompleted, setShowCompleted] = useState(true);
  const [isChangingWeek, setIsChangingWeek] = useState(false);
  const completedCount = completedShoppingIds.filter((id) =>
    shoppingItems.some((item) => item.id === id),
  ).length;
  const completedItemsLabel = `${completedCount} afgevinkte ${completedCount === 1 ? 'product' : 'producten'}`;
  const todayIso = dateToIso(new Date());
  const hasPastMeal = weekDays.some(
    (day) => day.isoDate < todayIso && (mealPlans[day.isoDate] ?? []).length > 0,
  );
  const hasCurrentOrFutureMeal = weekDays.some(
    (day) => day.isoDate >= todayIso && (mealPlans[day.isoDate] ?? []).length > 0,
  );
  const onlyHasPastMeals = hasPastMeal && !hasCurrentOrFutureMeal;

  const toggleItem = async (item: ShoppingItem) => {
    const wasCompleted = completedShoppingIds.includes(item.id);
    await toggleShoppingItem(item.id);
    if (!wasCompleted && completedCount + 1 === shoppingItems.length) {
      mealMateHaptics.listComplete();
      return;
    }
    mealMateHaptics.selection();
  };

  const selectAdjacentWeek = async (direction: -1 | 1) => {
    if (isChangingWeek) return;
    setIsChangingWeek(true);
    try {
      await changeWeek(direction);
      setShowCompleted(true);
    } catch (error) {
      if (__DEV__) console.warn('Tably shopping week change failed', error);
    } finally {
      setIsChangingWeek(false);
    }
  };

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
      const recipeIds = (mealPlans[day.isoDate] ?? []).map((plan) => plan.recipeId);
      if (recipeIds.length === 0 && plannedMeals[day.isoDate]) {
        recipeIds.push(plannedMeals[day.isoDate] as string);
      }
      recipeIds.forEach((recipeId) => {
        const title = recipes.find((recipe) => recipe.id === recipeId)?.title;
        if (title && !recipeOrder.has(title)) recipeOrder.set(title, index);
      });
    });

    return Array.from(grouped, ([title, data]) => ({ title, data })).sort(
      (a, b) =>
        (recipeOrder.get(a.title) ?? Number.MAX_SAFE_INTEGER) -
        (recipeOrder.get(b.title) ?? Number.MAX_SAFE_INTEGER),
    );
  }, [completedShoppingIds, groupMode, mealPlans, plannedMeals, recipes, shoppingItems, showCompleted, weekDays]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.key}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: getMealMateTabBarContentInset(insets.bottom) },
        ]}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled
        ListHeaderComponent={
          <View>
            <ScreenHeader
              eyebrow="AUTOMATISCH GESORTEERD"
              title="Boodschappen"
              subtitle="Per product zie je voor welk gerecht het nodig is. Handig bij vervangen in de winkel."
            />
            <View style={styles.toolbarCard}>
              <View style={styles.weekRow}>
                <Pressable
                  onPress={() => void selectAdjacentWeek(-1)}
                  disabled={isChangingWeek}
                  accessibilityRole="button"
                  accessibilityLabel="Vorige boodschappenweek"
                  style={({ pressed }) => [
                    styles.weekButton,
                    (pressed || isChangingWeek) && styles.pressed,
                  ]}>
                  <AppIcon
                    name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
                    tintColor={palette.sageDark}
                    size={18}
                  />
                </Pressable>
                <View style={styles.weekCopy}>
                  <Text style={styles.weekEyebrow}>BOODSCHAPPENWEEK</Text>
                  <Text style={styles.weekLabel}>{getWeekRangeLabel(weekDays)}</Text>
                </View>
                <Pressable
                  onPress={() => void selectAdjacentWeek(1)}
                  disabled={isChangingWeek}
                  accessibilityRole="button"
                  accessibilityLabel="Volgende boodschappenweek"
                  style={({ pressed }) => [
                    styles.weekButton,
                    (pressed || isChangingWeek) && styles.pressed,
                  ]}>
                  <AppIcon
                    name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                    tintColor={palette.sageDark}
                    size={18}
                  />
                </Pressable>
              </View>
              <View style={styles.progressRow}>
                <Text style={styles.progressTitle}>
                  {completedCount}/{shoppingItems.length} afgevinkt
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
              <View style={styles.toolbarRow}>
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
                {completedCount > 0 ? (
                  <Pressable
                    onPress={() => setShowCompleted((current) => !current)}
                    accessibilityRole="button"
                    accessibilityLabel={`${completedItemsLabel} ${showCompleted ? 'verbergen' : 'tonen'}`}
                    style={({ pressed }) => [styles.toolbarAction, pressed && styles.pressed]}>
                    <AppIcon
                      name={
                        showCompleted
                          ? {
                              ios: 'eye.slash',
                              android: 'visibility_off',
                              web: 'visibility_off',
                            }
                          : {
                              ios: 'eye',
                              android: 'visibility',
                              web: 'visibility',
                            }
                      }
                      tintColor={palette.sageDark}
                      size={16}
                    />
                    <Text style={styles.toolbarActionText}>
                      {showCompleted ? 'Verberg' : 'Toon'} ({completedCount})
                    </Text>
                  </Pressable>
                ) : null}
                <Pressable
                  onPress={() => router.push('/add-shopping-item')}
                  accessibilityRole="button"
                  accessibilityLabel="Los product toevoegen"
                  style={({ pressed }) => [
                    styles.toolbarAction,
                    styles.addAction,
                    pressed && styles.pressed,
                  ]}>
                  <AppIcon
                    name={{ ios: 'plus', android: 'add', web: 'add' }}
                    tintColor={palette.sageDark}
                    size={16}
                  />
                  <Text style={styles.toolbarActionText}>Product</Text>
                </Pressable>
              </View>
            </View>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text accessibilityRole="header" style={styles.sectionTitle}>
              {section.title}
            </Text>
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
            completed={completedShoppingIds.includes(listItem.item.id)}
            onToggle={() => void toggleItem(listItem.item)}
            onOpenActions={() =>
              router.push({
                pathname: '/shopping-item-actions',
                params: {
                  itemId: listItem.item.id,
                  canRemove: String(listItem.showRemove),
                },
              })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {shoppingItems.length
                ? 'Alles is afgevinkt'
                : onlyHasPastMeals
                  ? 'De geplande gerechten zijn geweest'
                  : 'De lijst is nog leeg'}
            </Text>
            <Text style={styles.emptyText}>
              {shoppingItems.length
                ? 'Toon afgestreepte producten om ze weer te bekijken.'
                : onlyHasPastMeals
                  ? 'De bijbehorende ingrediënten zijn automatisch van deze lijst gehaald.'
                  : 'Plan een gerecht om ingrediënten toe te voegen.'}
            </Text>
          </View>
        }
      />
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
  completed,
  onToggle,
  onOpenActions,
}: {
  item: ShoppingItem;
  amount: number;
  subtitle?: string;
  completed: boolean;
  onToggle: () => void;
  onOpenActions: () => void;
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
      <Pressable
        onPress={onOpenActions}
        accessibilityRole="button"
        accessibilityLabel={`Meer acties voor ${item.name}`}
        hitSlop={6}
        style={({ pressed }) => [styles.rowActionButton, pressed && styles.pressed]}>
        <AppIcon
          name={{ ios: 'ellipsis', android: 'more_horiz', web: 'more_horiz' }}
          tintColor={palette.textSoft}
          size={20}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.xl },
  toolbarCard: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    marginTop: spacing.xl,
    padding: spacing.md,
  },
  weekRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: spacing.xs,
  },
  weekButton: {
    alignItems: 'center',
    backgroundColor: palette.sageSoft,
    borderRadius: radius.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  weekCopy: { alignItems: 'center', flex: 1 },
  weekEyebrow: {
    color: palette.textSoft,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  weekLabel: { color: palette.text, fontSize: 16, fontWeight: '800', marginTop: 2 },
  progressRow: { alignItems: 'center', flexDirection: 'row' },
  progressTitle: { color: palette.text, fontSize: 13, fontWeight: '700' },
  progressTrack: {
    backgroundColor: palette.surfaceStrong,
    borderRadius: radius.pill,
    flex: 1,
    height: 6,
    marginLeft: spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: palette.sageDark,
    borderRadius: radius.pill,
    height: 6,
  },
  toolbarRow: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  segmentedControl: {
    backgroundColor: palette.surfaceMuted,
    borderRadius: radius.md,
    flexDirection: 'row',
    flex: 1,
    padding: spacing.xs,
  },
  groupButton: {
    alignItems: 'center',
    borderRadius: radius.sm,
    flex: 1,
    paddingVertical: spacing.sm,
  },
  groupButtonSelected: { backgroundColor: palette.surface },
  groupButtonText: {
    color: palette.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  groupButtonTextSelected: { color: palette.sageDark, fontWeight: '800' },
  toolbarAction: {
    alignItems: 'center',
    backgroundColor: palette.surfaceMuted,
    borderRadius: radius.sm,
    flexDirection: 'row',
    gap: spacing.xs,
    minHeight: 44,
    paddingHorizontal: 8,
  },
  addAction: { backgroundColor: palette.sageSoft },
  toolbarActionText: {
    color: palette.sageDark,
    fontSize: 11,
    fontWeight: '700',
  },
  sectionHeader: {
    alignItems: 'center',
    backgroundColor: palette.background,
    borderBottomColor: palette.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 50,
    paddingVertical: spacing.md,
    zIndex: 1,
  },
  sectionTitle: { color: palette.text, fontSize: 19, fontWeight: '700' },
  sectionCount: { color: palette.textSoft, fontSize: 13, fontWeight: '600' },
  sectionGap: { height: spacing.xs },
  itemSeparator: { height: 1, backgroundColor: palette.border, marginLeft: 51 },
  itemRow: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    flexDirection: 'row',
    minHeight: 66,
  },
  itemMain: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
  },
  rowActionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    minWidth: 48,
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
  checkboxChecked: {
    backgroundColor: palette.sageDark,
    borderColor: palette.sageDark,
  },
  itemCopy: { flex: 1, marginHorizontal: spacing.md },
  itemName: { color: palette.text, fontSize: 15, fontWeight: '600' },
  itemSource: {
    color: palette.textMuted,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 5,
  },
  itemAmount: { color: palette.textMuted, fontSize: 13, fontWeight: '600' },
  completedText: {
    color: palette.textSoft,
    textDecorationLine: 'line-through',
  },
  emptyState: { alignItems: 'center', paddingVertical: 70 },
  emptyTitle: { color: palette.text, fontSize: 17, fontWeight: '700' },
  emptyText: { color: palette.textMuted, fontSize: 14, marginTop: spacing.sm },
});
