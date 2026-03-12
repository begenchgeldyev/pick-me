export interface Order {
  id: string;
  from: string;
  to: string;
  date: string;
  seats: number;
  price: string;
  driverName: string;
  driverRating: number;
  departureTime: string;
}

export const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    from: 'г. Томск, проспект Ленина, 128',
    to: 'г. Новосибирск, улица Кирова, 44',
    date: '26.03.2026',
    seats: 3,
    price: '900 ₽',
    driverName: 'Андрей К.',
    driverRating: 4.8,
    departureTime: '08:00',
  },
  {
    id: '2',
    from: 'г. Томск, улица Советская, 5',
    to: 'г. Новосибирск, площадь Ленина, 1',
    date: '26.03.2026',
    seats: 2,
    price: '1100 ₽',
    driverName: 'Сергей М.',
    driverRating: 4.9,
    departureTime: '09:30',
  },
  {
    id: '3',
    from: 'г. Новосибирск, улица Кирова, 44',
    to: 'г. Томск, проспект Ленина, 128',
    date: '26.03.2026',
    seats: 1,
    price: '950 ₽',
    driverName: 'Иван П.',
    driverRating: 4.7,
    departureTime: '07:00',
  },
  {
    id: '4',
    from: 'г. Томск, проспект Ленина, 1',
    to: 'г. Кемерово, улица Весенняя, 10',
    date: '27.03.2026',
    seats: 4,
    price: '700 ₽',
    driverName: 'Дмитрий В.',
    driverRating: 4.6,
    departureTime: '06:00',
  },
  {
    id: '5',
    from: 'г. Новосибирск, Красный проспект, 18',
    to: 'г. Барнаул, проспект Ленина, 3',
    date: '27.03.2026',
    seats: 2,
    price: '600 ₽',
    driverName: 'Алексей Н.',
    driverRating: 5.0,
    departureTime: '10:00',
  },
  {
    id: '6',
    from: 'г. Кемерово, улица Весенняя, 10',
    to: 'г. Томск, проспект Ленина, 128',
    date: '26.03.2026',
    seats: 3,
    price: '750 ₽',
    driverName: 'Михаил О.',
    driverRating: 4.5,
    departureTime: '11:00',
  },
];
