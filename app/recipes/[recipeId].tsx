import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppText from '@/components/ui/AppText';
import { COLORS } from '@/constants/colors';
import { useFoodItems } from '@/context/FoodItemsContext';
import { fetchRecipeInformation } from '@/services/recipeSuggestionService';
import { RecipeInformation, SpoonacularIngredient } from '@/types/recipes';

type IngredientStatus = 'enough' | 'some' | 'missing';

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, '').trim();
}

function getIngredientStatus(
  ingredient: SpoonacularIngredient,
  pantryItems: any[]
): IngredientStatus {
  const ingredientName = normalize(ingredient.name);

  const matchingItem = pantryItems.find((item) => {
    const pantryName = normalize(String(item.name ?? ''));

    return (
      pantryName === ingredientName ||
      pantryName.includes(ingredientName) ||
      ingredientName.includes(pantryName)
    );
  });

  if (!matchingItem) return 'missing';

  const availableQuantity =
    typeof matchingItem.quantity === 'number'
      ? matchingItem.quantity
      : Number(matchingItem.quantity);

  const availableUnit = normalize(String(matchingItem.unit ?? ''));
  const neededUnit = normalize(String(ingredient.unit ?? ''));

  if (Number.isNaN(availableQuantity)) {
    return 'some';
  }

  if (neededUnit && availableUnit && neededUnit === availableUnit) {
    return availableQuantity >= ingredient.amount ? 'enough' : 'some';
  }

  return 'some';
}

export default function RecipeDetailScreen() {
  const { recipeId } = useLocalSearchParams<{ recipeId: string }>();
  const { items } = useFoodItems();

  const [recipe, setRecipe] = useState<RecipeInformation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadRecipeDetails() {
      if (!recipeId) {
        setErrorMessage('Missing recipe id.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage('');

        const result = await fetchRecipeInformation(recipeId);
        setRecipe(result);
      } catch (error) {
        console.error(error);
        setErrorMessage('We could not load this recipe.');
      } finally {
        setIsLoading(false);
      }
    }

    loadRecipeDetails();
  }, [recipeId]);

  const instructionSteps = useMemo(() => {
    if (!recipe) return [];

    return recipe.analyzedInstructions.flatMap((group) => group.steps);
  }, [recipe]);

  const openExternalLink = async () => {
    if (!recipe) return;

    const url = recipe.sourceUrl || recipe.spoonacularSourceUrl;
    if (!url) return;

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.notFoundContainer} edges={['top']}>
        <View style={styles.notFoundContent}>
          <ActivityIndicator />
          <AppText variant="body" style={styles.notFoundText}>
            Loading recipe...
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  if (!recipe || errorMessage) {
    return (
      <SafeAreaView style={styles.notFoundContainer} edges={['top']}>
        <View style={styles.notFoundContent}>
          <AppText variant="sectionTitle">Recipe not found</AppText>
          <AppText variant="body" style={styles.notFoundText}>
            {errorMessage || 'We couldn’t find that recipe.'}
          </AppText>

          <Pressable onPress={() => router.back()} style={styles.primaryButton}>
            <AppText variant="button" style={styles.primaryButtonText}>
              Go Back
            </AppText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={styles.heroImageWrapper}>
            <Image
              source={{ uri: recipe.image }}
              style={styles.heroImage}
              resizeMode="cover"
            />

            <View style={styles.heroOverlayRow}>
              <Pressable onPress={() => router.back()} style={styles.iconButton}>
                <Ionicons
                  name="chevron-back"
                  size={22}
                  color={COLORS.porcelain}
                />
              </Pressable>

              <Pressable style={styles.iconButton}>
                <Ionicons name="heart" size={20} color={COLORS.vibrant_coral} />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.bodyContent}>
          <View style={styles.summaryCard}>
            <AppText variant="sectionTitle" style={styles.recipeTitle}>
              {recipe.title}
            </AppText>

            <AppText variant="caption" style={styles.ingredientCount}>
              {recipe.extendedIngredients.length} ingredients
            </AppText>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={COLORS.royal_gold_shadow}
                />
                <AppText variant="caption" style={styles.metaText}>
                  {recipe.readyInMinutes} min
                </AppText>
              </View>

              <View style={styles.metaItem}>
                <Ionicons
                  name="heart-outline"
                  size={18}
                  color={COLORS.royal_gold_shadow}
                />
                <AppText variant="caption" style={styles.metaText}>
                  {recipe.aggregateLikes ?? 0} likes
                </AppText>
              </View>

              <View style={styles.metaItem}>
                <Ionicons
                  name="people-outline"
                  size={18}
                  color={COLORS.royal_gold_shadow}
                />
                <AppText variant="caption" style={styles.metaText}>
                  {recipe.servings} serve
                </AppText>
              </View>
            </View>

            {recipe.summary ? (
              <AppText variant="body" style={styles.summaryText}>
                {stripHtml(recipe.summary)}
              </AppText>
            ) : null}
          </View>

          <View style={styles.section}>
            <AppText variant="sectionTitle">Ingredients</AppText>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.ingredientsRow}
            >
              {recipe.extendedIngredients.map((ingredient, index) => {
                const status = getIngredientStatus(ingredient, items);

                return (
                  <View
                    key={`${ingredient.id}-${ingredient.name}-${index}`}
                    style={styles.ingredientCard}
                  >
                    <View style={styles.ingredientImageBox}>
                      <Ionicons
                        name="nutrition-outline"
                        size={28}
                        color={COLORS.blue_spruce}
                      />
                    </View>

                    <AppText
                      variant="cardTitle"
                      style={styles.ingredientName}
                      numberOfLines={2}
                    >
                      {ingredient.name}
                    </AppText>

                    <AppText variant="caption" style={styles.ingredientAmount}>
                      {ingredient.original}
                    </AppText>

                    <View
                      style={[
                        styles.ingredientStatusPill,
                        status === 'enough'
                          ? styles.enoughPill
                          : status === 'some'
                          ? styles.somePill
                          : styles.missingPill,
                      ]}
                    >
                      <AppText
                        variant="caption"
                        style={[
                          styles.ingredientStatusText,
                          status === 'enough'
                            ? styles.enoughText
                            : status === 'some'
                            ? styles.someText
                            : styles.missingText,
                        ]}
                      >
                        {status === 'enough'
                          ? 'Have enough'
                          : status === 'some'
                          ? 'Have some'
                          : 'Missing'}
                      </AppText>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <AppText variant="sectionTitle">Instructions</AppText>

            <View style={styles.instructionsList}>
              {instructionSteps.length > 0 ? (
                instructionSteps.map((step, index) => (
                  <View key={`${step.number}-${index}`} style={styles.stepCard}>
                    <AppText variant="cardTitle" style={styles.stepTitle}>
                      Step {index + 1}
                    </AppText>
                    <AppText variant="body" style={styles.stepText}>
                      {step.step}
                    </AppText>
                  </View>
                ))
              ) : (
                <View style={styles.stepCard}>
                  <AppText variant="body" style={styles.stepText}>
                    No step-by-step instructions were provided for this recipe.
                  </AppText>
                </View>
              )}
            </View>
          </View>

          {(recipe.sourceUrl || recipe.spoonacularSourceUrl) && (
            <View style={styles.section}>
              <AppText variant="sectionTitle">More</AppText>

              <Pressable onPress={openExternalLink} style={styles.linkButton}>
                <Ionicons name="open-outline" size={18} color={COLORS.porcelain} />
                <AppText variant="button" style={styles.linkButtonText}>
                  Open Recipe Website
                </AppText>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.honeydew,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.honeydew,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  heroSection: {
    backgroundColor: COLORS.blue_spruce,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  heroImageWrapper: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 280,
    borderRadius: 28,
  },
  heroOverlayRow: {
    position: 'absolute',
    top: 16,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 20,
  },
  summaryCard: {
    backgroundColor: COLORS.porcelain,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 16,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.honeydew_shadow,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    gap: 10,
  },
  recipeTitle: {
    textAlign: 'center',
    color: COLORS.blue_spruce_shadow,
  },
  ingredientCount: {
    textAlign: 'center',
    color: COLORS.input_text,
  },
  summaryText: {
    color: COLORS.blue_spruce_shadow,
    lineHeight: 22,
    marginTop: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 4,
  },
  metaItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: COLORS.input_text,
  },
  section: {
    gap: 12,
  },
  ingredientsRow: {
    gap: 12,
    paddingRight: 16,
  },
  ingredientCard: {
    width: 132,
    backgroundColor: COLORS.porcelain,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 10,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.honeydew_shadow,
  },
  ingredientImageBox: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: COLORS.honeydew_shadow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ingredientName: {
    textAlign: 'center',
    color: COLORS.blue_spruce_shadow,
    minHeight: 38,
  },
  ingredientAmount: {
    textAlign: 'center',
    color: COLORS.input_text,
  },
  ingredientStatusPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  ingredientStatusText: {
    fontSize: 12,
    textAlign: 'center',
  },
  enoughPill: {
    backgroundColor: COLORS.porcelain,
    borderColor: COLORS.mint_leaf,
  },
  enoughText: {
    color: COLORS.mint_leaf,
  },
  somePill: {
    backgroundColor: COLORS.royal_gold,
    borderColor: COLORS.royal_gold_shadow,
  },
  someText: {
    color: COLORS.royal_gold_shadow,
  },
  missingPill: {
    backgroundColor: COLORS.vibrant_coral,
    borderColor: COLORS.flag_red,
  },
  missingText: {
    color: COLORS.porcelain,
  },
  instructionsList: {
    gap: 12,
  },
  stepCard: {
    backgroundColor: COLORS.porcelain,
    borderRadius: 18,
    padding: 16,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.honeydew_shadow,
    gap: 8,
  },
  stepTitle: {
    color: COLORS.royal_gold_shadow,
  },
  stepText: {
    color: COLORS.blue_spruce_shadow,
    lineHeight: 22,
  },
  linkButton: {
    backgroundColor: COLORS.blue_spruce,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.blue_spruce_shadow,
  },
  linkButtonText: {
    color: COLORS.porcelain,
  },
  notFoundContainer: {
    flex: 1,
    backgroundColor: COLORS.honeydew,
  },
  notFoundContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  notFoundText: {
    color: COLORS.input_text,
    textAlign: 'center',
  },
  primaryButton: {
    marginTop: 8,
    backgroundColor: COLORS.blue_spruce,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
  },
  primaryButtonText: {
    color: COLORS.porcelain,
  },
});