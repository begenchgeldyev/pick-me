/**
 * Pick Me — Driver Registration
 *
 * @format
 */

import React, { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import WelcomeScreen from './src/screens/WelcomeScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import DriverRegistrationScreen from './src/screens/DriverRegistrationScreen';

type AppScreen = 'welcome' | 'onboarding' | 'login' | 'register';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('welcome');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <WelcomeScreen 
            onRegister={() => setCurrentScreen('onboarding')} 
            onLogin={() => setCurrentScreen('login')} 
          />
        );
      case 'onboarding':
        return (
          <OnboardingScreen 
            onFinish={() => setCurrentScreen('register')} 
            onSkip={() => setCurrentScreen('register')} 
            onBack={() => setCurrentScreen('welcome')}
          />
        );
      case 'login':
        return (
          <LoginScreen 
            onRegister={() => setCurrentScreen('onboarding')} 
            onBack={() => setCurrentScreen('welcome')}
          />
        );
      case 'register':
        return <DriverRegistrationScreen onBack={() => setCurrentScreen('onboarding')} />;
      default:
        return <WelcomeScreen onRegister={() => setCurrentScreen('onboarding')} onLogin={() => setCurrentScreen('login')} />;
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {renderScreen()}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
