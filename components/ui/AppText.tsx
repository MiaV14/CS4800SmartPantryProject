import { TYPOGRAPHY } from '@/constants/typography';
import { Text, TextProps } from 'react-native';

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
    <Text style={[TYPOGRAPHY[variant], style]} {...props}>
      {children}
    </Text>
  );
}