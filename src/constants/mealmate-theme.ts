export const palette = {
  background: '#FAFAF9',
  surface: '#FFFFFF',
  surfaceMuted: '#F3F3F2',
  surfaceStrong: '#E7E7E5',
  border: '#DEDEDB',
  text: '#20201F',
  textMuted: '#686865',
  textSoft: '#969691',
  sage: '#EA580C',
  sageDark: '#C2410C',
  sageSoft: '#FFF0E6',
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
    shadowColor: '#20201F',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
} as const;
