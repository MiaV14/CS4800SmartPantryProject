import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { COLORS } from '@/constants/colors';

type SearchBarProps = TextInputProps & {
  placeholder?: string;
};

export default function SearchBar({
  placeholder = 'Search',
  value,
  onChangeText,
  ...props
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={COLORS.blue_spruce} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.input_text}
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: COLORS.porcelain,
    borderRadius: 999,

    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.mint_leaf,

    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },

  input: {
    flex: 1,
    color: COLORS.blue_spruce_shadow,
    fontSize: 15,

    textAlignVertical: 'center',

    paddingVertical: 0,
  },
});