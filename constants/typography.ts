import { TextStyle } from 'react-native';
import { COLORS } from './colors';

export const TYPOGRAPHY: Record<string, TextStyle> = {
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.blue_spruce_shadow,
  },

  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: COLORS.blue_spruce_shadow,
  },

  heroTitle: {
    fontSize: 22,
    fontFamily: 'Poppins_500Medium',
    color: COLORS.porcelain,
  },

  heroGreeting: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: COLORS.porcelain,
  },

  cardTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: COLORS.blue_spruce_shadow,
  },

  body: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: COLORS.input_text,
  },

  caption: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: COLORS.input_text,
  },

  overviewCount: {
    fontSize: 20,
    fontFamily: 'Poppins_500Medium',
    color: COLORS.blue_spruce,
  },

  overviewLabel: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: COLORS.input_text,
  },

  button: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
    color: COLORS.porcelain,
  },

  inputLabel: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: COLORS.blue_spruce_shadow,
  },

  brand: {
    fontSize: 36,
    fontFamily: 'OleoScriptSwashCaps_400Regular',
    color: COLORS.blue_spruce_shadow,
  },

  authTitle: {
    fontSize: 32,
    fontFamily: 'Montserrat_700Bold',
    color: COLORS.blue_spruce_shadow,
    lineHeight: 38,
  },
};