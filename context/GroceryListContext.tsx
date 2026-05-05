import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import { useAuth } from "@/context/AuthContext";
import {
    createGroceryListItem,
    deleteGroceryListItem,
    fetchGroceryListItems,
    updateGroceryListItemChecked,
} from "@/services/groceryListService";
import { GroceryListItem, NewGroceryListItem } from "@/types/database";

type GroceryListContextValue = {
  groceryItems: GroceryListItem[];
  isLoading: boolean;
  error: string | null;
  refreshGroceryItems: () => Promise<void>;
  addGroceryItem: (item: NewGroceryListItem) => Promise<void>;
  toggleGroceryItemChecked: (itemId: string, isChecked: boolean) => Promise<void>;
  removeGroceryItem: (itemId: string) => Promise<void>;
  hasGrocerySuggestion: (foodItemId: string) => boolean;
};

const GroceryListContext = createContext<GroceryListContextValue | undefined>(
  undefined
);

export function GroceryListProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const [groceryItems, setGroceryItems] = useState<GroceryListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshGroceryItems = useCallback(async () => {
    if (!user) {
      setGroceryItems([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const items = await fetchGroceryListItems(user.id);
      setGroceryItems(items);
    } catch (err) {
      console.error("Failed to fetch grocery list items:", err);
      setError("Could not load grocery list.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const addGroceryItem = useCallback(
    async (item: NewGroceryListItem) => {
      if (!user) return;

      const trimmedName = item.name.trim();
      if (!trimmedName) return;

      const createdItem = await createGroceryListItem(user.id, {
        ...item,
        name: trimmedName,
      });

      setGroceryItems((current) => [createdItem, ...current]);
    },
    [user]
  );

  const toggleGroceryItemChecked = useCallback(
    async (itemId: string, isChecked: boolean) => {
      await updateGroceryListItemChecked(itemId, isChecked);

      setGroceryItems((current) =>
        current.map((item) =>
          item.id === itemId ? { ...item, is_checked: isChecked } : item
        )
      );
    },
    []
  );

  const removeGroceryItem = useCallback(async (itemId: string) => {
    await deleteGroceryListItem(itemId);

    setGroceryItems((current) => current.filter((item) => item.id !== itemId));
  }, []);

  const hasGrocerySuggestion = useCallback(
    (foodItemId: string) => {
      return groceryItems.some((item) => item.source_food_item_id === foodItemId);
    },
    [groceryItems]
  );

  useEffect(() => {
    refreshGroceryItems();
  }, [refreshGroceryItems]);

  const value = useMemo(
    () => ({
      groceryItems,
      isLoading,
      error,
      refreshGroceryItems,
      addGroceryItem,
      toggleGroceryItemChecked,
      removeGroceryItem,
      hasGrocerySuggestion,
    }),
    [
      groceryItems,
      isLoading,
      error,
      refreshGroceryItems,
      addGroceryItem,
      toggleGroceryItemChecked,
      removeGroceryItem,
      hasGrocerySuggestion,
    ]
  );

  return (
    <GroceryListContext.Provider value={value}>
      {children}
    </GroceryListContext.Provider>
  );
}

export function useGroceryList() {
  const context = useContext(GroceryListContext);

  if (!context) {
    throw new Error("useGroceryList must be used within a GroceryListProvider");
  }

  return context;
}