import { COLORS } from '@/constants/colors';
import { Image } from 'expo-image';
import { Pressable, StyleSheet } from 'react-native';


type AddTabButtonProps = {
  onPress: () => void;
};

export default function AddTabButton({ onPress }: AddTabButtonProps) {
  return (
    <Pressable
  style={({ pressed }) => [
    styles.button,
    pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
  ]}
  onPress={onPress}
>
      <Image
        source={require('@/assets/images/icon-plus-button.png')}
        style={styles.icon}
        contentFit="contain"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.vibrant_coral,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.flag_red,
    marginTop: 0,
    alignSelf: 'center',
  },
  icon: {
    width: 32,
    height: 32,
  },
});