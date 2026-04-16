/*
BottomSheetModal
    - visibility, backdrop, slide-up positioning, sheet styling, close behavior
    - The reusable wrapper for the other parts of the modal.
*/

import { COLORS } from '@/constants/colors';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    PanResponder,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

type BottomSheetModalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const SCREEN_HEIGHT = Dimensions.get('window').height;
const CLOSE_THRESHOLD = 120;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function BottomSheetModal({
  visible,
  onClose,
  children,
}: BottomSheetModalProps) {
  const [isMounted, setIsMounted] = useState(visible);

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const isClosing = useRef(false);

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      isClosing.current = false;

      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          tension: 70,
          friction: 12,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (isMounted) {
      translateY.setValue(SCREEN_HEIGHT);
      backdropOpacity.setValue(0);
      setIsMounted(false);
    }
  }, [visible, isMounted, backdropOpacity, translateY]);

  const closeSheet = () => {
    if (isClosing.current) return;
    isClosing.current = true;

    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      isClosing.current = false;
      setIsMounted(false);
      onClose();
    });
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 8,
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dy > 0) {
            translateY.setValue(gestureState.dy);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy > CLOSE_THRESHOLD) {
            closeSheet();
          } else {
            Animated.spring(translateY, {
              toValue: 0,
              tension: 70,
              friction: 12,
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    [translateY]
  );

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      transparent
      visible={isMounted}
      onRequestClose={closeSheet}
      statusBarTranslucent
    >
      <View style={styles.root}>
        <AnimatedPressable
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
          onPress={closeSheet}
        />

        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={closeSheet}
            style={styles.handleTouchable}
          >
            <View style={styles.handle} />
          </TouchableOpacity>

          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  sheet: {
    backgroundColor: COLORS.honeydew,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  handleTouchable: {
    alignItems: 'center',
    paddingBottom: 14,
  },
  handle: {
    width: 84,
    height: 5,
    borderRadius: 999,
    backgroundColor: COLORS.honeydew_shadow,
  },
});