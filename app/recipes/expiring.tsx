import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import RecipeCard from '@/components/recipes/RecipeCard';
import AppText from '@/components/ui/AppText';
import FilterChip from '@/components/ui/FilterChip';
import SearchBar from '@/components/ui/SearchBar';
import { COLORS } from '@/constants/colors';
import { mockRecipes } from '@/data/mockRecipes';

const FILTER_OPTIONS = ['All', 'Quick', 'Vegetarian', 'Pasta'];

export default function ExpiringRecipesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filteredRecipes = useMemo(() => {
    let results = [...mockRecipes];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      results = results.filter((recipe) =>
        recipe.name.toLowerCase().includes(query)
      );
    }

    if (selectedFilter !== 'All') {
      results = results.filter((recipe) => {
        const name = recipe.name.toLowerCase();

        switch (selectedFilter) {
          case 'Quick':
            return recipe.minutes <= 30;
          case 'Vegetarian':
            return name.includes('veggie') || name.includes('vegetable');
          case 'Pasta':
            return name.includes('pasta') || name.includes('spaghetti');
          default:
            return true;
        }
      });
    }

    return results.sort((a, b) => b.matchPercent - a.matchPercent);
  }, [searchQuery, selectedFilter]);

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <AppText variant="sectionTitle" style={styles.backArrow}>
              ←
            </AppText>
          </Pressable>

          <AppText variant="sectionTitle" style={styles.headerTitle}>
            Expiring soon recipes
          </AppText>
        </View>
      </SafeAreaView>

      <View style={styles.body}>
        <View style={styles.searchSection}>
          <SearchBar
            placeholder="Search recipes or ingredients"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleRow}>
            <AppText variant="sectionTitle">Best Matches</AppText>
            <AppText variant="caption" style={styles.subtitle}>
              Recipes to use ingredients before they expire
            </AppText>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {FILTER_OPTIONS.map((filter) => (
              <FilterChip
                key={filter}
                label={filter}
                selected={selectedFilter === filter}
                onPress={() => setSelectedFilter(filter)}
              />
            ))}
          </ScrollView>

          {filteredRecipes.length > 0 ? (
            <View style={styles.grid}>
              {filteredRecipes.map((recipe) => (
                <View key={recipe.id} style={styles.gridItem}>
                  <RecipeCard
                    name={recipe.name}
                    minutes={recipe.minutes}
                    matchPercent={recipe.matchPercent}
                    variant="grid"
                  />
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <AppText variant="cardTitle">No expiring recipes found</AppText>
              <AppText variant="caption" style={styles.emptyText}>
                Try another search or a different filter.
              </AppText>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.honeydew,
  },
  headerSafeArea: {
    backgroundColor: COLORS.vibrant_coral,
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
  body: {
    flex: 1,
    backgroundColor: COLORS.honeydew,
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
  headerTitle: {
    color: COLORS.porcelain,
    flexShrink: 1,
    lineHeight: 44,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 16,
  },
  titleRow: {
    gap: 4,
  },
  subtitle: {
    color: COLORS.input_text,
  },
  filterRow: {
    gap: 10,
    paddingRight: 16,
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
    borderColor: COLORS.porcelain_shadow,
    gap: 6,
  },
  emptyText: {
    color: COLORS.input_text,
  },
});