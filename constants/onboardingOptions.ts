// constants/onboardingOptions.ts

import { DietOption, IntoleranceOption } from '@/types/onboarding';

export const DIET_OPTIONS: DietOption[] = [
  { label: 'Omnivore', value: null, icon: '🍗' },
  { label: 'Vegetarian', value: 'vegetarian', icon: '🥗' },
  { label: 'Vegan', value: 'vegan', icon: '🌱' },
  { label: 'Keto', value: 'ketogenic', icon: '🥩' },
  { label: 'Gluten-Free', value: 'gluten free', icon: '🌾' },
  { label: 'Pescetarian', value: 'pescetarian', icon: '🐟' },
];

export const INTOLERANCE_OPTIONS: IntoleranceOption[] = [
  { label: 'Dairy', value: 'dairy' },
  { label: 'Egg', value: 'egg' },
  { label: 'Gluten', value: 'gluten' },
  { label: 'Grain', value: 'grain' },
  { label: 'Peanut', value: 'peanut' },
  { label: 'Seafood', value: 'seafood' },
  { label: 'Sesame', value: 'sesame' },
  { label: 'Shellfish', value: 'shellfish' },
  { label: 'Soy', value: 'soy' },
  { label: 'Tree Nut', value: 'tree nut' },
  { label: 'Wheat', value: 'wheat' },
];

export const AVATAR_OPTIONS = ['🏠', '🌿', '🥗', '🌻', '🐻', '🦊', '🐸', '🍳'];