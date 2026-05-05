import { supabase } from "@/lib/supabase";
import { GroceryListItem, NewGroceryListItem } from "@/types/database";

export async function fetchGroceryListItems(userId: string): Promise<GroceryListItem[]> {
  const { data, error } = await supabase
    .from("grocery_list_items")
    .select("*")
    .eq("user_id", userId)
    .order("is_checked", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}

export async function createGroceryListItem(
  userId: string,
  item: NewGroceryListItem
): Promise<GroceryListItem> {
  const { data, error } = await supabase
    .from("grocery_list_items")
    .insert({
      user_id: userId,
      name: item.name.trim(),
      quantity: item.quantity ?? null,
      unit: item.unit ?? null,
      category: item.category ?? null,
      source: item.source ?? "manual",
      source_food_item_id: item.source_food_item_id ?? null,
    })
    .select("*")
    .single();

  if (error) throw error;

  return data;
}

export async function updateGroceryListItemChecked(
  itemId: string,
  isChecked: boolean
): Promise<void> {
  const { error } = await supabase
    .from("grocery_list_items")
    .update({
      is_checked: isChecked,
      updated_at: new Date().toISOString(),
    })
    .eq("id", itemId);

  if (error) throw error;
}

export async function deleteGroceryListItem(itemId: string): Promise<void> {
  const { error } = await supabase
    .from("grocery_list_items")
    .delete()
    .eq("id", itemId);

  if (error) throw error;
}