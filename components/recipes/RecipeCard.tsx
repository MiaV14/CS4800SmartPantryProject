import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import AppText from '@/components/ui/AppText';
import { COLORS } from '@/constants/colors';

type RecipeCardProps = {
  name: string;
  minutes?: number;
  matchPercent?: number;
  badgeLabel?: string;
  image?: string | null;
  variant?: 'grid' | 'carousel';
  isSaved?: boolean;
  showBookmark?: boolean;
  onPress?: () => void;
  onBookmarkPress?: () => void;
};

export default function RecipeCard({
  name,
  minutes,
  matchPercent,
  badgeLabel,
  image,
  variant = 'grid',
  isSaved = false,
  showBookmark = true,
  onPress,
  onBookmarkPress,
}: RecipeCardProps) {
  const isGrid = variant === 'grid';

  const shouldShowBadge =
    badgeLabel !== undefined || matchPercent !== undefined;

  const displayBadge = badgeLabel ?? `${matchPercent ?? 0}% match`;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={[styles.card, isGrid ? styles.gridCard : styles.carouselCard]}
    >
      <View style={styles.imageArea}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons
              name="restaurant-outline"
              size={34}
              color={COLORS.blue_spruce}
            />
          </View>
        )}

        {shouldShowBadge ? (
          <View style={[styles.matchBadge, isGrid && styles.gridMatchBadge]}>
            <AppText variant="caption" style={styles.matchText}>
              {displayBadge}
            </AppText>
          </View>
        ) : null}

        {showBookmark ? (
          <Pressable
            style={styles.bookmarkButton}
            onPress={(event) => {
              event.stopPropagation();
              onBookmarkPress?.();
            }}
          >
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={isSaved ? COLORS.royal_gold : COLORS.blue_spruce}
            />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.content}>
        <AppText variant="cardTitle" numberOfLines={2} style={styles.title}>
          {name}
        </AppText>

        {typeof minutes === 'number' && minutes > 0 ? (
          <View style={styles.timeChip}>
            <AppText variant="caption" style={styles.timeText}>
              {minutes} MIN
            </AppText>
          </View>
        ) : null}
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
    width: '100%',
    height: 126,
    backgroundColor: COLORS.honeydew_shadow,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.honeydew_shadow,
  },
  matchBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
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
  bookmarkButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.porcelain,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: COLORS.honeydew_shadow,
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