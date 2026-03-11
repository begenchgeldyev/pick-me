import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useVerificationViewModel } from '../viewmodels/auth/useVerificationViewModel';

interface VerificationScreenProps {
  phoneNumber: string;
  onVerify: () => void;
  onBack: () => void;
  viewModel: ReturnType<typeof useVerificationViewModel>;
}

export const VerificationScreen: React.FC<VerificationScreenProps> = ({
  phoneNumber,
  onVerify,
  onBack,
  viewModel,
}) => {
  const {
    code, setCode,
    isLoading,
    error,
    handleVerify,
    resendCode,
  } = viewModel;

  const [codeArray, setCodeArray] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<Array<TextInput | null>>([null, null, null, null]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCodeChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text[text.length - 1];
    }
    const newCodeArray = [...codeArray];
    newCodeArray[index] = text;
    setCodeArray(newCodeArray);
    
    // Синхронизируем с ViewModel
    setCode(newCodeArray.join(''));

    if (text !== '' && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && codeArray[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onResendPress = () => {
    setTimer(60);
    resendCode();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.imageHeaderContainer}>
          <Image
            source={require('../../assets/images/registration_header.png')}
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
          <Text style={styles.title}>
            Отправили вам код подтверждения на номер телефона {phoneNumber}
          </Text>
          <Text style={styles.subtitle}>Введите код подтверждения</Text>

          <View style={styles.otpContainer}>
            {codeArray.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[styles.otpInput, error && styles.otpInputError]}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
              />
            ))}
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            onPress={timer === 0 ? onResendPress : undefined}
            disabled={timer > 0}
            style={styles.resendButton}
            activeOpacity={0.7}
          >
            <Text style={[styles.resendText, timer === 0 && styles.resendTextActive]}>
              Запросить новый код подтверждения {timer > 0 ? formatTime(timer) : ''}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.verifyButton, isLoading && styles.buttonDisabled]} 
              onPress={() => handleVerify(onVerify)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#555" />
              ) : (
                <Text style={styles.verifyButtonText}>Поехали!</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1 },
  imageHeaderContainer: { position: 'relative', width: '100%', height: 250, overflow: 'hidden' },
  headerImage: { width: '100%', height: '100%' },
  backButton: {
    position: 'absolute',
    top: 20,
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
  formContainer: { flex: 1, paddingHorizontal: 30, paddingTop: 30, alignItems: 'center' },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 28,
  },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 30 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
  otpInput: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    borderWidth: 1,
    borderColor: '#E8F3F8',
    fontSize: 24,
    color: '#000',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
      android: { elevation: 2 },
    }),
  },
  otpInputError: { backgroundColor: '#FFE5E5', borderColor: '#FFCCCC' },
  errorText: { color: '#FF0000', fontSize: 14, marginBottom: 10, fontWeight: '500' },
  resendButton: { marginBottom: 20 },
  resendText: { fontSize: 14, color: '#999', textAlign: 'center' },
  resendTextActive: { color: '#3498DB', fontWeight: '500' },
  footer: { flex: 1, justifyContent: 'flex-end', width: '100%', paddingBottom: 20 },
  verifyButton: {
    backgroundColor: '#C6DBF0',
    borderRadius: 15,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonDisabled: { backgroundColor: '#DDD' },
  verifyButtonText: { color: '#555', fontSize: 18, fontWeight: '500' },
});
