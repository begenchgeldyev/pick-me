import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

export const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Image 
          source={require('../assets/images/login_header.png')} 
          style={styles.headerImage} 
          resizeMode="cover"
        />

        <View style={styles.formContainer}>
          <Text style={styles.title}>Вход</Text>
          
          <Text style={styles.requiredText}>Обязательные поля отмечены *</Text>

          <Text style={styles.label}>Номер телефона *</Text>
          <TextInput
            style={[styles.input, isPhoneFocused && styles.inputFocused]}
            placeholder="Введите номер телефона"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor="#A9A9A9"
            onFocus={() => setIsPhoneFocused(true)} 
            onBlur={() => setIsPhoneFocused(false)} 
          />

          <Text style={styles.label}>Пароль *</Text>
          <View style={[styles.passwordContainer, isPasswordFocused && styles.inputFocused]}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Введите пароль"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              placeholderTextColor="#A9A9A9"
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
            />
            <View style={styles.iconWrapper}>
              <Image 
                source={require('../assets/images/key.png')} 
                style={styles.iconImage} 
              />
            </View>
          </View>

          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Войти</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotButton}>
            <Text style={styles.forgotButtonText}>Забыли пароль?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Нет аккаунта? <Text style={styles.registerLink}>Зарегистрироваться</Text>
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { flexGrow: 1, paddingBottom: 30 },
  headerImage: { width: '100%', height: 240 },
  formContainer: { paddingHorizontal: 20, paddingTop: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#000', textAlign: 'center', marginBottom: 20 },
  requiredText: { fontSize: 14, color: '#666', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#000', marginBottom: 8, marginLeft: 5 },
  

  input: {
    backgroundColor: '#EAEAEA',
    borderRadius: 30,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 20,
    fontSize: 16,
    color: '#000', 
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
    borderRadius: 30,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 30,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  
  inputFocused: {
    borderColor: '#007AFF',
    backgroundColor: '#F8F8F8',
  },

  passwordInput: { flex: 1, fontSize: 16, color: '#000' },
  
  iconWrapper: { 
    width: 30,
    alignItems: 'flex-end',
    justifyContent: 'center' 
  },
  
  iconImage: { 
    width: 15, 
    height: 15, 
    resizeMode: 'contain',
    tintColor: '#999'
  },
  
  loginButton: {
    backgroundColor: '#C6DBF0',
    borderRadius: 15,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: { color: '#555', fontSize: 18, fontWeight: '500' },
  forgotButton: {
    backgroundColor: '#EAEAEA',
    borderRadius: 15,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  forgotButtonText: { color: '#555', fontSize: 18},
  registerContainer: { alignItems: 'center' },
  registerText: { fontSize: 14, color: '#333' },
  registerLink: { fontWeight: 'bold', textDecorationLine: 'underline' },
});