import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import RecipeCard from '@/components/recipes/RecipeCard';
import SaveRecipeModal from '@/components/recipes/SaveRecipeModal';
import AppText from '@/components/ui/AppText';
import { COLORS } from '@/constants/colors';
import { useFoodItems } from '@/context/FoodItemsContext';
import { useRecipeCollections } from '@/context/RecipeCollectionsContext';
import {
  fetchRecipeSuggestions
} from '@/services/recipeSuggestionService';
import { RecipeSuggestion, SaveRecipeInput } from '@/types/recipes';
import { getExpiringRecipeIngredientNames } from '@/utils/recipeIngredients';

export default function ExpiringRecipesScreen() {
  const { items } = useFoodItems();
  const { isRecipeSaved } = useRecipeCollections();

  const [recipes, setRecipes] = useState<RecipeSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecipeToSave, setSelectedRecipeToSave] =
    useState<SaveRecipeInput | null>(null);

  const expiringIngredients = useMemo(
    () => getExpiringRecipeIngredientNames(items),
    [items]
  );

  useEffect(() => {
    async function loadRecipes() {
      if (expiringIngredients.length === 0) return;

      try {
        setIsLoading(true);

        const results = await fetchRecipeSuggestions({
          ingredients: expiringIngredients,
          number: 12,
        });

        results.sort(
          (a, b) => b.usedIngredientCount - a.usedIngredientCount
        );

        setRecipes(results);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadRecipes();
  }, [expiringIngredients]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <AppText variant="sectionTitle">Expiring Soon Recipes</AppText>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <View style={styles.grid}>
            {recipes.map((recipe) => (
              <View key={recipe.id} style={styles.gridItem}>
                <RecipeCard
                  name={recipe.title}
                  minutes={0}
                  badgeLabel={`Uses ${recipe.usedIngredientCount}`}
                  image={recipe.image}
                  isSaved={isRecipeSaved(recipe.id)}
                  onBookmarkPress={() =>
                    setSelectedRecipeToSave({
                      recipe_id: recipe.id,
                      title: recipe.title,
                      image: recipe.image,
                    })
                  }
                  onPress={() =>
                    router.push(`/recipes/${recipe.id}` as any)
                  }
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <SaveRecipeModal
        visible={!!selectedRecipeToSave}
        recipe={selectedRecipeToSave}
        onClose={() => setSelectedRecipeToSave(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.honeydew },
  header: { padding: 16 },
  content: { padding: 16 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },
  gridItem: { width: '48%' },
});