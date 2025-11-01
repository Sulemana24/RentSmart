export interface PropertyProps {
  id: number;
  name: string;
  address: {
    state: string;
    city: string;
    country: string;
  };
  rating: number;
  category: string[];
  price: number;
  agentFeePercentage?: number;
  walkingFee?: number;
  acceptableDurations: number[];
  beds?: number;
  image: string;
  images: string[];
  discount: string;
  description?: string;
  amenities?: string[];
  reviews?: {
    user: string;
    comment: string;
    rating: number;
  }[];
}
