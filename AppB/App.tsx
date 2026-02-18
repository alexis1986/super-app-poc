import React, {useState, Suspense} from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import type {LoginResponse} from 'SharedModule/Login';

const LoginScreen = React.lazy(() => import('./src/screens/LoginScreen'));
const WelcomeScreen = React.lazy(() => import('./src/screens/WelcomeScreen'));

function LoadingFallback() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" />
    </View>
  );
}

function App(): React.JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userSession, setUserSession] = useState<LoginResponse | null>(null);

  const handleLoginSuccess = (response: LoginResponse) => {
    console.log('App B - Login successful:', response);
    setUserSession(response);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserSession(null);
  };

  if (!isLoggedIn || !userSession) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <WelcomeScreen user={userSession} onLogout={handleLogout} />
    </Suspense>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
