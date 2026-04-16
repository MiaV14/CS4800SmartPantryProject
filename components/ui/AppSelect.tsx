import AppText from '@/components/ui/AppText';
import FormLabel from '@/components/ui/FormLabel';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

type AppSelectProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
  onPress?: () => void;
};

export default function AppSelect({
  label,
  placeholder,
  value,
  required = false,
  onPress,
}: AppSelectProps) {
  const displayText = value && value.trim().length > 0 ? value : placeholder;

  return (
    <View style={styles.wrapper}>
      {label ? <FormLabel label={label} required={required} /> : null}

      <Pressable style={styles.input} onPress={onPress}>
        <AppText
          style={[
            styles.text,
            !value ? styles.placeholder : null,
          ]}
        >
          {displayText}
        </AppText>

        <Ionicons
          name="chevron-down"
          size={20}
          color={COLORS.mint_leaf}
        />
      </Pressable>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.honeydew_shadow,
  },
  text: {
    color: '#363137',
  },
  placeholder: {
    color: COLORS.input_text,
  },
});