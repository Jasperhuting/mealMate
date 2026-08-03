export const palette = {
  background: '#F3F4F1',
  surface: '#FFFFFF',
  surfaceMuted: '#E9EBE6',
  surfaceStrong: '#DDE1D9',
  border: '#D7DAD3',
  text: '#20231F',
  textMuted: '#73786F',
  textSoft: '#989D95',
  sage: '#66745D',
  sageDark: '#4C5946',
  sageSoft: '#DDE4D8',
  white: '#FFFFFF',
  danger: '#A85F58',
  star: '#B99248',
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
    shadowColor: '#252820',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
} as const;
