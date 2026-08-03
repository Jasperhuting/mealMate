import { File } from 'expo-file-system';

import { normalizeDepartment, recipes as exampleRecipes, type Recipe } from '@/data/mock-data';
import { ensureMealMateHousehold, ensureMealMateSession } from '@/lib/mealmate-session';
import { supabase } from '@/lib/supabase';

type NewRecipe = Omit<Recipe, 'id'>;
type CloudRecipeInput = NewRecipe & { clientKey?: string };

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
    .select('id, client_key, title, description, duration_minutes, image_url, recipe_ingredients(id, name, quantity, unit, department, sort_order)')
    .order('created_at', { ascending: true });
  if (error) throw error;

  return Promise.all(
    (data ?? []).map(async (row) => {
      const bundledRecipe = exampleRecipes.find((recipe) => recipe.id === row.client_key);
      let signedImageUrl: string | null = null;
      if (row.image_url) {
        const { data: signed } = await client.storage
          .from('recipe-images')
          .createSignedUrl(row.image_url, 60 * 60 * 24 * 7);
        signedImageUrl = signed?.signedUrl ?? null;
      }

      return {
        id: row.id,
        clientKey: row.client_key || undefined,
        title: row.title,
        subtitle: row.description || 'Opgeslagen in jullie MealMate-collectie',
        minutes: row.duration_minutes || 30,
        image: signedImageUrl ? { uri: signedImageUrl } : bundledRecipe?.image ?? null,
        ingredients: [...(row.recipe_ingredients ?? [])]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((item) => ({
            id: item.id,
            name: item.name,
            amount: Number(item.quantity ?? 0),
            unit: item.unit || '',
            department: normalizeDepartment(item.department),
          })),
      };
    }),
  );
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
    })
    .select('id')
    .single();
  if (recipeError || !recipe) throw recipeError ?? new Error('Het recept kon niet worden bewaard.');

  const { error: ingredientError } = await supabase.from('recipe_ingredients').insert(
    input.ingredients.map((item, index) => ({
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

  return { ...input, id: recipe.id };
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
        .select('id, household_id')
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
            is_checked: previous?.is_checked ?? false,
            added_by: userId,
          };
        }),
      ),
    );
    if (shoppingInsertError) throw shoppingInsertError;
  } catch (error) {
    if (__DEV__) console.warn('MealMate planned shopping refresh failed', error);
  }
}

export async function updateCloudRecipe(
  recipeId: string,
  input: NewRecipe,
  imageChanged: boolean,
): Promise<Recipe> {
  if (!supabase) throw new Error('Supabase is nog niet geconfigureerd.');
  const householdId = await ensureMealMateHousehold();

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
    new_title: input.title,
    new_description: input.subtitle,
    new_duration_minutes: input.minutes,
    new_ingredients: input.ingredients.map((item, index) => ({
      name: item.name,
      quantity: item.amount,
      unit: item.unit,
      department: item.department,
      sort_order: index,
    })),
  });
  if (error) {
    if (isMissingRecipeUpdateFunction(error)) {
      await updateCloudRecipeWithoutRpc(recipeId, input);
    } else {
      throw error;
    }
  }

  if (imageChanged) {
    const localImageUri = imageUri(input.image);
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

    if (previousImagePath && previousImagePath !== nextImagePath) {
      await supabase.storage.from('recipe-images').remove([previousImagePath]);
    }
  }

  const updatedRecipe = (await loadCloudRecipes()).find((recipe) => recipe.id === recipeId);
  if (!updatedRecipe) throw new Error('Het aangepaste recept kon niet opnieuw worden geladen.');
  return updatedRecipe;
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
