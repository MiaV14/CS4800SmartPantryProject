import { Image } from 'expo-image';
import { Pressable, StyleSheet } from 'react-native';

type FloatingAddButtonProps = {
  onPress: () => void;
};

export default function FloatingAddButton({
  onPress,
}: FloatingAddButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
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
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B63',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: '#D93A32',
    zIndex: 20,
    elevation: 8,
    alignSelf: 'center',
  },
  icon: {
    width: 32,
    height: 32,
  },
});