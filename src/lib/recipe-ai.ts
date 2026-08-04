import { normalizeDepartment, type Department, type Ingredient } from '@/data/mock-data';
import { normalizeIngredientQuantity } from '@/lib/ingredient-parser';
import { ensureMealMateSession } from '@/lib/mealmate-session';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type AiIngredient = {
  name: string;
  amount: number;
  unit: string;
  department: Department;
};

type AiRecipeResponse = {
  title: string;
  subtitle: string;
  minutes: number;
  ingredients: AiIngredient[];
};

export type RecipeAiInput = {
  text?: string;
  imageBase64?: string | null;
  imageMimeType?: string | null;
};

export type RecipeAiDraft = Omit<AiRecipeResponse, 'ingredients'> & {
  ingredients: Ingredient[];
};

export const isRecipeAiConfigured = isSupabaseConfigured;

const ingredientId = (name: string, index: number) =>
  `ai-${index}-${name.toLocaleLowerCase('nl').replace(/[^a-z0-9]+/g, '-')}`;

const functionErrorMessage = async (error: unknown) => {
  const fallback = error instanceof Error ? error.message : 'Het recept kon niet door AI worden gelezen.';
  const friendlyFallback = /failed to send a request|network request failed|fetch failed/i.test(fallback)
    ? 'Tably kon de AI-server niet bereiken. Controleer je verbinding en probeer het opnieuw.'
    : fallback;
  const context = (error as { context?: { json?: () => Promise<unknown> } } | null)?.context;
  if (!context?.json) return friendlyFallback;

  try {
    const body = (await context.json()) as { error?: unknown };
    if (typeof body.error !== 'string') return friendlyFallback;
    if (body.error.includes('OPENAI_API_KEY')) {
      return 'De OpenAI-koppeling moet nog één keer veilig worden geactiveerd.';
    }
    if (/no credits|billing/i.test(body.error)) {
      return 'Er staat nog geen API-tegoed op het OpenAI-account. Voeg eerst tegoed toe bij OpenAI Billing.';
    }
    return body.error;
  } catch {
    return friendlyFallback;
  }
};

export async function extractRecipeWithAi(input: RecipeAiInput): Promise<RecipeAiDraft> {
  if (!supabase) {
    throw new Error(
      'De AI-koppeling moet nog worden geactiveerd met de Supabase-gegevens.',
    );
  }

  await ensureMealMateSession();

  const { data, error } = await supabase.functions.invoke<AiRecipeResponse>('parse-recipe', {
    body: input,
  });

  if (error) throw new Error(await functionErrorMessage(error));
  if (!data?.title || !Array.isArray(data.ingredients) || data.ingredients.length === 0) {
    throw new Error('AI vond geen volledig recept. Probeer meer tekst of een duidelijkere foto.');
  }

  return {
    title: data.title,
    subtitle: data.subtitle,
    minutes: data.minutes,
    ingredients: data.ingredients.map((ingredient, index) =>
      normalizeIngredientQuantity({
        ...ingredient,
        id: ingredientId(ingredient.name, index),
        department: normalizeDepartment(ingredient.department),
      }),
    ),
  };
}
