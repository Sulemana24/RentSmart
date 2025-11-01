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
  image: string;
  images: string[];
  discount?: string;
  description: string;
  amenities?: string[];
  reviews?: Review[];
}
