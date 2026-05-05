export type SpoonacularIngredient = {
  id: number;
  name: string;
  original: string;
  amount: number;
  unit: string;
};

export type RecipeSuggestion = {
  id: number;
  title: string;
  image: string;
  imageType?: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  likes: number;
  usedIngredients: SpoonacularIngredient[];
  missedIngredients: SpoonacularIngredient[];
};

export type RecipeInstructionStep = {
  number: number;
  step: string;
};

export type RecipeInstructionGroup = {
  name: string;
  steps: RecipeInstructionStep[];
};

export type RecipeInformation = {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl?: string;
  spoonacularSourceUrl?: string;
  summary?: string;
  dishTypes?: string[];
  cuisines?: string[];
  diets?: string[];
  aggregateLikes?: number;
  healthScore?: number;
  spoonacularScore?: number;
  extendedIngredients: SpoonacularIngredient[];
  analyzedInstructions: RecipeInstructionGroup[];
};

export type PopularRecipe = {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings?: number;
  dishTypes?: string[];
  cuisines?: string[];
  diets?: string[];
  aggregateLikes?: number;
  healthScore?: number;
};

export type RecipeCollection = {
  id: string;
  user_id: string;
  name: string;
  is_default: boolean;
  created_at: string;
};

export type SavedRecipe = {
  id: string;
  user_id: string;
  collection_id: string;
  recipe_id: number;
  title: string;
  image: string | null;
  ready_in_minutes: number | null;
  created_at: string;
};

export type SaveRecipeInput = {
  recipe_id: number;
  title: string;
  image?: string | null;
  ready_in_minutes?: number | null;
};