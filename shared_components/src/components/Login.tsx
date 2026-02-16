import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Input, Text, Card } from '../design-system';
import { defaultTheme, Theme } from '../design-system/theme';
import type { LoginCredentials, LoginResponse, AuthState } from '../types/auth';

export interface LoginProps {
  onLoginSuccess: (response: LoginResponse) => void;
  onLoginError?: (error: string) => void;
  theme?: Theme;
  title?: string;
}

// Credenciales hardcodeadas para la simulación
const MOCK_CREDENTIALS = {
  email: 'user@app.com',
  password: '123456',
};

// Simula una llamada a API con delay
const simulateLogin = (credentials: LoginCredentials): Promise<LoginResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (
        credentials.email === MOCK_CREDENTIALS.email &&
        credentials.password === MOCK_CREDENTIALS.password
      ) {
        resolve({
          success: true,
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: '1',
            email: credentials.email,
            name: 'Usuario Demo',
          },
        });
      } else {
        resolve({
          success: false,
          error: 'Credenciales incorrectas',
        });
      }
    }, 1500); // Simula 1.5s de latencia de red
  });
};

export const Login: React.FC<LoginProps> = ({
  onLoginSuccess,
  onLoginError,
  theme = defaultTheme,
  title = 'Iniciar Sesión',
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null,
  });

  // Validación básica de email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validación de password
  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleLogin = async () => {
    // Reset error
    setAuthState({ isLoading: false, error: null });

    // Validaciones
    if (!email.trim()) {
      setAuthState({ isLoading: false, error: 'El email es requerido' });
      return;
    }

    if (!validateEmail(email)) {
      setAuthState({ isLoading: false, error: 'Email inválido' });
      return;
    }

    if (!password) {
      setAuthState({ isLoading: false, error: 'La contraseña es requerida' });
      return;
    }

    if (!validatePassword(password)) {
      setAuthState({ isLoading: false, error: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    // Iniciar loading
    setAuthState({ isLoading: true, error: null });

    try {
      const response = await simulateLogin({ email, password });

      if (response.success) {
        onLoginSuccess(response);
      } else {
        const errorMsg = response.error || 'Error desconocido';
        setAuthState({ isLoading: false, error: errorMsg });
        if (onLoginError) {
          onLoginError(errorMsg);
        }
      }
    } catch (error) {
      const errorMsg = 'Error de conexión';
      setAuthState({ isLoading: false, error: errorMsg });
      if (onLoginError) {
        onLoginError(errorMsg);
      }
    }
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Card variant="elevated" padding="large" theme={theme}>
        <Text variant="heading" weight="bold" align="center" theme={theme}>
          {title}
        </Text>

        <Text variant="caption" align="center" theme={theme} style={styles.subtitle}>
          Ingresa tus credenciales para continuar
        </Text>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="usuario@ejemplo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            theme={theme}
            editable={!authState.isLoading}
          />

          <Input
            label="Contraseña"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            showPasswordToggle
            theme={theme}
            editable={!authState.isLoading}
          />

          {authState.error && (
            <View style={styles.errorContainer}>
              <Text variant="body" color={theme.colors.error}>
                {authState.error}
              </Text>
            </View>
          )}

          <Button
            title="Iniciar Sesión"
            onPress={handleLogin}
            loading={authState.isLoading}
            fullWidth
            theme={theme}
            style={styles.button}
          />

          <Text variant="caption" align="center" theme={theme} style={styles.hint}>
            Credenciales de prueba:{'\n'}
            Email: user@app.com{'\n'}
            Contraseña: 123456
          </Text>
        </View>
      </Card>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
    },
    subtitle: {
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    form: {
      marginTop: theme.spacing.md,
    },
    errorContainer: {
      backgroundColor: theme.colors.error + '20', // 20% opacity
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
    },
    button: {
      marginTop: theme.spacing.md,
    },
    hint: {
      marginTop: theme.spacing.lg,
      opacity: 0.6,
    },
  });