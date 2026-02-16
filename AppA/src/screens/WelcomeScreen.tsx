import React from 'react';
import { SafeAreaView, StyleSheet, Alert, View } from 'react-native';
import { Text, Button, Card } from 'SharedComponents/DesignSystem';
import type { LoginResponse } from 'SharedComponents/Login';
import { appATheme } from '../theme/appATheme';

interface WelcomeScreenProps {
  user: LoginResponse;
  onLogout: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ user, onLogout }) => {
  // Comportamiento COMPARTIDO - Usa Alert nativo de React Native
  const handleSharedBehavior = () => {
    Alert.alert(
      'App A - Comportamiento Compartido',
      `Hola ${user.user?.name}!\n\nEste botón usa el comportamiento estándar de Alert de React Native, que es compartido entre todas las apps.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Card theme={appATheme} variant="elevated" padding="large">
          <Text variant="heading" weight="bold" align="center" theme={appATheme}>
            ¡Bienvenido a App A! 🎯
          </Text>

          <Text
            variant="body"
            align="center"
            theme={appATheme}
            style={styles.subtitle}
          >
            Aplicación Corporativa
          </Text>

          <View style={styles.userInfo}>
            <Text variant="body" theme={appATheme}>
              <Text weight="bold">Usuario:</Text> {user.user?.name}
            </Text>
            <Text variant="body" theme={appATheme} style={styles.infoText}>
              <Text weight="bold">Email:</Text> {user.user?.email}
            </Text>
            <Text variant="caption" theme={appATheme} style={styles.infoText}>
              Token: {user.token?.substring(0, 20)}...
            </Text>
          </View>

          <View style={styles.divider} />

          <Text variant="subheading" weight="bold" theme={appATheme}>
            Características de App A:
          </Text>

          <View style={styles.features}>
            <Text variant="body" theme={appATheme}>
              • Theme azul corporativo 🔵
            </Text>
            <Text variant="body" theme={appATheme}>
              • Componentes cargados remotamente
            </Text>
            <Text variant="body" theme={appATheme}>
              • Comportamiento compartido en alertas
            </Text>
          </View>

          <Button
            title="Mostrar Alerta (Comportamiento Compartido)"
            onPress={handleSharedBehavior}
            theme={appATheme}
            variant="primary"
            fullWidth
            style={styles.button}
          />

          <Button
            title="Cerrar Sesión"
            onPress={onLogout}
            theme={appATheme}
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
    backgroundColor: appATheme.colors.surface,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: appATheme.spacing.lg,
  },
  subtitle: {
    marginTop: appATheme.spacing.sm,
    marginBottom: appATheme.spacing.lg,
  },
  userInfo: {
    backgroundColor: appATheme.colors.surface,
    padding: appATheme.spacing.md,
    borderRadius: appATheme.borderRadius.md,
    marginVertical: appATheme.spacing.md,
  },
  infoText: {
    marginTop: appATheme.spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: appATheme.colors.border,
    marginVertical: appATheme.spacing.lg,
  },
  features: {
    marginTop: appATheme.spacing.md,
    marginBottom: appATheme.spacing.lg,
  },
  button: {
    marginBottom: appATheme.spacing.md,
  },
});

export default WelcomeScreen;