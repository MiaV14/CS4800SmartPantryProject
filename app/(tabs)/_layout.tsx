// (tabs) _layout.tsx

import { COLORS } from '@/constants/colors';
import { useAddItemDraft } from '@/context/AddItemDraftContext';
import { useFoodItems } from '@/context/FoodItemsContext';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, router } from 'expo-router';
import React, { useEffect, useState } from 'react';

import BottomSheetModal from '@/components/modals/BottomSheetModal';
import ItemFormModal, { ItemFormValues } from '@/components/modals/ItemFormModal';
import AddTabButton from '@/components/ui/AddTabButton';
import AppButton from '@/components/ui/AppButton';
import AppText from '@/components/ui/AppText';

const EMPTY_ITEM_FORM = {
  name: '',
  quantity: '',
  unit: '',
  expirationDate: '',
  category: '',
  storageLocation: '',
  trackingMode: 'count',
};

export default function TabLayout() {
  const { addItem } = useFoodItems();
  const { draft, clearDraft } = useAddItemDraft();

  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showAddFormModal, setShowAddFormModal] = useState(false);

  useEffect(() => {
    if (draft) {
      setShowAddFormModal(true);
    }
  }, [draft]);

  const closeChoiceModal = () => {
    setShowChoiceModal(false);
  };

  const closeAddFormModal = () => {
    setShowAddFormModal(false);
    clearDraft();
  };

  const goToManualForm = () => {
    setShowChoiceModal(false);
    clearDraft();
    setShowAddFormModal(true);
  };

  const goToBarcodeScan = () => {
    setShowChoiceModal(false);
    router.push('/scan/barcode');
  };

  const goToReceiptScan = () => {
    setShowChoiceModal(false);
    router.push('/scan/receipt');
  };

  const handleAddItem = async (values: ItemFormValues) => {
    try {
      await addItem(values);
      setShowAddFormModal(false);
      clearDraft();
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.active,
          tabBarInactiveTintColor: COLORS.inactive,
          tabBarStyle: {
            height: 80,
            paddingTop: 8,
            paddingBottom: 12,
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="recipes"
          options={{
            title: 'Recipes',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="restaurant" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="add"
          options={{
            title: '',
            tabBarLabel: () => null,
            tabBarIcon: () => null,
            tabBarButton: () => (
              <AddTabButton onPress={() => setShowChoiceModal(true)} />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
            },
          }}
        />

        <Tabs.Screen
          name="list"
          options={{
            title: 'List',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Tabs>

      <BottomSheetModal visible={showChoiceModal} onClose={closeChoiceModal}>
        <>
          <AppText
            variant="sectionTitle"
            style={{ textAlign: 'center', marginBottom: 4 }}
          >
            Add Item
          </AppText>

          <AppButton
            title="Add Manually"
            onPress={goToManualForm}
            variant="secondary"
          />

          <AppButton
            title="Scan Receipt"
            onPress={goToReceiptScan}
            variant="primary"
          />

          <AppButton
            title="Scan Item / Barcode"
            onPress={goToBarcodeScan}
            variant="accent"
          />
        </>
      </BottomSheetModal>

      <ItemFormModal
        visible={showAddFormModal}
        mode="add"
        initialValues={draft ?? EMPTY_ITEM_FORM}
        onClose={closeAddFormModal}
        onSubmit={handleAddItem}
      />
    </>
  );
}