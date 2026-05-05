import { FoodItem } from '@/context/FoodItemsContext';
import { isExpiringSoon } from '@/utils/expiry';

const MAX_INGREDIENTS = 12;

function cleanIngredientName(name: string) {
  return name.trim().toLowerCase();
}

function removeDuplicateNames(names: string[]) {
  return Array.from(new Set(names));
}

export function getRecipeIngredientNames(items: FoodItem[]) {
  const names = items
    .filter((item) => item.name?.trim())
    .map((item) => cleanIngredientName(item.name))
    .filter(Boolean);

  return removeDuplicateNames(names).slice(0, MAX_INGREDIENTS);
}

export function getExpiringRecipeIngredientNames(items: FoodItem[]) {
  const names = items
    .filter((item) => item.expirationDate && isExpiringSoon(item.expirationDate))
    .filter((item) => item.name?.trim())
    .map((item) => cleanIngredientName(item.name))
    .filter(Boolean);

  return removeDuplicateNames(names).slice(0, MAX_INGREDIENTS);
}