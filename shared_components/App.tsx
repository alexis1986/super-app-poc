import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Alert } from 'react-native';
import { Login } from './src/components/Login';
import { defaultTheme } from './src/design-system/theme';
import type { LoginResponse } from './src/types/auth';

function App(): React.JSX.Element {
  const handleLoginSuccess = (response: LoginResponse) => {
    Alert.alert(
      'Login Exitoso',
      `Bienvenido ${response.user?.name}!\nToken: ${response.token?.substring(0, 20)}...`
    );
  };

  const handleLoginError = (error: string) => {
    Alert.alert('Error', error);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={defaultTheme.colors.surface} />
      <Login
        onLoginSuccess={handleLoginSuccess}
        onLoginError={handleLoginError}
        theme={defaultTheme}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultTheme.colors.surface,
  },
});

export default App;