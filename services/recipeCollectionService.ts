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
  const trimmedName = name.trim();

  const { data: existing, error: existingError } = await supabase
    .from('recipe_collections')
    .select('*')
    .eq('user_id', userId)
    .eq('name', trimmedName)
    .maybeSingle();

  if (existingError) throw existingError;

  if (existing) return existing;

  const { data, error } = await supabase
    .from('recipe_collections')
    .insert({
      user_id: userId,
      name: trimmedName,
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
  const { data: existingDefault, error: defaultFetchError } = await supabase
    .from('recipe_collections')
    .select('*')
    .eq('user_id', userId)
    .eq('is_default', true)
    .maybeSingle();

  if (defaultFetchError) throw defaultFetchError;

  if (existingDefault) return existingDefault;

  const { data: existingByName, error: nameFetchError } = await supabase
    .from('recipe_collections')
    .select('*')
    .eq('user_id', userId)
    .eq('name', DEFAULT_COLLECTION_NAME)
    .maybeSingle();

  if (nameFetchError) throw nameFetchError;

  if (existingByName) {
    const { data: updated, error: updateError } = await supabase
      .from('recipe_collections')
      .update({ is_default: true })
      .eq('id', existingByName.id)
      .select('*')
      .single();

    if (updateError) throw updateError;

    return updated;
  }

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
        servings: recipe.servings ?? null,
        summary: recipe.summary ?? null,
        saved_recipe_data: recipe.saved_recipe_data ?? null,
        source: 'spoonacular',
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

export async function deleteSavedRecipesByRecipeId(
  userId: string,
  recipeId: number
): Promise<void> {
  const { error } = await supabase
    .from('saved_recipes')
    .delete()
    .eq('user_id', userId)
    .eq('recipe_id', recipeId);

  if (error) throw error;
}