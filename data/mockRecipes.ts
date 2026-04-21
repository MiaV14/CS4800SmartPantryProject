export type RecipeItem = {
  id: string;
  name: string;
  minutes: number;
  matchPercent: number;
  category: string;
};

export const mockRecipes: RecipeItem[] = [
  {
    id: '1',
    name: 'Veggie Omelet',
    minutes: 15,
    matchPercent: 75,
    category: 'Breakfast',
  },
  {
    id: '2',
    name: 'Chicken Rice Bowl',
    minutes: 25,
    matchPercent: 80,
    category: 'Lunch',
  },
  {
    id: '3',
    name: 'Pasta Primavera',
    minutes: 30,
    matchPercent: 70,
    category: 'Dinner',
  },
  {
    id: '4',
    name: 'Fruit Yogurt Parfait',
    minutes: 10,
    matchPercent: 65,
    category: 'Dessert',
  },
  {
    id: '5',
    name: 'Pantry Stir Fry',
    minutes: 20,
    matchPercent: 78,
    category: 'Pantry',
  },
];