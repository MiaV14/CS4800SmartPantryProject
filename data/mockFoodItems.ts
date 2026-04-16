export type FoodItem = {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  expirationDate: string;
  category: string;
  storageId: string;
};

export const MOCK_FOOD_ITEMS: FoodItem[] = [
  // =========================
  // FRIDGE - MAIN
  // =========================
  {
    id: '1',
    name: 'Milk',
    quantity: '1',
    unit: 'count',
    expirationDate: '04/10/2026', // ❌ expired
    category: 'Dairy',
    storageId: 'fridge-main',
  },
  {
    id: '2',
    name: 'Eggs',
    quantity: '12',
    unit: 'count',
    expirationDate: '04/14/2026', // ⚠️ today
    category: 'Dairy',
    storageId: 'fridge-main',
  },
  {
    id: '3',
    name: 'Chicken',
    quantity: '2',
    unit: 'lb',
    expirationDate: '04/15/2026', // ⚠️ +1 day
    category: 'Meat',
    storageId: 'fridge-main',
  },
  {
    id: '4',
    name: 'Spinach',
    quantity: '1',
    unit: 'count',
    expirationDate: '04/16/2026', // ⚠️ +2 days
    category: 'Produce',
    storageId: 'fridge-main',
  },
  {
    id: '5',
    name: 'Yogurt',
    quantity: '6',
    unit: 'count',
    expirationDate: '04/25/2026', // ✅ fresh
    category: 'Dairy',
    storageId: 'fridge-main',
  },

  // =========================
  // FREEZER
  // =========================
  {
    id: '6',
    name: 'Frozen Peas',
    quantity: '1',
    unit: 'count',
    expirationDate: '06/10/2026',
    category: 'Frozen',
    storageId: 'fridge-freezer',
  },
  {
    id: '7',
    name: 'Ice Cream',
    quantity: '1',
    unit: 'count',
    expirationDate: '07/01/2026',
    category: 'Frozen',
    storageId: 'fridge-freezer',
  },
  {
    id: '8',
    name: 'Frozen Pizza',
    quantity: '2',
    unit: 'count',
    expirationDate: '05/15/2026',
    category: 'Frozen',
    storageId: 'fridge-freezer',
  },
  {
    id: '9',
    name: 'Ground Beef',
    quantity: '1',
    unit: 'lb',
    expirationDate: '04/13/2026', // ❌ expired
    category: 'Meat',
    storageId: 'fridge-freezer',
  },
  {
    id: '10',
    name: 'Frozen Berries',
    quantity: '1',
    unit: 'count',
    expirationDate: '06/25/2026',
    category: 'Frozen',
    storageId: 'fridge-freezer',
  },

  // =========================
  // PANTRY
  // =========================
  {
    id: '11',
    name: 'Rice',
    quantity: '2',
    unit: 'lb',
    expirationDate: '10/15/2026',
    category: 'Grain',
    storageId: 'pantry',
  },
  {
    id: '12',
    name: 'Pasta',
    quantity: '1',
    unit: 'lb',
    expirationDate: '09/10/2026',
    category: 'Grain',
    storageId: 'pantry',
  },
  {
    id: '13',
    name: 'Cereal',
    quantity: '1',
    unit: 'count',
    expirationDate: '04/17/2026', // ⚠️ soon
    category: 'Grain',
    storageId: 'pantry',
  },
  {
    id: '14',
    name: 'Chips',
    quantity: '2',
    unit: 'count',
    expirationDate: '05/30/2026',
    category: 'Snack',
    storageId: 'pantry',
  },
  {
    id: '15',
    name: 'Peanut Butter',
    quantity: '1',
    unit: 'count',
    expirationDate: '11/05/2026',
    category: 'Condiment',
    storageId: 'pantry',
  },

  // =========================
  // SEASONINGS
  // =========================
  {
    id: '16',
    name: 'Salt',
    quantity: '1',
    unit: 'count',
    expirationDate: '12/01/2027',
    category: 'Seasoning',
    storageId: 'seasonings',
  },
  {
    id: '17',
    name: 'Black Pepper',
    quantity: '1',
    unit: 'count',
    expirationDate: '11/20/2027',
    category: 'Seasoning',
    storageId: 'seasonings',
  },
  {
    id: '18',
    name: 'Paprika',
    quantity: '1',
    unit: 'count',
    expirationDate: '10/15/2027',
    category: 'Seasoning',
    storageId: 'seasonings',
  },
  {
    id: '19',
    name: 'Olive Oil',
    quantity: '1',
    unit: 'count',
    expirationDate: '04/12/2026', // ❌ expired
    category: 'Condiment',
    storageId: 'seasonings',
  },
  {
    id: '20',
    name: 'Soy Sauce',
    quantity: '1',
    unit: 'count',
    expirationDate: '04/15/2026', // ⚠️ soon
    category: 'Condiment',
    storageId: 'seasonings',
  },
];