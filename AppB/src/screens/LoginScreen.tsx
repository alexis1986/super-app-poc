import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { Login } from 'SharedComponents/Login';
import type { LoginResponse } from 'SharedComponents/Login';
import { appBTheme } from '../theme/appBTheme';

interface LoginScreenProps {
  onLoginSuccess: (response: LoginResponse) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const handleLoginError = (error: string) => {
    console.log('Login error in App B:', error);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={appBTheme.colors.surface} />
      <Login
        onLoginSuccess={onLoginSuccess}
        onLoginError={handleLoginError}
        theme={appBTheme}
        title="App B - Iniciar Sesión"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appBTheme.colors.surface,
  },
});

export default LoginScreen;