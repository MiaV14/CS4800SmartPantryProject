import { FoodItem, MOCK_FOOD_ITEMS } from '@/data/mockFoodItems';
import { isExpiringSoon } from '@/utils/expiry';
import React, { createContext, useContext, useMemo, useState } from 'react';

type AddItemInput = Omit<FoodItem, 'id' | 'storageId' | 'isExpiring'> & {
  storageLocation: string;
};

type UpdateItemInput = {
  id: string;
  updates: Omit<FoodItem, 'id' | 'storageId' | 'isExpiring'> & {
    storageLocation: string;
  };
};

type FoodItemsContextType = {
  items: FoodItem[];
  addItem: (item: AddItemInput) => void;
  updateItem: (payload: UpdateItemInput) => void;
  deleteItem: (id: string) => void;
};

const FoodItemsContext = createContext<FoodItemsContextType | undefined>(
  undefined
);

const STORAGE_ID_BY_LABEL: Record<string, string> = {
  'Fridge - Main': 'fridge-main',
  'Fridge - Freezer': 'fridge-freezer',
  Pantry: 'pantry',
  Seasonings: 'seasonings',
};

function getstorageIdFromLabel(storageLocation: string): string {
  return STORAGE_ID_BY_LABEL[storageLocation] ?? 'pantry';
}

function createItemId(): string {
  return Date.now().toString();
}

export function FoodItemsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<FoodItem[]>(MOCK_FOOD_ITEMS);

  const addItem = (item: AddItemInput) => {
    const storageId = getstorageIdFromLabel(item.storageLocation);

    const newItem: FoodItem = {
      id: createItemId(),
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      expirationDate: item.expirationDate,
      category: item.category,
      storageId,
      isExpiring: isExpiringSoon(item.expirationDate),
    };

    setItems((prev) => [newItem, ...prev]);
  };

  const updateItem = ({ id, updates }: UpdateItemInput) => {
    const storageId = getstorageIdFromLabel(updates.storageLocation);

    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              name: updates.name,
              quantity: updates.quantity,
              unit: updates.unit,
              expirationDate: updates.expirationDate,
              category: updates.category,
              storageId,
              isExpiring: isExpiringSoon(updates.expirationDate),
            }
          : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateItem,
      deleteItem,
    }),
    [items]
  );

  return (
    <FoodItemsContext.Provider value={value}>
      {children}
    </FoodItemsContext.Provider>
  );
}

export function useFoodItems() {
  const context = useContext(FoodItemsContext);

  if (!context) {
    throw new Error('useFoodItems must be used within a FoodItemsProvider');
  }

  return context;
}