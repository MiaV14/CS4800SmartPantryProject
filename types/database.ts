export type GroceryListSource = "manual" | "expired" | "expiring_soon" | "running_low";

export type GroceryListItem = {
  id: string;
  user_id: string;
  name: string;
  quantity: number | null;
  unit: string | null;
  category: string | null;
  source: GroceryListSource;
  source_food_item_id: string | null;
  is_checked: boolean;
  created_at: string;
  updated_at: string;
};

export type NewGroceryListItem = {
  name: string;
  quantity?: number | null;
  unit?: string | null;
  category?: string | null;
  source?: GroceryListSource;
  source_food_item_id?: string | null;
};