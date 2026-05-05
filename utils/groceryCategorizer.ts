export type GroceryCategory =
  | 'Produce'
  | 'Meat'
  | 'Seafood'
  | 'Dairy'
  | 'Frozen'
  | 'Grain'
  | 'Seasoning'
  | 'Condiment'
  | 'Snack'
  | 'Beverage'
  | 'Other';

const CATEGORY_KEYWORDS: Record<GroceryCategory, string[]> = {
  Produce: [
    'apple',
    'banana',
    'orange',
    'grape',
    'strawberry',
    'blueberry',
    'avocado',
    'lettuce',
    'spinach',
    'kale',
    'carrot',
    'potato',
    'onion',
    'tomato',
    'pepper',
    'broccoli',
    'cucumber',
    'garlic',
    'lime',
    'lemon',
  ],
  Meat: [
    'chicken',
    'beef',
    'steak',
    'pork',
    'bacon',
    'sausage',
    'turkey',
    'ham',
  ],
  Seafood: [
    'fish',
    'salmon',
    'tuna',
    'shrimp',
    'crab',
    'lobster',
    'cod',
    'tilapia',
  ],
  Dairy: [
    'milk',
    'cheese',
    'yogurt',
    'butter',
    'cream',
    'eggs',
    'egg',
    'sour cream',
  ],
  Frozen: [
    'frozen',
    'ice cream',
    'pizza rolls',
    'frozen pizza',
    'frozen vegetables',
  ],
  Grain: [
    'bread',
    'rice',
    'pasta',
    'noodles',
    'tortilla',
    'flour',
    'oats',
    'cereal',
    'bagel',
    'bun',
  ],
  Seasoning: [
    'salt',
    'pepper',
    'paprika',
    'garlic powder',
    'onion powder',
    'seasoning',
    'cinnamon',
    'oregano',
    'basil',
  ],
  Condiment: [
    'ketchup',
    'mustard',
    'mayo',
    'mayonnaise',
    'sauce',
    'dressing',
    'salsa',
    'soy sauce',
    'hot sauce',
  ],
  Snack: [
    'chips',
    'crackers',
    'cookies',
    'popcorn',
    'pretzels',
    'granola',
    'candy',
    'chocolate',
  ],
  Beverage: [
    'water',
    'juice',
    'soda',
    'coffee',
    'tea',
    'milkshake',
    'lemonade',
    'sports drink',
  ],
  Other: [],
};

export function categorizeGroceryItem(name: string): GroceryCategory {
  const normalizedName = name.trim().toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const hasMatch = keywords.some((keyword) =>
      normalizedName.includes(keyword)
    );

    if (hasMatch) {
      return category as GroceryCategory;
    }
  }

  return 'Other';
}