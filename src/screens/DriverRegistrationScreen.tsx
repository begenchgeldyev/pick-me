import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { registerDriver, registerPassenger } from '../api/auth';

const PLATE_REGEX = /^[АВЕКМНОРСТУХ]\d{3}[АВЕКМНОРСТУХ]{2}\d{2,3}$/i;

interface FieldErrors {
  [key: string]: string;
}

type Role = 'passenger' | 'driver';

const ROLES = [
  { label: 'Пассажир', value: 'passenger' },
  { label: 'Водитель', value: 'driver' },
];

interface DriverRegistrationScreenProps {
  onBack: () => void;
}

export default function DriverRegistrationScreen({ onBack }: DriverRegistrationScreenProps) {
  const [role, setRole] = useState<Role>('passenger');
  const [showRolePicker, setShowRolePicker] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehicleSeats, setVehicleSeats] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [vehicleOwnerAccepted, setVehicleOwnerAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const newErrors: FieldErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Обязательное поле';
    }
    if (!email.trim()) {
      newErrors.email = 'Обязательное поле';
    }
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Обязательное поле';
    }
    if (!password) {
      newErrors.password = 'Обязательное поле';
    } else if (password.length < 8) {
      newErrors.password = 'Минимум 8 символов';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Обязательное поле';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    if (role === 'driver') {
      if (!licenseNumber.trim()) {
        newErrors.licenseNumber = 'Обязательное поле';
      }
      if (!vehicleNumber.trim()) {
        newErrors.vehicleNumber = 'Обязательное поле';
      } else if (!PLATE_REGEX.test(vehicleNumber.trim())) {
        newErrors.vehicleNumber = 'Некорректный номер!';
      }
      if (!vehicleMake.trim()) {
        newErrors.vehicleMake = 'Обязательное поле';
      }
      if (!vehicleModel.trim()) {
        newErrors.vehicleModel = 'Обязательное поле';
      }
      if (!vehicleColor.trim()) {
        newErrors.vehicleColor = 'Обязательное поле';
      }
      if (!vehicleYear.trim()) {
        newErrors.vehicleYear = 'Обязательное поле';
      } else {
        const year = parseInt(vehicleYear, 10);
        if (isNaN(year) || year < 1900) {
          newErrors.vehicleYear = 'Некорректный год!';
        } else if (year > new Date().getFullYear()) {
          newErrors.vehicleYear = 'Год не может быть больше текущего!';
        }
      }
      if (!vehicleSeats.trim()) {
        newErrors.vehicleSeats = 'Обязательное поле';
      } else {
        const seats = parseInt(vehicleSeats, 10);
        if (isNaN(seats) || seats < 1 || seats > 99) {
          newErrors.vehicleSeats = 'Некорректное количество мест!';
        }
      }
      if (!vehicleOwnerAccepted) {
        newErrors.vehicleOwner = 'Необходимо подтверждение';
      }
    }

    if (!termsAccepted) {
      newErrors.terms = 'Необходимо принять условия';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      if (role === 'driver') {
        await registerDriver({
          fullName: fullName.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim(),
          password,
          licenseNumber: licenseNumber.trim(),
          vehicleNumber: vehicleNumber.trim(),
          vehicleMake: vehicleMake.trim(),
          vehicleModel: vehicleModel.trim(),
          vehicleColor: vehicleColor.trim(),
          vehicleYear: parseInt(vehicleYear, 10),
          vehicleSeats: parseInt(vehicleSeats, 10),
        });
      } else {
        await registerPassenger({
          fullName: fullName.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim(),
          password,
        });
      }
      Alert.alert('Успех', 'Регистрация прошла успешно. Проверьте email для подтверждения.');
    } catch (error: any) {
      Alert.alert('Ошибка', error.message || 'Произошла ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  }

  function renderField(
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    errorKey: string,
    options?: {
      secureTextEntry?: boolean;
      showToggle?: boolean;
      toggleValue?: boolean;
      onToggle?: () => void;
      keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
      autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
      editable?: boolean;
    },
  ) {
    const hasError = !!errors[errorKey];
    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          {label} <Text style={styles.asterisk}>*</Text>
        </Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[
              styles.input,
              hasError && styles.inputError,
              options?.editable === false && styles.inputDisabled,
            ]}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={options?.secureTextEntry && !options?.toggleValue}
            keyboardType={options?.keyboardType || 'default'}
            autoCapitalize={options?.autoCapitalize ?? 'sentences'}
            editable={options?.editable}
          />
          {options?.showToggle && (
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={options.onToggle}>
              <Text style={styles.eyeIcon}>
                {options.toggleValue ? '🙈' : '👁'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {hasError && <Text style={styles.errorText}>{errors[errorKey]}</Text>}
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>PICK ME</Text>
        </View>
        <View style={{ width: 40 }} /> 
      </View>
      <Text style={styles.title}>Регистрация</Text>

      {renderField('Фамилия Имя Отчество', fullName, setFullName, 'fullName', {
        autoCapitalize: 'words',
      })}
      {renderField('Email', email, setEmail, 'email', {
        keyboardType: 'email-address',
        autoCapitalize: 'none',
      })}
      {renderField('Номер телефона', phoneNumber, setPhoneNumber, 'phoneNumber', {
        keyboardType: 'phone-pad',
      })}
      {renderField('Пароль', password, setPassword, 'password', {
        secureTextEntry: true,
        showToggle: true,
        toggleValue: showPassword,
        onToggle: () => setShowPassword(!showPassword),
        autoCapitalize: 'none',
      })}
      {renderField(
        'Пароль ещё раз',
        confirmPassword,
        setConfirmPassword,
        'confirmPassword',
        {
          secureTextEntry: true,
          showToggle: true,
          toggleValue: showConfirmPassword,
          onToggle: () => setShowConfirmPassword(!showConfirmPassword),
          autoCapitalize: 'none',
        },
      )}

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Роль в системе <Text style={styles.asterisk}>*</Text>
        </Text>
        <TouchableOpacity
          style={[styles.input, showRolePicker && styles.inputActive]}
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
      </View>

      {role === 'driver' && (
        <>
          {renderField(
            'Номер водительского удостоверения',
            licenseNumber,
            setLicenseNumber,
            'licenseNumber',
          )}

          <Text style={styles.sectionHeader}>Данные машины</Text>

          {renderField('Номер', vehicleNumber, setVehicleNumber, 'vehicleNumber', {
            autoCapitalize: 'characters',
          })}
          {renderField('Марка', vehicleMake, setVehicleMake, 'vehicleMake')}
          {renderField('Модель', vehicleModel, setVehicleModel, 'vehicleModel')}
          {renderField(
            'Цвет как в документах',
            vehicleColor,
            setVehicleColor,
            'vehicleColor',
          )}
          {renderField(
            'Год выпуска',
            vehicleYear,
            setVehicleYear,
            'vehicleYear',
            { keyboardType: 'numeric' },
          )}
          {renderField(
            'Количество мест',
            vehicleSeats,
            setVehicleSeats,
            'vehicleSeats',
            { keyboardType: 'numeric' },
          )}

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setVehicleOwnerAccepted(!vehicleOwnerAccepted)}
            activeOpacity={0.7}>
            <View style={[styles.checkbox, vehicleOwnerAccepted && styles.checkboxChecked]}>
              {vehicleOwnerAccepted && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              Я подтверждаю, что являюсь владельцем указанной машины и машина не находится в розыске
            </Text>
          </TouchableOpacity>
          {errors.vehicleOwner && (
            <Text style={[styles.errorText, styles.termsError]}>
              {errors.vehicleOwner}
            </Text>
          )}
        </>
      )}

      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setTermsAccepted(!termsAccepted)}
        activeOpacity={0.7}>
        <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
          {termsAccepted && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.checkboxLabel}>
          Я согласен с условиями использования
        </Text>
      </TouchableOpacity>
      {errors.terms && (
        <Text style={[styles.errorText, styles.termsError]}>
          {errors.terms}
        </Text>
      )}

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
        activeOpacity={0.8}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Зарегистрироваться</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 30,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
    transform: [{ translateY: -6 }],
    marginLeft: -2,
  },
  logoPlaceholder: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  fieldContainer: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  asterisk: {
    color: '#e53935',
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: '#fafafa',
    color: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputError: {
    borderColor: '#e53935',
    backgroundColor: '#ffebee',
  },
  inputDisabled: {
    backgroundColor: '#eee',
    justifyContent: 'center',
  },
  inputActive: {
    borderColor: '#2196F3',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  roleText: {
    fontSize: 15,
    color: '#333',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: '#fafafa',
    overflow: 'hidden',
    marginTop: -1,
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  dropdownOptionText: {
    fontSize: 15,
    color: '#333',
  },
  dropdownOptionTextActive: {
    color: '#2196F3',
    fontWeight: '600',
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  eyeIcon: {
    fontSize: 18,
  },
  errorText: {
    color: '#e53935',
    fontSize: 12,
    marginTop: 3,
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    marginBottom: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#2196F3',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#2196F3',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  termsError: {
    marginLeft: 32,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
