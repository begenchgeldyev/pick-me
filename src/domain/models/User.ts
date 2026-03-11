export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  rating: number;
  isVerified: boolean;
  createdAt: Date;
}

export interface Passenger extends User {
  // В диаграмме: getBookings()
}

export interface Driver extends User {
  licenseNum: string;
  // В диаграмме: getActiveTrips(), addCar(), removeCar()
}
