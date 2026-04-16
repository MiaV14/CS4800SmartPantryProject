import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ItemFormModal, { ItemFormValues } from '@/components/modals/ItemFormModal';
import AppText from '@/components/ui/AppText';
import BackButton from '@/components/ui/BackButton';
import FilterChip from '@/components/ui/FilterChip';
import FloatingAddButton from '@/components/ui/FloatingAddButton';
import FoodItemCard from '@/components/ui/FoodItemCard';
import { COLORS } from '@/constants/colors';
import { useFoodItems } from '@/context/FoodItemsContext';
import { FoodItem } from '@/data/mockFoodItems';

const CATEGORY_ORDER = [
  'Produce',
  'Meat',
  'Seafood',
  'Dairy',
  'Grain',
  'Seasoning',
  'Frozen',
  'Condiment',
  'Snack',
  'Beverage',
  'Other',
];

const STORAGE_LABELS: Record<string, string> = {
  'fridge-main': 'Fridge - Main',
  'fridge-freezer': 'Fridge - Freezer',
  pantry: 'Pantry',
  seasonings: 'Seasonings',
};

const EMPTY_ITEM_FORM: ItemFormValues = {
  name: '',
  quantity: '',
  unit: '',
  expirationDate: '',
  category: '',
  storageLocation: '',
};

export default function StorageScreen() {
  const router = useRouter();
  const { storageId } = useLocalSearchParams<{ storageId: string }>();
  const { items, addItem, updateItem, deleteItem } = useFoodItems();

  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const storageTitle = STORAGE_LABELS[storageId] ?? String(storageId);
  const lockedStorageLocation = STORAGE_LABELS[storageId] ?? 'Pantry';

  const storageItems = useMemo(() => {
    return items.filter((item) => item.storageId === storageId);
  }, [items, storageId]);

  const filterOptions = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const item of storageItems) {
      counts[item.category] = (counts[item.category] ?? 0) + 1;
    }

    const sortedCategories = Object.keys(counts)
      .filter((category) => counts[category] > 0)
      .sort((a, b) => {
        const countDifference = counts[b] - counts[a];

        if (countDifference !== 0) {
          return countDifference;
        }

        return CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b);
      });

    return ['All', ...sortedCategories];
  }, [storageItems]);

  useEffect(() => {
    if (!filterOptions.includes(selectedFilter)) {
      setSelectedFilter('All');
    }
  }, [filterOptions, selectedFilter]);

  const filteredItems = useMemo(() => {
    if (selectedFilter === 'All') {
      return storageItems;
    }

    return storageItems.filter((item) => item.category === selectedFilter);
  }, [storageItems, selectedFilter]);

  const editInitialValues: ItemFormValues = selectedItem
    ? {
        name: selectedItem.name,
        quantity: selectedItem.quantity,
        unit: selectedItem.unit ?? '',
        expirationDate: selectedItem.expirationDate ?? '',
        category: selectedItem.category,
        storageLocation: STORAGE_LABELS[selectedItem.storageId] ?? '',
      }
    : EMPTY_ITEM_FORM;

  const handleOpenEditModal = (item: FoodItem) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedItem(null);
  };

  const handleSaveItem = (values: ItemFormValues) => {
    if (!selectedItem) return;

    updateItem({
      id: selectedItem.id,
      updates: values,
    });

    handleCloseEditModal();
  };

  const handleAddItemToStorage = (values: ItemFormValues) => {
    addItem({
      ...values,
      storageLocation: lockedStorageLocation,
    });

    setShowAddModal(false);
  };

  const handleDeleteItem = () => {
    if (!selectedItem) return;

    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${selectedItem.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteItem(selectedItem.id);
            handleCloseEditModal();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />

        <View style={styles.titlePill}>
          <AppText variant="cardTitle" style={styles.titleText}>
            Storage: {storageTitle}
          </AppText>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {filterOptions.map((option) => (
            <FilterChip
              key={option}
              label={option}
              selected={selectedFilter === option}
              onPress={() => setSelectedFilter(option)}
            />
          ))}
        </ScrollView>

        {filteredItems.length > 0 ? (
          <View style={styles.grid}>
            {filteredItems.map((item) => (
              <FoodItemCard
                key={item.id}
                name={item.name}
                quantity={item.quantity}
                unit={item.unit}
                category={item.category}
                expirationDate={item.expirationDate}
                onPress={() => handleOpenEditModal(item)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <AppText variant="cardTitle">No items found</AppText>
            <AppText variant="caption">
              There are no items in this storage for the selected filter.
            </AppText>
          </View>
        )}
      </ScrollView>

      <FloatingAddButton onPress={() => setShowAddModal(true)} />

      <ItemFormModal
        visible={showEditModal}
        mode="edit"
        initialValues={editInitialValues}
        onClose={handleCloseEditModal}
        onSubmit={handleSaveItem}
        onDelete={handleDeleteItem}
      />

      <ItemFormModal
        visible={showAddModal}
        mode="add"
        initialValues={EMPTY_ITEM_FORM}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddItemToStorage}
        hideStorageField
        lockedStorageLocation={lockedStorageLocation}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.honeydew,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: COLORS.blue_spruce,
  },
  titlePill: {
    flex: 1,
    backgroundColor: COLORS.mint_leaf,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  titleText: {
    color: COLORS.porcelain,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 100,
  },
  chipRow: {
    gap: 8,
    paddingRight: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'flex-start',
  },
  emptyState: {
    backgroundColor: COLORS.porcelain,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
});