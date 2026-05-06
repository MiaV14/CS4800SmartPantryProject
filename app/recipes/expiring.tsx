import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import RecipeCard from '@/components/recipes/RecipeCard';
import SaveRecipeModal from '@/components/recipes/SaveRecipeModal';
import AppText from '@/components/ui/AppText';
import SearchBar from '@/components/ui/SearchBar';
import { COLORS } from '@/constants/colors';
import { useFoodItems } from '@/context/FoodItemsContext';
import { useRecipeCollections } from '@/context/RecipeCollectionsContext';
import { fetchRecipeSuggestions } from '@/services/recipeSuggestionService';
import { RecipeSuggestion, SaveRecipeInput } from '@/types/recipes';
import { getExpiringRecipeIngredientNames } from '@/utils/recipeIngredients';

function normalize(value: string) {
  return value.toLowerCase().trim();
}

export default function ExpiringRecipesScreen() {
  const { items } = useFoodItems();
  const { isRecipeSaved, removeRecipeFromAllCollections } =
    useRecipeCollections();

  const [recipes, setRecipes] = useState<RecipeSuggestion[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedRecipeToSave, setSelectedRecipeToSave] =
    useState<SaveRecipeInput | null>(null);

  const expiringIngredients = useMemo(
    () => getExpiringRecipeIngredientNames(items),
    [items]
  );

  useEffect(() => {
    async function loadRecipes() {
      setErrorMessage('');

      if (expiringIngredients.length === 0) {
        setRecipes([]);
        return;
      }

      try {
        setIsLoading(true);

        const results = await fetchRecipeSuggestions({
          ingredients: expiringIngredients,
          number: 12,
        });

        results.sort((a, b) => {
          if (b.usedIngredientCount !== a.usedIngredientCount) {
            return b.usedIngredientCount - a.usedIngredientCount;
          }

          return a.missedIngredientCount - b.missedIngredientCount;
        });

        setRecipes(results);
      } catch (err) {
        console.error(err);
        setErrorMessage('Could not load expiring soon recipes right now.');
      } finally {
        setIsLoading(false);
      }
    }

    loadRecipes();
  }, [expiringIngredients]);

  const filteredRecipes = useMemo(() => {
    const query = normalize(searchQuery);

    if (!query) return recipes;

    return recipes.filter((recipe) => {
      const titleMatch = normalize(recipe.title).includes(query);

      const usedIngredientMatch = recipe.usedIngredients.some((ingredient) =>
        normalize(ingredient.name).includes(query)
      );

      const missedIngredientMatch = recipe.missedIngredients.some((ingredient) =>
        normalize(ingredient.name).includes(query)
      );

      return titleMatch || usedIngredientMatch || missedIngredientMatch;
    });
  }, [recipes, searchQuery]);

  async function handleBookmarkPress(recipe: RecipeSuggestion) {
    if (isRecipeSaved(recipe.id)) {
      await removeRecipeFromAllCollections(recipe.id);
      return;
    }

    setSelectedRecipeToSave({
      recipe_id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      saved_recipe_data: recipe as unknown as Record<string, unknown>,
    });
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <AppText variant="sectionTitle" style={styles.backArrow}>
            ←
          </AppText>
        </Pressable>

        <View style={styles.headerText}>
          <AppText variant="sectionTitle" style={styles.headerTitle}>
            Expiring Soon Recipes
          </AppText>

          <AppText variant="caption" style={styles.headerSubtitle}>
            Prioritizing ingredients that need to be used soon
          </AppText>
        </View>
      </View>

      <View style={styles.search}>
        <SearchBar
          placeholder="Search recipes or ingredients"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {expiringIngredients.length > 0 ? (
          <View style={styles.expiringBox}>
            <AppText variant="caption" style={styles.expiringLabel}>
              Expiring ingredients
            </AppText>

            <View style={styles.expiringChipRow}>
              {expiringIngredients.map((ingredient) => (
                <View key={ingredient} style={styles.expiringChip}>
                  <AppText variant="caption" style={styles.expiringChipText}>
                    {ingredient}
                  </AppText>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {isLoading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator />
            <AppText variant="caption" style={styles.emptyText}>
              Finding recipes for expiring ingredients...
            </AppText>
          </View>
        ) : null}

        {!isLoading && errorMessage ? (
          <View style={styles.emptyState}>
            <AppText variant="cardTitle">Recipe API unavailable</AppText>
            <AppText variant="caption" style={styles.emptyText}>
              {errorMessage}
            </AppText>
          </View>
        ) : null}

        {!isLoading && !errorMessage && expiringIngredients.length === 0 ? (
          <View style={styles.emptyState}>
            <AppText variant="cardTitle">Nothing expiring soon</AppText>
            <AppText variant="caption" style={styles.emptyText}>
              You do not have any pantry items close to expiration yet.
            </AppText>
          </View>
        ) : null}

        {!isLoading && !errorMessage && filteredRecipes.length > 0 ? (
          <View style={styles.grid}>
            {filteredRecipes.map((recipe) => (
              <View key={recipe.id} style={styles.gridItem}>
                <RecipeCard
                  name={recipe.title}
                  badgeLabel={`Uses ${recipe.usedIngredientCount}`}
                  image={recipe.image}
                  isSaved={isRecipeSaved(recipe.id)}
                  onBookmarkPress={async () => {
                    if (isRecipeSaved(recipe.id)) {
                      await removeRecipeFromAllCollections(recipe.id);
                      return;
                    }

                    setSelectedRecipeToSave({
                      recipe_id: recipe.id,
                      title: recipe.title,
                      image: recipe.image,
                    });
                  }}
                  onPress={() => router.push(`/recipes/${recipe.id}` as any)}
                />
              </View>
            ))}
          </View>
        ) : null}

        {!isLoading &&
        !errorMessage &&
        expiringIngredients.length > 0 &&
        filteredRecipes.length === 0 ? (
          <View style={styles.emptyState}>
            <AppText variant="cardTitle">No recipes found</AppText>
            <AppText variant="caption" style={styles.emptyText}>
              Try another search or add more expiring ingredients.
            </AppText>
          </View>
        ) : null}
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
  container: {
    flex: 1,
    backgroundColor: COLORS.honeydew,
  },
  header: {
    backgroundColor: COLORS.vibrant_coral,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.flag_red,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.porcelain,
  },
  backArrow: {
    color: COLORS.porcelain,
    lineHeight: 24,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    color: COLORS.porcelain,
  },
  headerSubtitle: {
    color: COLORS.porcelain,
    opacity: 0.85,
  },
  search: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  expiringBox: {
    backgroundColor: COLORS.porcelain,
    borderRadius: 16,
    padding: 14,
    gap: 10,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.vibrant_coral,
  },
  expiringLabel: {
    color: COLORS.input_text,
  },
  expiringChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  expiringChip: {
    backgroundColor: COLORS.vibrant_coral,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  expiringChipText: {
    color: COLORS.porcelain,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },
  gridItem: {
    width: '48%',
  },
  emptyState: {
    backgroundColor: COLORS.porcelain,
    borderRadius: 16,
    padding: 20,
    gap: 10,
    alignItems: 'center',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.honeydew_shadow,
  },
  emptyText: {
    color: COLORS.input_text,
    textAlign: 'center',
  },
});