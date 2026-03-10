import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

export const LoginScreen = () => {
  // Состояния для хранения того, что вводит пользователь
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Вход</Text>
        <Text style={styles.subtitle}>Добро пожаловать в PickMe!</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true} // Скрывает пароль звездочками
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Войти</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>Нет аккаунта? Зарегистрироваться</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F5F5' 
  },
  formContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20 
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#333333', 
    marginBottom: 10, 
    textAlign: 'center' 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#666666', 
    marginBottom: 30, 
    textAlign: 'center' 
  },
  input: { 
    backgroundColor: '#FFFFFF', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: '#DDDDDD', 
    fontSize: 16 
  },
  button: { 
    backgroundColor: '#007AFF', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginTop: 10 
  },
  buttonText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  linkButton: { 
    marginTop: 20, 
    alignItems: 'center' 
  },
  linkText: { 
    color: '#007AFF', 
    fontSize: 14 
  }
});