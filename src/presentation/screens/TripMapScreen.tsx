import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
  Modal,
  ScrollView,
} from 'react-native';
import YaMap, { Marker, Polyline } from 'react-native-yamap';
import Geolocation from '@react-native-community/geolocation';
import { Order } from '../../data/mock/mockOrders';

interface TripMapScreenProps {
  order: Order;
  onBack: () => void;
}

interface Coords {
  lat: number;
  lon: number;
}

const CITY_COORDS: Record<string, Coords> = {
  'Томск':        { lat: 56.4977, lon: 84.9744 },
  'Новосибирск':  { lat: 54.9885, lon: 82.9207 },
  'Кемерово':     { lat: 55.3545, lon: 86.0853 },
  'Барнаул':      { lat: 53.3547, lon: 83.7697 },
};

function getCityCoords(address: string): Coords {
  for (const city of Object.keys(CITY_COORDS)) {
    if (address.includes(city)) {
      return CITY_COORDS[city];
    }
  }
  return { lat: 54.9885, lon: 82.9207 };
}

const TripMapScreen: React.FC<TripMapScreenProps> = ({ order, onBack }) => {
  const [infoVisible, setInfoVisible] = useState(false);
  const [userCoords, setUserCoords] = useState<Coords | null>(null);

  const fromCoords = getCityCoords(order.from);
  const toCoords = getCityCoords(order.to);
  const driverCoords: Coords = {
    lat: fromCoords.lat + 0.05,
    lon: fromCoords.lon - 0.08,
  };

  const centerLat = (fromCoords.lat + toCoords.lat) / 2;
  const centerLon = (fromCoords.lon + toCoords.lon) / 2;

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Доступ к геолокации',
          message: 'PickMe нужен доступ к вашему местоположению',
          buttonPositive: 'Разрешить',
          buttonNegative: 'Отмена',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  useEffect(() => {
    const getLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('Нет доступа к геолокации', 'Разрешите доступ в настройках телефона');
        return;
      }
      Geolocation.getCurrentPosition(
        position => {
          setUserCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        () => {},
        { enableHighAccuracy: true, timeout: 10000 },
      );
    };
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <YaMap
        style={styles.map}
        initialRegion={{
          lat: centerLat,
          lon: centerLon,
          zoom: 7,
          azimuth: 0,
        }}
        showUserPosition={true}
      >
        {/* Точка отправления */}
        <Marker
          point={{ lat: fromCoords.lat, lon: fromCoords.lon }}
          scale={2}
          children={
            <View style={styles.markerFrom}>
              <Text style={styles.markerText}>A</Text>
            </View>
          }
        />

        {/* Точка назначения */}
        <Marker
          point={{ lat: toCoords.lat, lon: toCoords.lon }}
          scale={2}
          children={
            <View style={styles.markerTo}>
              <Text style={styles.markerText}>B</Text>
            </View>
          }
        />

        {/* Водитель */}
        <Marker
          point={{ lat: driverCoords.lat, lon: driverCoords.lon }}
          scale={2}
          children={
            <View style={styles.markerDriver}>
              <Text style={styles.markerDriverText}>🚗</Text>
            </View>
          }
        />

        {/* Моя геолокация */}
        {userCoords && (
          <Marker
            point={{ lat: userCoords.lat, lon: userCoords.lon }}
            scale={2}
            children={
              <View style={styles.markerUser}>
                <Text style={styles.markerText}>Я</Text>
              </View>
            }
          />
        )}

        {/* Маршрут */}
        <Polyline
          points={[
            { lat: fromCoords.lat, lon: fromCoords.lon },
            { lat: toCoords.lat, lon: toCoords.lon },
          ]}
          strokeColor="#2A7DDE"
          strokeWidth={4}
        />
      </YaMap>

      {/* Кнопка назад */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      {/* Кнопка информации */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => setInfoVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.infoButtonText}>Информация о поездке</Text>
        </TouchableOpacity>
      </View>

      {/* Нижний навбар */}
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

      {/* Модалка с информацией о поездке */}
      <Modal visible={infoVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Информация о поездке</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Откуда</Text>
                <Text style={styles.infoValue}>{order.from}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Куда</Text>
                <Text style={styles.infoValue}>{order.to}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Дата</Text>
                <Text style={styles.infoValue}>{order.date}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Время</Text>
                <Text style={styles.infoValue}>{order.departureTime}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Водитель</Text>
                <Text style={styles.infoValue}>{order.driverName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Рейтинг</Text>
                <Text style={styles.infoValue}>⭐ {order.driverRating}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Мест</Text>
                <Text style={styles.infoValue}>{order.seats}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Стоимость</Text>
                <Text style={[styles.infoValue, styles.infoPrice]}>{order.price}</Text>
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setInfoVisible(false)}>
              <Text style={styles.closeButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  backButtonText: {
    fontSize: 22,
    color: '#222',
    fontWeight: 'bold',
  },
  markerFrom: {
    backgroundColor: '#2A7DDE',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerTo: {
    backgroundColor: '#E53935',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerDriver: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    borderWidth: 2,
    borderColor: '#2A7DDE',
  },
  markerDriverText: { fontSize: 20 },
  markerUser: {
    backgroundColor: '#43A047',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 70,
    left: 16,
    right: 16,
  },
  infoButton: {
    backgroundColor: '#C8DEFA',
    borderRadius: 30,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  infoButtonText: {
    color: '#4A6D8C',
    fontSize: 16,
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
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navIconActive: { fontSize: 26, color: '#222' },
  navIconGray: { fontSize: 26, color: '#AAAAAA' },
  navPlusBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#AAAAAA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navPlusText: { fontSize: 22, color: '#AAAAAA', lineHeight: 26 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: { fontSize: 14, color: '#888', fontWeight: '500' },
  infoValue: {
    fontSize: 14,
    color: '#222',
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  infoPrice: { color: '#3A5F7A', fontSize: 16 },
  closeButton: {
    backgroundColor: '#C8DEFA',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: { color: '#4A6D8C', fontSize: 16, fontWeight: '600' },
});

export default TripMapScreen;
