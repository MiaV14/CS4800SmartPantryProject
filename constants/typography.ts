import { TextStyle } from 'react-native';

export const TYPOGRAPHY: Record<string, TextStyle> = {
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: '#363137',
  },

  heroTitle: {
    fontSize: 22,
    fontFamily: 'Poppins_500Medium',
    color: '#F7FAF8',
  },

  heroGreeting: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#F7FAF8',
  },

  cardTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: '#363137',
  },

  body: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#889A8E',
  },

  caption: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: '#889A8E',
  },

  overviewCount: {
    fontSize: 20,
    fontFamily: 'Poppins_500Medium',
    color: '#1F7A6B',
  },

  overviewLabel: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#889A8E',
  },

  button: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
  },

  inputLabel: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#363137',
  },

  brand: {
  fontSize: 36,
  fontFamily: 'OleoScriptSwashCaps_400Regular',
  color: '#363137',
},

  authTitle: {
    fontSize: 32,
    fontFamily: 'Montserrat_700Bold',
    color: '#363137', // or COLORS.blue_spruce_shadow
    lineHeight: 38,
  },
};