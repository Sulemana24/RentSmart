import { PropertyProps } from "@/interfaces";
import img1 from "../public/images/Leonardo_Phoenix_Nestled_atop_a_rolling_hill_on_the_edge_of_to_0.jpg";
import img2 from "../public/images/image 2.png";
import img3 from "../public/images/Leonardo_Phoenix_Nestled_atop_a_rolling_hill_on_the_edge_of_to_2.jpg";
import img4 from "../public/images/Leonardo_Phoenix_Nestled_atop_a_rolling_hill_on_the_edge_of_to_3.jpg";
import img5 from "../public/images/pexels-asphotograpy-101808.jpg";
import img6 from "../public/images/pexels-asphotograpy-565324.jpg";
import img7 from "../public/images/pexels-expect-best-79873-323780.jpg";
import img8 from "../public/images/pexels-frans-van-heerden-201846-1438832.jpg";
import img9 from "../public/images/pexels-frans-van-heerden-201846-1438834.jpg";
import img10 from "../public/images/pexels-godless-humanist-739743-1587947.jpg";
import img11 from "../public/images/pexels-marketingtuig-87223.jpg";
import img12 from "../public/images/pexels-nextvoyage-1481105.jpg";
import img13 from "../public/images/pexels-pixabay-209296.jpg";

export const PROPERTYLISTINGSAMPLE: PropertyProps[] = [
  {
    id: 1,
    name: "Villa Ocean Breeze",
    address: {
      state: "Northern Region",
      city: "Yendi",
      country: "Ghana",
    },
    rating: 4.89,
    category: ["Luxury Villa", "Pool", "Free Parking"],
    price: 3200,
    offers: {
      bed: "3",
      shower: "3",
      occupants: "4-6",
    },
    image: img1.src,
    discount: "",
    description:
      "Experience the ultimate beachfront luxury at Villa Ocean Breeze. This stunning villa offers breathtaking ocean views, a private pool, and modern amenities to ensure a comfortable and memorable stay.",
    amenities: ["Free WiFi", "Pool", "Air Conditioning", "Kitchen"],
    reviews: [
      { user: "Hawawu", comment: "Great place!", rating: 5 },
      { user: "Maltiti", comment: "Very clean and cozy", rating: 4 },
    ],
  },
  {
    id: 2,
    name: "Mountain Escape Chalet",
    address: {
      state: "Ashanti Region",
      city: "Kumasi",
      country: "Ghana",
    },
    rating: 4.7,
    category: ["Mountain View", "Fireplace", "Self Checkin"],
    price: 1800,
    offers: {
      bed: "4",
      shower: "2",
      occupants: "5-7",
    },
    image: img2.src,
    discount: "30",
    description:
      "Escape into the snowy mountains with this rustic yet modern chalet. Ideal for family ski trips, it offers a cozy fireplace and breathtaking views of Aspen’s peaks.",
    amenities: ["Fireplace", "Free WiFi", "Heating", "Balcony", "Kitchen"],
    reviews: [
      {
        user: "Issahaku",
        comment: "The view from the balcony was unforgettable.",
        rating: 5,
      },
      {
        user: "Rahama",
        comment: "Warm and cozy, loved the fireplace!",
        rating: 4.5,
      },
    ],
  },
  {
    id: 3,
    name: "Cozy Desert Retreat",
    address: {
      state: "Northern Region",
      city: "Tamale",
      country: "Ghana",
    },
    rating: 4.92,
    category: ["Desert View", "Pet Friendly", "Self Checkin"],
    price: 1500,
    offers: {
      bed: "2",
      shower: "1",
      occupants: "2-3",
    },
    image: img3.src,
    discount: "",
    description:
      "This desert retreat is perfect for those seeking peace and quiet. Watch the sunset over the desert mountains and enjoy a night under the stars.",
    amenities: [
      "Air Conditioning",
      "Free Parking",
      "Outdoor Lounge",
      "Kitchen",
    ],
    reviews: [
      {
        user: "Abdulai",
        comment: "Very peaceful, I slept so well.",
        rating: 5,
      },
      {
        user: "Maltiti",
        comment: "Loved watching the stars at night.",
        rating: 4.8,
      },
    ],
  },
  {
    id: 4,
    name: "City Lights Penthouse",
    address: {
      state: "Savannah Region",
      city: "Damongo",
      country: "Ghana",
    },
    rating: 4.85,
    category: ["City View", "Free WiFi", "24h Checkin"],
    price: 4500,
    offers: {
      bed: "2",
      shower: "2",
      occupants: "2-4",
    },
    image: img4.src,
    discount: "15",
    description:
      "A luxurious penthouse in the heart of New York. Floor-to-ceiling windows give you panoramic views of the skyline and a modern living space.",
    amenities: ["High-speed WiFi", "24h Concierge", "Rooftop Access", "Gym"],
    reviews: [
      {
        user: "Yakubu",
        comment: "The view of Manhattan is priceless.",
        rating: 5,
      },
      { user: "Hawawu", comment: "Stylish and very clean.", rating: 4.7 },
    ],
  },
  {
    id: 5,
    name: "Riverside Cabin",
    address: {
      state: "Queenstown",
      city: "Otago",
      country: "New Zealand",
    },
    rating: 4.77,
    category: ["Riverside", "Private Dock", "Free Kayaks"],
    price: 2800,
    offers: {
      bed: "3",
      shower: "2",
      occupants: "4-6",
    },
    image: img5.src,
    discount: "20",
    description:
      "Relax by the riverside in this peaceful cabin. Guests can kayak, fish, or enjoy a quiet evening by the water.",
    amenities: [
      "Private Dock",
      "Kayaks Included",
      "Fireplace",
      "Outdoor Grill",
    ],
    reviews: [
      {
        user: "Fuseini",
        comment: "Kayaking on the river was amazing.",
        rating: 4.9,
      },
      { user: "Mariam", comment: "So calm and refreshing.", rating: 4.6 },
    ],
  },
  {
    id: 6,
    name: "Modern Beachfront Villa",
    address: {
      state: "Sidemen",
      city: "Bali",
      country: "Indonesia",
    },
    rating: 4.95,
    category: ["Beachfront", "Private Pool", "Chef Service"],
    price: 5000,
    offers: {
      bed: "5",
      shower: "4",
      occupants: "8-10",
    },
    image: img6.src,
    discount: "",
    description:
      "Luxury meets relaxation in this beachfront villa with a private pool. Guests enjoy chef service and direct beach access.",
    amenities: [
      "Private Chef",
      "Infinity Pool",
      "Beach Access",
      "Air Conditioning",
    ],
    reviews: [
      { user: "Alhassan", comment: "Best vacation of my life.", rating: 5 },
      {
        user: "Rahama",
        comment: "The private chef was wonderful!",
        rating: 4.8,
      },
    ],
  },
  {
    id: 7,
    name: "Lakeside Chalet",
    address: {
      state: "Banff",
      city: "Alberta",
      country: "Canada",
    },
    rating: 4.65,
    category: ["Lakeside", "Mountain View", "Hiking Trails"],
    price: 2300,
    offers: {
      bed: "3",
      shower: "3",
      occupants: "4-5",
    },
    image: img7.src,
    discount: "10",
  },
  {
    id: 8,
    name: "Tropical Garden Villa",
    address: {
      state: "Greater Accra",
      city: "Accra",
      country: "Ghana",
    },
    rating: 4.8,
    category: ["Garden", "Free Parking", "Self Checkin"],
    price: 2750,
    offers: {
      bed: "3",
      shower: "3",
      occupants: "5-6",
    },
    image: img8.src,
    discount: "25",
  },
  {
    id: 9,
    name: "Urban Loft",
    address: {
      state: "Berlin",
      city: "Berlin",
      country: "Germany",
    },
    rating: 4.6,
    category: ["City Center", "Free WiFi", "24h Checkin"],
    price: 2000,
    offers: {
      bed: "2",
      shower: "1",
      occupants: "2-3",
    },
    image: img9.src,
    discount: "",
    description:
      "Luxury meets relaxation in this beachfront villa with a private pool. Guests enjoy chef service and direct beach access.",
    amenities: [
      "Private Chef",
      "Infinity Pool",
      "Beach Access",
      "Air Conditioning",
    ],
    reviews: [
      { user: "Alhassan", comment: "Best vacation of my life.", rating: 5 },
      {
        user: "Rahama",
        comment: "The private chef was wonderful!",
        rating: 4.8,
      },
    ],
  },
  {
    id: 10,
    name: "Secluded Forest Cabin",
    address: {
      state: "Whistler",
      city: "British Columbia",
      country: "Canada",
    },
    rating: 4.72,
    category: ["Secluded", "Hot Tub", "Self Checkin"],
    price: 2600,
    offers: {
      bed: "4",
      shower: "2",
      occupants: "5-7",
    },
    image: img10.src,
    discount: "40",
    description:
      "Luxury meets relaxation in this beachfront villa with a private pool. Guests enjoy chef service and direct beach access.",
    amenities: [
      "Private Chef",
      "Infinity Pool",
      "Beach Access",
      "Air Conditioning",
    ],
    reviews: [
      { user: "Alhassan", comment: "Best vacation of my life.", rating: 5 },
      {
        user: "Rahama",
        comment: "The private chef was wonderful!",
        rating: 4.8,
      },
    ],
  },
  {
    id: 11,
    name: "Cliffside Villa",
    address: {
      state: "Northern Region",
      city: "Yendi",
      country: "Ghana",
    },
    rating: 4.93,
    category: ["Cliffside", "Infinity Pool", "Sea View"],
    price: 6000,
    offers: {
      bed: "4",
      shower: "4",
      occupants: "6-8",
    },
    image: img11.src,
    discount: "50",
    description:
      "Luxury meets relaxation in this beachfront villa with a private pool. Guests enjoy chef service and direct beach access.",
    amenities: [
      "Private Chef",
      "Infinity Pool",
      "Beach Access",
      "Air Conditioning",
    ],
    reviews: [
      { user: "Alhassan", comment: "Best vacation of my life.", rating: 5 },
      {
        user: "Rahama",
        comment: "The private chef was wonderful!",
        rating: 4.8,
      },
    ],
  },
  {
    id: 12,
    name: "Coastal Escape Villa",
    address: {
      state: "Noosa",
      city: "Queensland",
      country: "Australia",
    },
    rating: 4.83,
    category: ["Beachfront", "Pet Friendly", "Free Parking"],
    price: 3400,
    offers: {
      bed: "3",
      shower: "3",
      occupants: "4-6",
    },
    image: img12.src,
    discount: "",
    description:
      "Luxury meets relaxation in this beachfront villa with a private pool. Guests enjoy chef service and direct beach access.",
    amenities: [
      "Private Chef",
      "Infinity Pool",
      "Beach Access",
      "Air Conditioning",
    ],
    reviews: [
      { user: "Alhassan", comment: "Best vacation of my life.", rating: 5 },
      {
        user: "Rahama",
        comment: "The private chef was wonderful!",
        rating: 4.8,
      },
    ],
  },
  {
    id: 13,
    name: "Historical Villa",
    address: {
      state: "Florence",
      city: "Tuscany",
      country: "Italy",
    },
    rating: 4.67,
    category: ["Historical", "Free Breakfast", "Self Checkin"],
    price: 2700,
    offers: {
      bed: "2",
      shower: "2",
      occupants: "2-4",
    },
    image: img13.src,
    discount: "35",
    description:
      "Luxury meets relaxation in this beachfront villa with a private pool. Guests enjoy chef service and direct beach access.",
    amenities: [
      "Private Chef",
      "Infinity Pool",
      "Beach Access",
      "Air Conditioning",
    ],
    reviews: [
      { user: "Alhassan", comment: "Best vacation of my life.", rating: 5 },
      {
        user: "Rahama",
        comment: "The private chef was wonderful!",
        rating: 4.8,
      },
    ],
  },
  {
    id: 14,
    name: "Downtown Apartment",
    address: {
      state: "Tokyo",
      city: "Tokyo",
      country: "Japan",
    },
    rating: 4.81,
    category: ["City Center", "Free WiFi", "Public Transport"],
    price: 2200,
    offers: {
      bed: "1",
      shower: "1",
      occupants: "2",
    },
    image: img1.src,
    discount: "",
    description:
      "Luxury meets relaxation in this beachfront villa with a private pool. Guests enjoy chef service and direct beach access.",
    amenities: [
      "Private Chef",
      "Infinity Pool",
      "Beach Access",
      "Air Conditioning",
    ],
    reviews: [
      { user: "Alhassan", comment: "Best vacation of my life.", rating: 5 },
      {
        user: "Rahama",
        comment: "The private chef was wonderful!",
        rating: 4.8,
      },
    ],
  },
  {
    id: 15,
    name: "Luxury Safari Lodge",
    address: {
      state: "Serengeti",
      city: "Mara",
      country: "Tanzania",
    },
    rating: 4.97,
    category: ["Safari", "Guided Tours", "Free Breakfast"],
    price: 4500,
    offers: {
      bed: "4",
      shower: "4",
      occupants: "6-8",
    },
    image: img2.src,
    discount: "20",
    description:
      "Luxury meets relaxation in this beachfront villa with a private pool. Guests enjoy chef service and direct beach access.",
    amenities: [
      "Private Chef",
      "Infinity Pool",
      "Beach Access",
      "Air Conditioning",
    ],
    reviews: [
      { user: "Alhassan", comment: "Best vacation of my life.", rating: 5 },
      {
        user: "Rahama",
        comment: "The private chef was wonderful!",
        rating: 4.8,
      },
    ],
  },
  {
    id: 15,
    name: "Countryside Cottage",
    address: {
      state: "Cotswolds",
      city: "Gloucestershire",
      country: "UK",
    },
    rating: 4.58,
    category: ["Countryside", "Fireplace", "Self Checkin"],
    price: 1800,
    offers: {
      bed: "2",
      shower: "1",
      occupants: "2-4",
    },
    image: img3.src,
    discount: "25",
    description:
      "Luxury meets relaxation in this beachfront villa with a private pool. Guests enjoy chef service and direct beach access.",
    amenities: [
      "Private Chef",
      "Infinity Pool",
      "Beach Access",
      "Air Conditioning",
    ],
    reviews: [
      { user: "Alhassan", comment: "Best vacation of my life.", rating: 5 },
      {
        user: "Rahama",
        comment: "The private chef was wonderful!",
        rating: 4.8,
      },
    ],
  },
  {
    id: 16,
    name: "Riverfront Mansion",
    address: {
      state: "Paris",
      city: "Île-de-France",
      country: "France",
    },
    rating: 4.86,
    category: ["Riverfront", "Private Garden", "Self Checkin"],
    price: 5000,
    offers: {
      bed: "4",
      shower: "3",
      occupants: "6-8",
    },
    image: img4.src,
    discount: "30",
    description:
      "Luxury meets relaxation in this beachfront villa with a private pool. Guests enjoy chef service and direct beach access.",
    amenities: [
      "Private Chef",
      "Infinity Pool",
      "Beach Access",
      "Air Conditioning",
    ],
    reviews: [
      { user: "Alhassan", comment: "Best vacation of my life.", rating: 5 },
      {
        user: "Rahama",
        comment: "The private chef was wonderful!",
        rating: 4.8,
      },
    ],
  },
  {
    id: 17,
    name: "Ski Chalet",
    address: {
      state: "Zermatt",
      city: "Valais",
      country: "Switzerland",
    },
    rating: 4.75,
    category: ["Mountain View", "Ski Access", "Fireplace"],
    price: 3900,
    offers: {
      bed: "3",
      shower: "3",
      occupants: "4-5",
    },
    image: img5.src,
    discount: "",
  },
  {
    id: 18,
    name: "Island Paradise Villa",
    address: {
      state: "Mahe",
      city: "Victoria",
      country: "Seychelles",
    },
    rating: 4.98,
    category: ["Beachfront", "Private Pool", "Chef Service"],
    price: 6500,
    offers: {
      bed: "5",
      shower: "5",
      occupants: "8-10",
    },
    image: img6.src,
    discount: "60",
    description:
      "Luxury meets relaxation in this beachfront villa with a private pool. Guests enjoy chef service and direct beach access.",
    amenities: [
      "Private Chef",
      "Infinity Pool",
      "Beach Access",
      "Air Conditioning",
    ],
    reviews: [
      { user: "Alhassan", comment: "Best vacation of my life.", rating: 5 },
      {
        user: "Rahama",
        comment: "The private chef was wonderful!",
        rating: 4.8,
      },
    ],
  },
  {
    id: 19,
    name: "Clifftop Retreat",
    address: {
      state: "Cape Town",
      city: "Western Cape",
      country: "South Africa",
    },
    rating: 4.78,
    category: ["Ocean View", "Private Pool", "Self Checkin"],
    price: 4100,
    offers: {
      bed: "3",
      shower: "3",
      occupants: "4-5",
    },
    image: img7.src,
    discount: "",
    description:
      "Luxury meets relaxation in this beachfront villa with a private pool. Guests enjoy chef service and direct beach access.",
    amenities: [
      "Private Chef",
      "Infinity Pool",
      "Beach Access",
      "Air Conditioning",
    ],
    reviews: [
      { user: "Alhassan", comment: "Best vacation of my life.", rating: 5 },
      {
        user: "Rahama",
        comment: "The private chef was wonderful!",
        rating: 4.8,
      },
    ],
  },
];
