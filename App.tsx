/**
 * Pick Me — Clean Architecture + MVVM Implementation
 */

import React, { useState, useMemo } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import YaMap from 'react-native-yamap';

YaMap.init('bccd5891-767c-424d-bab2-c7c4d379521a');

// UI
import WelcomeScreen from './src/presentation/screens/WelcomeScreen';
import OnboardingScreen from './src/presentation/screens/OnboardingScreen';
import { LoginScreen } from './src/presentation/screens/LoginScreen';
import RegistrationScreen from './src/presentation/screens/DriverRegistrationScreen'; // Теперь это общий экран регистрации
import { VerificationScreen } from './src/presentation/screens/VerificationScreen';
import { SuccessRegistrationScreen } from './src/presentation/screens/SuccessRegistrationScreen';
import SearchScreen, { SearchParams } from './src/presentation/screens/SearchScreen';
import SearchResultsScreen from './src/presentation/screens/SearchResultsScreen';
import TripMapScreen from './src/presentation/screens/TripMapScreen';
import { Order } from './src/data/mock/mockOrders';

// Architecture Layers
import { AuthRepositoryImpl } from './src/data/repositories/AuthRepositoryImpl';
import { LoginUseCase } from './src/domain/usecases/auth/LoginUseCase';
import { RegisterDriverUseCase } from './src/domain/usecases/auth/RegisterDriverUseCase';
import { VerifyPhoneUseCase } from './src/domain/usecases/auth/VerifyPhoneUseCase';
import { useLoginViewModel } from './src/presentation/viewmodels/auth/useLoginViewModel';
import { useRegistrationViewModel } from './src/presentation/viewmodels/auth/useRegistrationViewModel';
import { useVerificationViewModel } from './src/presentation/viewmodels/auth/useVerificationViewModel';

type AppScreen = 'welcome' | 'onboarding' | 'login' | 'register' | 'verification' | 'success_registration' | 'search' | 'search_results' | 'trip_map';


function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('welcome');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchParams, setSearchParams] = useState<SearchParams>({ from: '', to: '', date: '', passengers: '' });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // 1. Инициализация репозитория
  const authRepository = useMemo(() => new AuthRepositoryImpl(), []);

  // 2. Инициализация UseCases
  const loginUseCase = useMemo(() => new LoginUseCase(authRepository), [authRepository]);
  const registerDriverUseCase = useMemo(() => new RegisterDriverUseCase(authRepository), [authRepository]);
  const verifyPhoneUseCase = useMemo(() => new VerifyPhoneUseCase(authRepository), [authRepository]);
  
  // 3. Инициализация ViewModels
  const loginViewModel = useLoginViewModel(loginUseCase, () => setCurrentScreen('search'));
  const registrationViewModel = useRegistrationViewModel(registerDriverUseCase);
  const verificationViewModel = useVerificationViewModel(verifyPhoneUseCase);

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
            viewModel={loginViewModel}
            onRegister={() => setCurrentScreen('onboarding')} 
            onBack={() => setCurrentScreen('welcome')}
          />
        );
      case 'register':
        return (
          <RegistrationScreen 
            viewModel={registrationViewModel}
            onBack={() => setCurrentScreen('onboarding')} 
            onSuccess={(phone) => {
              setPhoneNumber(phone);
              setCurrentScreen('verification');
            }}
          />
        );
      case 'verification':
        return (
          <VerificationScreen
            viewModel={verificationViewModel}
            phoneNumber={phoneNumber}
            onVerify={() => setCurrentScreen('success_registration')}
            onBack={() => setCurrentScreen('register')}
          />
        );
      case 'success_registration':
        return (
          <SuccessRegistrationScreen
            onFinish={() => setCurrentScreen('search')}
          />
        );
      case 'search':
        return (
          <SearchScreen
            onSearch={(params) => {
              setSearchParams(params);
              setCurrentScreen('search_results');
            }}
          />
        );
      case 'search_results':
        return (
          <SearchResultsScreen
            searchParams={searchParams}
            onBack={() => setCurrentScreen('search')}
            onSelectOrder={(order: Order) => {
              setSelectedOrder(order);
              setCurrentScreen('trip_map');
            }}
          />
        );
      case 'trip_map':
        return selectedOrder ? (
          <TripMapScreen
            order={selectedOrder}
            onBack={() => setCurrentScreen('search_results')}
          />
        ) : null;
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
  container: { flex: 1, backgroundColor: '#fff' },
});

export default App;
