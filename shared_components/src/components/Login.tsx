import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Input, Text, Card, ThemeProvider, useTheme} from '../design-system';
import type {Theme} from '../design-system/theme';
import type {LoginCredentials, LoginResponse, AuthState} from '../types/auth';
import type {NavigationActions} from '../types/navigation';

export type {NavigationActions} from '../types/navigation';

export interface LoginProps extends NavigationActions {
  theme?: Theme;
  title?: string;
}

// Credenciales hardcodeadas para la simulacion
const MOCK_CREDENTIALS = {
  email: 'user@app.com',
  password: '123456',
};

// Simula una llamada a API con delay
const simulateLogin = (credentials: LoginCredentials): Promise<LoginResponse> => {
  return new Promise(resolve => {
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
    }, 1500);
  });
};

export const Login: React.FC<LoginProps> = ({
  onLoginSuccess,
  onLoginError,
  theme,
  title = 'Iniciar Sesion',
}) => {
  const contextTheme = useTheme();
  const resolvedTheme = theme ?? contextTheme;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null,
  });

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validatePassword = (value: string): boolean => {
    return value.length >= 6;
  };

  const handleLogin = async () => {
    setAuthState({isLoading: false, error: null});

    if (!email.trim()) {
      setAuthState({isLoading: false, error: 'El email es requerido'});
      return;
    }

    if (!validateEmail(email)) {
      setAuthState({isLoading: false, error: 'Email invalido'});
      return;
    }

    if (!password) {
      setAuthState({isLoading: false, error: 'La contrasena es requerida'});
      return;
    }

    if (!validatePassword(password)) {
      setAuthState({isLoading: false, error: 'La contrasena debe tener al menos 6 caracteres'});
      return;
    }

    setAuthState({isLoading: true, error: null});

    try {
      const response = await simulateLogin({email, password});

      if (response.success) {
        onLoginSuccess(response);
      } else {
        const errorMsg = response.error || 'Error desconocido';
        setAuthState({isLoading: false, error: errorMsg});
        onLoginError?.(errorMsg);
      }
    } catch (_error) {
      const errorMsg = 'Error de conexion';
      setAuthState({isLoading: false, error: errorMsg});
      onLoginError?.(errorMsg);
    }
  };

  const styles = createStyles(resolvedTheme);

  return (
    <ThemeProvider theme={resolvedTheme}>
      <View style={styles.container}>
        <Card variant="elevated" padding="large">
          <Text variant="heading" weight="bold" align="center">
            {title}
          </Text>

          <Text variant="caption" align="center" style={styles.subtitle}>
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
              editable={!authState.isLoading}
            />

            <Input
              label="Contrasena"
              placeholder="Minimo 6 caracteres"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              showPasswordToggle
              editable={!authState.isLoading}
            />

            {authState.error && (
              <View style={styles.errorContainer}>
                <Text variant="body" color={resolvedTheme.colors.error}>
                  {authState.error}
                </Text>
              </View>
            )}

            <Button
              title="Iniciar Sesion"
              onPress={handleLogin}
              loading={authState.isLoading}
              fullWidth
              style={styles.button}
            />

            <Text variant="caption" align="center" style={styles.hint}>
              Credenciales de prueba:{'\n'}
              Email: user@app.com{'\n'}
              Contrasena: 123456
            </Text>
          </View>
        </Card>
      </View>
    </ThemeProvider>
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
      backgroundColor: theme.colors.error + '20',
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
