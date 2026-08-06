export const palette = {
  background: '#FCFCF7',
  surface: '#FFFFFF',
  surfaceMuted: '#F2F8F4',
  surfaceStrong: '#E2EFE7',
  border: '#D9E7DF',
  text: '#123D35',
  textMuted: '#4F6B62',
  textSoft: '#7C928B',
  sage: '#16805C',
  sageDark: '#0F6F58',
  sageSoft: '#E8F5EE',
  white: '#FFFFFF',
  danger: '#B42318',
  star: '#F59E0B',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  pill: 999,
} as const;

export const shadow = {
  card: {
    shadowColor: '#123D35',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
} as const;
