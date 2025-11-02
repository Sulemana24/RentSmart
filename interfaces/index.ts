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
  propertyId: number;
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
  id: number;
  name: string;
  address: Address;
  rating: number;
  category?: string[];
  price: number;
  agentFeePercentage: number;
  walkingFee: number;
  acceptableDurations: number[];
  beds: number;
  host?: string;
  image: string;
  images: string[];
  discount?: string;
  description: string;
  amenities?: string[];
  reviews?: Review[];
}
