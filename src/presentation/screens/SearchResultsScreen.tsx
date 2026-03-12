import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { MOCK_ORDERS, Order } from '../../data/mock/mockOrders';
import { SearchParams } from './SearchScreen';

interface SearchResultsScreenProps {
  searchParams: SearchParams;
  onBack: () => void;
  onSelectOrder: (order: Order) => void;
}

const SearchResultsScreen: React.FC<SearchResultsScreenProps> = ({
  searchParams,
  onBack,
  onSelectOrder,
}) => {
  const results = MOCK_ORDERS.filter(order => {
    const fromMatch = !searchParams.from || order.from.toLowerCase().includes(searchParams.from.toLowerCase());
    const toMatch = !searchParams.to || order.to.toLowerCase().includes(searchParams.to.toLowerCase());
    const dateMatch = !searchParams.date || order.date === searchParams.date;
    const seatsMatch = !searchParams.passengers || order.seats >= parseInt(searchParams.passengers, 10);
    return fromMatch && toMatch && dateMatch && seatsMatch;
  });

  const renderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity style={styles.card} onPress={() => onSelectOrder(item)} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <View style={styles.routeContainer}>
          <Text style={styles.city}>{item.from}</Text>
          <Text style={styles.arrow}> → </Text>
          <Text style={styles.city}>{item.to}</Text>
        </View>
        <Text style={styles.price}>{item.price}</Text>
      </View>

      <View style={styles.cardDetails}>
        <Text style={styles.detail}>🕐 {item.departureTime}  •  📅 {item.date}</Text>
        <Text style={styles.detail}>💺 Мест: {item.seats}  •  ⭐ {item.driverRating}</Text>
        <Text style={styles.detail}>👤 {item.driverName}</Text>
      </View>

      <TouchableOpacity style={styles.selectButton} onPress={() => onSelectOrder(item)} activeOpacity={0.8}>
        <Text style={styles.selectButtonText}>Выбрать</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>← Назад</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {searchParams.from || '...'} → {searchParams.to || '...'}
          </Text>
        </View>

        {results.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.errorIconCircle}>
              <Text style={styles.errorIconText}>!</Text>
            </View>
            <Text style={styles.emptyText}>Не удалось найти,{'\n'}попробуйте позже</Text>
            <View style={styles.retryButtonContainer}>
              <TouchableOpacity style={styles.retryButton} onPress={onBack} activeOpacity={0.8}>
                <Text style={styles.retryButtonText}>Попробовать еще</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
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
    backgroundColor: '#F0F4F8',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EEF4',
  },
  backButton: {
    marginBottom: 6,
  },
  backText: {
    color: '#5E7A90',
    fontSize: 15,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  city: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  arrow: {
    fontSize: 16,
    color: '#5E7A90',
    fontWeight: '600',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3A5F7A',
  },
  cardDetails: {
    gap: 4,
    marginBottom: 12,
  },
  detail: {
    fontSize: 13,
    color: '#666',
  },
  selectButton: {
    backgroundColor: '#C6DBF0',
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#3A5F7A',
    fontSize: 15,
    fontWeight: '600',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  errorIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  errorIconText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#222',
    lineHeight: 56,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#D32F2F',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 0,
  },
  retryButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: '#C8DEFA',
    borderRadius: 30,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButtonText: {
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

export default SearchResultsScreen;
