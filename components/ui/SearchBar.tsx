import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

type SearchBarProps = TextInputProps & {
  placeholder?: string;
};

export default function SearchBar({
  placeholder = 'Search items',
  value,
  onChangeText,
  ...props
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color={COLORS.input_text} />
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
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.honeydew_shadow,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.blue_spruce,
    fontFamily: 'Poppins_400Regular',
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
});