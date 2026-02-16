import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { Login } from 'SharedComponents/Login';
import type { LoginResponse } from 'SharedComponents/Login';
import { appATheme } from '../theme/appATheme';

interface LoginScreenProps {
  onLoginSuccess: (response: LoginResponse) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const handleLoginError = (error: string) => {
    console.log('Login error in App A:', error);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={appATheme.colors.surface} />
      <Login
        onLoginSuccess={onLoginSuccess}
        onLoginError={handleLoginError}
        theme={appATheme}
        title="App A - Iniciar Sesión"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appATheme.colors.surface,
  },
});

export default LoginScreen;