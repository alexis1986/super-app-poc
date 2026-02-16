import React from 'react';
import { View, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { defaultTheme, Theme } from '../theme';

export interface CardProps extends ViewProps {
  theme?: Theme;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({
  theme = defaultTheme,
  variant = 'elevated',
  padding = 'medium',
  style,
  children,
  ...props
}) => {
  const styles = createStyles(theme);

  const cardStyle: ViewStyle[] = [
    styles.base,
    styles[`variant_${variant}`],
    styles[`padding_${padding}`],
    style as ViewStyle,
  ];

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    base: {
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
    },
    variant_elevated: {
      backgroundColor: theme.colors.background,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    variant_outlined: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    variant_filled: {
      backgroundColor: theme.colors.surface,
    },
    padding_none: {
      padding: 0,
    },
    padding_small: {
      padding: theme.spacing.sm,
    },
    padding_medium: {
      padding: theme.spacing.md,
    },
    padding_large: {
      padding: theme.spacing.lg,
    },
  });