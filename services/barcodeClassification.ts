export type PantryCategory =
  | 'Produce'
  | 'Meat'
  | 'Seafood'
  | 'Dairy'
  | 'Grain'
  | 'Seasoning'
  | 'Frozen'
  | 'Condiment'
  | 'Snack'
  | 'Beverage'
  | 'Other';

export type TrackingMode = 'count' | 'amount' | 'fill';

function normalizeText(text?: string) {
  return (text ?? '').toLowerCase();
}

function includesAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

const CATEGORY_KEYWORDS: Record<PantryCategory, string[]> = {
  Produce: [
    'produce',
    'fruit',
    'fruits',
    'vegetable',
    'vegetables',
    'apple',
    'banana',
    'orange',
    'grape',
    'berry',
    'berries',
    'strawberry',
    'blueberry',
    'raspberry',
    'blackberry',
    'avocado',
    'tomato',
    'potato',
    'onion',
    'garlic',
    'lettuce',
    'spinach',
    'kale',
    'broccoli',
    'cauliflower',
    'pepper',
    'peppers',
    'carrot',
    'carrots',
    'celery',
    'cucumber',
    'zucchini',
    'squash',
    'lime',
    'lemon',
    'cilantro',
    'parsley',
    'mushroom',
    'mushrooms',
  ],
  Meat: [
    'meat',
    'beef',
    'steak',
    'ground beef',
    'burger',
    'chicken',
    'turkey',
    'pork',
    'ham',
    'bacon',
    'sausage',
    'pepperoni',
    'salami',
    'prosciutto',
    'deli meat',
    'lunch meat',
    'jerky',
  ],
  Seafood: [
    'seafood',
    'fish',
    'salmon',
    'tuna',
    'shrimp',
    'prawn',
    'cod',
    'tilapia',
    'crab',
    'lobster',
    'sardine',
    'anchovy',
  ],
  Dairy: [
    'dairy',
    'milk',
    'whole milk',
    'skim milk',
    'almond milk',
    'soy milk',
    'oat milk',
    'lactose free milk',
    'cheese',
    'cheddar',
    'mozzarella',
    'parmesan',
    'yogurt',
    'yoghurt',
    'butter',
    'cream',
    'creamer',
    'sour cream',
    'half and half',
    'cottage cheese',
    'cream cheese',
    'probiotic',
    'yakult',
    'kefir',
  ],
  Grain: [
    'grain',
    'bread',
    'bagel',
    'bun',
    'roll',
    'tortilla',
    'tortillas',
    'tostada',
    'tostadas',
    'rice',
    'pasta',
    'noodle',
    'noodles',
    'spaghetti',
    'macaroni',
    'flour',
    'oats',
    'oatmeal',
    'cereal',
    'cracker',
    'crackers',
    'quinoa',
    'barley',
  ],
  Seasoning: [
    'seasoning',
    'spice',
    'spices',
    'salt',
    'pepper',
    'paprika',
    'cumin',
    'oregano',
    'basil',
    'thyme',
    'rosemary',
    'cinnamon',
    'garlic powder',
    'onion powder',
    'chili powder',
    'taco seasoning',
  ],
  Frozen: [
    'frozen',
    'ice cream',
    'popsicle',
    'frozen pizza',
    'frozen meal',
    'frozen vegetables',
    'frozen fruit',
    'frozen chicken',
    'frozen fries',
  ],
  Condiment: [
    'condiment',
    'sauce',
    'ketchup',
    'mustard',
    'mayo',
    'mayonnaise',
    'relish',
    'bbq',
    'hot sauce',
    'soy sauce',
    'teriyaki',
    'salsa',
    'dressing',
    'vinegar',
    'oil',
    'olive oil',
    'canola oil',
    'sesame oil',
    'honey',
    'jam',
    'jelly',
    'peanut butter',
  ],
  Snack: [
    'snack',
    'chips',
    'chip',
    'cookie',
    'cookies',
    'cracker',
    'granola bar',
    'protein bar',
    'pretzel',
    'pretzels',
    'popcorn',
    'candy',
    'chocolate',
    'nuts',
    'trail mix',
  ],
  Beverage: [
    'beverage',
    'drink',
    'juice',
    'soda',
    'soft drink',
    'water',
    'sparkling water',
    'coffee',
    'tea',
    'sports drink',
    'energy drink',
    'lemonade',
    'smoothie',
  ],
  Other: [],
};

const FILL_KEYWORDS = [
  'milk',
  'creamer',
  'juice',
  'broth',
  'stock',
  'chips',
  'tortilla chips',
  'tostadas',
  'cereal',
  'rice',
  'flour',
  'sugar',
  'coffee',
  'syrup',
  'dressing',
  'salsa',
  'sauce',
  'ketchup',
  'mustard',
  'mayo',
  'oil',
  'vinegar',
  'snack',
  'crackers',
  'cookies',
];

const COUNT_KEYWORDS = [
  'egg',
  'eggs',
  'yakult',
  'yogurt drink',
  'string cheese',
  'apple',
  'banana',
  'orange',
  'can',
  'cans',
  'bottle',
  'bottles',
  'cup',
  'cups',
  'pack',
  'packs',
  'piece',
  'pieces',
];

export function inferCategory(...parts: Array<string | undefined>): PantryCategory {
  const text = normalizeText(parts.filter(Boolean).join(' '));

  if (!text.trim()) return 'Other';

  const orderedCategories: PantryCategory[] = [
    'Dairy',
    'Beverage',
    'Snack',
    'Condiment',
    'Seasoning',
    'Frozen',
    'Meat',
    'Seafood',
    'Produce',
    'Grain',
  ];

  for (const category of orderedCategories) {
    if (includesAny(text, CATEGORY_KEYWORDS[category])) {
      return category;
    }
  }

  return 'Other';
}

export function suggestTrackingMode(
  name?: string,
  category?: string
): TrackingMode {
  const text = normalizeText(`${name ?? ''} ${category ?? ''}`);

  if (includesAny(text, FILL_KEYWORDS)) {
    return 'fill';
  }

  if (includesAny(text, COUNT_KEYWORDS)) {
    return 'count';
  }

  return 'amount';
}