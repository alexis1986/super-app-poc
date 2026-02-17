import type { Theme } from 'SharedComponents/DesignSystem';

// Theme customizado para App B - Estilo Verde/Fintech
export const appBTheme: Theme = {
  colors: {
    primary: '#10B981',        // Verde esmeralda
    secondary: '#059669',      // Verde oscuro
    background: '#FFFFFF',
    surface: '#F0FDF4',        // Verde muy claro
    text: '#1A1A1A',
    textSecondary: '#6B7280',
    error: '#DC2626',
    success: '#059669',
    border: '#D1D5DB',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
  },
  typography: {
    fontSize: {
      sm: 12,
      md: 16,
      lg: 20,
      xl: 24,
    },
    fontWeight: {
      regular: '400',
      medium: '500',
      bold: '700',
    },
  },
};