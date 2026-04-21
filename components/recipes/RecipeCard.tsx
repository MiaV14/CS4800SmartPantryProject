import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import AppText from '@/components/ui/AppText';
import { COLORS } from '@/constants/colors';

type RecipeCardProps = {
  id: string;
  name: string;
  minutes: number;
  matchPercent: number;
  variant?: 'grid' | 'carousel';
};

export default function RecipeCard({
  id,
  name,
  minutes,
  matchPercent,
  variant = 'grid',
}: RecipeCardProps) {
  const isGrid = variant === 'grid';

  return (
    <Pressable
      onPress={() => router.push(`/recipes/${id}` as any)}
      style={[styles.card, isGrid ? styles.gridCard : styles.carouselCard]}
    >
      <View style={styles.imageArea}>
        <View style={[styles.matchBadge, isGrid && styles.gridMatchBadge]}>
          <AppText variant="caption" style={styles.matchText}>
            {matchPercent}% match
          </AppText>
        </View>
      </View>

      <View style={styles.content}>
        <AppText variant="cardTitle" numberOfLines={2} style={styles.title}>
          {name}
        </AppText>

        <View style={styles.timeChip}>
          <AppText variant="caption" style={styles.timeText}>
            {minutes} MIN
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.porcelain,
    borderRadius: 22,
    overflow: 'hidden',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.mint_leaf,
  },
  gridCard: {
    minHeight: 230,
  },
  carouselCard: {
    minHeight: 220,
  },
  imageArea: {
    height: 120,
    backgroundColor: COLORS.honeydew_shadow,
    padding: 12,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  matchBadge: {
    backgroundColor: COLORS.royal_gold,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.royal_gold_shadow,
  },
  gridMatchBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  matchText: {
    color: COLORS.blue_spruce_shadow,
  },
  content: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
    gap: 12,
  },
  title: {
    color: COLORS.blue_spruce_shadow,
    lineHeight: 20,
    minHeight: 40,
  },
  timeChip: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.porcelain,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: COLORS.honeydew_shadow,
  },
  timeText: {
    color: COLORS.mint_leaf,
  },
});