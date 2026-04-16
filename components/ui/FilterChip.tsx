import { COLORS } from '@/constants/colors';
import { Pressable, StyleSheet } from 'react-native';
import AppText from './AppText';

type FilterChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export default function FilterChip({
  label,
  selected,
  onPress,
}: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.base,
        selected ? styles.selected : styles.unselected,
      ]}
    >
      <AppText
        style={[
          styles.text,
          selected ? styles.selectedText : styles.unselectedText,
        ]}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,

    borderWidth: 2, // simplify instead of 4-side borders
  },

  selected: {
    backgroundColor: COLORS.royal_gold,
    borderColor: COLORS.royal_gold_shadow,
  },

  unselected: {
    backgroundColor: COLORS.porcelain,
    borderColor: COLORS.porcelain_shadow,
  },

  text: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
  },

  selectedText: {
    color: COLORS.royal_gold_shadow,
  },

  unselectedText: {
    color: COLORS.mint_leaf,
  },
});