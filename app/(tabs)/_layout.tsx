import { COLORS } from '@/constants/colors';
import { useFoodItems } from '@/context/FoodItemsContext';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useState } from 'react';

import BottomSheetModal from '@/components/modals/BottomSheetModal';
import ItemFormModal, { ItemFormValues } from '@/components/modals/ItemFormModal';
import AddTabButton from '@/components/ui/AddTabButton';
import AppButton from '@/components/ui/AppButton';
import AppText from '@/components/ui/AppText';

const EMPTY_ITEM_FORM: ItemFormValues = {
  name: '',
  quantity: '',
  unit: '',
  expirationDate: '',
  category: '',
  storageLocation: '',
};

export default function TabLayout() {
  const { addItem } = useFoodItems();

  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showAddFormModal, setShowAddFormModal] = useState(false);

  const closeChoiceModal = () => {
    setShowChoiceModal(false);
  };

  const goToManualForm = () => {
    setShowChoiceModal(false);
    setShowAddFormModal(true);
  };

  const handleAddItem = (values: ItemFormValues) => {
    addItem(values);
    setShowAddFormModal(false);
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
        <React.Fragment>
          <AppText variant="sectionTitle" style={{ textAlign: 'center', marginBottom: 4 }}>
            Add Item
          </AppText>

          <AppButton
            title="Add Manually"
            onPress={goToManualForm}
            variant="secondary"
          />

          <AppButton
            title="Scan Receipt"
            onPress={() => {}}
            variant="primary"
          />

          <AppButton
            title="Scan Item / Barcode"
            onPress={() => {}}
            variant="accent"
          />
        </React.Fragment>
      </BottomSheetModal>

      <ItemFormModal
        visible={showAddFormModal}
        mode="add"
        initialValues={EMPTY_ITEM_FORM}
        onClose={() => setShowAddFormModal(false)}
        onSubmit={handleAddItem}
      />
    </>
  );
}