import React from 'react';
import { SafeAreaView, StyleSheet, Alert, View } from 'react-native';
import { Text, Button, Card } from 'SharedComponents/DesignSystem';
import type { LoginResponse } from 'SharedComponents/Login';
import { appBTheme } from '../theme/appBTheme';

interface WelcomeScreenProps {
  user: LoginResponse;
  onLogout: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ user, onLogout }) => {
  // Comportamiento COMPARTIDO - Usa Alert nativo de React Native
  const handleSharedBehavior = () => {
    Alert.alert(
      'App B - Comportamiento Compartido',
      `Hola ${user.user?.name}!\n\nEste botón usa el comportamiento estándar de Alert de React Native, que es compartido entre todas las apps.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Card theme={appBTheme} variant="elevated" padding="large">
          <Text variant="heading" weight="bold" align="center" theme={appBTheme}>
            ¡Bienvenido a App B! 💚
          </Text>

          <Text
            variant="body"
            align="center"
            theme={appBTheme}
            style={styles.subtitle}
          >
            Aplicación Fintech
          </Text>

          <View style={styles.userInfo}>
            <Text variant="body" theme={appBTheme}>
              <Text weight="bold">Usuario:</Text> {user.user?.name}
            </Text>
            <Text variant="body" theme={appBTheme} style={styles.infoText}>
              <Text weight="bold">Email:</Text> {user.user?.email}
            </Text>
            <Text variant="caption" theme={appBTheme} style={styles.infoText}>
              Token: {user.token?.substring(0, 20)}...
            </Text>
          </View>

          <View style={styles.divider} />

          <Text variant="subheading" weight="bold" theme={appBTheme}>
            Características de App B:
          </Text>

          <View style={styles.features}>
            <Text variant="body" theme={appBTheme}>
              • Theme verde fintech 🟢
            </Text>
            <Text variant="body" theme={appBTheme}>
              • Componentes cargados remotamente
            </Text>
            <Text variant="body" theme={appBTheme}>
              • Comportamiento compartido en alertas
            </Text>
          </View>

          <Button
            title="Mostrar Alerta (Comportamiento Compartido)"
            onPress={handleSharedBehavior}
            theme={appBTheme}
            variant="primary"
            fullWidth
            style={styles.button}
          />

          <Button
            title="Cerrar Sesión"
            onPress={onLogout}
            theme={appBTheme}
            variant="outline"
            fullWidth
          />
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appBTheme.colors.surface,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: appBTheme.spacing.lg,
  },
  subtitle: {
    marginTop: appBTheme.spacing.sm,
    marginBottom: appBTheme.spacing.lg,
  },
  userInfo: {
    backgroundColor: appBTheme.colors.surface,
    padding: appBTheme.spacing.md,
    borderRadius: appBTheme.borderRadius.md,
    marginVertical: appBTheme.spacing.md,
  },
  infoText: {
    marginTop: appBTheme.spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: appBTheme.colors.border,
    marginVertical: appBTheme.spacing.lg,
  },
  features: {
    marginTop: appBTheme.spacing.md,
    marginBottom: appBTheme.spacing.lg,
  },
  button: {
    marginBottom: appBTheme.spacing.md,
  },
});

export default WelcomeScreen;