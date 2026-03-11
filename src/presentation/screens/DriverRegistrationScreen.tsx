import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useDriverRegistrationViewModel } from '../viewmodels/auth/useDriverRegistrationViewModel';

interface DriverRegistrationScreenProps {
  onBack: () => void;
  onSuccess: (phone: string) => void;
  viewModel: ReturnType<typeof useDriverRegistrationViewModel>;
}

const DriverRegistrationScreen: React.FC<DriverRegistrationScreenProps> = ({ 
  onBack, 
  onSuccess, 
  viewModel 
}) => {
  const {
    formData,
    updateField,
    isLoading,
    error,
    handleRegister,
  } = viewModel;

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const renderInput = (
    label: string, 
    value: string, 
    field: keyof typeof formData, 
    placeholder: string, 
    keyboardType: any = 'default',
    secure: boolean = false
  ) => (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, focusedField === field && styles.inputFocused]}
        placeholder={placeholder}
        value={value}
        onChangeText={(text) => updateField(field, text)}
        keyboardType={keyboardType}
        secureTextEntry={secure}
        placeholderTextColor="#A9A9A9"
        onFocus={() => setFocusedField(field)}
        onBlur={() => setFocusedField(null)}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Image 
            source={require('../../assets/images/registration_header.png')} 
            style={styles.headerImage} 
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Регистрация</Text>
          <Text style={styles.subtitle}>водитель</Text>
          
          <Text style={styles.requiredText}>Обязательные поля отмечены *</Text>
          {error && <Text style={styles.errorText}>{error}</Text>}

          <Text style={styles.sectionTitle}>Личные данные</Text>
          {renderInput('ФИО *', formData.fullName, 'fullName', 'Иван Иванов')}
          {renderInput('Email *', formData.email, 'email', 'example@mail.ru', 'email-address')}
          {renderInput('Номер телефона *', formData.phone, 'phone', '89990000000', 'phone-pad')}
          {renderInput('Пароль *', formData.password, 'password', '••••••••', 'default', true)}
          {renderInput('Номер ВУ *', formData.licenseNumber, 'licenseNumber', '77 12 345678')}

          <Text style={styles.sectionTitle}>Данные автомобиля</Text>
          {renderInput('Гос. номер *', formData.vehicleNumber, 'vehicleNumber', 'А 123 БВ 77')}
          {renderInput('Марка *', formData.vehicleMake, 'vehicleMake', 'Toyota')}
          {renderInput('Модель *', formData.vehicleModel, 'vehicleModel', 'Camry')}
          {renderInput('Цвет *', formData.vehicleColor, 'vehicleColor', 'Белый')}
          {renderInput('Год выпуска *', formData.vehicleYear, 'vehicleYear', '2020', 'numeric')}
          {renderInput('Количество мест *', formData.vehicleSeats, 'vehicleSeats', '4', 'numeric')}

          <TouchableOpacity 
            style={[styles.submitButton, isLoading && styles.buttonDisabled]} 
            onPress={() => handleRegister(onSuccess)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitButtonText}>Зарегистрироваться</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },
  headerContainer: { position: 'relative' },
  headerImage: { width: '100%', height: 200 },
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
  },
  backButtonText: { fontSize: 30, color: '#000', fontWeight: 'bold' },
  formContainer: { paddingHorizontal: 20, paddingTop: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#000', textAlign: 'center' },
  subtitle: { fontSize: 18, color: '#666', textAlign: 'center', marginBottom: 20, marginTop: -5 },
  requiredText: { fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#000', marginTop: 10, marginBottom: 15 },
  inputWrapper: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#000', marginBottom: 8, marginLeft: 5 },
  input: {
    backgroundColor: '#EAEAEA',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
    color: '#000',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputFocused: { borderColor: '#007AFF', backgroundColor: '#F8F8F8' },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 15 },
  submitButton: {
    backgroundColor: '#C6DBF0',
    borderRadius: 15,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: { backgroundColor: '#DDD' },
  submitButtonText: { color: '#555', fontSize: 18, fontWeight: 'bold' },
});

export default DriverRegistrationScreen;
