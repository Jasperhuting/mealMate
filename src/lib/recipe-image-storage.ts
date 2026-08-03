import { Directory, File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

type RecipeImageInput = {
  uri: string;
  base64: string | null;
  mimeType: string | null;
};

const extensionForMimeType = (mimeType: string | null) => {
  if (mimeType === 'image/png') return '.png';
  if (mimeType === 'image/webp') return '.webp';
  if (mimeType === 'image/heic' || mimeType === 'image/heif') return '.heic';
  return '.jpg';
};

export async function persistRecipeImage(image: RecipeImageInput) {
  if (Platform.OS === 'web') {
    return image.base64
      ? `data:${image.mimeType || 'image/jpeg'};base64,${image.base64}`
      : image.uri;
  }

  const imageDirectory = new Directory(Paths.document, 'recipe-images');
  imageDirectory.create({ idempotent: true, intermediates: true });

  const destination = new File(
    imageDirectory,
    `recipe-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extensionForMimeType(image.mimeType)}`,
  );
  await new File(image.uri).copy(destination);
  return destination.uri;
}
