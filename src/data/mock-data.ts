import type { ImageSource } from 'expo-image';

export const jumboDepartments = [
  'Alles voor je BBQ!',
  'Aardappelen, groente en fruit',
  'Verse maaltijden en gemak',
  'Vlees, vis en vega',
  'Brood en gebak',
  'Zuivel, boter en eieren',
  'Vleeswaren, kaas en tapas',
  'Vega en plantaardig',
  'Conserven, soepen, sauzen, oliën',
  'Wereldkeukens, kruiden, pasta en rijst',
  'Ontbijt, broodbeleg en bakproducten',
  'Koek, snoep, chocolade en chips',
  'Koffie en thee',
  'Frisdrank en sappen',
  'Bier en wijn',
  'Diepvries',
  'Drogisterij en gezondheid',
  'Baby en kind',
  'Huishouden en dieren',
  'Non-food en servicebalie',
  'Bewuste voeding',
] as const;

export type Department = (typeof jumboDepartments)[number];

export const defaultDepartment: Department = 'Conserven, soepen, sauzen, oliën';

const legacyDepartments: Record<string, Department> = {
  'Groente & fruit': 'Aardappelen, groente en fruit',
  Koeling: 'Zuivel, boter en eieren',
  'Pasta, rijst & wereldkeuken': 'Wereldkeukens, kruiden, pasta en rijst',
  'Kruiden & houdbaar': 'Conserven, soepen, sauzen, oliën',
};

export const normalizeDepartment = (value: string): Department =>
  jumboDepartments.includes(value as Department)
    ? (value as Department)
    : legacyDepartments[value] ?? defaultDepartment;

export type Ingredient = {
  id: string;
  name: string;
  amount: number;
  unit: string;
  department: Department;
};

export type Recipe = {
  id: string;
  clientKey?: string;
  title: string;
  subtitle: string;
  minutes: number;
  image: ImageSource | null;
  ingredients: Ingredient[];
  sourceUrl?: string;
};

export type WeekDay = {
  id: string;
  short: string;
  label: string;
  date: number;
  isoDate: string;
  month: string;
  monthShort: string;
};

export type FamilyMember = {
  id: string;
  name: string;
  initials: string;
  color: string;
  email?: string;
  invitationStatus?: 'pending' | 'accepted';
  linkedUserId?: string;
  avatarUrl?: string;
};

const ingredient = (
  id: string,
  name: string,
  amount: number,
  unit: string,
  department: Department,
): Ingredient => ({ id, name, amount, unit, department });

export const recipes: Recipe[] = [
  {
    id: 'risotto',
    title: 'Paddenstoelenrisotto',
    subtitle: 'Romig, hartig en favoriet van jullie allebei',
    minutes: 35,
    image: require('@/assets/images/meals/risotto.webp'),
    ingredients: [
      ingredient('risotto-rice', 'Risottorijst', 300, 'g', 'Wereldkeukens, kruiden, pasta en rijst'),
      ingredient('mushrooms', 'Gemengde paddenstoelen', 400, 'g', 'Aardappelen, groente en fruit'),
      ingredient('onion-risotto', 'Ui', 1, 'stuk', 'Aardappelen, groente en fruit'),
      ingredient('garlic-risotto', 'Knoflook', 2, 'tenen', 'Aardappelen, groente en fruit'),
      ingredient('stock-risotto', 'Groentebouillon', 1, 'l', 'Conserven, soepen, sauzen, oliën'),
      ingredient('parmesan-risotto', 'Parmezaanse kaas', 75, 'g', 'Vleeswaren, kaas en tapas'),
    ],
  },
  {
    id: 'curry',
    title: 'Thaise groene curry',
    subtitle: 'Fris, licht pittig en snel op tafel',
    minutes: 30,
    image: null,
    ingredients: [
      ingredient('rice-curry', 'Jasmijnrijst', 300, 'g', 'Wereldkeukens, kruiden, pasta en rijst'),
      ingredient('pepper-curry', 'Rode paprika', 2, 'stuks', 'Aardappelen, groente en fruit'),
      ingredient('beans-curry', 'Sperziebonen', 300, 'g', 'Aardappelen, groente en fruit'),
      ingredient('coconut-curry', 'Kokosmelk', 400, 'ml', 'Wereldkeukens, kruiden, pasta en rijst'),
      ingredient('paste-curry', 'Groene currypasta', 2, 'el', 'Wereldkeukens, kruiden, pasta en rijst'),
    ],
  },
  {
    id: 'pesto',
    title: 'Pasta pesto',
    subtitle: 'Een makkelijke doordeweekse klassieker',
    minutes: 20,
    image: require('@/assets/images/meals/pasta-pesto.webp'),
    ingredients: [
      ingredient('pasta-pesto', 'Penne', 350, 'g', 'Wereldkeukens, kruiden, pasta en rijst'),
      ingredient('tomatoes-pesto', 'Cherrytomaten', 250, 'g', 'Aardappelen, groente en fruit'),
      ingredient('pesto-pesto', 'Groene pesto', 120, 'g', 'Conserven, soepen, sauzen, oliën'),
      ingredient('parmesan-pesto', 'Parmezaanse kaas', 50, 'g', 'Vleeswaren, kaas en tapas'),
      ingredient('arugula-pesto', 'Rucola', 75, 'g', 'Aardappelen, groente en fruit'),
    ],
  },
  {
    id: 'tart',
    title: 'Plaattaart met geitenkaas',
    subtitle: 'Knapperig met biet en zachte geitenkaas',
    minutes: 40,
    image: null,
    ingredients: [
      ingredient('pastry-tart', 'Bladerdeeg', 1, 'rol', 'Verse maaltijden en gemak'),
      ingredient('beet-tart', 'Gekookte bieten', 500, 'g', 'Aardappelen, groente en fruit'),
      ingredient('goat-tart', 'Zachte geitenkaas', 150, 'g', 'Vleeswaren, kaas en tapas'),
      ingredient('onion-tart', 'Rode ui', 2, 'stuks', 'Aardappelen, groente en fruit'),
      ingredient('walnuts-tart', 'Walnoten', 60, 'g', 'Ontbijt, broodbeleg en bakproducten'),
    ],
  },
  {
    id: 'spaghetti',
    title: 'Spaghetti bolognese',
    subtitle: 'Vertrouwd comfortfood voor een rustige avond',
    minutes: 45,
    image: null,
    ingredients: [
      ingredient('spaghetti-bolo', 'Spaghetti', 350, 'g', 'Wereldkeukens, kruiden, pasta en rijst'),
      ingredient('mince-bolo', 'Rundergehakt', 400, 'g', 'Vlees, vis en vega'),
      ingredient('tomatoes-bolo', 'Tomatenblokjes', 800, 'g', 'Conserven, soepen, sauzen, oliën'),
      ingredient('onion-bolo', 'Ui', 1, 'stuk', 'Aardappelen, groente en fruit'),
      ingredient('carrot-bolo', 'Winterpeen', 1, 'stuk', 'Aardappelen, groente en fruit'),
    ],
  },
];

const dayDefinitions = [
  { id: 'mon', short: 'MA', label: 'Maandag' },
  { id: 'tue', short: 'DI', label: 'Dinsdag' },
  { id: 'wed', short: 'WO', label: 'Woensdag' },
  { id: 'thu', short: 'DO', label: 'Donderdag' },
  { id: 'fri', short: 'VR', label: 'Vrijdag' },
  { id: 'sat', short: 'ZA', label: 'Zaterdag' },
  { id: 'sun', short: 'ZO', label: 'Zondag' },
] as const;

export const dateToIso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const today = new Date();
today.setHours(12, 0, 0, 0);
const monday = new Date(today);
monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

export const createWeekDays = (weekStart: Date): WeekDay[] =>
  dayDefinitions.map((definition, index) => {
    const date = new Date(weekStart);
    date.setHours(12, 0, 0, 0);
    date.setDate(weekStart.getDate() + index);
    return {
      ...definition,
      date: date.getDate(),
      isoDate: dateToIso(date),
      month: date.toLocaleDateString('nl-NL', { month: 'long' }),
      monthShort: date.toLocaleDateString('nl-NL', { month: 'short' }).replace('.', ''),
    };
  });

export const getWeekRangeLabel = (days: WeekDay[]) => {
  const first = days[0];
  const last = days[days.length - 1];
  if (!first || !last) return '';
  if (first.month === last.month) return `${first.date} – ${last.date} ${last.month}`;
  return `${first.date} ${first.monthShort} – ${last.date} ${last.monthShort}`;
};

export const weekDays = createWeekDays(monday);
export const weekRangeLabel = getWeekRangeLabel(weekDays);

export const familyMembers: FamilyMember[] = [
  { id: 'jasper', name: 'Jasper', initials: 'JH', color: '#0F6F58' },
  { id: 'lisanne', name: 'Lisanne', initials: 'LH', color: '#737373' },
];
