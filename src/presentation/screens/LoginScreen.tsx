import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useLoginViewModel, Role } from '../viewmodels/auth/useLoginViewModel';

const ROLES = [
  { label: 'Пассажир', value: 'passenger' },
  { label: 'Водитель', value: 'driver' },
];

interface LoginScreenProps {
  onRegister: () => void;
  onBack: () => void;
  viewModel: ReturnType<typeof useLoginViewModel>;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ 
  onRegister, 
  onBack, 
  viewModel 
}) => {
  const {
    phone, setPhone,
    password, setPassword,
    role, setRole,
    isLoading,
    error,
    showRolePicker, setShowRolePicker,
    handleLogin,
  } = viewModel;

  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Для подсветки ошибок из ViewModel (упрощенная реализация)
  const hasError = !!error;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.imageHeaderContainer}>
          <Image 
            source={require('../../assets/images/login_header.png')} 
            style={styles.headerImage} 
            resizeMode="cover"
          />
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Вход</Text>
          
          <Text style={styles.requiredText}>Обязательные поля отмечены *</Text>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Text style={styles.label}>Роль в системе *</Text>
          <TouchableOpacity
            style={[styles.input, styles.roleInput, showRolePicker && styles.inputActive]}
            onPress={() => setShowRolePicker(!showRolePicker)}
            activeOpacity={0.7}>
            <Text style={styles.roleText}>
              {role === 'passenger' ? 'Пассажир' : 'Водитель'}
            </Text>
            <Text style={styles.dropdownIcon}>{showRolePicker ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {showRolePicker && (
            <View style={styles.dropdownContainer}>
              {ROLES.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setRole(item.value as Role);
                    setShowRolePicker(false);
                  }}>
                  <Text
                    style={[
                      styles.dropdownOptionText,
                      role === item.value && styles.dropdownOptionTextActive,
                    ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.label}>Номер телефона *</Text>
          <TextInput
            style={[
              styles.input, 
              isPhoneFocused && styles.inputFocused,
              hasError && !phone && styles.inputError
            ]}
            placeholder="89134567890"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor="#A9A9A9"
            onFocus={() => setIsPhoneFocused(true)}
            onBlur={() => setIsPhoneFocused(false)}
          />

          <Text style={styles.label}>Пароль *</Text>
          <View style={[
            styles.passwordContainer, 
            isPasswordFocused && styles.inputFocused,
            hasError && !password && styles.inputError
          ]}>
            <TextInput
              style={styles.passwordInput}
              placeholder="****************"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              placeholderTextColor="#A9A9A9"
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
            />
            <View style={styles.iconWrapper}>
              <Image 
                source={require('../../assets/images/key.png')} 
                style={styles.iconImage} 
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.loginButtonText}>Войти</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotButton}>
            <Text style={styles.forgotButtonText}>Забыли пароль?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.registerContainer} 
            onPress={onRegister}
            activeOpacity={0.7}
          >
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
  imageHeaderContainer: { position: 'relative' },
  headerImage: { width: '100%', height: 240 },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 30,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    transform: [{ translateY: -6 }],
    marginLeft: -2,
  },
  formContainer: { paddingHorizontal: 20, paddingTop: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#000', textAlign: 'center', marginBottom: 20 },
  requiredText: { fontSize: 12, color: '#666', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#000', marginBottom: 8, marginLeft: 5 },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 10, fontWeight: 'bold' },
  input: {
    backgroundColor: '#EAEAEA',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 55,
    marginBottom: 20,
    fontSize: 16,
    color: '#000',
    borderWidth: 1.5,
    borderColor: 'transparent',
    justifyContent: 'center',
  },
  roleInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputActive: {
    borderColor: '#007AFF',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginBottom: 0,
  },
  roleText: {
    fontSize: 16,
    color: '#000',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
  },
  dropdownContainer: {
    backgroundColor: '#F0F0F0',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#007AFF',
    borderTopWidth: 0,
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#DDD',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownOptionTextActive: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 55,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: '#007AFF',
    backgroundColor: '#F8F8F8',
  },
  inputError: {
    backgroundColor: '#FFD6D6',
    borderColor: '#FF0000',
  },
  passwordInput: { flex: 1, fontSize: 16, color: '#000' },
  iconWrapper: { 
    width: 30,
    alignItems: 'flex-end',
    justifyContent: 'center' 
  },
  iconImage: { 
    width: 20, 
    height: 20, 
    resizeMode: 'contain',
    tintColor: '#000'
  },
  loginButton: {
    backgroundColor: '#C6DBF0',
    borderRadius: 30,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: '#DDD',
  },
  loginButtonText: { color: '#555', fontSize: 18, fontWeight: '500' },
  forgotButton: {
    backgroundColor: '#EAEAEA',
    borderRadius: 30,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  forgotButtonText: { color: '#555', fontSize: 16 },
  registerContainer: { alignItems: 'center' },
  registerText: { fontSize: 14, color: '#333' },
  registerLink: { fontWeight: 'bold', textDecorationLine: 'underline' },
});
