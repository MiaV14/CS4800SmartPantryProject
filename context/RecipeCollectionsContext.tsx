import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useAuth } from '@/context/AuthContext';
import {
  createRecipeCollection,
  deleteSavedRecipesByRecipeId,
  fetchRecipeCollections,
  fetchSavedRecipes,
  getOrCreateDefaultRecipeCollection,
  saveRecipeToCollection,
} from '@/services/recipeCollectionService';
import {
  RecipeCollection,
  SavedRecipe,
  SaveRecipeInput,
} from '@/types/recipes';

type RecipeCollectionsContextValue = {
  collections: RecipeCollection[];
  savedRecipes: SavedRecipe[];
  isLoading: boolean;
  error: string | null;
  refreshCollections: () => Promise<void>;
  addCollection: (name: string) => Promise<void>;
  saveRecipe: (collectionId: string, recipe: SaveRecipeInput) => Promise<void>;
  removeRecipeFromAllCollections: (recipeId: number) => Promise<void>;
  getCollectionCount: (collectionId: string) => number;
  isRecipeSaved: (recipeId: number) => boolean;
};

const RecipeCollectionsContext =
  createContext<RecipeCollectionsContextValue | undefined>(undefined);

export function RecipeCollectionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  const [collections, setCollections] = useState<RecipeCollection[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshCollections = useCallback(async () => {
    if (!user) {
      setCollections([]);
      setSavedRecipes([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await getOrCreateDefaultRecipeCollection(user.id);

      const [collectionRows, savedRows] = await Promise.all([
        fetchRecipeCollections(user.id),
        fetchSavedRecipes(user.id),
      ]);

      setCollections(collectionRows);
      setSavedRecipes(savedRows);
    } catch (err) {
      console.error('Failed to load recipe collections:', err);
      setError('Could not load recipe collections.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const addCollection = useCallback(
    async (name: string) => {
      if (!user) return;

      const trimmedName = name.trim();
      if (!trimmedName) return;

      const created = await createRecipeCollection(user.id, trimmedName);

      setCollections((current) => {
        const alreadyExists = current.some((item) => item.id === created.id);
        if (alreadyExists) return current;
        return [...current, created];
      });
    },
    [user]
  );

  const saveRecipe = useCallback(
    async (collectionId: string, recipe: SaveRecipeInput) => {
      if (!user) return;

      const saved = await saveRecipeToCollection(user.id, collectionId, recipe);

      setSavedRecipes((current) => {
        const alreadyExists = current.some(
          (item) =>
            item.collection_id === saved.collection_id &&
            item.recipe_id === saved.recipe_id
        );

        if (alreadyExists) return current;

        return [saved, ...current];
      });
    },
    [user]
  );

  const removeRecipeFromAllCollections = useCallback(
    async (recipeId: number) => {
      if (!user) return;

      await deleteSavedRecipesByRecipeId(user.id, recipeId);

      setSavedRecipes((current) =>
        current.filter((recipe) => recipe.recipe_id !== recipeId)
      );
    },
    [user]
  );

  const getCollectionCount = useCallback(
    (collectionId: string) => {
      return savedRecipes.filter(
        (recipe) => recipe.collection_id === collectionId
      ).length;
    },
    [savedRecipes]
  );

  const isRecipeSaved = useCallback(
    (recipeId: number) => {
      return savedRecipes.some((recipe) => recipe.recipe_id === recipeId);
    },
    [savedRecipes]
  );

  useEffect(() => {
    refreshCollections();
  }, [refreshCollections]);

  const value = useMemo(
    () => ({
      collections,
      savedRecipes,
      isLoading,
      error,
      refreshCollections,
      addCollection,
      saveRecipe,
      removeRecipeFromAllCollections,
      getCollectionCount,
      isRecipeSaved,
    }),
    [
      collections,
      savedRecipes,
      isLoading,
      error,
      refreshCollections,
      addCollection,
      saveRecipe,
      removeRecipeFromAllCollections,
      getCollectionCount,
      isRecipeSaved,
    ]
  );

  return (
    <RecipeCollectionsContext.Provider value={value}>
      {children}
    </RecipeCollectionsContext.Provider>
  );
}

export function useRecipeCollections() {
  const context = useContext(RecipeCollectionsContext);

  if (!context) {
    throw new Error(
      'useRecipeCollections must be used within a RecipeCollectionsProvider'
    );
  }

  return context;
}