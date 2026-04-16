import { TYPOGRAPHY } from '@/constants/typography';
import { StyleSheet, Text, TextProps } from 'react-native';

type AppTextProps = TextProps & {
  variant?: keyof typeof TYPOGRAPHY;
};

export default function AppText({
  variant = 'body',
  style,
  children,
  ...props
}: AppTextProps) {
  return (
    <Text style={[styles.defaultText, TYPOGRAPHY[variant], style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: 'Poppins_400Regular',
  },
});