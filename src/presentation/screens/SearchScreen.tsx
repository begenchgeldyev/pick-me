import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';

export interface SearchParams {
  from: string;
  to: string;
  date: string;
  passengers: string;
}

interface SearchScreenProps {
  onSearch: (params: SearchParams) => void;
}

function parseDate(value: string): Date | null {
  const parts = value.trim().split('.');
  if (parts.length !== 3) return null;
  const [day, month, year] = parts.map(Number);
  if (!day || !month || !year) return null;
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ onSearch }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState('');
  const [error, setError] = useState('');
  const [errorFields, setErrorFields] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    const fields = new Set<string>();
    let errorMessage = '';

    if (!from.trim() || !to.trim() || !date.trim() || !passengers.trim()) {
      if (!from.trim()) fields.add('from');
      if (!to.trim()) fields.add('to');
      if (!date.trim()) fields.add('date');
      if (!passengers.trim()) fields.add('passengers');
      errorMessage = 'Заполните все поля';
    } else {
      const passengersNum = parseInt(passengers, 10);
      if (isNaN(passengersNum) || passengersNum <= 0) {
        fields.add('passengers');
        errorMessage = 'Количество пассажиров должно быть больше 0';
      }

      if (!fields.has('passengers')) {
        const parsed = parseDate(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (!parsed || parsed < today) {
          fields.add('date');
          errorMessage = 'Выберите дату в будущем';
        }
      }
    }

    setErrorFields(fields);
    setError(errorMessage);

    if (fields.size === 0) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1200));
      setIsLoading(false);
      onSearch({ from, to, date, passengers });
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/login_header.png')}
        style={styles.headerImage}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Поиск</Text>

          <Text style={styles.label}>Откуда</Text>
          <View style={[styles.inputRow, errorFields.has('from') && styles.inputRowError]}>
            <TextInput
              style={styles.input}
              placeholder="г. Томск, проспект Ленина, 128"
              placeholderTextColor="#BBBDC0"
              value={from}
              onChangeText={setFrom}
            />
            <Text style={styles.inputIcon}>↓</Text>
          </View>

          <Text style={styles.label}>Откуда</Text>
          <View style={[styles.inputRow, errorFields.has('to') && styles.inputRowError]}>
            <TextInput
              style={styles.input}
              placeholder="г. Новосибирск, улица Кирова, 44"
              placeholderTextColor="#BBBDC0"
              value={to}
              onChangeText={setTo}
            />
            <Text style={styles.inputIcon}>↓</Text>
          </View>

          <Text style={styles.label}>Дата поездки</Text>
          <View style={[styles.inputRow, errorFields.has('date') && styles.inputRowError]}>
            <TextInput
              style={styles.input}
              placeholder="чт, 26 мар."
              placeholderTextColor="#BBBDC0"
              value={date}
              onChangeText={setDate}
            />
            <Text style={styles.inputIcon}>📅</Text>
          </View>

          <Text style={styles.label}>Количество пассажиров</Text>
          <View style={[styles.inputRow, errorFields.has('passengers') && styles.inputRowError]}>
            <TextInput
              style={styles.input}
              placeholder="1"
              placeholderTextColor="#BBBDC0"
              value={passengers}
              onChangeText={setPassengers}
              keyboardType="numeric"
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <Text style={styles.searchButtonText}>{isLoading ? 'Поиск ...' : 'Найти'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>⌕</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navPlusBox}>
            <Text style={styles.navPlusText}>+</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconGray}>⚲</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconGray}>⊙</Text>
        </TouchableOpacity>
      </View>
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
    height: 200,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
    marginLeft: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F4F6',
    borderRadius: 30,
    paddingHorizontal: 18,
    height: 52,
    marginBottom: 16,
  },
  inputRowError: {
    backgroundColor: '#FDDEDE',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#222',
  },
  inputIcon: {
    fontSize: 18,
    color: '#888',
    marginLeft: 8,
  },
  errorText: {
    color: '#E53935',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: '#C8DEFA',
    borderRadius: 30,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  searchButtonText: {
    color: '#4A6D8C',
    fontSize: 17,
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#F7F9FB',
    borderTopWidth: 1,
    borderTopColor: '#E4E8EE',
    height: 64,
    alignItems: 'center',
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIconActive: {
    fontSize: 26,
    color: '#222',
  },
  navIconGray: {
    fontSize: 26,
    color: '#AAAAAA',
  },
  navPlusBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#AAAAAA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navPlusText: {
    fontSize: 22,
    color: '#AAAAAA',
    lineHeight: 26,
  },
});

export default SearchScreen;
