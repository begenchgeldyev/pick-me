import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';

interface OnboardingScreenProps {
  onFinish: () => void;
  onSkip: () => void;
  onBack: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish, onSkip, onBack }) => {
  const [step, setStep] = useState(0);
  const totalSteps = 4;

  const nextStep = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      onFinish();
    }
  };

  const renderStepIndicators = () => {
    return (
      <View style={styles.indicatorContainer}>
        {[...Array(totalSteps)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.indicator,
              i <= step ? styles.indicatorActive : styles.indicatorInactive,
            ]}
          />
        ))}
      </View>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <View style={styles.imageCircle}>
              <Image 
                source={require('../assets/images/lightning_mcqueen.png')} 
                style={styles.mcqueenImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>Вы почти с нами!</Text>
            <Text style={styles.subtitle}>
              Ознакомьтесь с основной информацией перед началом.
            </Text>
            <Text style={styles.description}>
              Собрали немного информации по функционалу и правилам для Вас.
            </Text>
          </View>
        );
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.title}>Возможности:</Text>
            <View style={styles.listContainer}>
              <Text style={styles.listItem}>• Создавайте аккаунт водителя, если хотите отправиться в поездку и ищете пассажиров.</Text>
              <Text style={styles.listItem}>• Создавайте аккаунт пассажира, если хотите отправиться в поездку и ищете водителя.</Text>
              <Text style={styles.listItem}>• Вы можете сами задавать цены на поездки и правила поведения в вашей машине, а также время и место сбора.</Text>
              <Text style={styles.listItem}>• Вы можете обсуждать детали поездок в личных сообщениях.</Text>
              <Text style={styles.listItem}>• Вы точно не забудете о поездке, так как получите уведомление!</Text>
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.title}>Правила:</Text>
            <View style={styles.listContainer}>
              <Text style={styles.listItem}>• При отмене поездки менее чем за сутки ваш рейтинг будет снижен на 0,2 балла.</Text>
              <Text style={styles.listItem}>• При отмене поездки менее чем за сутки 3 и более раз подряд вы будете заблокированы в системе на 10 дней.</Text>
              <Text style={styles.listItem}>• Общение должно быть уважительным и культурным.</Text>
              <Text style={styles.listItem}>• Расчет возможен только наличными и в конце поездки.</Text>
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.title}>Спасибо за доверие!</Text>
            <Text style={styles.subtitle}>
              Надеемся на долгое сотрудничество!
            </Text>
            <Text style={styles.description}>
              Возможности и правила вы сможете еще раз прочитать в приложении в любое время.
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.indicatorContainer}>
          {[...Array(totalSteps)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.indicator,
                i <= step ? styles.indicatorActive : styles.indicatorInactive,
              ]}
            />
          ))}
        </View>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderStepContent()}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={nextStep}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>
            {step === 0 ? 'Поехали' : step === totalSteps - 1 ? 'Дальше' : 'Дальше'}
          </Text>
        </TouchableOpacity>

        {step < totalSteps - 1 && (
          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={onSkip}
            activeOpacity={0.6}
          >
            <Text style={styles.secondaryButtonText}>Пропустить</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
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
  indicatorContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },
  indicator: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  indicatorActive: {
    backgroundColor: '#999',
  },
  indicatorInactive: {
    backgroundColor: '#DDD',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  stepContent: {
    alignItems: 'center',
  },
  imageCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: '#F8F8F8', // Changed to light gray for better look
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  mcqueenImage: {
    width: '90%',
    height: '90%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  listContainer: {
    width: '100%',
    marginTop: 10,
  },
  listItem: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 10,
  },
  buttonContainer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#C6DBF0',
    borderRadius: 15,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#444',
    fontSize: 18,
    fontWeight: '500',
  },
  secondaryButton: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#888',
    fontSize: 16,
  },
});

export default OnboardingScreen;
