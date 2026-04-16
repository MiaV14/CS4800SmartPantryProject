import { COLORS } from '@/constants/colors';
import { getExpiryStatus } from '@/utils/expiry';
import { Pressable, StyleSheet, View } from 'react-native';
import AppText from './AppText';

type FoodItemCardProps = {
  name: string;
  quantity: string;
  unit?: string;
  category: string;
  expirationDate: string;
  onPress?: () => void;
};

export default function FoodItemCard({
  name,
  quantity,
  unit,
  category,
  expirationDate,
  onPress,
}: FoodItemCardProps) {
  const quantityLabel = unit ? `${quantity} ${unit}` : quantity;
  const expiryStatus = getExpiryStatus(expirationDate);

  const cardStyle = [
    styles.card,
    expiryStatus === 'expiring' && styles.expiringCard,
    expiryStatus === 'expired' && styles.expiredCard,
  ];

  return (
    <Pressable style={cardStyle} onPress={onPress}>
      <View style={styles.imagePlaceholder} />

      <View style={styles.categoryChip}>
        <AppText style={styles.categoryText}>{category}</AppText>
      </View>

      <AppText variant="cardTitle" style={styles.name}>
        {name}
      </AppText>

      <AppText variant="caption">{quantityLabel}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '31%',
    backgroundColor: COLORS.porcelain,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.mint_leaf,
    position: 'relative',
  },
  expiringCard: {
    backgroundColor: COLORS.expiring_bg,
    borderColor: COLORS.expiring_border,
  },
  expiredCard: {
    backgroundColor: COLORS.expired_bg,
    borderColor: COLORS.expired_border,
  },
  imagePlaceholder: {
    width: '100%',
    height: 70,
    backgroundColor: COLORS.honeydew_shadow,
    marginBottom: 8,
    borderRadius: 0,
  },
  name: {
    textAlign: 'center',
    marginBottom: 2,
  },
  categoryChip: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: COLORS.mint_leaf,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: COLORS.blue_spruce_shadow,
    zIndex: 2,
  },
  categoryText: {
    fontSize: 10,
    color: COLORS.porcelain,
  },
});