import { File } from 'expo-file-system';

import { curatedRecipes } from '@/data/curated-recipes';
import {
  dateToIso,
  normalizeDepartment,
  recipes as exampleRecipes,
  type Recipe,
} from '@/data/mock-data';
import { peasMakerRecipes } from '@/data/peas-maker-recipes';
import { normalizeIngredientQuantity } from '@/lib/ingredient-parser';
import { ensureMealMateHousehold, ensureMealMateSession } from '@/lib/mealmate-session';
import { supabase } from '@/lib/supabase';

type NewRecipe = Omit<Recipe, 'id'>;
type CloudRecipeInput = NewRecipe & { clientKey?: string };

const getWeekStartForDate = (isoDate: string) => {
  const date = new Date(`${isoDate}T12:00:00`);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return dateToIso(date);
};

const imageUri = (image: Recipe['image']) => {
  if (!image || typeof image === 'number' || !('uri' in image)) return null;
  return image.uri ?? null;
};

const imageData = async (uri: string) => {
  if (uri.startsWith('data:')) {
    const response = await fetch(uri);
    return response.arrayBuffer();
  }
  return new File(uri).arrayBuffer();
};

const imageType = (uri: string) => {
  if (uri.startsWith('data:image/png') || uri.toLowerCase().endsWith('.png')) return 'image/png';
  if (uri.startsWith('data:image/webp') || uri.toLowerCase().endsWith('.webp')) return 'image/webp';
  if (/\.(heic|heif)$/i.test(uri)) return 'image/heic';
  return 'image/jpeg';
};

const extension = (mimeType: string) => {
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  if (mimeType === 'image/heic') return 'heic';
  return 'jpg';
};

export async function loadCloudRecipes(): Promise<Recipe[]> {
  const client = supabase;
  if (!client) return [];
  await ensureMealMateHousehold();

  const { data, error } = await client
    .from('recipes')
    .select('id, client_key, created_at, title, description, duration_minutes, image_url, source_url, recipe_ingredients(id, name, quantity, unit, department, sort_order)')
    .order('created_at', { ascending: true });
  if (error) throw error;

  return Promise.all(
    (data ?? []).map(async (row) => {
      const bundledRecipe = [...exampleRecipes, ...peasMakerRecipes, ...curatedRecipes].find(
        (recipe) => recipe.clientKey === row.client_key || recipe.id === row.client_key,
      );
      let signedImageUrl: string | null = null;
      if (row.image_url) {
        if (/^https?:\/\//i.test(row.image_url)) {
          signedImageUrl = row.image_url;
        } else {
          const { data: signed } = await client.storage
            .from('recipe-images')
            .createSignedUrl(row.image_url, 60 * 60 * 24 * 7);
          signedImageUrl = signed?.signedUrl ?? null;
        }
      }

      return {
        id: row.id,
        clientKey: row.client_key || undefined,
        createdAt: row.created_at,
        title: row.title,
        subtitle: row.description || 'Opgeslagen in jullie Tably-collectie',
        minutes: row.duration_minutes || 30,
        image: bundledRecipe?.image ?? (signedImageUrl ? { uri: signedImageUrl } : null),
        sourceUrl: row.source_url || undefined,
        ingredients: [...(row.recipe_ingredients ?? [])]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((item) =>
            normalizeIngredientQuantity({
              id: item.id,
              name: item.name,
              amount: Number(item.quantity ?? 0),
              unit: item.unit || '',
              department: normalizeDepartment(item.department),
            }),
          ),
      };
    }),
  );
}

export async function loadCloudHiddenRecipeIds(): Promise<string[]> {
  if (!supabase) return [];
  const userId = await ensureMealMateSession();
  const { data, error } = await supabase
    .from('user_hidden_recipes')
    .select('recipe_id')
    .eq('user_id', userId);
  if (error) throw error;
  return (data ?? []).map((row) => row.recipe_id);
}

export async function setCloudRecipeHidden(recipeId: string, isHidden: boolean) {
  if (!supabase) return;
  const userId = await ensureMealMateSession();

  if (isHidden) {
    const { error } = await supabase.from('user_hidden_recipes').upsert(
      { recipe_id: recipeId, user_id: userId },
      { onConflict: 'recipe_id,user_id' },
    );
    if (error) throw error;
    return;
  }

  const { error } = await supabase
    .from('user_hidden_recipes')
    .delete()
    .eq('recipe_id', recipeId)
    .eq('user_id', userId);
  if (error) throw error;
}

export async function createCloudRecipe(input: CloudRecipeInput): Promise<Recipe> {
  if (!supabase) throw new Error('Supabase is nog niet geconfigureerd.');
  const [userId, householdId] = await Promise.all([
    ensureMealMateSession(),
    ensureMealMateHousehold(),
  ]);

  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .insert({
      household_id: householdId,
      created_by: userId,
      title: input.title,
      description: input.subtitle,
      duration_minutes: input.minutes,
      servings: 2,
      client_key: input.clientKey || null,
      source_url: input.sourceUrl || null,
    })
    .select('id, created_at')
    .single();
  if (recipeError || !recipe) throw recipeError ?? new Error('Het recept kon niet worden bewaard.');

  const normalizedIngredients = input.ingredients.map(normalizeIngredientQuantity);
  const { error: ingredientError } = await supabase.from('recipe_ingredients').insert(
    normalizedIngredients.map((item, index) => ({
      recipe_id: recipe.id,
      name: item.name,
      quantity: item.amount,
      unit: item.unit,
      department: item.department,
      sort_order: index,
    })),
  );
  if (ingredientError) {
    await supabase.from('recipes').delete().eq('id', recipe.id);
    throw ingredientError;
  }

  const localImageUri = imageUri(input.image);
  if (localImageUri) {
    const mimeType = imageType(localImageUri);
    const path = `${householdId}/${recipe.id}/cover.${extension(mimeType)}`;
    const { error: uploadError } = await supabase.storage
      .from('recipe-images')
      .upload(path, await imageData(localImageUri), { contentType: mimeType, upsert: true });

    if (!uploadError) {
      await supabase.from('recipes').update({ image_url: path }).eq('id', recipe.id);
    }
  }

  return { ...input, id: recipe.id, createdAt: recipe.created_at };
}

const isMissingRecipeUpdateFunction = (error: unknown) => {
  if (!error || typeof error !== 'object') return false;
  const candidate = error as { code?: string; message?: string };
  return (
    candidate.code === 'PGRST202' ||
    candidate.code === '42883' ||
    candidate.message?.includes('update_recipe_details') === true
  );
};

async function updateCloudRecipeWithoutRpc(recipeId: string, input: NewRecipe) {
  if (!supabase) return;
  const { data: previousRecipe, error: loadError } = await supabase
    .from('recipes')
    .select('title, description, duration_minutes, recipe_ingredients(id, name, quantity, unit, department, sort_order)')
    .eq('id', recipeId)
    .single();
  if (loadError) throw loadError;

  const { error: recipeError } = await supabase
    .from('recipes')
    .update({
      title: input.title,
      description: input.subtitle,
      duration_minutes: input.minutes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', recipeId);
  if (recipeError) throw recipeError;

  const { error: deleteError } = await supabase
    .from('recipe_ingredients')
    .delete()
    .eq('recipe_id', recipeId);
  if (deleteError) {
    await supabase
      .from('recipes')
      .update({
        title: previousRecipe.title,
        description: previousRecipe.description,
        duration_minutes: previousRecipe.duration_minutes,
      })
      .eq('id', recipeId);
    throw deleteError;
  }

  const { error: ingredientError } = await supabase.from('recipe_ingredients').insert(
    input.ingredients.map((item, index) => ({
      recipe_id: recipeId,
      name: item.name,
      quantity: item.amount,
      unit: item.unit,
      department: item.department,
      sort_order: index,
    })),
  );

  if (ingredientError) {
    await supabase
      .from('recipes')
      .update({
        title: previousRecipe.title,
        description: previousRecipe.description,
        duration_minutes: previousRecipe.duration_minutes,
      })
      .eq('id', recipeId);
    await supabase.from('recipe_ingredients').delete().eq('recipe_id', recipeId);
    if (previousRecipe.recipe_ingredients.length > 0) {
      await supabase.from('recipe_ingredients').insert(
        previousRecipe.recipe_ingredients.map((item) => ({
          id: item.id,
          recipe_id: recipeId,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          department: item.department,
          sort_order: item.sort_order,
        })),
      );
    }
    throw ingredientError;
  }

  try {
    const [userId, { data: plans, error: planError }] = await Promise.all([
      ensureMealMateSession(),
      supabase
        .from('meal_plans')
        .select('id, household_id, planned_for')
        .eq('recipe_id', recipeId),
    ]);
    if (planError) throw planError;
    const planIds = (plans ?? []).map((plan) => plan.id);
    if (planIds.length === 0) return;

    const { data: previousItems, error: itemLoadError } = await supabase
      .from('shopping_items')
      .select('name, unit, department, is_checked')
      .in('meal_plan_id', planIds);
    if (itemLoadError) throw itemLoadError;
    const previousByProduct = new Map(
      (previousItems ?? []).map((item) => [
        `${item.name.toLocaleLowerCase('nl')}|${item.unit ?? ''}`,
        item,
      ]),
    );

    const { error: shoppingDeleteError } = await supabase
      .from('shopping_items')
      .delete()
      .in('meal_plan_id', planIds);
    if (shoppingDeleteError) throw shoppingDeleteError;

    const { error: shoppingInsertError } = await supabase.from('shopping_items').insert(
      (plans ?? []).flatMap((plan) =>
        input.ingredients.map((ingredient) => {
          const previous = previousByProduct.get(
            `${ingredient.name.toLocaleLowerCase('nl')}|${ingredient.unit}`,
          );
          return {
            household_id: plan.household_id,
            name: ingredient.name,
            quantity: ingredient.amount,
            unit: ingredient.unit,
            department: previous?.department ?? ingredient.department,
            recipe_id: recipeId,
            meal_plan_id: plan.id,
            week_start: getWeekStartForDate(plan.planned_for),
            is_checked: previous?.is_checked ?? false,
            added_by: userId,
          };
        }),
      ),
    );
    if (shoppingInsertError) throw shoppingInsertError;
  } catch (error) {
    if (__DEV__) console.warn('Tably planned shopping refresh failed', error);
  }
}

export async function updateCloudRecipe(
  recipeId: string,
  input: NewRecipe,
  imageChanged: boolean,
): Promise<Recipe> {
  if (!supabase) throw new Error('Supabase is nog niet geconfigureerd.');
  const householdId = await ensureMealMateHousehold();
  const normalizedInput = {
    ...input,
    ingredients: input.ingredients.map(normalizeIngredientQuantity),
  };

  let previousImagePath: string | null = null;
  if (imageChanged) {
    const { data, error } = await supabase
      .from('recipes')
      .select('image_url')
      .eq('id', recipeId)
      .single();
    if (error) throw error;
    previousImagePath = data.image_url;
  }

  const { error } = await supabase.rpc('update_recipe_details', {
    target_recipe_id: recipeId,
    new_title: normalizedInput.title,
    new_description: normalizedInput.subtitle,
    new_duration_minutes: normalizedInput.minutes,
    new_ingredients: normalizedInput.ingredients.map((item, index) => ({
      name: item.name,
      quantity: item.amount,
      unit: item.unit,
      department: item.department,
      sort_order: index,
    })),
  });
  if (error) {
    if (isMissingRecipeUpdateFunction(error)) {
      await updateCloudRecipeWithoutRpc(recipeId, normalizedInput);
    } else {
      throw error;
    }
  }

  if (imageChanged) {
    const localImageUri = imageUri(normalizedInput.image);
    let nextImagePath: string | null = null;
    if (localImageUri) {
      const mimeType = imageType(localImageUri);
      nextImagePath = `${householdId}/${recipeId}/cover.${extension(mimeType)}`;
      const { error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(nextImagePath, await imageData(localImageUri), {
          contentType: mimeType,
          upsert: true,
        });
      if (uploadError) throw uploadError;
    }

    const { error: imageUpdateError } = await supabase
      .from('recipes')
      .update({ image_url: nextImagePath })
      .eq('id', recipeId);
    if (imageUpdateError) throw imageUpdateError;

    if (
      previousImagePath &&
      previousImagePath !== nextImagePath &&
      !/^https?:\/\//i.test(previousImagePath)
    ) {
      await supabase.storage.from('recipe-images').remove([previousImagePath]);
    }
  }

  const updatedRecipe = (await loadCloudRecipes()).find((recipe) => recipe.id === recipeId);
  if (!updatedRecipe) throw new Error('Het aangepaste recept kon niet opnieuw worden geladen.');
  return updatedRecipe;
}

export async function deleteCloudRecipe(recipeId: string) {
  if (!supabase) throw new Error('Supabase is nog niet geconfigureerd.');

  const { data: deletedImagePath, error } = await supabase.rpc('delete_recipe', {
    target_recipe_id: recipeId,
  });
  if (error) throw error;

  if (deletedImagePath && !/^https?:\/\//i.test(deletedImagePath)) {
    const { error: imageError } = await supabase.storage
      .from('recipe-images')
      .remove([deletedImagePath]);
    if (imageError && __DEV__) {
      console.warn('Tably deleted recipe image cleanup failed', imageError);
    }
  }
}

export async function ensureSeedRecipes() {
  if (!supabase) return;
  const [userId, householdId] = await Promise.all([
    ensureMealMateSession(),
    ensureMealMateHousehold(),
  ]);
  const [{ data, error }, { data: deletedSeeds, error: deletedSeedsError }] = await Promise.all([
    supabase
      .from('recipes')
      .select('client_key')
      .eq('household_id', householdId)
      .not('client_key', 'is', null),
    supabase
      .from('household_recipe_seed_deletions')
      .select('client_key')
      .eq('household_id', householdId),
  ]);
  if (error) throw error;
  if (deletedSeedsError) throw deletedSeedsError;

  const existingKeys = new Set([
    ...(data ?? []).map((row) => row.client_key),
    ...(deletedSeeds ?? []).map((row) => row.client_key),
  ]);
  const missingRecipes = [...peasMakerRecipes, ...curatedRecipes].filter(
    (recipe) => recipe.clientKey && !existingKeys.has(recipe.clientKey),
  );
  if (missingRecipes.length === 0) return;

  const { data: createdRecipes, error: recipeError } = await supabase
    .from('recipes')
    .insert(
      missingRecipes.map((recipe) => ({
        household_id: householdId,
        created_by: userId,
        title: recipe.title,
        description: recipe.subtitle,
        duration_minutes: recipe.minutes,
        servings: 2,
        image_url: imageUri(recipe.image),
        source_url: recipe.sourceUrl || null,
        client_key: recipe.clientKey,
      })),
    )
    .select('id, client_key');
  if (recipeError || !createdRecipes) {
    throw recipeError ?? new Error('De vaste recepten konden niet worden toegevoegd.');
  }

  const recipeIdByClientKey = new Map(
    createdRecipes.map((recipe) => [recipe.client_key, recipe.id]),
  );
  const ingredients = missingRecipes.flatMap((recipe) => {
    const recipeId = recipeIdByClientKey.get(recipe.clientKey);
    if (!recipeId) return [];
    return recipe.ingredients.map((ingredient, index) => ({
      recipe_id: recipeId,
      name: ingredient.name,
      quantity: ingredient.amount,
      unit: ingredient.unit,
      department: ingredient.department,
      sort_order: index,
    }));
  });

  try {
    for (let index = 0; index < ingredients.length; index += 300) {
      const { error: ingredientError } = await supabase
        .from('recipe_ingredients')
        .insert(ingredients.slice(index, index + 300));
      if (ingredientError) throw ingredientError;
    }
  } catch (ingredientError) {
    await supabase
      .from('recipes')
      .delete()
      .in(
        'id',
        createdRecipes.map((recipe) => recipe.id),
      );
    throw ingredientError;
  }
}

export async function ensureExampleRecipes() {
  if (!supabase) return;
  const householdId = await ensureMealMateHousehold();
  const { data, error } = await supabase
    .from('recipes')
    .select('client_key')
    .eq('household_id', householdId)
    .not('client_key', 'is', null);
  if (error) throw error;

  const existingKeys = new Set((data ?? []).map((row) => row.client_key));
  for (const recipe of exampleRecipes) {
    if (existingKeys.has(recipe.id)) continue;
    await createCloudRecipe({
      clientKey: recipe.id,
      title: recipe.title,
      subtitle: recipe.subtitle,
      minutes: recipe.minutes,
      image: null,
      ingredients: recipe.ingredients,
    });
  }
}
