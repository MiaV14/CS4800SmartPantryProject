import AppText from '@/components/ui/AppText';
import { COLORS } from '@/constants/colors';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';

type AppButtonVariant = 'primary' | 'secondary' | 'accent';

type AppButtonProps = PressableProps & {
  title: string;
  variant?: AppButtonVariant;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
};

export default function AppButton({
  title,
  variant = 'primary',
  style,
  textStyle,
  disabled,
  ...pressableProps
}: AppButtonProps) {
  return (
    <Pressable
      {...pressableProps}
      disabled={disabled}
      style={[
        styles.base,
        buttonStyles[variant],
        disabled && styles.disabled,
        style,
      ]}
    >
      <AppText
        variant="button"
        style={[textStyles.base, textStyles[variant], textStyle]}
      >
        {title}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 46,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 4,
    borderBottomWidth: 4,
  },
  disabled: {
    opacity: 0.6,
  },
});

const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: COLORS.blue_spruce,
    borderColor: '#0E3C34',
  },
  secondary: {
    backgroundColor: COLORS.porcelain,
    borderColor: COLORS.mint_leaf,
  },
  accent: {
    backgroundColor: COLORS.royal_gold,
    borderColor: '#C9B53E',
  },
});

const textStyles = StyleSheet.create({
  base: {},
  primary: {
    color: COLORS.porcelain,
  },
  secondary: {
    color: COLORS.mint_leaf,
  },
  accent: {
    color: COLORS.blue_spruce,
  },
});