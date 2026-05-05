import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import RecipeCard from '@/components/recipes/RecipeCard';
import AppText from '@/components/ui/AppText';
import { COLORS } from '@/constants/colors';
import { useRecipeCollections } from '@/context/RecipeCollectionsContext';

export default function RecipeCollectionDetailScreen() {
  const { collectionId } = useLocalSearchParams<{ collectionId: string }>();

  const { collections, savedRecipes } = useRecipeCollections();

  const collection = collections.find((item) => item.id === collectionId);

  const recipesInCollection = savedRecipes.filter(
    (recipe) => recipe.collection_id === collectionId
  );

  if (!collection) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centerContent}>
          <AppText variant="sectionTitle">Collection not found</AppText>

          <Pressable onPress={() => router.back()} style={styles.backHomeButton}>
            <AppText variant="button" style={styles.backHomeText}>
              Go Back
            </AppText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
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
            {collection.name}
          </AppText>

          <AppText variant="caption" style={styles.subtitle}>
            {recipesInCollection.length} saved recipe
            {recipesInCollection.length === 1 ? '' : 's'}
          </AppText>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {recipesInCollection.length > 0 ? (
          <View style={styles.grid}>
            {recipesInCollection.map((recipe) => (
              <View key={recipe.id} style={styles.gridItem}>
                <RecipeCard
                  name={recipe.title}
                  minutes={recipe.ready_in_minutes ?? 0}
                  badgeLabel="Saved"
                  image={recipe.image ?? undefined}
                  variant="grid"
                  isSaved
                  onPress={() => router.push(`/recipes/${recipe.recipe_id}` as any)}
                />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <AppText variant="cardTitle">No recipes saved yet</AppText>

            <AppText variant="caption" style={styles.emptyText}>
              Tap the bookmark icon on a recipe card to save it here.
            </AppText>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.honeydew,
  },
  header: {
    backgroundColor: COLORS.blue_spruce,
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
    backgroundColor: COLORS.porcelain,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.blue_spruce_shadow,
  },
  backArrow: {
    color: COLORS.blue_spruce,
    lineHeight: 24,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    color: COLORS.porcelain,
  },
  subtitle: {
    color: COLORS.porcelain,
    opacity: 0.8,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
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
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.honeydew_shadow,
    gap: 8,
  },
  emptyText: {
    color: COLORS.input_text,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 14,
  },
  backHomeButton: {
    backgroundColor: COLORS.blue_spruce,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
  },
  backHomeText: {
    color: COLORS.porcelain,
  },
});