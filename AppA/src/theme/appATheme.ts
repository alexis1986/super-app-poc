import type { Theme } from 'SharedModule/DesignSystem';

// Theme customizado para App A - Estilo Azul/Corporativo
export const appATheme: Theme = {
  colors: {
    primary: '#0066CC',        // Azul corporativo
    secondary: '#004C99',      // Azul oscuro
    background: '#FFFFFF',
    surface: '#F5F8FA',        // Gris azulado claro
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