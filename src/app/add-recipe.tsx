import { Image } from 'expo-image';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Image as NativeImage,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/mealmate/app-icon';
import { ModalScreenHeader } from '@/components/mealmate/modal-screen-header';
import { palette, radius, spacing } from '@/constants/mealmate-theme';
import type { Ingredient, Recipe } from '@/data/mock-data';
import { parseIngredientLines } from '@/lib/ingredient-parser';
import { mealMateHaptics } from '@/lib/mealmate-haptics';
import { persistRecipeImage } from '@/lib/recipe-image-storage';
import {
  extractRecipeWithAi,
  isRecipeAiConfigured,
  type RecipeAiDraft,
} from '@/lib/recipe-ai';
import { useMealMate } from '@/state/meal-mate-provider';

type InputMode = 'ai' | 'manual';

type SelectedImage = {
  uri: string;
  base64: string | null;
  mimeType: string | null;
};

const formatIngredients = (ingredients: Ingredient[]) =>
  ingredients
    .map((ingredient) => `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`)
    .join('\n');

const existingImageUri = (image: Recipe['image']) => {
  if (!image) return null;
  if (typeof image === 'number') return NativeImage.resolveAssetSource(image)?.uri ?? null;
  if ('uri' in image && typeof image.uri === 'string') return image.uri;
  return null;
};

const isProtectedSocialLink = (value: string) => {
  try {
    const host = new URL(value.trim()).hostname.toLowerCase();
    return ['facebook.com', 'instagram.com', 'tiktok.com'].some(
      (domain) => host === domain || host.endsWith(`.${domain}`),
    );
  } catch {
    return false;
  }
};

const prepareSelectedImage = async (asset: ImagePicker.ImagePickerAsset): Promise<SelectedImage> => {
  const longestSide = Math.max(asset.width, asset.height);
  const scale = longestSide > 1800 ? 1800 / longestSide : 1;
  const context = ImageManipulator.manipulate(asset.uri);

  if (scale < 1) {
    context.resize({
      width: Math.round(asset.width * scale),
      height: Math.round(asset.height * scale),
    });
  }

  const renderedImage = await context.renderAsync();
  const result = await renderedImage.saveAsync({
    base64: true,
    compress: 0.72,
    format: SaveFormat.JPEG,
  });

  if (!result.base64) throw new Error('De foto kon niet worden voorbereid.');
  return { uri: result.uri, base64: result.base64, mimeType: 'image/jpeg' };
};

export default function AddRecipeScreen() {
  const { recipeId } = useLocalSearchParams<{ recipeId?: string }>();
  const router = useRouter();
  const { addRecipe, updateRecipe, removeRecipe, getRecipe } = useMealMate();
  const editingRecipe = getRecipe(typeof recipeId === 'string' ? recipeId : undefined);
  const isEditing = typeof recipeId === 'string';
  const initialImageUri = existingImageUri(editingRecipe?.image ?? null);
  const titleInputRef = useRef<TextInput>(null);
  const [mode, setMode] = useState<InputMode>(isEditing ? 'manual' : 'ai');
  const [title, setTitle] = useState(editingRecipe?.title ?? '');
  const [description, setDescription] = useState(editingRecipe?.subtitle ?? '');
  const [minutes, setMinutes] = useState(String(editingRecipe?.minutes ?? 30));
  const [ingredientText, setIngredientText] = useState(
    editingRecipe ? formatIngredients(editingRecipe.ingredients) : '',
  );
  const [aiIngredients, setAiIngredients] = useState<Ingredient[] | null>(
    editingRecipe?.ingredients ?? null,
  );
  const [sourceText, setSourceText] = useState('');
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    initialImageUri ? { uri: initialImageUri, base64: null, mimeType: null } : null,
  );
  const [imageChanged, setImageChanged] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [wasFilledByAi, setWasFilledByAi] = useState(false);
  const [formVersion, setFormVersion] = useState(0);

  const ingredients = useMemo(
    () => aiIngredients ?? parseIngredientLines(ingredientText),
    [aiIngredients, ingredientText],
  );

  const setManualIngredientText = (value: string) => {
    setIngredientText(value);
    setAiIngredients(null);
  };

  const saveRecipe = async () => {
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      Alert.alert('Naam ontbreekt', 'Geef het gerecht eerst een naam.');
      titleInputRef.current?.focus();
      return;
    }
    if (ingredients.length === 0) {
      Alert.alert(
        'Ingrediënten ontbreken',
        'Voeg minimaal één ingrediënt toe, zodat Tably een boodschappenlijst kan maken.',
      );
      return;
    }

    setIsSaving(true);
    try {
      const imageUri =
        imageChanged && selectedImage ? await persistRecipeImage(selectedImage) : null;
      const parsedMinutes = Number.parseInt(minutes, 10);
      const recipeInput = {
        title: cleanTitle,
        subtitle: description.trim() || 'Zelf toegevoegd aan jullie recepten',
        minutes: Number.isFinite(parsedMinutes) && parsedMinutes > 0 ? parsedMinutes : 30,
        image: imageChanged
          ? imageUri
            ? { uri: imageUri }
            : null
          : editingRecipe?.image ?? null,
        ingredients,
        sourceUrl: editingRecipe?.sourceUrl,
      };
      if (editingRecipe) {
        await updateRecipe(editingRecipe.id, recipeInput, imageChanged);
      } else {
        await addRecipe(recipeInput);
      }
      mealMateHaptics.success();
      router.back();
    } catch {
      mealMateHaptics.error();
      Alert.alert(
        'Gerecht bewaren mislukt',
        'Tably kon het gerecht niet veilig opslaan. Controleer je internetverbinding en probeer het opnieuw.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const deleteRecipe = async () => {
    if (!editingRecipe) return;
    setIsDeleting(true);
    try {
      await removeRecipe(editingRecipe.id);
      mealMateHaptics.destructive();
      router.replace('/recipes');
    } catch {
      mealMateHaptics.error();
      Alert.alert(
        'Gerecht verwijderen mislukt',
        'Het gerecht is niet verwijderd. Controleer je internetverbinding en probeer het opnieuw.',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmRecipeRemoval = () => {
    if (!editingRecipe) return;
    Alert.alert(
      'Gerecht verwijderen?',
      `${editingRecipe.title} wordt definitief verwijderd. Eventuele planningen en bijbehorende boodschappen verdwijnen ook.`,
      [
        { text: 'Annuleer', style: 'cancel' },
        {
          text: 'Verwijder',
          style: 'destructive',
          onPress: () => void deleteRecipe(),
        },
      ],
    );
  };

  const selectImage = async (source: 'camera' | 'library') => {
    try {
      if (source === 'camera') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Camera niet toegestaan', 'Geef Tably toegang tot de camera om een foto te maken.');
          return;
        }
      } else {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Foto’s niet toegestaan', 'Geef Tably toegang tot je fotobibliotheek.');
          return;
        }
      }

      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ['images'],
        allowsEditing: false,
        base64: false,
        quality: 0.9,
        selectionLimit: 1,
      };
      const result =
        source === 'camera'
          ? await ImagePicker.launchCameraAsync(options)
          : await ImagePicker.launchImageLibraryAsync(options);

      if (result.canceled || !result.assets[0]) return;
      setSelectedImage(await prepareSelectedImage(result.assets[0]));
      setImageChanged(true);
    } catch {
      Alert.alert('Foto toevoegen mislukt', 'Probeer het nog een keer.');
    }
  };

  const applyAiDraft = (draft: RecipeAiDraft) => {
    setTitle(draft.title);
    setDescription(draft.subtitle);
    setMinutes(String(draft.minutes));
    setIngredientText(formatIngredients(draft.ingredients));
    setAiIngredients(draft.ingredients);
    setWasFilledByAi(true);
    setFormVersion((current) => current + 1);
    setMode('manual');
  };

  const fillWithAi = async () => {
    if (!sourceText.trim() && !selectedImage?.base64) {
      Alert.alert('Nog geen bron', 'Plak recepttekst, voer een link in of kies een duidelijke foto.');
      return;
    }

    if (isProtectedSocialLink(sourceText) && !selectedImage?.base64) {
      Alert.alert(
        'Deze link schermt het recept af',
        'Facebook, Instagram en TikTok laten Tably de inhoud meestal niet lezen. Voeg een screenshot toe of plak de tekst van het bericht.',
      );
      return;
    }

    setIsExtracting(true);
    try {
      const draft = await extractRecipeWithAi({
        text: sourceText.trim() || undefined,
        imageBase64: selectedImage?.base64,
        imageMimeType: selectedImage?.mimeType,
      });
      applyAiDraft(draft);
      mealMateHaptics.success();
    } catch (error) {
      mealMateHaptics.error();
      Alert.alert(
        'AI kon het recept niet invullen',
        error instanceof Error ? error.message : 'Probeer het nog een keer.',
      );
    } finally {
      setIsExtracting(false);
    }
  };

  if (isEditing && !editingRecipe) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ModalScreenHeader title="Gerecht aanpassen" closeLabel="Sluit gerecht aanpassen" />
        <Text style={styles.notFound}>Dit gerecht kon niet worden gevonden.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ModalScreenHeader
        title={isEditing ? 'Gerecht aanpassen' : 'Gerecht toevoegen'}
        closeLabel={isEditing ? 'Sluit gerecht aanpassen' : 'Sluit gerecht toevoegen'}
      />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={88}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text style={styles.eyebrow}>
            {isEditing ? 'RECEPT AANPASSEN' : 'NIEUW IN JULLIE COLLECTIE'}
          </Text>
          <Text style={styles.title}>
            {isEditing ? 'Pas het gerecht aan' : 'Voeg een gerecht toe'}
          </Text>
          <Text style={styles.subtitle}>
            {isEditing
              ? 'Wijzig de naam, foto, bereidingstijd of ingrediënten en bewaar je aanpassingen.'
              : 'Laat AI het recept invullen of voer het zelf in. Je controleert altijd eerst het resultaat.'}
          </Text>

          <View style={styles.modeSwitch}>
            <ModeButton label="Met AI" mode="ai" selectedMode={mode} onPress={setMode} />
            <ModeButton label="Zelf invullen" mode="manual" selectedMode={mode} onPress={setMode} />
          </View>

          {mode === 'ai' ? (
            <AiImportPanel
              sourceText={sourceText}
              onChangeSourceText={setSourceText}
              selectedImage={selectedImage}
              onCamera={() => void selectImage('camera')}
              onLibrary={() => void selectImage('library')}
              onRemoveImage={() => {
                setSelectedImage(null);
                setImageChanged(true);
              }}
              onExtract={() => void fillWithAi()}
              isExtracting={isExtracting}
            />
          ) : (
            <View key={formVersion}>
              {wasFilledByAi ? (
                <View style={styles.aiSuccessCard}>
                  <AppIcon
                    name={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }}
                    tintColor={palette.sageDark}
                    fallback="✦"
                  />
                  <View style={styles.aiSuccessCopy}>
                    <Text style={styles.aiSuccessTitle}>Ingevuld door AI</Text>
                    <Text style={styles.aiSuccessText}>Controleer hoeveelheden en afdelingen voor je bewaart.</Text>
                  </View>
                </View>
              ) : null}

              <PhotoPicker
                image={selectedImage}
                onCamera={() => void selectImage('camera')}
                onLibrary={() => void selectImage('library')}
                onRemove={() => {
                  setSelectedImage(null);
                  setImageChanged(true);
                }}
                title="Foto van het gerecht"
                subtitle="Deze foto verschijnt straks bij het recept."
              />

              <View style={styles.formSection}>
                <Text style={styles.label}>Naam van het gerecht</Text>
                <TextInput
                  ref={titleInputRef}
                  defaultValue={title}
                  onChangeText={setTitle}
                  placeholder="Bijvoorbeeld: lasagne met spinazie"
                  placeholderTextColor={palette.textSoft}
                  returnKeyType="next"
                  style={styles.input}
                  accessibilityLabel="Naam van het gerecht"
                />

                <Text style={styles.label}>Korte omschrijving</Text>
                <TextInput
                  defaultValue={description}
                  onChangeText={setDescription}
                  placeholder="Waarom willen jullie dit onthouden?"
                  placeholderTextColor={palette.textSoft}
                  multiline
                  style={[styles.input, styles.descriptionInput]}
                  accessibilityLabel="Korte omschrijving"
                />

                <Text style={styles.label}>Bereidingstijd</Text>
                <View style={styles.timeRow}>
                  <TextInput
                    defaultValue={minutes}
                    onChangeText={setMinutes}
                    keyboardType="number-pad"
                    maxLength={3}
                    style={[styles.input, styles.timeInput]}
                    accessibilityLabel="Bereidingstijd in minuten"
                  />
                  <Text style={styles.timeUnit}>minuten</Text>
                </View>
              </View>

              <View style={styles.ingredientsHeading}>
                <View style={styles.ingredientsTitleRow}>
                  <Text style={styles.sectionTitle}>Ingrediënten</Text>
                  {ingredients.length > 0 ? (
                    <Text style={styles.countPill}>{ingredients.length}</Text>
                  ) : null}
                </View>
                <Text style={styles.hint}>
                  Eén per regel, bijvoorbeeld `300 g penne` of `2 paprika&apos;s`.
                </Text>
              </View>

              <TextInput
                defaultValue={ingredientText}
                onChangeText={setManualIngredientText}
                placeholder={'300 g penne\n2 paprika\'s\n1 pot tomatensaus\n150 g geraspte kaas'}
                placeholderTextColor={palette.textSoft}
                multiline
                textAlignVertical="top"
                autoCapitalize="sentences"
                style={[styles.input, styles.ingredientsInput]}
                accessibilityLabel="Ingrediënten, één per regel"
              />

              {ingredients.length > 0 ? <IngredientPreview ingredients={ingredients} /> : null}

            </View>
          )}
        </ScrollView>
        {mode === 'manual' ? (
          <View style={styles.stickyFooter}>
            {isEditing ? (
              <Pressable
                onPress={confirmRecipeRemoval}
                disabled={isSaving || isDeleting}
                accessibilityRole="button"
                accessibilityLabel={`Verwijder ${editingRecipe?.title ?? 'dit gerecht'}`}
                accessibilityState={{ disabled: isSaving || isDeleting }}
                style={({ pressed }) => [
                  styles.deleteButton,
                  (isSaving || isDeleting) && styles.disabledButton,
                  pressed && styles.pressed,
                ]}>
                {isDeleting ? (
                  <ActivityIndicator color={palette.danger} size="small" />
                ) : (
                  <AppIcon
                    name={{ ios: 'trash', android: 'delete_outline', web: 'delete_outline' }}
                    tintColor={palette.danger}
                    size={20}
                  />
                )}
              </Pressable>
            ) : null}
            <Pressable
              onPress={() => void saveRecipe()}
              disabled={isSaving || isDeleting}
              accessibilityRole="button"
              accessibilityState={{ disabled: isSaving || isDeleting }}
              style={({ pressed }) => [
                styles.saveButton,
                (isSaving || isDeleting) && styles.disabledButton,
                pressed && styles.pressed,
              ]}>
              {isSaving ? (
                <ActivityIndicator color={palette.white} />
              ) : (
                <Text style={styles.saveButtonText}>
                  {isEditing ? 'Wijzigingen bewaren' : 'Gerecht bewaren'}
                </Text>
              )}
            </Pressable>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ModeButton({
  label,
  mode,
  selectedMode,
  onPress,
}: {
  label: string;
  mode: InputMode;
  selectedMode: InputMode;
  onPress: (mode: InputMode) => void;
}) {
  const selected = mode === selectedMode;
  return (
    <Pressable
      onPress={() => onPress(mode)}
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      style={[styles.modeButton, selected && styles.modeButtonSelected]}>
      <Text style={[styles.modeLabel, selected && styles.modeLabelSelected]}>{label}</Text>
    </Pressable>
  );
}

function AiImportPanel({
  sourceText,
  onChangeSourceText,
  selectedImage,
  onCamera,
  onLibrary,
  onRemoveImage,
  onExtract,
  isExtracting,
}: {
  sourceText: string;
  onChangeSourceText: (value: string) => void;
  selectedImage: SelectedImage | null;
  onCamera: () => void;
  onLibrary: () => void;
  onRemoveImage: () => void;
  onExtract: () => void;
  isExtracting: boolean;
}) {
  return (
    <View style={styles.aiPanel}>
      <View style={styles.aiIntroCard}>
        <View style={styles.sparkleIcon}>
          <AppIcon
            name={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }}
            tintColor={palette.sageDark}
            fallback="✦"
          />
        </View>
        <View style={styles.aiIntroCopy}>
          <Text style={styles.aiIntroTitle}>AI doet het denkwerk</Text>
          <Text style={styles.aiIntroText}>Plak tekst of een receptlink, fotografeer een recept of combineer beide.</Text>
        </View>
      </View>

      {!isRecipeAiConfigured ? (
        <View style={styles.setupNotice}>
          <Text style={styles.setupTitle}>AI-koppeling staat klaar</Text>
          <Text style={styles.setupText}>Voor live gebruik zijn alleen nog de Supabase- en OpenAI-sleutels nodig.</Text>
        </View>
      ) : null}

      <Text style={styles.label}>Recepttekst of link</Text>
      <TextInput
        defaultValue={sourceText}
        onChangeText={onChangeSourceText}
        placeholder="Plak hier een recept, ingrediëntenlijst of https://..."
        placeholderTextColor={palette.textSoft}
        multiline
        textAlignVertical="top"
        autoCapitalize="sentences"
        style={[styles.input, styles.sourceInput]}
        accessibilityLabel="Recepttekst of link voor AI"
      />

      <PhotoPicker
        image={selectedImage}
        onCamera={onCamera}
        onLibrary={onLibrary}
        onRemove={onRemoveImage}
        title="Foto laten uitlezen"
        subtitle="Gebruik een screenshot, kookboekpagina of foto van het gerecht."
      />

      <Pressable
        onPress={onExtract}
        disabled={isExtracting}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.aiButton,
          isExtracting && styles.disabledButton,
          pressed && styles.pressed,
        ]}>
        {isExtracting ? (
          <ActivityIndicator color={palette.white} />
        ) : (
          <>
            <AppIcon
              name={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }}
              tintColor={palette.white}
              fallback="✦"
              size={18}
            />
            <Text style={styles.aiButtonText}>Laat AI het recept invullen</Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

function PhotoPicker({
  image,
  onCamera,
  onLibrary,
  onRemove,
  title,
  subtitle,
}: {
  image: SelectedImage | null;
  onCamera: () => void;
  onLibrary: () => void;
  onRemove: () => void;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.photoSection}>
      <Text style={styles.label}>{title}</Text>
      <Text style={styles.photoSubtitle}>{subtitle}</Text>
      {image ? (
        <View style={styles.imagePreviewCard}>
          <Image source={{ uri: image.uri }} style={styles.imagePreview} contentFit="cover" />
          <View style={styles.imageActions}>
            <Pressable onPress={onLibrary} accessibilityRole="button" style={styles.smallAction}>
              <Text style={styles.smallActionText}>Wijzig</Text>
            </Pressable>
            <Pressable onPress={onRemove} accessibilityRole="button" style={styles.smallAction}>
              <Text style={styles.removeText}>Verwijder</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.photoActions}>
          <Pressable onPress={onCamera} accessibilityRole="button" style={styles.photoButton}>
            <AppIcon
              name={{ ios: 'camera', android: 'photo_camera', web: 'photo_camera' }}
              tintColor={palette.sageDark}
            />
            <Text style={styles.photoButtonText}>Camera</Text>
          </Pressable>
          <Pressable onPress={onLibrary} accessibilityRole="button" style={styles.photoButton}>
            <AppIcon
              name={{ ios: 'photo.on.rectangle', android: 'photo_library', web: 'photo_library' }}
              tintColor={palette.sageDark}
            />
            <Text style={styles.photoButtonText}>Fotobibliotheek</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function IngredientPreview({ ingredients }: { ingredients: Ingredient[] }) {
  return (
    <View style={styles.previewCard}>
      <View style={styles.previewHeader}>
        <AppIcon
          name={{ ios: 'checkmark.circle', android: 'check_circle', web: 'check_circle' }}
          tintColor={palette.sageDark}
          size={18}
        />
        <Text style={styles.previewTitle}>Klaar voor de boodschappenlijst</Text>
      </View>
      {ingredients.map((ingredient, index) => (
        <View
          key={ingredient.id}
          style={[styles.previewRow, index > 0 && styles.previewDivider]}>
          <View style={styles.previewCopy}>
            <Text style={styles.ingredientName}>{ingredient.name}</Text>
            <Text style={styles.department}>{ingredient.department}</Text>
          </View>
          <Text style={styles.amount}>{ingredient.amount} {ingredient.unit}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  keyboardView: { flex: 1 },
  scrollView: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: spacing.xl },
  eyebrow: { color: palette.sage, fontSize: 11, fontWeight: '800', letterSpacing: 1.1 },
  title: { color: palette.text, fontSize: 28, fontWeight: '700', letterSpacing: -0.7, marginTop: 6 },
  subtitle: { color: palette.textMuted, fontSize: 15, lineHeight: 20, marginTop: 6 },
  modeSwitch: { backgroundColor: palette.surfaceStrong, borderRadius: radius.pill, flexDirection: 'row', marginTop: spacing.xl, padding: 4 },
  modeButton: { alignItems: 'center', borderRadius: radius.pill, flex: 1, paddingVertical: 11 },
  modeButtonSelected: { backgroundColor: palette.surface },
  modeLabel: { color: palette.textMuted, fontSize: 13, fontWeight: '700' },
  modeLabelSelected: { color: palette.sageDark },
  aiPanel: { marginTop: spacing.xl },
  aiIntroCard: { alignItems: 'center', backgroundColor: palette.sageSoft, borderRadius: radius.lg, flexDirection: 'row', padding: spacing.md },
  sparkleIcon: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.65)', borderRadius: radius.md, height: 42, justifyContent: 'center', width: 42 },
  aiIntroCopy: { flex: 1, marginLeft: spacing.md },
  aiIntroTitle: { color: palette.text, fontSize: 15, fontWeight: '800' },
  aiIntroText: { color: palette.textMuted, fontSize: 12, lineHeight: 17, marginTop: 4 },
  setupNotice: { borderColor: palette.border, borderRadius: radius.md, borderWidth: 1, marginTop: spacing.lg, padding: spacing.md },
  setupTitle: { color: palette.text, fontSize: 13, fontWeight: '700' },
  setupText: { color: palette.textMuted, fontSize: 11, lineHeight: 16, marginTop: 4 },
  formSection: { gap: spacing.sm, marginTop: spacing.xl },
  label: { color: palette.text, fontSize: 13, fontWeight: '700', marginTop: spacing.md },
  input: { backgroundColor: palette.surface, borderColor: palette.border, borderRadius: radius.md, borderWidth: 1, color: palette.text, fontSize: 16, minHeight: 52, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  sourceInput: { minHeight: 104 },
  descriptionInput: { minHeight: 76 },
  timeRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  timeInput: { textAlign: 'center', width: 88 },
  timeUnit: { color: palette.textMuted, fontSize: 14 },
  photoSection: { marginTop: spacing.sm },
  photoSubtitle: { color: palette.textMuted, fontSize: 11, lineHeight: 16, marginTop: 5 },
  photoActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  photoButton: { alignItems: 'center', backgroundColor: palette.surface, borderColor: palette.border, borderRadius: radius.md, borderWidth: 1, flex: 1, flexDirection: 'row', gap: spacing.sm, justifyContent: 'center', minHeight: 54, paddingHorizontal: spacing.sm },
  photoButtonText: { color: palette.sageDark, fontSize: 12, fontWeight: '700' },
  imagePreviewCard: { backgroundColor: palette.surface, borderRadius: radius.lg, marginTop: spacing.md, overflow: 'hidden' },
  imagePreview: { height: 160, width: '100%' },
  imageActions: { flexDirection: 'row', justifyContent: 'flex-end', padding: spacing.sm },
  smallAction: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  smallActionText: { color: palette.sageDark, fontSize: 12, fontWeight: '700' },
  removeText: { color: palette.danger, fontSize: 12, fontWeight: '700' },
  aiButton: { alignItems: 'center', backgroundColor: palette.sageDark, borderRadius: radius.pill, flexDirection: 'row', gap: spacing.sm, justifyContent: 'center', marginTop: spacing.xl, minHeight: 54, paddingHorizontal: spacing.xl },
  aiButtonText: { color: palette.white, fontSize: 14, fontWeight: '700' },
  disabledButton: { opacity: 0.65 },
  aiSuccessCard: { alignItems: 'center', backgroundColor: palette.sageSoft, borderRadius: radius.lg, flexDirection: 'row', marginTop: spacing.xl, padding: spacing.md },
  aiSuccessCopy: { flex: 1, marginLeft: spacing.md },
  aiSuccessTitle: { color: palette.text, fontSize: 14, fontWeight: '800' },
  aiSuccessText: { color: palette.textMuted, fontSize: 11, lineHeight: 16, marginTop: 4 },
  ingredientsHeading: { marginBottom: spacing.md, marginTop: spacing.xl },
  ingredientsTitleRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  sectionTitle: { color: palette.text, fontSize: 19, fontWeight: '700' },
  countPill: { backgroundColor: palette.sageSoft, borderRadius: radius.pill, color: palette.sageDark, fontSize: 12, fontWeight: '800', overflow: 'hidden', paddingHorizontal: 8, paddingVertical: 3 },
  hint: { color: palette.textMuted, fontSize: 12, lineHeight: 18, marginTop: spacing.sm },
  ingredientsInput: { minHeight: 136 },
  previewCard: { backgroundColor: palette.sageSoft, borderRadius: radius.lg, marginTop: spacing.md, padding: spacing.md },
  previewHeader: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  previewTitle: { color: palette.sageDark, fontSize: 13, fontWeight: '800' },
  previewRow: { alignItems: 'center', flexDirection: 'row', minHeight: 48 },
  previewDivider: { borderTopColor: 'rgba(194,65,12,0.14)', borderTopWidth: 1 },
  previewCopy: { flex: 1 },
  ingredientName: { color: palette.text, fontSize: 14, fontWeight: '600' },
  department: { color: palette.textMuted, fontSize: 11, marginTop: 4 },
  amount: { color: palette.sageDark, fontSize: 12, fontWeight: '700' },
  stickyFooter: {
    alignItems: 'center',
    backgroundColor: palette.background,
    borderTopColor: palette.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  deleteButton: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.danger,
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  saveButton: { alignItems: 'center', backgroundColor: palette.sageDark, borderRadius: radius.pill, flex: 1, minHeight: 54, justifyContent: 'center', paddingVertical: 16 },
  saveButtonText: { color: palette.white, fontSize: 15, fontWeight: '700' },
  pressed: { opacity: 0.72 },
  notFound: { color: palette.text, fontSize: 16, padding: spacing.xl },
});
