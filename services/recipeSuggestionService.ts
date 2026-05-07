import {
  PopularRecipe,
  RecipeInformation,
  RecipeSuggestion,
} from '@/types/recipes';

const BASE_URL = 'https://api.spoonacular.com/recipes';
const API_KEY = process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY;

export type RecipePreferences = {
  diet?: string | null;
  intolerances?: string[] | null;
  householdSize?: number | null;
};

const cache = {
  popular: new Map<string, PopularRecipe[]>(),
  suggestions: new Map<string, RecipeSuggestion[]>(),
  details: new Map<string | number, RecipeInformation>(),
};

function ensureApiKey() {
  if (!API_KEY) {
    throw new Error('Missing EXPO_PUBLIC_SPOONACULAR_API_KEY');
  }
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const text = await response.text();
    console.error('Spoonacular error:', text);
    throw new Error(`Spoonacular error ${response.status}`);
  }

  return response.json();
}

function applyRecipePreferences(
  params: URLSearchParams,
  preferences?: RecipePreferences
) {
  if (preferences?.diet) {
    params.append('diet', preferences.diet);
  }

  if (preferences?.intolerances?.length) {
    params.append('intolerances', preferences.intolerances.join(','));
  }
}

function getPreferenceCacheKey(preferences?: RecipePreferences) {
  return [
    preferences?.diet ?? 'any',
    preferences?.intolerances?.join(',') ?? 'none',
    preferences?.householdSize ?? 1,
  ].join('|');
}

const SPOONACULAR_TYPES: Record<string, string> = {
  breakfast: 'breakfast',
  'main-course': 'main course',
  'side-dish': 'side dish',
  dessert: 'dessert',
  snack: 'snack',
};

export async function fetchPopularRecipes({
  query = '',
  category = 'all',
  number = 12,
  preferences,
}: {
  query?: string;
  category?: string;
  number?: number;
  preferences?: RecipePreferences;
}): Promise<PopularRecipe[]> {
  ensureApiKey();

  const key = `${query}|${category}|${number}|${getPreferenceCacheKey(preferences)}`;

  if (cache.popular.has(key)) {
    return cache.popular.get(key)!;
  }

  const params = new URLSearchParams({
    apiKey: API_KEY!,
    number: String(number),
    sort: 'popularity',
  });

  if (query.trim()) {
    params.append('query', query.trim());
  }

  if (SPOONACULAR_TYPES[category]) {
    params.append('type', SPOONACULAR_TYPES[category]);
  }

  if (category === 'quick') {
    params.append('maxReadyTime', '30');
  }

  applyRecipePreferences(params, preferences);

  const response = await fetch(`${BASE_URL}/complexSearch?${params.toString()}`);
  const data = await handleResponse(response);

  const results = data.results ?? [];

  cache.popular.set(key, results);

  return results;
}

export async function fetchRecipeSuggestions({
  ingredients,
  number = 12,
  preferences,
}: {
  ingredients: string[];
  number?: number;
  preferences?: RecipePreferences;
}): Promise<RecipeSuggestion[]> {
  ensureApiKey();

  if (ingredients.length === 0) return [];

  const key = `${ingredients.join(',')}|${number}|${getPreferenceCacheKey(preferences)}`;

  if (cache.suggestions.has(key)) {
    return cache.suggestions.get(key)!;
  }

  const params = new URLSearchParams({
    apiKey: API_KEY!,
    ingredients: ingredients.join(','),
    number: String(number),
    ranking: '1',
    ignorePantry: 'true',
  });

  const response = await fetch(
    `${BASE_URL}/findByIngredients?${params.toString()}`
  );

  let data = await handleResponse(response);

  if (preferences?.diet || preferences?.intolerances?.length) {
    data = await filterIngredientRecipesByPreferences(data, preferences);
  }

  cache.suggestions.set(key, data);

  return data;
}

async function filterIngredientRecipesByPreferences(
  recipes: RecipeSuggestion[],
  preferences: RecipePreferences
): Promise<RecipeSuggestion[]> {
  const checkedRecipes = await Promise.all(
    recipes.map(async (recipe) => {
      const info = await fetchRecipeInformation(recipe.id);

      const matchesDiet = preferences.diet
        ? recipeMatchesDiet(info, preferences.diet)
        : true;

      const matchesIntolerances = preferences.intolerances?.length
        ? recipeAvoidsIntolerances(info, preferences.intolerances)
        : true;

      return matchesDiet && matchesIntolerances ? recipe : null;
    })
  );

  return checkedRecipes.filter(Boolean) as RecipeSuggestion[];
}

function recipeMatchesDiet(recipe: RecipeInformation, diet: string) {
  const normalizedDiet = diet.toLowerCase();

  if (normalizedDiet === 'vegetarian') return recipe.vegetarian === true;
  if (normalizedDiet === 'vegan') return recipe.vegan === true;
  if (normalizedDiet === 'gluten free') return recipe.glutenFree === true;

  return true;
}

function recipeAvoidsIntolerances(
  recipe: RecipeInformation,
  intolerances: string[]
) {
  const title = recipe.title?.toLowerCase() ?? '';
  const summary = recipe.summary?.toLowerCase() ?? '';
  const text = `${title} ${summary}`;

  return intolerances.every((item) => !text.includes(item.toLowerCase()));
}

export async function fetchRecipeInformation(
  recipeId: string | number
): Promise<RecipeInformation> {
  ensureApiKey();

  if (cache.details.has(recipeId)) {
    return cache.details.get(recipeId)!;
  }

  const params = new URLSearchParams({
    apiKey: API_KEY!,
    includeNutrition: 'false',
  });

  const response = await fetch(
    `${BASE_URL}/${recipeId}/information?${params.toString()}`
  );

  const data = await handleResponse(response);

  cache.details.set(recipeId, data);

  return data;
}

export function getRecipeMatchPercent(recipe: RecipeSuggestion) {
  const total = recipe.usedIngredientCount + recipe.missedIngredientCount;

  if (total === 0) return 0;

  return Math.round((recipe.usedIngredientCount / total) * 100);
}