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
import { useRegistrationViewModel, Role } from '../viewmodels/auth/useRegistrationViewModel';

interface RegistrationScreenProps {
  onBack: () => void;
  onSuccess: (phone: string) => void;
  viewModel: ReturnType<typeof useRegistrationViewModel>;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ 
  onBack, 
  onSuccess, 
  viewModel 
}) => {
  const {
    role, setRole,
    showRolePicker, setShowRolePicker,
    formData,
    updateField,
    agreedToTerms, setAgreedToTerms,
    confirmedOwnership, setConfirmedOwnership,
    isLoading,
    error,
    handleRegister,
  } = viewModel;

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const shouldShowError = (field: keyof typeof formData) => {
    // Подсвечиваем красным, если есть общая ошибка и это поле пустое
    return error === 'Заполните обязательные поля!' && !formData[field].trim();
  };

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
      <View style={[
        styles.inputContainer,
        focusedField === field && styles.inputFocused,
        shouldShowError(field) && styles.inputError
      ]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={(text) => {
            // Для email убираем пробелы
            const processedText = field === 'email' ? text.trim() : text;
            updateField(field, processedText);
          }}
          keyboardType={keyboardType}
          secureTextEntry={secure}
          placeholderTextColor="#A9A9A9"
          onFocus={() => setFocusedField(field)}
          onBlur={() => setFocusedField(null)}
        />
        {secure && (
          <Image 
            source={require('../../assets/images/key.png')} 
            style={styles.keyIcon} 
          />
        )}
      </View>
    </View>
  );

  const Checkbox = ({ checked, onPress, label }: { checked: boolean, onPress: () => void, label: string }) => (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Text style={styles.checkboxIcon}>✓</Text>}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
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
          
          <Text style={styles.requiredText}>Обязательные поля отмечены *</Text>

          {renderInput('Фамилия Имя Отчество *', formData.fullName, 'fullName', '')}
          {renderInput('Email *', formData.email, 'email', '', 'email-address')}
          {renderInput('Номер телефона *', formData.phone, 'phone', '', 'phone-pad')}
          {renderInput('Пароль *', formData.password, 'password', '', 'default', true)}
          {renderInput('Пароль еще раз *', formData.confirmPassword, 'confirmPassword', '', 'default', true)}

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Роль в системе *</Text>
            <TouchableOpacity
              style={[styles.roleSelector, showRolePicker && styles.inputFocused]}
              onPress={() => setShowRolePicker(!showRolePicker)}
            >
              <Text style={styles.roleText}>{role === 'passenger' ? 'Пассажир' : 'Водитель'}</Text>
              <Text style={styles.dropdownIcon}>↓</Text>
            </TouchableOpacity>

            {showRolePicker && (
              <View style={styles.dropdown}>
                {(['passenger', 'driver'] as Role[]).map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setRole(r);
                      setShowRolePicker(false);
                    }}
                  >
                    <Text style={[styles.roleText, role === r && styles.roleTextActive]}>
                      {r === 'passenger' ? 'Пассажир' : 'Водитель'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {role === 'driver' && (
            <View style={styles.driverSection}>
              <Text style={styles.sectionTitle}>Данные машины</Text>
              {renderInput('Номер *', formData.vehicleNumber, 'vehicleNumber', '')}
              {renderInput('Марка *', formData.vehicleMake, 'vehicleMake', '')}
              {renderInput('Модель *', formData.vehicleModel, 'vehicleModel', '')}
              {renderInput('Цвет как в документах*', formData.vehicleColor, 'vehicleColor', '')}
              {renderInput('Год выпуска *', formData.vehicleYear, 'vehicleYear', '', 'numeric')}
              {renderInput('Количество мест *', formData.vehicleSeats, 'vehicleSeats', '', 'numeric')}
              
              <Checkbox 
                checked={confirmedOwnership} 
                onPress={() => setConfirmedOwnership(!confirmedOwnership)}
                label="Я подтверждаю, что являюсь владельцем указанной машины и машина не находится в розыске"
              />
            </View>
          )}

          <Checkbox 
            checked={agreedToTerms} 
            onPress={() => setAgreedToTerms(!agreedToTerms)}
            label="Согласен с условиями пользования"
          />

          {/* Ошибка теперь НАД кнопкой */}
          {error && <Text style={styles.globalErrorText}>{error}</Text>}

          <TouchableOpacity 
            style={[styles.submitButton, isLoading && styles.buttonDisabled]} 
            onPress={() => handleRegister(onSuccess)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#555" />
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
  headerImage: { width: '100%', height: 220 },
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
  backButtonText: { fontSize: 30, color: '#000', fontWeight: 'bold', transform: [{ translateY: -3 }] },
  formContainer: { paddingHorizontal: 25, paddingTop: 20 },
  title: { fontSize: 40, fontWeight: 'bold', color: '#000', textAlign: 'center', marginBottom: 30 },
  requiredText: { fontSize: 14, color: '#999', marginBottom: 25, fontWeight: '500' },
  inputWrapper: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#000', marginBottom: 10, marginLeft: 5 },
  inputContainer: {
    backgroundColor: '#EAEAEA',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  input: { flex: 1, fontSize: 16, color: '#000', height: '100%' },
  inputFocused: { borderColor: '#007AFF', backgroundColor: '#F8F8F8' },
  inputError: { backgroundColor: '#FFD6D6', borderColor: '#FF0000' },
  keyIcon: { width: 18, height: 18, tintColor: '#000', resizeMode: 'contain' },
  
  roleSelector: {
    backgroundColor: '#EAEAEA',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  roleText: { fontSize: 16, color: '#666' },
  roleTextActive: { color: '#007AFF', fontWeight: 'bold' },
  dropdownIcon: { fontSize: 18, color: '#000' },
  dropdown: {
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    marginTop: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  dropdownItem: { paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#DDD' },
  
  driverSection: { marginTop: 20 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#000', textAlign: 'center', marginBottom: 25 },
  
  checkboxContainer: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 10, paddingHorizontal: 5 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: { backgroundColor: '#333' },
  checkboxIcon: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  checkboxLabel: { flex: 1, fontSize: 13, color: '#000', lineHeight: 18 },
  
  globalErrorText: { 
    color: 'red', 
    textAlign: 'center', 
    marginBottom: 10, // Отступ снизу до кнопки
    marginTop: 15,    // Отступ сверху от чекбоксов
    fontWeight: 'bold', 
    fontSize: 14 
  },
  submitButton: {
    backgroundColor: '#D1E3FF',
    borderRadius: 15,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10, // Уменьшен отступ, так как сверху теперь может быть ошибка
  },
  buttonDisabled: { backgroundColor: '#DDD' },
  submitButtonText: { color: '#5E7A90', fontSize: 18, fontWeight: 'bold' },
});

export default RegistrationScreen;
