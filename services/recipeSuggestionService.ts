import {
  PopularRecipe,
  RecipeInformation,
  RecipeSuggestion,
} from '@/types/recipes';

const BASE_URL = 'https://api.spoonacular.com/recipes';
const API_KEY = process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY;

/**
 * SIMPLE IN-MEMORY CACHE (per session)
 */
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

//
// =========================
// FETCH BY INGREDIENTS
// =========================
//

export async function fetchRecipeSuggestions({
  ingredients,
  number = 12,
}: {
  ingredients: string[];
  number?: number;
}): Promise<RecipeSuggestion[]> {
  ensureApiKey();

  if (ingredients.length === 0) return [];

  const key = ingredients.join(',') + `|${number}`;

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

  const data = await handleResponse(response);

  cache.suggestions.set(key, data);

  return data;
}

//
// =========================
// POPULAR RECIPES (LOW COST)
// =========================
//

export async function fetchPopularRecipes({
  query = '',
  category = 'all',
  number = 12,
}: {
  query?: string;
  category?: string;
  number?: number;
}): Promise<PopularRecipe[]> {
  ensureApiKey();

  const key = `${query}|${category}|${number}`;

  if (cache.popular.has(key)) {
    return cache.popular.get(key)!;
  }

  const params = new URLSearchParams({
    apiKey: API_KEY!,
    number: String(number),
    sort: 'popularity',
    // ❌ REMOVED expensive options:
    // addRecipeInformation
    // instructionsRequired
  });

  if (query.trim()) {
    params.append('query', query.trim());
  }

  if (category !== 'all' && category !== 'quick') {
    params.append('type', category);
  }

  if (category === 'quick') {
    params.append('maxReadyTime', '30');
  }

  const response = await fetch(
    `${BASE_URL}/complexSearch?${params.toString()}`
  );

  const data = await handleResponse(response);

  const results = data.results ?? [];

  cache.popular.set(key, results);

  return results;
}

//
// =========================
// RECIPE DETAILS (CACHED)
// =========================
//

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

//
// =========================
// UTIL
// =========================
//

export function getRecipeMatchPercent(recipe: RecipeSuggestion) {
  const total =
    recipe.usedIngredientCount + recipe.missedIngredientCount;

  if (total === 0) return 0;

  return Math.round((recipe.usedIngredientCount / total) * 100);
}