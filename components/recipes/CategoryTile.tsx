import AppText from '@/components/ui/AppText';
import { COLORS } from '@/constants/colors';
import { Pressable, StyleSheet, View } from 'react-native';

type CategoryTileProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
};

export default function CategoryTile({
  label,
  selected = false,
  onPress,
  icon,
}: CategoryTileProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, selected ? styles.selectedContainer : styles.defaultContainer]}
    >
      <View style={[styles.iconBox, selected ? styles.selectedIconBox : styles.defaultIconBox]}>
        {icon}
      </View>

      <AppText
        variant="caption"
        style={[styles.label, selected ? styles.selectedLabel : styles.defaultLabel]}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 78,
    alignItems: 'center',
    gap: 8,
  },
  defaultContainer: {},
  selectedContainer: {},
  iconBox: {
    width: 78,
    height: 78,
    borderRadius: 14,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultIconBox: {
    backgroundColor: COLORS.porcelain,
    borderColor: COLORS.mint_leaf,
  },
  selectedIconBox: {
    backgroundColor: COLORS.blue_spruce,
    borderColor: COLORS.blue_spruce_shadow,
  },
  label: {
    textAlign: 'center',
  },
  defaultLabel: {
    color: COLORS.blue_spruce_shadow,
  },
  selectedLabel: {
    color: COLORS.blue_spruce_shadow,
  },
});