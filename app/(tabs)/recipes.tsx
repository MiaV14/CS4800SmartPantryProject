import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CategoryTile from '@/components/recipes/CategoryTile';
import RecipeActionCard from '@/components/recipes/RecipeActionCard';
import RecipeCard from '@/components/recipes/RecipeCard';
import AppText from '@/components/ui/AppText';
import OverviewCard from '@/components/ui/OverviewCard';
import SearchBar from '@/components/ui/SearchBar';
import { COLORS } from '@/constants/colors';
import { mockRecipes } from '@/data/mockRecipes';

const { width } = Dimensions.get('window');
const POPULAR_CARD_WIDTH = width * 0.5;

const CATEGORY_OPTIONS = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'dessert', label: 'Dessert' },
  { id: 'quick', label: 'Quick' },
];

const COLLECTIONS = [
  { id: 'saved', label: 'Saved', count: 3 },
  { id: 'tried', label: 'Have Tried', count: 0 },
  { id: 'favorites', label: 'Favorites', count: 0 },
];

export default function RecipesScreen() {
  const [selectedCategory, setSelectedCategory] = useState('breakfast');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <SearchBar placeholder="Search recipes" />
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
            {COLLECTIONS.map((collection) => (
              <View key={collection.id} style={styles.collectionCardWrapper}>
                <OverviewCard label={collection.label} count={collection.count} />
              </View>
            ))}

            <Pressable style={styles.addFolderCard}>
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
          <AppText variant="sectionTitle">Popular</AppText>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.popularRow}
          >
            {mockRecipes.map((recipe) => (
              <View key={recipe.id} style={styles.popularCardWrapper}>
                <RecipeCard
                  id={recipe.id}
                  name={recipe.name}
                  minutes={recipe.minutes}
                  matchPercent={recipe.matchPercent}
                  variant="grid"
                />
              </View>
            ))}
          </ScrollView>
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
});