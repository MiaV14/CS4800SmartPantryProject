import { useAuth } from '@/context/AuthContext';
import { FoodItem } from '@/data/mockFoodItems';
import { supabase } from '@/lib/supabase';
import { isExpiringSoon } from '@/utils/expiry';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

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
  isLoading: boolean;
  addItem: (item: AddItemInput) => Promise<void>;
  updateItem: (payload: UpdateItemInput) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  refreshItems: () => Promise<void>;
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

function getStorageIdFromLabel(storageLocation: string): string {
  return STORAGE_ID_BY_LABEL[storageLocation] ?? 'pantry';
}

function getStorageLabelFromId(storageId: string): string {
  const entry = Object.entries(STORAGE_ID_BY_LABEL).find(
    ([, value]) => value === storageId
  );

  return entry?.[0] ?? 'Pantry';
}

function mapRowToFoodItem(row: {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiration_date: string | null;
  category: string | null;
  storage_id: string;
}): FoodItem {
  const expirationDate = row.expiration_date ?? '';

  return {
    id: row.id,
    name: row.name,
    quantity: row.quantity,
    unit: row.unit,
    expirationDate,
    category: row.category ?? '',
    storageId: row.storage_id,
    isExpiring: expirationDate ? isExpiringSoon(expirationDate) : false,
  };
}

export function FoodItemsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [items, setItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshItems = async () => {
    if (!user) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const { data, error } = await supabase
      .from('food_items')
      .select('id, name, quantity, unit, expiration_date, category, storage_id')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching food items:', error.message);
      setItems([]);
      setIsLoading(false);
      return;
    }

    const mappedItems = (data ?? []).map(mapRowToFoodItem);
    setItems(mappedItems);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshItems();
  }, [user]);

  const addItem = async (item: AddItemInput) => {
    if (!user) {
      throw new Error('You must be logged in to add items.');
    }

    const storageId = getStorageIdFromLabel(item.storageLocation);

    const { error } = await supabase.from('food_items').insert({
      user_id: user.id,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      expiration_date: item.expirationDate || null,
      category: item.category || null,
      storage_id: storageId,
    });

    if (error) {
      throw new Error(error.message);
    }

    await refreshItems();
  };

  const updateItem = async ({ id, updates }: UpdateItemInput) => {
    if (!user) {
      throw new Error('You must be logged in to update items.');
    }

    const storageId = getStorageIdFromLabel(updates.storageLocation);

    const { error } = await supabase
      .from('food_items')
      .update({
        name: updates.name,
        quantity: updates.quantity,
        unit: updates.unit,
        expiration_date: updates.expirationDate || null,
        category: updates.category || null,
        storage_id: storageId,
      })
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    await refreshItems();
  };

  const deleteItem = async (id: string) => {
    if (!user) {
      throw new Error('You must be logged in to delete items.');
    }

    const { error } = await supabase.from('food_items').delete().eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    await refreshItems();
  };

  const value = useMemo(
    () => ({
      items,
      isLoading,
      addItem,
      updateItem,
      deleteItem,
      refreshItems,
    }),
    [items, isLoading]
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

export { getStorageLabelFromId };

