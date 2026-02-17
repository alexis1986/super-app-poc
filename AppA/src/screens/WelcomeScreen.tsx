import React from 'react';
import {SafeAreaView, StyleSheet, Alert, View} from 'react-native';
import {Text, Button, Card, ThemeProvider, useTheme} from 'SharedComponents/DesignSystem';
import type {LoginResponse} from 'SharedComponents/Login';
import {appATheme} from '../theme/appATheme';

interface WelcomeScreenProps {
  user: LoginResponse;
  onLogout: () => void;
}

const WelcomeScreenContent: React.FC<WelcomeScreenProps> = ({user, onLogout}) => {
  const theme = useTheme();

  const handleSharedBehavior = () => {
    Alert.alert(
      'App A - Comportamiento Compartido',
      `Hola ${user.user?.name}!\n\nEste boton usa el comportamiento estandar de Alert de React Native, que es compartido entre todas las apps.`,
      [{text: 'OK'}],
    );
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.surface}]}>
      <View style={[styles.content, {paddingHorizontal: theme.spacing.lg}]}>
        <Card variant="elevated" padding="large">
          <Text variant="heading" weight="bold" align="center">
            Bienvenido a App A!
          </Text>

          <Text
            variant="body"
            align="center"
            style={{marginTop: theme.spacing.sm, marginBottom: theme.spacing.lg}}>
            Aplicacion Corporativa
          </Text>

          <View
            style={{
              backgroundColor: theme.colors.surface,
              padding: theme.spacing.md,
              borderRadius: theme.borderRadius.md,
              marginVertical: theme.spacing.md,
            }}>
            <Text variant="body">
              <Text weight="bold">Usuario:</Text> {user.user?.name}
            </Text>
            <Text variant="body" style={{marginTop: theme.spacing.sm}}>
              <Text weight="bold">Email:</Text> {user.user?.email}
            </Text>
            <Text variant="caption" style={{marginTop: theme.spacing.sm}}>
              Token: {user.token?.substring(0, 20)}...
            </Text>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: theme.colors.border,
              marginVertical: theme.spacing.lg,
            }}
          />

          <Text variant="subheading" weight="bold">
            Caracteristicas de App A:
          </Text>

          <View style={{marginTop: theme.spacing.md, marginBottom: theme.spacing.lg}}>
            <Text variant="body">Theme azul corporativo</Text>
            <Text variant="body">Componentes cargados remotamente</Text>
            <Text variant="body">Comportamiento compartido en alertas</Text>
          </View>

          <Button
            title="Mostrar Alerta (Comportamiento Compartido)"
            onPress={handleSharedBehavior}
            variant="primary"
            fullWidth
            style={{marginBottom: theme.spacing.md}}
          />

          <Button
            title="Cerrar Sesion"
            onPress={onLogout}
            variant="outline"
            fullWidth
          />
        </Card>
      </View>
    </SafeAreaView>
  );
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = props => {
  return (
    <ThemeProvider theme={appATheme}>
      <WelcomeScreenContent {...props} />
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default WelcomeScreen;
