import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import {
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
import { mockRecipes } from '@/data/mockRecipes';

type IngredientStatus = 'enough' | 'some' | 'missing';

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function parseAmount(amount: string) {
  const cleaned = amount.trim().toLowerCase();
  const match = cleaned.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);

  if (!match) return null;

  return {
    quantity: Number(match[1]),
    unit: match[2].trim(),
  };
}

function getIngredientStatus(
  ingredient: { name: string; amount: string },
  pantryItems: any[]
): IngredientStatus {
  const matchingItem = pantryItems.find(
    (item) => normalize(String(item.name)) === normalize(ingredient.name)
  );

  if (!matchingItem) return 'missing';

  const needed = parseAmount(ingredient.amount);
  const availableQuantity =
    typeof matchingItem.quantity === 'number'
      ? matchingItem.quantity
      : Number(matchingItem.quantity);
  const availableUnit = normalize(String(matchingItem.unit ?? ''));

  if (!needed || Number.isNaN(availableQuantity)) {
    return 'some';
  }

  const neededUnit = normalize(needed.unit);

  if (neededUnit && availableUnit && neededUnit === availableUnit) {
    return availableQuantity >= needed.quantity ? 'enough' : 'some';
  }

  return 'some';
}

export default function RecipeDetailScreen() {
  const { recipeId } = useLocalSearchParams<{ recipeId: string }>();
  const { items } = useFoodItems();

  const recipe = mockRecipes.find((item) => item.id === recipeId);

  if (!recipe) {
    return (
      <SafeAreaView style={styles.notFoundContainer} edges={['top']}>
        <View style={styles.notFoundContent}>
          <AppText variant="sectionTitle">Recipe not found</AppText>
          <AppText variant="body" style={styles.notFoundText}>
            We couldn’t find that recipe.
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

  const openExternalLink = async () => {
    const url = recipe.videoUrl || recipe.recipeUrl;
    if (!url) return;

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

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
              {recipe.name}
            </AppText>

            <AppText variant="caption" style={styles.ingredientCount}>
              {recipe.ingredients.length} ingredients
            </AppText>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={COLORS.royal_gold_shadow}
                />
                <AppText variant="caption" style={styles.metaText}>
                  {recipe.minutes} min
                </AppText>
              </View>

              <View style={styles.metaItem}>
                <Ionicons
                  name="flame-outline"
                  size={18}
                  color={COLORS.royal_gold_shadow}
                />
                <AppText variant="caption" style={styles.metaText}>
                  {recipe.calories} cal
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
          </View>

          <View style={styles.section}>
            <AppText variant="sectionTitle">Ingredients</AppText>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.ingredientsRow}
            >
              {recipe.ingredients.map((ingredient, index) => {
                const status = getIngredientStatus(ingredient, items);

                return (
                  <View
                    key={`${ingredient.name}-${index}`}
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
                      {ingredient.amount}
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
              {recipe.instructions.map((step, index) => (
                <View key={index} style={styles.stepCard}>
                  <AppText variant="cardTitle" style={styles.stepTitle}>
                    Step {index + 1}
                  </AppText>
                  <AppText variant="body" style={styles.stepText}>
                    {step}
                  </AppText>
                </View>
              ))}
            </View>
          </View>

          {(recipe.videoUrl || recipe.recipeUrl) && (
            <View style={styles.section}>
              <AppText variant="sectionTitle">More</AppText>

              <Pressable onPress={openExternalLink} style={styles.linkButton}>
                <Ionicons name="open-outline" size={18} color={COLORS.porcelain} />
                <AppText variant="button" style={styles.linkButtonText}>
                  {recipe.videoUrl
                    ? 'Watch Video / View Recipe'
                    : 'Open Recipe Website'}
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