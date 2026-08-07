import { defaultDepartment, type Department, type Ingredient } from '@/data/mock-data';

const unitAliases: Record<string, string> = {
  g: 'g',
  gram: 'g',
  kg: 'kg',
  ml: 'ml',
  l: 'l',
  liter: 'l',
  el: 'el',
  eetlepel: 'el',
  eetlepels: 'el',
  tl: 'tl',
  theelepel: 'tl',
  theelepels: 'tl',
  stuk: 'stuk',
  stuks: 'stuks',
  teen: 'teen',
  tenen: 'tenen',
  blik: 'blik',
  blikken: 'blikken',
  pot: 'pot',
  potten: 'potten',
  pak: 'pak',
  pakken: 'pakken',
  zak: 'zak',
  zakken: 'zakken',
  bos: 'bos',
  bossen: 'bossen',
  rol: 'rol',
  rollen: 'rollen',
};

const embeddedQuantityPattern = new RegExp(
  `^(\\d+(?:[.,]\\d+)?)\\s*(${Object.keys(unitAliases)
    .sort((a, b) => b.length - a.length)
    .join('|')})\\s+(.+)$`,
  'i',
);

const departmentKeywords: [Department, string[]][] = [
  [
    'Conserven, soepen, sauzen, oliën',
    ['bouillon', 'conserven', 'kokosmelk', 'olie', 'pesto', 'saus', 'soep', 'tomatenblokjes'],
  ],
  [
    'Aardappelen, groente en fruit',
    [
      'aardappel', 'appel', 'aubergine', 'avocado', 'banaan', 'biet', 'bloemkool',
      'boon', 'bosui', 'broccoli', 'champignon', 'citroen', 'courgette', 'fruit',
      'gember', 'knoflook', 'komkommer', 'limoen', 'paprika', 'peer', 'peen',
      'paddenstoel', 'prei', 'rucola', 'sla', 'spinazie', 'tomaat', 'ui', 'wortel',
    ],
  ],
  [
    'Vlees, vis en vega',
    [
      'biefstuk', 'gehakt', 'hamburger', 'kip', 'kotelet', 'rund', 'varken', 'vis',
      'vlees', 'zalm', 'falafel', 'plantaardig', 'seitan', 'tempeh', 'tofu', 'vega',
      'vegetarisch',
    ],
  ],
  [
    'Vleeswaren, kaas en tapas',
    [
      'bacon', 'brie', 'chorizo', 'feta', 'geitenkaas', 'ham', 'kaas', 'mozzarella',
      'parmezaan', 'salami', 'tapas',
    ],
  ],
  [
    'Zuivel, boter en eieren',
    ['boter', 'crème fraîche', 'ei', 'melk', 'kwark', 'room', 'yoghurt'],
  ],
  [
    'Wereldkeukens, kruiden, pasta en rijst',
    [
      'couscous', 'currypasta', 'kruid', 'lasagne', 'noedel', 'pasta', 'penne',
      'peper', 'rijst', 'spaghetti', 'tortilla', 'wrap', 'zout',
    ],
  ],
  ['Brood en gebak', ['bagel', 'brood', 'broodje', 'croissant', 'stokbrood']],
  [
    'Ontbijt, broodbeleg en bakproducten',
    ['bloem', 'gist', 'granen', 'havermout', 'jam', 'meel', 'muesli', 'noot', 'ontbijt'],
  ],
  ['Diepvries', ['diepvries', 'bevroren', 'ijs']],
  ['Koffie en thee', ['koffie', 'thee']],
  ['Frisdrank en sappen', ['frisdrank', 'sap', 'siroop']],
  ['Bier en wijn', ['bier', 'wijn']],
];

const slug = (value: string) =>
  value
    .toLocaleLowerCase('nl')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export function suggestDepartment(name: string): Department {
  const normalized = name.toLocaleLowerCase('nl');
  const match = departmentKeywords.find(([, keywords]) =>
    keywords.some((keyword) => normalized.includes(keyword)),
  );
  return match?.[0] ?? defaultDepartment;
}

export function normalizeIngredientQuantity(ingredient: Ingredient): Ingredient {
  const match = ingredient.name.trim().match(embeddedQuantityPattern);
  if (!match) return ingredient;

  const embeddedAmount = Number(match[1].replace(',', '.'));
  const embeddedUnit = unitAliases[match[2].toLocaleLowerCase('nl')];
  const normalizedName = match[3].trim();
  if (!Number.isFinite(embeddedAmount) || embeddedAmount <= 0 || !embeddedUnit || !normalizedName) {
    return ingredient;
  }

  const currentUnit = ingredient.unit.trim().toLocaleLowerCase('nl');
  const hasPlaceholderQuantity =
    !Number.isFinite(ingredient.amount) ||
    ingredient.amount <= 0 ||
    (ingredient.amount === 1 && ['', 'stuk', 'stuks'].includes(currentUnit));

  return {
    ...ingredient,
    name: normalizedName,
    amount: hasPlaceholderQuantity ? embeddedAmount : ingredient.amount,
    unit: hasPlaceholderQuantity ? embeddedUnit : ingredient.unit,
  };
}

export function parseIngredientLines(value: string): Ingredient[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const parts = line.split(/\s+/);
      const parsedAmount = Number(parts[0]?.replace(',', '.'));
      const hasAmount = Number.isFinite(parsedAmount) && parsedAmount > 0;
      const amount = hasAmount ? parsedAmount : 1;
      const possibleUnit = hasAmount ? parts[1]?.toLocaleLowerCase('nl') : undefined;
      const recognizedUnit = possibleUnit ? unitAliases[possibleUnit] : undefined;
      const nameStart = hasAmount ? (recognizedUnit ? 2 : 1) : 0;
      const name = parts.slice(nameStart).join(' ').trim() || line;
      const unit = recognizedUnit ?? (amount === 1 ? 'stuk' : 'stuks');

      return normalizeIngredientQuantity({
        id: `ingredient-${index}-${slug(name) || 'item'}`,
        name,
        amount,
        unit,
        department: suggestDepartment(name),
      });
    });
}
