export const normalizeIngredientPreferenceName = (value: string) =>
  value
    .normalize('NFKC')
    .trim()
    .toLocaleLowerCase('nl')
    .replace(/\s+/g, ' ')
    .replace(/\s*%\s*/g, '% ')
    .trim();
