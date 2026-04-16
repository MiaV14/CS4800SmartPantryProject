// constants/styles.ts

import { ViewStyle } from 'react-native';
import { COLORS } from './colors';

// Base function (you can reuse later if needed)
function sharpShadow(color: string): ViewStyle {
  return {
    shadowColor: color,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3, // Android fallback
  };
}

// Predefined shadows for your app
export const SHADOWS = {
  banner: sharpShadow(COLORS.blue_spruce),
  overview: sharpShadow('#BEE3CD'),
  storage: sharpShadow(COLORS.mint_leaf),
};