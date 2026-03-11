import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';

interface WelcomeScreenProps {
  onRegister: () => void;
  onLogin: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onRegister, onLogin }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" transparent backgroundColor="transparent" />
      <Image 
        source={require('../assets/images/login_header.png')} 
        style={styles.headerImage} 
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Добро пожаловать в PickMe!*</Text>
            <Text style={styles.subtitle}>*Лучшее приложение для поездок!</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={onRegister}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Регистрация</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.button} 
              onPress={onLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Вход</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Регистрируясь, я принимаю условия и Политику Пользования Приложением.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerImage: {
    width: '100%',
    height: 300,
  },
  safeArea: {
    flex: 1,
    marginTop: -20, // Slight overlap for better layout
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    color: '#000',
    marginBottom: 10,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 15,
  },
  button: {
    backgroundColor: '#D1E3FF',
    borderRadius: 15,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#5E7A90',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 11,
    color: '#777',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default WelcomeScreen;
