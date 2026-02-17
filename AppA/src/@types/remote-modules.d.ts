declare module 'SharedComponents/DesignSystem' {
  export interface Theme {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      surface: string;
      text: string;
      textSecondary: string;
      error: string;
      success: string;
      border: string;
    };
    spacing: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
    borderRadius: {
      sm: number;
      md: number;
      lg: number;
    };
    typography: {
      fontSize: {
        sm: number;
        md: number;
        lg: number;
        xl: number;
      };
      fontWeight: {
        regular: '400';
        medium: '500';
        bold: '700';
      };
    };
  }

  export interface ThemeProviderProps {
    theme: Theme;
    children: React.ReactNode;
  }

  export interface ButtonProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    theme?: Theme;
    fullWidth?: boolean;
    onPress?: () => void;
    disabled?: boolean;
  }

  export interface TextProps {
    variant?: 'heading' | 'subheading' | 'body' | 'caption';
    weight?: 'regular' | 'medium' | 'bold';
    color?: string;
    theme?: Theme;
    align?: 'left' | 'center' | 'right';
    children: React.ReactNode;
  }

  export interface InputProps {
    label?: string;
    error?: string;
    theme?: Theme;
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    showPasswordToggle?: boolean;
  }

  export interface CardProps {
    theme?: Theme;
    variant?: 'elevated' | 'outlined' | 'filled';
    padding?: 'none' | 'small' | 'medium' | 'large';
    children: React.ReactNode;
  }

  export const ThemeProvider: React.FC<ThemeProviderProps>;
  export function useTheme(): Theme;
  export const Button: React.FC<ButtonProps>;
  export const Text: React.FC<TextProps>;
  export const Input: React.FC<InputProps>;
  export const Card: React.FC<CardProps>;
  export const defaultTheme: Theme;
}

declare module 'SharedComponents/Login' {
  import {Theme} from 'SharedComponents/DesignSystem';

  export interface LoginResponse {
    success: boolean;
    token?: string;
    user?: {
      id: string;
      email: string;
      name: string;
    };
    error?: string;
  }

  export interface NavigationActions {
    onLoginSuccess: (response: LoginResponse) => void;
    onLoginError?: (error: string) => void;
  }

  export interface LoginProps extends NavigationActions {
    theme?: Theme;
    title?: string;
  }

  export const Login: React.FC<LoginProps>;
}
