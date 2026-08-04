import { mkdir, writeFile } from 'node:fs/promises';

const overviewUrl = 'https://www.peasmaker.nl/pages/recepten';
const jinaUrl = (url) => `https://r.jina.ai/http://${new URL(url).host}${new URL(url).pathname}`;
const imageDirectory = new URL('../assets/images/peas-maker/', import.meta.url);

const cleanMarkdown = (value) =>
  value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s*\(/g, ' (')
    .replace(/\s+/g, ' ')
    .trim();

const fractionValues = {
  '¼': 0.25,
  '½': 0.5,
  '¾': 0.75,
  '⅓': 1 / 3,
  '⅔': 2 / 3,
  '⅛': 0.125,
  '⅜': 0.375,
  '⅝': 0.625,
  '⅞': 0.875,
};

const numberValue = (value) => {
  const normalized = value.replace(',', '.').trim();
  if (fractionValues[normalized] !== undefined) return fractionValues[normalized];
  const mixed = normalized.match(/^(\d+)\s*([\u00bc\u00bd\u00be\u2153\u2154\u215b\u215c\u215d\u215e])$/);
  if (mixed) return Number(mixed[1]) + fractionValues[mixed[2]];
  const range = normalized.match(/^(\d+(?:\.\d+)?)[-\u2013](\d+(?:\.\d+)?)$/);
  if (range) return Number(range[1]);
  return Number(normalized);
};

const unitAliases = new Map([
  ['g', 'g'],
  ['gram', 'g'],
  ['kg', 'kg'],
  ['ml', 'ml'],
  ['cl', 'cl'],
  ['dl', 'dl'],
  ['l', 'l'],
  ['liter', 'l'],
  ['el', 'el'],
  ['eetlepel', 'el'],
  ['eetlepels', 'el'],
  ['tl', 'tl'],
  ['theelepel', 'tl'],
  ['theelepels', 'tl'],
  ['teentje', 'teen'],
  ['teentjes', 'tenen'],
  ['stuk', 'stuk'],
  ['stuks', 'stuks'],
  ['blik', 'blik'],
  ['blikken', 'blikken'],
  ['pot', 'pot'],
  ['pakken', 'pakken'],
  ['pak', 'pak'],
  ['pakje', 'pakje'],
  ['pakjes', 'pakjes'],
  ['zakje', 'zakje'],
  ['zakjes', 'zakjes'],
  ['blikje', 'blikje'],
  ['blikjes', 'blikjes'],
  ['handje', 'handje'],
  ['handjes', 'handjes'],
  ['plak', 'plak'],
  ['plakken', 'plakken'],
  ['vel', 'vel'],
  ['vellen', 'vellen'],
]);

const departmentFor = (name) => {
  const text = name.toLocaleLowerCase('nl');
  if (/peas maker|tofu|tempeh|vegan (kip|gehakt|kaas|mayonaise)|plantaardige (kip|stukjes|yoghurt|room|melk|boter)|kokosyoghurt|sojayoghurt|havermelk/.test(text))
    return 'Vega en plantaardig';
  if (/ui|knoflook|peper|paprika|tomaat|wortel|broccoli|kool|courgette|aubergine|aardappel|champignon|paddenstoel|komkommer|sla|avocado|citroen|limoen|gember|koriander|peterselie|munt|basilicum|bosui|prei|sperzie|doperwt|maïs|appel|mango|ananas|spinazie|taugé|paksoi|biet|knolselderij/.test(text))
    return 'Aardappelen, groente en fruit';
  if (/brood|naan|wrap|tortilla|pita|stokbrood|bolletje|bapao|bladerdeeg|filodeeg/.test(text))
    return 'Brood en gebak';
  if (/noten|cashew|pinda|amandel|rozijn|dadels|kokosrasp/.test(text))
    return 'Ontbijt, broodbeleg en bakproducten';
  if (/kokosmelk|kokosroom/.test(text))
    return 'Wereldkeukens, kruiden, pasta en rijst';
  if (/kaas|yoghurt|melk|room|boter|ei\b|eieren/.test(text))
    return 'Zuivel, boter en eieren';
  if (/diepvries|bevroren/.test(text)) return 'Diepvries';
  if (/rijst|pasta|orzo|noedel|mie\b|bloem|maïzena|paneermeel|couscous|quinoa|kruiden|poeder|zaad|komijn|kerrie|kurkuma|kaneel|nootmuskaat|oregano|tijm|rozemarijn|laurier|sumak|garam|masala|chilivlok|saffraan/.test(text))
    return 'Wereldkeukens, kruiden, pasta en rijst';
  if (/olie|azijn|saus|bouillon|puree|passata|tomatenblok|kokosmelk|ketjap|sojasaus|sambal|mosterd|mayonaise|suiker|zout|peper|stroop|pindakaas|tahin|conserven|blik/.test(text))
    return 'Conserven, soepen, sauzen, oliën';
  return 'Conserven, soepen, sauzen, oliën';
};

const ingredientFrom = (raw, index, slug) => {
  let text = cleanMarkdown(raw).replace(/^[-•]\s*/, '').replace(/\s*\([^)]*optioneel[^)]*\)\s*$/i, '').trim();
  if (!text) return null;

  const parentheticalAmount = text.match(/^\s*[\d¼½¾⅓⅔⅛⅜⅝⅞.,\s-]+\s*\((\d+(?:[.,]\d+)?)\s*(g|kg|ml|cl|dl|l)\)\s+(.+)$/i);
  if (parentheticalAmount) {
    const amount = Number(parentheticalAmount[1].replace(',', '.'));
    const unit = parentheticalAmount[2].toLowerCase();
    const name = parentheticalAmount[3].replace(/,\s*(naar smaak|optioneel).*$/i, '').trim();
    return { id: `${slug}-${index + 1}`, name, amount, unit, department: departmentFor(name) };
  }

  const leading = text.match(/^([\d¼½¾⅓⅔⅛⅜⅝⅞]+(?:[.,]\d+)?(?:\s*[\u00bc\u00bd\u00be\u2153\u2154\u215b\u215c\u215d\u215e])?(?:[-–]\d+(?:[.,]\d+)?)?)\s*(.*)$/);
  let amount = 1;
  let rest = text;
  if (leading) {
    amount = numberValue(leading[1]);
    rest = leading[2].trim();
  }

  let unit = 'stuk';
  const unitMatch = rest.match(/^([\p{L}]+)\b\s*(.*)$/u);
  if (unitMatch && unitAliases.has(unitMatch[1].toLowerCase())) {
    unit = unitAliases.get(unitMatch[1].toLowerCase());
    rest = unitMatch[2].trim();
  } else if (!leading && /^(snufje|snuf|scheutje|scheut)\b/i.test(rest)) {
    const descriptor = rest.match(/^(snufje|snuf|scheutje|scheut)\b/i)[1].toLowerCase();
    unit = descriptor.startsWith('snuf') ? 'snufje' : 'scheut';
    rest = rest.slice(descriptor.length).trim();
  }

  const name = rest
    .replace(/^\([^)]*\)\s*/, '')
    .replace(/^[–-]\s*\d+(?:[.,]\d+)?\s*(?:liter|kg|ml|cl|dl|g|l)\s+/i, '')
    .replace(/,\s*(naar smaak|optioneel|om\b.*)$/i, '')
    .replace(/\s+\(.*\)$/, '')
    .trim();
  if (!name) return null;
  return { id: `${slug}-${index + 1}`, name, amount, unit, department: departmentFor(name) };
};

const minutesFrom = (markdown) => {
  const match = markdown.match(/####\s+Totale tijd\s*\n+([^\n]+)/i);
  if (!match) return 30;
  const value = cleanMarkdown(match[1]);
  const hours = Number(value.match(/(\d+(?:[.,]\d+)?)\s*uur/i)?.[1]?.replace(',', '.') ?? 0);
  const minutes = Number(value.match(/(\d+)\s*min/i)?.[1] ?? 0);
  return Math.round(hours * 60 + minutes) || 30;
};

const ingredientLinesFrom = (markdown) => {
  const start = markdown.indexOf('Recept afdrukken');
  if (start === -1) return [];
  const section = markdown.slice(start + 'Recept afdrukken'.length);
  const endMarkers = ['\n### Zo maak je het', '\n1.\n', '\n1.\r\n'];
  const end = endMarkers
    .map((marker) => section.indexOf(marker))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];
  const ingredients = end === undefined ? section.slice(0, 5000) : section.slice(0, end);
  return ingredients
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^\*\s+/.test(line))
    .map((line) => line.replace(/^\*\s+/, ''));
};

const fetchText = async (url) => {
  for (let attempt = 1; attempt <= 8; attempt += 1) {
    let response;
    try {
      response = await fetch(jinaUrl(url), { headers: { Accept: 'text/plain' } });
      if (response.ok) return response.text();
      if (attempt === 8) throw new Error(`${response.status} voor ${url}`);
    } catch (error) {
      if (attempt === 8) throw error;
    }
    const delay = response?.status === 429 ? attempt * 5000 : attempt * 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
};

const downloadImage = async (url, destination) => {
  const resizedUrl = new URL(url);
  resizedUrl.searchParams.set('width', '720');
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      const response = await fetch(resizedUrl, {
        headers: { Accept: 'image/avif,image/webp,image/jpeg,*/*' },
      });
      if (response.ok) {
        await writeFile(destination, Buffer.from(await response.arrayBuffer()));
        return;
      }
      if (attempt === 5) throw new Error(`${response.status} voor ${url}`);
    } catch (error) {
      if (attempt === 5) throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
  }
};

const overview = await fetchText(overviewUrl);
const recipePattern = /!\[[^\]]*:\s*([^\]]+)\]\((https?:\/\/www\.peasmaker\.nl\/cdn\/shop\/articles\/[^)]+)\)\s*([^\]]+)\]\((https?:\/\/www\.peasmaker\.nl\/blogs\/alle\/[^)]+)\)/g;
const cards = [];
for (const match of overview.matchAll(recipePattern)) {
  cards.push({
    title: cleanMarkdown(match[3]),
    imageUrl: match[2].replace(/^http:/, 'https:'),
    sourceUrl: match[4].replace(/^http:/, 'https:'),
  });
}

if (cards.length < 70) throw new Error(`Slechts ${cards.length} recepten gevonden op de overzichtspagina.`);

await mkdir(imageDirectory, { recursive: true });

let nextIndex = 0;
const recipes = Array(cards.length);
const worker = async () => {
  while (nextIndex < cards.length) {
    const index = nextIndex;
    nextIndex += 1;
    const card = cards[index];
    const slug = new URL(card.sourceUrl).pathname.split('/').pop();
    const extension = new URL(card.imageUrl).pathname.toLowerCase().endsWith('.webp')
      ? 'webp'
      : 'jpg';
    const imageFile = `${slug}.${extension}`;
    const [markdown] = await Promise.all([
      fetchText(card.sourceUrl),
      downloadImage(card.imageUrl, new URL(imageFile, imageDirectory)),
    ]);
    const ingredients = ingredientLinesFrom(markdown)
      .map((line, ingredientIndex) => ingredientFrom(line, ingredientIndex, `peasmaker-${slug}`))
      .filter(Boolean);
    recipes[index] = {
      id: `peasmaker-${slug}`,
      clientKey: `peasmaker-${slug}`,
      title: card.title,
      subtitle:
        ingredients.length > 0
          ? 'Plantaardig recept van Peas Maker'
          : 'Volledig recept in het gratis Peas Maker e-book',
      minutes: minutesFrom(markdown),
      imageKey: slug,
      imageFile,
      ingredients,
      sourceUrl: card.sourceUrl,
    };
    process.stdout.write(`\r${index + 1}/${cards.length} ${card.title}`);
  }
};

await Promise.all(Array.from({ length: 2 }, () => worker()));
process.stdout.write('\n');

const imageMap = recipes
  .map(
    (recipe) =>
      `  ${JSON.stringify(recipe.imageKey)}: require('@/assets/images/peas-maker/${recipe.imageFile}'),`,
  )
  .join('\n');
const recipeData = recipes.map(({ imageFile: _imageFile, ...recipe }) => recipe);
const output = `import type { Recipe } from '@/data/mock-data';\n\n// Gegenereerd uit ${overviewUrl} op ${new Date().toISOString().slice(0, 10)}.\n// Alleen gestructureerde receptgegevens worden bewaard; voor de volledige bereiding opent Tably de bron.\nconst peasMakerImages: Record<string, Recipe['image']> = {\n${imageMap}\n};\n\nconst peasMakerRecipeData: (Omit<Recipe, 'image'> & { imageKey: string })[] = ${JSON.stringify(recipeData, null, 2)};\n\nexport const peasMakerRecipes: Recipe[] = peasMakerRecipeData.map(({ imageKey, ...recipe }) => ({\n  ...recipe,\n  image: peasMakerImages[imageKey],\n}));\n`;
await writeFile(new URL('../src/data/peas-maker-recipes.ts', import.meta.url), output);

const ingredientCount = recipes.reduce((total, recipe) => total + recipe.ingredients.length, 0);
console.log(`${recipes.length} recepten en ${ingredientCount} ingrediënten geschreven.`);
