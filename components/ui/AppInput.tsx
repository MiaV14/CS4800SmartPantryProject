import FormLabel from '@/components/ui/FormLabel';
import { COLORS } from '@/constants/colors';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

type AppInputProps = TextInputProps & {
  label?: string;
  required?: boolean;
};

export default function AppInput({
  label,
  required = false,
  style,
  ...textInputProps
}: AppInputProps) {
  return (
    <View style={styles.wrapper}>
      {label ? <FormLabel label={label} required={required} /> : null}

      <TextInput
        {...textInputProps}
        style={[styles.input, style]}
        placeholderTextColor={COLORS.input_text}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  input: {
    height: 42,
    borderRadius: 10,
    backgroundColor: COLORS.porcelain,
    paddingHorizontal: 12,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#363137',
    borderWidth: 1,
    borderColor: COLORS.honeydew_shadow,
  },
});