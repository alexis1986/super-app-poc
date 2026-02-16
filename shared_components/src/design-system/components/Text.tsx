import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from 'react-native';
import { defaultTheme, Theme } from '../theme';

export interface TextProps extends RNTextProps {
  variant?: 'heading' | 'subheading' | 'body' | 'caption';
  weight?: 'regular' | 'medium' | 'bold';
  color?: string;
  theme?: Theme;
  align?: 'left' | 'center' | 'right';
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  weight = 'regular',
  color,
  theme = defaultTheme,
  align = 'left',
  style,
  children,
  ...props
}) => {
  const styles = createStyles(theme);

  const textStyle: TextStyle[] = [
    styles.base,
    styles[`variant_${variant}`],
    styles[`weight_${weight}`],
    { textAlign: align },
    color && { color },
    style as TextStyle,
  ];

  return (
    <RNText style={textStyle} {...props}>
      {children}
    </RNText>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    base: {
      color: theme.colors.text,
    },
    variant_heading: {
      fontSize: theme.typography.fontSize.xl,
      lineHeight: theme.typography.fontSize.xl * 1.3,
    },
    variant_subheading: {
      fontSize: theme.typography.fontSize.lg,
      lineHeight: theme.typography.fontSize.lg * 1.3,
    },
    variant_body: {
      fontSize: theme.typography.fontSize.md,
      lineHeight: theme.typography.fontSize.md * 1.5,
    },
    variant_caption: {
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.fontSize.sm * 1.4,
      color: theme.colors.textSecondary,
    },
    weight_regular: {
      fontWeight: theme.typography.fontWeight.regular,
    },
    weight_medium: {
      fontWeight: theme.typography.fontWeight.medium,
    },
    weight_bold: {
      fontWeight: theme.typography.fontWeight.bold,
    },
  });