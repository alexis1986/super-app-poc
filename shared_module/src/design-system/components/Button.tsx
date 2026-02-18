import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {Theme} from '../theme';
import {useTheme} from '../ThemeContext';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  theme?: Theme;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  theme,
  fullWidth = false,
  disabled,
  style,
  ...props
}) => {
  const contextTheme = useTheme();
  const resolvedTheme = theme ?? contextTheme;
  const styles = createStyles(resolvedTheme);

  const buttonStyle: ViewStyle[] = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    fullWidth && styles.buttonFullWidth,
    disabled && styles.buttonDisabled,
    style as ViewStyle,
  ];

  const textStyle: TextStyle[] = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.textDisabled,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? resolvedTheme.colors.primary : '#FFFFFF'}
        />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    button_primary: {
      backgroundColor: theme.colors.primary,
    },
    button_secondary: {
      backgroundColor: theme.colors.secondary,
    },
    button_outline: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.primary,
    },
    button_small: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 32,
    },
    button_medium: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      minHeight: 44,
    },
    button_large: {
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.lg,
      minHeight: 56,
    },
    buttonFullWidth: {
      width: '100%',
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    text: {
      fontWeight: theme.typography.fontWeight.medium,
      textAlign: 'center',
    },
    text_primary: {
      color: '#FFFFFF',
    },
    text_secondary: {
      color: '#FFFFFF',
    },
    text_outline: {
      color: theme.colors.primary,
    },
    text_small: {
      fontSize: theme.typography.fontSize.sm,
    },
    text_medium: {
      fontSize: theme.typography.fontSize.md,
    },
    text_large: {
      fontSize: theme.typography.fontSize.lg,
    },
    textDisabled: {
      opacity: 0.7,
    },
  });
