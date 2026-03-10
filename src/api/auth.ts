import { API_BASE_URL } from './config';

interface RegisterDriverData {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  licenseNumber: string;
  vehicleNumber: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleColor: string;
  vehicleYear: number;
  vehicleSeats: number;
}

interface RegisterPassengerData {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
}

export async function registerDriver(data: RegisterDriverData) {
  const response = await fetch(`${API_BASE_URL}/driver/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || 'Registration failed');
  }

  return json;
}

export async function registerPassenger(data: RegisterPassengerData) {
  const response = await fetch(`${API_BASE_URL}/passenger/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || 'Registration failed');
  }

  return json;
}
