export interface Address {
  city: string;
  state?: string;
  country?: string;
}

export interface PropertyMock {
  id: number;
  name: string;
  host: string;
  address: Address;
  price: number;
  beds?: number;
  isActive?: boolean;
  image?: string;
  description?: string;
  amenities?: string[];
}

export interface HomeownerMock {
  id: number;
  name: string;
  email: string;
  phone?: string;
  paymentInfo?: string;
  joinedAt?: string;
}

export interface BookingMock {
  id: string;
  propertyId: number;
  propertyName?: string;
  homeowner?: string;
  guestName: string;
  guestEmail?: string;
  startDate: string;
  duration: string;
  total: number;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  location?: string;
}

export interface GuestMock {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

export interface MessageMock {
  id: string;
  from: string;
  to: string;
  property?: string;
  date: string;
  message: string;
  status?: "read" | "unread";
}

/* ---------------------
   PROPERTIES
   --------------------- */

export const PROPERTIES: PropertyMock[] = [
  {
    id: 1,
    name: "Villa Ocean Breeze",
    host: "Maltiti",
    address: { city: "Accra", state: "Greater Accra Region", country: "Ghana" },
    price: 3200,
    beds: 3,
    isActive: true,
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
    description:
      "Experience beachfront luxury at Villa Ocean Breeze with ocean views and private pool.",
    amenities: ["Pool", "WiFi", "Air Conditioning"],
  },
  {
    id: 2,
    name: "Mountain Escape Chalet",
    host: "Mary Smith",
    address: { city: "Kumasi", state: "Ashanti Region", country: "Ghana" },
    price: 1800,
    beds: 4,
    isActive: false,
    image:
      "https://images.unsplash.com/photo-1505691723518-36a8d1f6b9a0?auto=format&fit=crop&w=1200&q=80",
    description:
      "Rustic mountain chalet with cozy fireplace and hiking access.",
    amenities: ["Fireplace", "Balcony"],
  },
  {
    id: 3,
    name: "Cozy Desert Retreat",
    host: "John Doe",
    address: { city: "Tamale", state: "Northern Region", country: "Ghana" },
    price: 1500,
    beds: 2,
    isActive: true,
    image:
      "https://images.unsplash.com/photo-1505691723518-36a8d1f6b9a0?auto=format&fit=crop&w=1200&q=80",
    description: "Quiet desert retreat under the stars.",
    amenities: ["Kitchen", "Parking"],
  },
];

/* ---------------------
   HOMEOWNERS
   --------------------- */

export const HOMEOWNERS: HomeownerMock[] = [
  {
    id: 1,
    name: "Maltiti",
    email: "maltiti@hosts.com",
    phone: "+233241234567",
    paymentInfo: "MTN Momo — 0244123456",
    joinedAt: "2023-09-01",
  },
  {
    id: 2,
    name: "Mary Smith",
    email: "mary@example.com",
    phone: "+233245678901",
    paymentInfo: "GCB — 0012456789",
    joinedAt: "2024-02-20",
  },
  {
    id: 3,
    name: "Iddrisu Sulemana",
    email: "iddrisu@example.com",
    phone: "+233249876543",
    paymentInfo: "AirtelTigo — 0549876543",
    joinedAt: "2024-01-10",
  },
];

/* ---------------------
   BOOKINGS
   --------------------- */

export const BOOKINGS: BookingMock[] = [
  {
    id: "ABC123",
    propertyId: 1,
    propertyName: "Villa Ocean Breeze",
    homeowner: "Maltiti",
    guestName: "Kwame Appiah",
    guestEmail: "kwame@example.com",
    startDate: "2024-02-15",
    duration: "5",
    total: 3410,
    status: "confirmed",
    location: "Accra",
  },
  {
    id: "XYZ789",
    propertyId: 2,
    propertyName: "Mountain Escape Chalet",
    homeowner: "Mary Smith",
    guestName: "Ama Serwaa",
    guestEmail: "ama@example.com",
    startDate: "2024-03-10",
    duration: "7",
    total: 2130,
    status: "pending",
    location: "Kumasi",
  },
];

/* ---------------------
   GUESTS
   --------------------- */

export const GUESTS: GuestMock[] = [
  {
    id: 1,
    name: "Kwame Appiah",
    email: "kwame@example.com",
    phone: "+233201234567",
  },
  {
    id: 2,
    name: "Ama Serwaa",
    email: "ama@example.com",
    phone: "+233205678901",
  },
  {
    id: 3,
    name: "Alice Mensah",
    email: "alice@example.com",
    phone: "+233207890123",
  },
];

/* ---------------------
   COMMUNICATIONS / MESSAGES
   --------------------- */

export const MESSAGES: MessageMock[] = [
  {
    id: "m1",
    from: "Kwame Appiah",
    to: "Maltiti",
    property: "Villa Ocean Breeze",
    date: "2024-01-10 09:15",
    message:
      "Hi, I want to confirm whether the villa has working wifi and if early check-in is possible.",
    status: "unread",
  },
  {
    id: "m2",
    from: "Ama Serwaa",
    to: "Mary Smith",
    property: "Mountain Escape Chalet",
    date: "2024-02-02 14:22",
    message: "Hello, is there a baby cot available during our stay?",
    status: "read",
  },
];

export default {
  PROPERTIES,
  HOMEOWNERS,
  BOOKINGS,
  GUESTS,
  MESSAGES,
};
