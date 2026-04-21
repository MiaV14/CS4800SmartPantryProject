import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Image, Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppText from '@/components/ui/AppText';
import { COLORS } from '@/constants/colors';
import { mockRecipes } from '@/data/mockRecipes';

export default function RecipeDetailScreen() {
  const { recipeId } = useLocalSearchParams<{ recipeId: string }>();

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
            <AppText variant="button">Go Back</AppText>
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
    <View style={styles.screen}>
      <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
        <View style={styles.heroWrapper}>
          <Image
            source={{ uri: recipe.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          <View style={styles.heroOverlayRow}>
            <Pressable onPress={() => router.back()} style={styles.iconButton}>
              <Ionicons name="chevron-back" size={22} color={COLORS.porcelain} />
            </Pressable>

            <Pressable style={styles.iconButton}>
              <Ionicons name="heart" size={20} color={COLORS.vibrant_coral} />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <AppText variant="sectionTitle" style={styles.recipeTitle}>
            {recipe.name}
          </AppText>

          <AppText variant="caption" style={styles.ingredientCount}>
            {recipe.ingredients.length} ingredients
          </AppText>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={18} color={COLORS.royal_gold_shadow} />
              <AppText variant="caption" style={styles.metaText}>
                {recipe.minutes} min
              </AppText>
            </View>

            <View style={styles.metaItem}>
              <Ionicons name="flame-outline" size={18} color={COLORS.royal_gold_shadow} />
              <AppText variant="caption" style={styles.metaText}>
                {recipe.calories} cal
              </AppText>
            </View>

            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={18} color={COLORS.royal_gold_shadow} />
              <AppText variant="caption" style={styles.metaText}>
                {recipe.servings} serve
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <AppText variant="sectionTitle">Ingredients</AppText>

          <View style={styles.ingredientsList}>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={`${ingredient.name}-${index}`} style={styles.ingredientRow}>
                <View style={styles.ingredientLeft}>
                  <View style={styles.ingredientIconBox}>
                    <AppText variant="caption" style={styles.ingredientEmoji}>
                      {ingredient.icon}
                    </AppText>
                  </View>

                  <View style={styles.ingredientTextBlock}>
                    <AppText variant="cardTitle">{ingredient.name}</AppText>
                    <AppText variant="caption" style={styles.ingredientAmount}>
                      {ingredient.amount}
                    </AppText>
                  </View>
                </View>
              </View>
            ))}
          </View>
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
                {recipe.videoUrl ? 'Watch Video / View Recipe' : 'Open Recipe Website'}
              </AppText>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.honeydew,
  },
  headerSafeArea: {
    backgroundColor: COLORS.blue_spruce,
  },
  heroWrapper: {
    backgroundColor: COLORS.blue_spruce,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  heroImage: {
    width: '100%',
    height: 280,
    borderRadius: 28,
  },
  heroOverlayRow: {
    position: 'absolute',
    top: 16,
    left: 28,
    right: 28,
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
  body: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 20,
    paddingBottom: 32,
  },
  summaryCard: {
    marginTop: -26,
    backgroundColor: COLORS.porcelain,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.honeydew_shadow,
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
  ingredientsList: {
    gap: 10,
  },
  ingredientRow: {
    backgroundColor: COLORS.porcelain,
    borderRadius: 18,
    padding: 12,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.honeydew_shadow,
  },
  ingredientLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ingredientIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.honeydew_shadow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ingredientEmoji: {
    fontSize: 24,
  },
  ingredientTextBlock: {
    flex: 1,
    gap: 2,
  },
  ingredientAmount: {
    color: COLORS.input_text,
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
});