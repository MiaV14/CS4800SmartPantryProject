import AppText from '@/components/ui/AppText';
import FilterChip from '@/components/ui/FilterChip';
import { COLORS } from '@/constants/colors';
import { FoodItem, useFoodItems } from '@/context/FoodItemsContext';
import { useGroceryList } from '@/context/GroceryListContext';
import { isExpired, isExpiringSoon } from '@/utils/expiry';
import { categorizeGroceryItem } from '@/utils/groceryCategorizer';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ListFilter = 'Full List' | 'My List' | 'Auto-Gen';
type SortMode = 'Category' | 'A-Z';

const LIST_FILTERS: ListFilter[] = ['Full List', 'My List', 'Auto-Gen'];

const CATEGORY_ORDER = [
  'Produce',
  'Meat',
  'Seafood',
  'Dairy',
  'Frozen',
  'Grain',
  'Seasoning',
  'Condiment',
  'Snack',
  'Beverage',
  'Other',
];

export default function ListScreen() {
  const { items: pantryItems } = useFoodItems();
  const {
    groceryItems,
    addGroceryItem,
    toggleGroceryItemChecked,
    removeGroceryItem,
    hasGrocerySuggestion,
  } = useGroceryList();

  const [selectedFilter, setSelectedFilter] = useState<ListFilter>('Full List');
  const [sortMode, setSortMode] = useState<SortMode>('Category');
  const [manualName, setManualName] = useState('');

  const myListItems = useMemo(() => {
    return groceryItems
      .filter((item) => item.source === 'manual')
      .sort((a, b) => sortGroceryItems(a, b, sortMode));
  }, [groceryItems, sortMode]);

  const autoListItems = useMemo(() => {
    return groceryItems
      .filter((item) => item.source !== 'manual')
      .sort((a, b) => sortGroceryItems(a, b, sortMode));
  }, [groceryItems, sortMode]);

  const suggestedItems = useMemo(() => {
    const expired = pantryItems
      .filter(
        (item) =>
          item.expirationDate &&
          isExpired(item.expirationDate) &&
          !hasGrocerySuggestion(item.id)
      )
      .map((item) => ({
        item,
        source: 'expired' as const,
        label: 'Expired',
      }));

    const expiringSoon = pantryItems
      .filter(
        (item) =>
          item.expirationDate &&
          isExpiringSoon(item.expirationDate) &&
          !isExpired(item.expirationDate) &&
          !hasGrocerySuggestion(item.id)
      )
      .map((item) => ({
        item,
        source: 'expiring_soon' as const,
        label: 'Expiring Soon',
      }));

    return [...expired, ...expiringSoon].sort((a, b) =>
      compareCategories(a.item.category, b.item.category)
    );
  }, [pantryItems, hasGrocerySuggestion]);

  const showMyList = selectedFilter === 'Full List' || selectedFilter === 'My List';
  const showAutoList =
    selectedFilter === 'Full List' || selectedFilter === 'Auto-Gen';

  const handleAddManualItem = async () => {
    const trimmedName = manualName.trim();
    if (!trimmedName) return;

    try {
      await addGroceryItem({
        name: trimmedName,
        category: categorizeGroceryItem(trimmedName),
        source: 'manual',
      });

      setManualName('');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not add grocery item.');
    }
  };

  const handleAddSuggestion = async (
    pantryItem: FoodItem,
    source: 'expired' | 'expiring_soon'
  ) => {
    try {
      await addGroceryItem({
        name: pantryItem.name,
        quantity: pantryItem.quantity,
        unit: pantryItem.unit,
        category: pantryItem.category || 'Other',
        source,
        source_food_item_id: pantryItem.id,
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not add suggested item.');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await removeGroceryItem(itemId);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not delete grocery item.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppText variant="sectionTitle" style={styles.title}>
          Grocery List
        </AppText>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {LIST_FILTERS.map((filter) => (
            <FilterChip
              key={filter}
              label={filter}
              selected={selectedFilter === filter}
              onPress={() => setSelectedFilter(filter)}
            />
          ))}
        </ScrollView>

        {showMyList && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AppText variant="sectionTitle" style={styles.sectionTitle}>
                My List
              </AppText>

              <Pressable
                style={styles.sortButton}
                onPress={() =>
                  setSortMode((current) =>
                    current === 'Category' ? 'A-Z' : 'Category'
                  )
                }
              >
                <Ionicons
                  name="swap-vertical-outline"
                  size={16}
                  color={COLORS.blue_spruce_shadow}
                />
                <AppText variant="caption" style={styles.sortText}>
                  {sortMode}
                </AppText>
              </Pressable>
            </View>

            <View style={styles.listCard}>
              {myListItems.map((item) => (
                <ListRow
                  key={item.id}
                  title={item.name}
                  subtitle={item.category || 'Other'}
                  isChecked={item.is_checked}
                  onToggle={() =>
                    toggleGroceryItemChecked(item.id, !item.is_checked)
                  }
                  onDelete={() => handleDeleteItem(item.id)}
                />
              ))}

              <View style={styles.addRow}>
                <View style={styles.uncheckedBox} />

                <TextInput
                  value={manualName}
                  onChangeText={setManualName}
                  placeholder="Add Item"
                  placeholderTextColor={COLORS.mint_leaf}
                  style={styles.input}
                  returnKeyType="done"
                  onSubmitEditing={handleAddManualItem}
                />

                <IconButton
                  icon="add"
                  color={COLORS.mint_leaf}
                  onPress={handleAddManualItem}
                />
              </View>
            </View>
          </View>
        )}

        {showAutoList && (
          <View style={styles.section}>
            <AppText variant="sectionTitle" style={styles.sectionTitle}>
              Autolist
            </AppText>

            <View style={styles.listCard}>
              {autoListItems.map((item) => (
                <ListRow
                  key={item.id}
                  title={item.name}
                  subtitle={formatItemDetails(item.category, item.quantity, item.unit)}
                  isChecked={item.is_checked}
                  onToggle={() =>
                    toggleGroceryItemChecked(item.id, !item.is_checked)
                  }
                  onDelete={() => handleDeleteItem(item.id)}
                />
              ))}

              {suggestedItems.map(({ item, source, label }) => (
                <SuggestionRow
                  key={item.id}
                  title={item.name}
                  subtitle={`${item.category || 'Other'} · ${label}`}
                  onAdd={() => handleAddSuggestion(item, source)}
                />
              ))}

              {autoListItems.length === 0 && suggestedItems.length === 0 && (
                <View style={styles.emptyRow}>
                  <AppText variant="caption" style={styles.emptyText}>
                    No expired or expiring items to suggest.
                  </AppText>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ListRow({
  title,
  subtitle,
  isChecked,
  onToggle,
  onDelete,
}: {
  title: string;
  subtitle?: string;
  isChecked: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <View style={styles.row}>
      <Pressable
        onPress={onToggle}
        style={[styles.uncheckedBox, isChecked && styles.checkedBox]}
      >
        {isChecked && (
          <Ionicons name="checkmark" size={20} color={COLORS.porcelain} />
        )}
      </Pressable>

      <Pressable style={styles.rowTextWrapper} onPress={onToggle}>
        <AppText
          variant="body"
          style={[styles.rowTitle, isChecked && styles.checkedText]}
        >
          {title}
        </AppText>

        {!!subtitle && (
          <AppText variant="caption" style={styles.rowSubtitle}>
            {subtitle}
          </AppText>
        )}
      </Pressable>

      <IconButton
        icon="trash-outline"
        color={COLORS.input_text}
        onPress={onDelete}
      />
    </View>
  );
}

function SuggestionRow({
  title,
  subtitle,
  onAdd,
}: {
  title: string;
  subtitle: string;
  onAdd: () => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.uncheckedBox} />

      <View style={styles.rowTextWrapper}>
        <AppText variant="body" style={styles.rowTitle}>
          {title}
        </AppText>

        <AppText variant="caption" style={styles.rowSubtitle}>
          {subtitle}
        </AppText>
      </View>

      <IconButton
        icon="add-circle-outline"
        color={COLORS.mint_leaf}
        onPress={onAdd}
      />
    </View>
  );
}

function IconButton({
  icon,
  color,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.iconButton} onPress={onPress} hitSlop={12}>
      <Ionicons name={icon} size={24} color={color} />
    </Pressable>
  );
}

function sortGroceryItems(
  a: { name: string; category: string | null; is_checked: boolean },
  b: { name: string; category: string | null; is_checked: boolean },
  sortMode: SortMode
) {
  if (a.is_checked !== b.is_checked) {
    return Number(a.is_checked) - Number(b.is_checked);
  }

  if (sortMode === 'A-Z') {
    return a.name.localeCompare(b.name);
  }

  const categoryComparison = compareCategories(a.category, b.category);

  if (categoryComparison !== 0) {
    return categoryComparison;
  }

  return a.name.localeCompare(b.name);
}

function compareCategories(a?: string | null, b?: string | null) {
  const aCategory = a?.trim() || 'Other';
  const bCategory = b?.trim() || 'Other';

  const aIndex = CATEGORY_ORDER.indexOf(aCategory);
  const bIndex = CATEGORY_ORDER.indexOf(bCategory);

  if (aIndex === -1 && bIndex === -1) {
    return aCategory.localeCompare(bCategory);
  }

  if (aIndex === -1) return 1;
  if (bIndex === -1) return -1;

  return aIndex - bIndex;
}

function formatItemDetails(
  category: string | null,
  quantity: number | null,
  unit: string | null
) {
  return [category || 'Other', quantity, unit].filter(Boolean).join(' · ');
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.porcelain_shadow,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
    gap: 22,
  },
  title: {
    color: COLORS.blue_spruce_shadow,
  },
  chipRow: {
    gap: 8,
    paddingRight: 8,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: COLORS.blue_spruce_shadow,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: COLORS.honeydew,
    borderWidth: 1,
    borderColor: COLORS.mint_leaf,
  },
  sortText: {
    color: COLORS.blue_spruce_shadow,
  },
  listCard: {
    backgroundColor: COLORS.honeydew,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.mint_leaf,
    overflow: 'hidden',
  },
  row: {
    minHeight: 56,
    paddingHorizontal: 8,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.mint_leaf_shadow,
  },
  addRow: {
    minHeight: 56,
    paddingHorizontal: 8,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  uncheckedBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: COLORS.porcelain,
    borderWidth: 2,
    borderColor: COLORS.mint_leaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: COLORS.mint_leaf,
    borderColor: COLORS.mint_leaf,
  },
  rowTextWrapper: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    color: COLORS.blue_spruce_shadow,
  },
  rowSubtitle: {
    color: COLORS.input_text,
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: COLORS.input_text,
  },
  input: {
    flex: 1,
    color: COLORS.blue_spruce_shadow,
    fontSize: 16,
    paddingVertical: 0,
  },
  iconButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyRow: {
    padding: 16,
  },
  emptyText: {
    color: COLORS.input_text,
  },
});