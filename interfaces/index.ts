import { Timestamp } from "firebase/firestore";

export interface Review {
  user: string;
  comment: string;
  rating: number;
}

export interface Address {
  state: string;
  city: string;
  country: string;
}

export interface BookingDetails {
  id?: string;
  propertyId: string;
  propertyName: string;
  propertyImage: string;
  startDate: string;
  duration: number;
  price: number;
  totalPropertyPrice: number;
  agentFeePercentage: number;
  agentFee: number;
  walkingFee: number;
  subtotal: number;
  total: number;
  status?: "pending" | "confirmed" | "completed";
  host?: string;
}

export interface PropertyProps {
  id: string;
  name: string;
  address: Address;
  rating: number;
  category?: string[];
  price: number;
  status: string;
  agentFeePercentage: number;
  walkingFee: number;
  acceptableDurations: number[];
  beds: number;
  host?: string;
  image: string;
  images: string[];
  discount?: number;
  description: string;
  amenities?: string[];
  reviews?: Review[];
  featured?: boolean;
  spotlight?: boolean;
  createdAt?: Date;
  total?: number;
}
