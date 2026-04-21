import AppText from '@/components/ui/AppText';
import { COLORS } from '@/constants/colors';
import { Pressable, StyleSheet, View } from 'react-native';

type RecipeActionCardProps = {
  title: string;
  onPress: () => void;
  backgroundColor: string;
  circleColor: string;
  arrowColor: string;
};

export default function RecipeActionCard({
  title,
  onPress,
  backgroundColor,
  circleColor,
  arrowColor,
}: RecipeActionCardProps) {
  return (
    <Pressable onPress={onPress} style={[styles.card, { backgroundColor }]}>
      <AppText variant="sectionTitle" style={styles.title}>
        {title}
      </AppText>

      <View style={[styles.arrowCircle, { backgroundColor: circleColor }]}>
        <AppText variant="body" style={[styles.arrow, { color: arrowColor }]}>
          →
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 108,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    justifyContent: 'space-between',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.blue_spruce,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    maxWidth: '80%',
    color: COLORS.porcelain,
  },
  arrowCircle: {
    alignSelf: 'flex-end',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.blue_spruce,
  },
  arrow: {
    fontSize: 22,
    fontWeight: '700',
  },
});