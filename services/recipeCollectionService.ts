import { supabase } from '@/lib/supabase';
import {
  RecipeCollection,
  SavedRecipe,
  SaveRecipeInput,
} from '@/types/recipes';

const DEFAULT_COLLECTION_NAME = 'Saved Recipes';

export async function fetchRecipeCollections(
  userId: string
): Promise<RecipeCollection[]> {
  const { data, error } = await supabase
    .from('recipe_collections')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: true });

  if (error) throw error;

  return data ?? [];
}

export async function fetchSavedRecipes(userId: string): Promise<SavedRecipe[]> {
  const { data, error } = await supabase
    .from('saved_recipes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data ?? [];
}

export async function createRecipeCollection(
  userId: string,
  name: string,
  isDefault = false
): Promise<RecipeCollection> {
  const { data, error } = await supabase
    .from('recipe_collections')
    .insert({
      user_id: userId,
      name: name.trim(),
      is_default: isDefault,
    })
    .select('*')
    .single();

  if (error) throw error;

  return data;
}

export async function getOrCreateDefaultRecipeCollection(
  userId: string
): Promise<RecipeCollection> {
  // 1. Try to find existing default
  const { data: existingDefault } = await supabase
    .from('recipe_collections')
    .select('*')
    .eq('user_id', userId)
    .eq('is_default', true)
    .maybeSingle();

  if (existingDefault) return existingDefault;

  // 2. Try to find by name (prevents duplicate constraint crash)
  const { data: existingByName } = await supabase
    .from('recipe_collections')
    .select('*')
    .eq('user_id', userId)
    .eq('name', DEFAULT_COLLECTION_NAME)
    .maybeSingle();

  if (existingByName) {
    // Promote it to default instead of creating new
    const { data: updated } = await supabase
      .from('recipe_collections')
      .update({ is_default: true })
      .eq('id', existingByName.id)
      .select('*')
      .single();

    return updated!;
  }

  // 3. Create ONLY if truly missing
  return createRecipeCollection(userId, DEFAULT_COLLECTION_NAME, true);
}

export async function saveRecipeToCollection(
  userId: string,
  collectionId: string,
  recipe: SaveRecipeInput
): Promise<SavedRecipe> {
  const { data, error } = await supabase
    .from('saved_recipes')
    .upsert(
      {
        user_id: userId,
        collection_id: collectionId,
        recipe_id: recipe.recipe_id,
        title: recipe.title,
        image: recipe.image ?? null,
        ready_in_minutes: recipe.ready_in_minutes ?? null,
      },
      {
        onConflict: 'user_id,collection_id,recipe_id',
      }
    )
    .select('*')
    .single();

  if (error) throw error;

  return data;
}

export async function deleteSavedRecipe(savedRecipeId: string): Promise<void> {
  const { error } = await supabase
    .from('saved_recipes')
    .delete()
    .eq('id', savedRecipeId);

  if (error) throw error;
}