import FormLabel from '@/components/ui/FormLabel';
import { COLORS } from '@/constants/colors';
import { ReactNode } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

type AppInputProps = TextInputProps & {
  label?: string;
  required?: boolean;
  rightAccessory?: ReactNode;
};

export default function AppInput({
  label,
  required = false,
  style,
  rightAccessory,
  ...textInputProps
}: AppInputProps) {
  return (
    <View style={styles.wrapper}>
      {label ? <FormLabel label={label} required={required} /> : null}

      <View style={styles.inputWrapper}>
        <TextInput
          {...textInputProps}
          style={[
            styles.input,
            rightAccessory ? styles.inputWithAccessory : null,
            style,
          ]}
          placeholderTextColor={COLORS.input_text}
        />

        {rightAccessory ? (
          <View style={styles.rightAccessory}>{rightAccessory}</View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
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
  inputWithAccessory: {
    paddingRight: 44,
  },
  rightAccessory: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});