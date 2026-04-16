import AppText from '@/components/ui/AppText';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

type StorageCardProps = {
  name: string;
  itemCount: number;
  expiringCount: number;
  onPress?: () => void;
};

export default function StorageCard({
  name,
  itemCount,
  expiringCount,
  onPress,
}: StorageCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.leftSection}>
        <View style={styles.iconWrapper}>
          <Ionicons
            name="archive-outline"
            size={20}
            color={COLORS.blue_spruce}
          />
        </View>

        <View style={styles.textContainer}>
          <AppText variant="cardTitle">{name}</AppText>

          <View style={styles.bottomRow}>
            <AppText variant="caption">{itemCount} items</AppText>
            <AppText variant="caption">{expiringCount} expiring</AppText>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.porcelain,
    borderRadius: 16,
    padding: 14,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.mint_leaf,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.honeydew,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
});