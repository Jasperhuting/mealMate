import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { widgetsDirectory } from 'expo-widgets';
import { Platform } from 'react-native';

import type { Recipe } from '@/data/mock-data';
import { dateToIso } from '@/data/mock-data';
import HomeMealPlanWidget, {
  type MealPlanWidgetProps,
} from '../../widgets/HomeMealPlanWidget';
import LockScreenMealPlanWidget from '../../widgets/LockScreenMealPlanWidget';

type PlannedMeals = Record<string, string | undefined>;
type WidgetRecipe = Pick<Recipe, 'id' | 'title'> & { widgetImageUri?: string };

const emptyMealTitle = 'Nog niets gepland';
const timelineDays = 8;
const widgetImageMaxDimension = 400;
const cachedWidgetImages = new Map<string, { sourceKey: string; uri: string }>();
let widgetUpdateQueue = Promise.resolve();

const addDays = (date: Date, amount: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
};

const mealTitleForDate = (
  date: Date,
  plannedMeals: PlannedMeals,
  titlesById: Map<string, string>,
) => {
  const recipeId = plannedMeals[dateToIso(date)];
  return recipeId ? titlesById.get(recipeId) ?? emptyMealTitle : emptyMealTitle;
};

const mealImageForDate = (
  date: Date,
  plannedMeals: PlannedMeals,
  imagesById: Map<string, string | undefined>,
) => {
  const recipeId = plannedMeals[dateToIso(date)];
  return recipeId ? imagesById.get(recipeId) : undefined;
};

export const createMealPlanWidgetProps = (
  date: Date,
  plannedMeals: PlannedMeals,
  recipes: WidgetRecipe[],
): MealPlanWidgetProps => {
  const titlesById = new Map(recipes.map((recipe) => [recipe.id, recipe.title]));
  const imagesById = new Map(recipes.map((recipe) => [recipe.id, recipe.widgetImageUri]));
  const isAfterEight = date.getHours() >= 20;
  const primaryDate = addDays(date, isAfterEight ? 1 : 0);
  const secondaryDate = addDays(primaryDate, 1);

  return {
    primaryLabel: isAfterEight ? 'Morgen' : 'Vandaag',
    primaryTitle: mealTitleForDate(primaryDate, plannedMeals, titlesById),
    primaryImageUri: mealImageForDate(primaryDate, plannedMeals, imagesById),
    secondaryLabel: isAfterEight ? 'Overmorgen' : 'Morgen',
    secondaryTitle: mealTitleForDate(secondaryDate, plannedMeals, titlesById),
    secondaryImageUri: mealImageForDate(secondaryDate, plannedMeals, imagesById),
  };
};

const safeFileName = (value: string) => value.replace(/[^a-z0-9]+/gi, '-').toLowerCase();

const extensionForUri = (uri: string, fallback = 'jpg') => {
  const match = uri.split('?')[0].match(/\.([a-z0-9]{2,5})$/i);
  const extension = match?.[1]?.toLowerCase();
  return extension && ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'].includes(extension)
    ? extension
    : fallback;
};

const copyRecipeImageToWidgetStorage = async (recipe: Recipe) => {
  if (!recipe.image || !widgetsDirectory) return undefined;

  let sourceUri: string | undefined;
  let extension = 'jpg';

  if (typeof recipe.image === 'number') {
    const asset = await Asset.fromModule(recipe.image).downloadAsync();
    sourceUri = asset.localUri ?? asset.uri;
    extension = asset.type || extensionForUri(sourceUri, extension);
  } else if ('uri' in recipe.image && recipe.image.uri) {
    sourceUri = recipe.image.uri;
    extension = extensionForUri(sourceUri, extension);
  }

  if (!sourceUri) return undefined;
  const sourceKey = `compact-v1:${sourceUri}`;
  const cached = cachedWidgetImages.get(recipe.id);
  if (cached?.sourceKey === sourceKey && new File(cached.uri).exists) return cached.uri;

  const destination = new File(
    widgetsDirectory,
    `meal-${safeFileName(recipe.id)}-compact.jpg`,
  );

  if (/^https?:\/\//i.test(sourceUri)) {
    await File.downloadFileAsync(sourceUri, destination, { idempotent: true });
  } else if (sourceUri.startsWith('data:')) {
    const response = await fetch(sourceUri);
    destination.write(new Uint8Array(await response.arrayBuffer()));
  } else {
    if (destination.exists) destination.delete();
    await new File(sourceUri).copy(destination);
  }

  // WidgetKit archiveert de bronafbeelding, niet alleen het kleine SwiftUI-frame.
  // Vooral lockscreen-widgets worden volledig geweigerd wanneer die bron te groot is.
  const sourceImage = await ImageManipulator.manipulate(destination.uri).renderAsync();
  const longestSide = Math.max(sourceImage.width, sourceImage.height);

  if (longestSide > widgetImageMaxDimension || extension !== 'jpg') {
    const context = ImageManipulator.manipulate(destination.uri);
    if (sourceImage.width >= sourceImage.height) {
      context.resize({ width: widgetImageMaxDimension, height: null });
    } else {
      context.resize({ width: null, height: widgetImageMaxDimension });
    }
    const resizedImage = await context.renderAsync();
    const resizedFile = await resizedImage.saveAsync({
      compress: 0.86,
      format: SaveFormat.JPEG,
    });
    destination.delete();
    await new File(resizedFile.uri).copy(destination);
  }

  cachedWidgetImages.set(recipe.id, { sourceKey, uri: destination.uri });
  return destination.uri;
};

const prepareWidgetRecipes = async (plannedMeals: PlannedMeals, recipes: Recipe[]) => {
  const plannedRecipeIds = new Set(Object.values(plannedMeals).filter(Boolean));

  return Promise.all(
    recipes.map(async (recipe): Promise<WidgetRecipe> => {
      if (!plannedRecipeIds.has(recipe.id)) return recipe;
      try {
        return {
          ...recipe,
          widgetImageUri: await copyRecipeImageToWidgetStorage(recipe),
        };
      } catch (error) {
        if (__DEV__) console.warn(`Tably widget image failed for ${recipe.title}`, error);
        return recipe;
      }
    }),
  );
};

const createTimelineDates = (now: Date) => {
  const dates = [now];

  for (let offset = 0; offset < timelineDays; offset += 1) {
    const day = addDays(now, offset);
    const eightPm = new Date(day);
    eightPm.setHours(20, 0, 0, 0);
    if (eightPm > now) dates.push(eightPm);

    const midnight = addDays(day, 1);
    midnight.setHours(0, 0, 0, 0);
    if (midnight > now) dates.push(midnight);
  }

  return dates.sort((left, right) => left.getTime() - right.getTime());
};

async function performMealPlanWidgetUpdate(
  plannedMeals: PlannedMeals,
  recipes: Recipe[],
  now = new Date(),
) {
  const timelineDates = createTimelineDates(now);
  const recipesWithoutImages = recipes.map(({ id, title }) => ({ id, title }));
  const textEntries = timelineDates.map((date) => ({
    date,
    props: createMealPlanWidgetProps(date, plannedMeals, recipesWithoutImages),
  }));

  // Toon de planning direct. Het voorbereiden van externe afbeeldingen kan langer duren
  // en mag de titel op het toegangsscherm niet tegenhouden.
  LockScreenMealPlanWidget.updateTimeline(textEntries);
  HomeMealPlanWidget.updateTimeline(textEntries);

  const widgetRecipes = await prepareWidgetRecipes(plannedMeals, recipes);
  const imageEntries = timelineDates.map((date) => ({
    date,
    props: createMealPlanWidgetProps(date, plannedMeals, widgetRecipes),
  }));

  // Werk daarna dezelfde tijdlijn bij met afbeeldingen die vanuit de widget leesbaar zijn.
  LockScreenMealPlanWidget.updateTimeline(imageEntries);
  HomeMealPlanWidget.updateTimeline(imageEntries);
}

export function updateMealPlanWidgets(
  plannedMeals: PlannedMeals,
  recipes: Recipe[],
  now = new Date(),
) {
  if (Platform.OS !== 'ios') return Promise.resolve();

  const update = widgetUpdateQueue
    .catch(() => undefined)
    .then(() => performMealPlanWidgetUpdate(plannedMeals, recipes, now));

  // Een mislukte update mag latere wijzigingen in de planning niet blokkeren.
  widgetUpdateQueue = update.catch(() => undefined);
  return update;
}

export function clearMealPlanWidgets() {
  return updateMealPlanWidgets({}, [], new Date());
}
