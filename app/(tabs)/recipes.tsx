import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomSheetModal from '@/components/modals/BottomSheetModal';
import CategoryTile from '@/components/recipes/CategoryTile';
import RecipeActionCard from '@/components/recipes/RecipeActionCard';
import RecipeCard from '@/components/recipes/RecipeCard';
import SaveRecipeModal from '@/components/recipes/SaveRecipeModal';
import AppButton from '@/components/ui/AppButton';
import AppInput from '@/components/ui/AppInput';
import AppText from '@/components/ui/AppText';
import OverviewCard from '@/components/ui/OverviewCard';
import SearchBar from '@/components/ui/SearchBar';
import { COLORS } from '@/constants/colors';
import { useRecipeCollections } from '@/context/RecipeCollectionsContext';
import { PopularRecipe, SaveRecipeInput } from '@/types/recipes';

const { width } = Dimensions.get('window');
const POPULAR_CARD_WIDTH = width * 0.5;

const CATEGORY_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'dessert', label: 'Dessert' },
  { id: 'quick', label: 'Quick' },
];

export default function RecipesScreen() {
  const {
    collections,
    addCollection,
    getCollectionCount,
    isRecipeSaved,
  } = useRecipeCollections();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [popularRecipes, setPopularRecipes] = useState<PopularRecipe[]>([]);
  const [isLoadingPopular, setIsLoadingPopular] = useState(false);
  const [popularError, setPopularError] = useState('');

  const [selectedRecipeToSave, setSelectedRecipeToSave] =
    useState<SaveRecipeInput | null>(null);

  const [showCreateCollectionModal, setShowCreateCollectionModal] =
    useState(false);

  const [newCollectionName, setNewCollectionName] = useState('');

  useEffect(() => {
    async function loadPopularRecipes() {
      // TEMP: disable API while quota is exceeded
      setPopularRecipes([]);
      setPopularError('API limit reached. Try again tomorrow.');
      return;
    }

    loadPopularRecipes();
  }, [searchQuery, selectedCategory]);

  const sectionTitle = useMemo(() => {
    if (searchQuery.trim()) return 'Matching Recipes';

    if (selectedCategory === 'quick') return 'Quick Recipes';

    if (selectedCategory !== 'all') {
      const selected = CATEGORY_OPTIONS.find(
        (item) => item.id === selectedCategory
      );

      return selected ? `${selected.label} Recipes` : 'Popular';
    }

    return 'Popular';
  }, [searchQuery, selectedCategory]);

  async function handleCreateCollection() {
    const trimmedName = newCollectionName.trim();

    if (!trimmedName) return;

    await addCollection(trimmedName);
    setNewCollectionName('');
    setShowCreateCollectionModal(false);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <SearchBar
          placeholder="Search recipes"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.actionRow}>
          <RecipeActionCard
            title="Cook with what you have"
            backgroundColor={COLORS.blue_spruce}
            circleColor={COLORS.porcelain}
            arrowColor={COLORS.blue_spruce_shadow}
            onPress={() => router.push('/recipes/from-pantry' as any)}
          />

          <RecipeActionCard
            title="Expiring soon recipes"
            backgroundColor={COLORS.vibrant_coral}
            circleColor={COLORS.flag_red}
            arrowColor={COLORS.porcelain}
            onPress={() => router.push('/recipes/expiring' as any)}
          />
        </View>

        <View style={styles.section}>
          <AppText variant="sectionTitle">Your Collections</AppText>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.collectionRow}
          >
            {collections.map((collection) => (
              <Pressable
                key={collection.id}
                style={styles.collectionCardWrapper}
                onPress={() =>
                  router.push(`/recipes/collections/${collection.id}` as any)
                }
              >
                <OverviewCard
                  label={collection.name}
                  count={getCollectionCount(collection.id)}
                />
              </Pressable>
            ))}

            <Pressable
              style={styles.addFolderCard}
              onPress={() => setShowCreateCollectionModal(true)}
            >
              <View style={styles.addFolderIcon}>
                <Ionicons name="add" size={22} color={COLORS.blue_spruce} />
              </View>

              <AppText variant="caption" style={styles.addFolderText}>
                Add Folder
              </AppText>
            </Pressable>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <AppText variant="sectionTitle">Categories</AppText>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            {CATEGORY_OPTIONS.map((item) => (
              <CategoryTile
                key={item.id}
                label={item.label}
                selected={selectedCategory === item.id}
                onPress={() => setSelectedCategory(item.id)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <AppText variant="sectionTitle">{sectionTitle}</AppText>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.popularRow}
          >
            {isLoadingPopular ? (
              <View style={styles.loadingState}>
                <ActivityIndicator />
                <AppText variant="caption" style={styles.emptyText}>
                  Loading recipes...
                </AppText>
              </View>
            ) : null}

            {!isLoadingPopular && popularError ? (
              <View style={styles.emptyState}>
                <AppText variant="cardTitle">Something went wrong</AppText>
                <AppText variant="caption" style={styles.emptyText}>
                  {popularError}
                </AppText>
              </View>
            ) : null}

            {!isLoadingPopular && !popularError && popularRecipes.length > 0
              ? popularRecipes.map((recipe) => (
                  <View key={recipe.id} style={styles.popularCardWrapper}>
                    <RecipeCard
                      name={recipe.title}
                      minutes={recipe.readyInMinutes ?? 0}
                      badgeLabel="Popular"
                      image={recipe.image}
                      variant="carousel"
                      isSaved={isRecipeSaved(recipe.id)}
                      onBookmarkPress={() =>
                        setSelectedRecipeToSave({
                          recipe_id: recipe.id,
                          title: recipe.title,
                          image: recipe.image,
                          ready_in_minutes: recipe.readyInMinutes ?? null,
                        })
                      }
                      onPress={() => router.push(`/recipes/${recipe.id}` as any)}
                    />
                  </View>
                ))
              : null}

            {!isLoadingPopular &&
            !popularError &&
            popularRecipes.length === 0 ? (
              <View style={styles.emptyState}>
                <AppText variant="cardTitle">No matching recipes found</AppText>
                <AppText variant="caption" style={styles.emptyText}>
                  Try searching by recipe name, ingredient, or category.
                </AppText>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </ScrollView>

      <SaveRecipeModal
        visible={!!selectedRecipeToSave}
        recipe={selectedRecipeToSave}
        onClose={() => setSelectedRecipeToSave(null)}
      />

      <BottomSheetModal
        visible={showCreateCollectionModal}
        onClose={() => setShowCreateCollectionModal(false)}
      >
        <View style={styles.createCollectionSheet}>
          <AppText variant="sectionTitle">Create Collection</AppText>

          <AppInput
            label="Collection Name"
            placeholder="Favorites, To Try, Meal Prep..."
            value={newCollectionName}
            onChangeText={setNewCollectionName}
          />

          <AppButton
            title="Create"
            onPress={handleCreateCollection}
            disabled={!newCollectionName.trim()}
          />
        </View>
      </BottomSheetModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.honeydew,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 24,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  section: {
    gap: 12,
  },
  collectionRow: {
    gap: 12,
    paddingRight: 16,
  },
  collectionCardWrapper: {
    width: 100,
  },
  addFolderCard: {
    width: 100,
    minHeight: 100,
    backgroundColor: COLORS.porcelain,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.honeydew_shadow,
  },
  addFolderIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.honeydew_shadow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addFolderText: {
    color: COLORS.blue_spruce_shadow,
    textAlign: 'center',
  },
  categoryRow: {
    gap: 12,
    paddingRight: 16,
  },
  popularRow: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 16,
  },
  popularCardWrapper: {
    width: POPULAR_CARD_WIDTH,
  },
  loadingState: {
    width: 260,
    backgroundColor: COLORS.porcelain,
    borderRadius: 18,
    padding: 18,
    gap: 10,
    alignItems: 'center',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.honeydew_shadow,
  },
  emptyState: {
    width: 260,
    backgroundColor: COLORS.porcelain,
    borderRadius: 18,
    padding: 18,
    gap: 6,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.honeydew_shadow,
  },
  emptyText: {
    color: COLORS.input_text,
  },
  createCollectionSheet: {
    gap: 14,
  },
});