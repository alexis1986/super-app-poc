import React from 'react';
import {SafeAreaView, StyleSheet, StatusBar} from 'react-native';
import {Login} from 'SharedModule/Login';
import type {LoginResponse} from 'SharedModule/Login';
import {ThemeProvider, useTheme} from 'SharedModule/DesignSystem';
import {appBTheme} from '../theme/appBTheme';

interface LoginScreenProps {
  onLoginSuccess: (response: LoginResponse) => void;
}

const LoginScreenContent: React.FC<LoginScreenProps> = ({onLoginSuccess}) => {
  const theme = useTheme();

  const handleLoginError = (error: string) => {
    console.log('Login error in App B:', error);
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.surface}]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />
      <Login
        onLoginSuccess={onLoginSuccess}
        onLoginError={handleLoginError}
        title="App B - Iniciar Sesion"
      />
    </SafeAreaView>
  );
};

const LoginScreen: React.FC<LoginScreenProps> = props => {
  return (
    <ThemeProvider theme={appBTheme}>
      <LoginScreenContent {...props} />
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LoginScreen;
