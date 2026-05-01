import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { isExpiringSoon } from '@/utils/expiry';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type FoodItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expirationDate: string;
  category: string;
  storageId: string;
  isExpiring: boolean;
  trackingMode: 'count' | 'amount' | 'fill';
};

type AddItemInput = {
  name: string;
  quantity: string;
  unit: string;
  expirationDate: string;
  category: string;
  storageLocation: string;
  trackingMode: 'count' | 'amount' | 'fill';
};

type UpdateItemInput = {
  id: string;
  updates: AddItemInput;
};

type FoodItemsContextType = {
  items: FoodItem[];
  isLoading: boolean;
  addItem: (item: AddItemInput) => Promise<void>;
  updateItem: (payload: UpdateItemInput) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
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

function getStorageIdFromLabel(label: string) {
  return STORAGE_ID_BY_LABEL[label] ?? 'pantry';
}

function mapRowToItem(row: any): FoodItem {
  const expirationDate = row.expiration_date ?? '';

  return {
    id: row.id,
    name: row.name,
    quantity: row.quantity,
    unit: row.unit,
    expirationDate,
    category: row.category ?? '',
    storageId: row.storage_id,
    trackingMode: row.tracking_mode ?? 'count',
    isExpiring: expirationDate ? isExpiringSoon(expirationDate) : false,
  };
}

export function FoodItemsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchItems = async () => {
    if (!user) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('food_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error.message);
      setIsLoading(false);
      return;
    }

    setItems((data ?? []).map(mapRowToItem));
    setIsLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [user]);

  const addItem = async (item: AddItemInput) => {
    if (!user) throw new Error('Not logged in');

    await supabase.from('food_items').insert({
      user_id: user.id,
      name: item.name,
      quantity: Number(item.quantity),
      unit: item.unit,
      expiration_date: item.expirationDate || null,
      category: item.category || null,
      storage_id: getStorageIdFromLabel(item.storageLocation),
      tracking_mode: item.trackingMode,
    });

    await fetchItems();
  };

  const updateItem = async ({ id, updates }: UpdateItemInput) => {
    await supabase
      .from('food_items')
      .update({
        name: updates.name,
        quantity: Number(updates.quantity),
        unit: updates.unit,
        expiration_date: updates.expirationDate || null,
        category: updates.category || null,
        storage_id: getStorageIdFromLabel(updates.storageLocation),
        tracking_mode: updates.trackingMode,
      })
      .eq('id', id);

    await fetchItems();
  };

  const deleteItem = async (id: string) => {
    await supabase.from('food_items').delete().eq('id', id);
    await fetchItems();
  };

  const value = useMemo(
    () => ({
      items,
      isLoading,
      addItem,
      updateItem,
      deleteItem,
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
    throw new Error('useFoodItems must be used within FoodItemsProvider');
  }
  return context;
}