import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Platform,
} from 'react-native';

interface SuccessRegistrationScreenProps {
  onFinish: () => void;
}

export const SuccessRegistrationScreen: React.FC<SuccessRegistrationScreenProps> = ({
  onFinish,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageHeaderContainer}>
          <Image
            source={require('../../assets/images/registration_header.png')}
            style={styles.headerImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>
            Поздравляем вы успешно зарегистрированы!
          </Text>
          
          <Text style={styles.subtitle}>
            Не забудьте подтвердить свою почту в личном кабинете. Это нужно чтобы повысить безопасность и комфорт пользования.
          </Text>
          
          <Text style={styles.hint}>
            Давайте уже скорее куда-нибудь отправимся!
          </Text>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.finishButton} onPress={onFinish}>
              <Text style={styles.finishButtonText}>Поехали!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  imageHeaderContainer: {
    width: '100%',
    height: 250,
    overflow: 'hidden',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  hint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    paddingBottom: 20,
  },
  finishButton: {
    backgroundColor: '#C6DBF0',
    borderRadius: 15,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  finishButtonText: {
    color: '#555',
    fontSize: 18,
    fontWeight: '500',
  },
});
