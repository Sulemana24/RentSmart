// constants/hostelListings.ts
export interface HostelRoomType {
  id: number;
  name: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  beds: string;
  availability: number;
  features: string[];
  images?: string[];
}

export interface HostelReview {
  id: number;
  user: string;
  rating: number;
  date: string;
  comment: string;
  stayType: string;
  travelerType?: string;
  nationality?: string;
}

export interface HostelPolicies {
  checkIn: string;
  checkOut: string;
  cancellation: string;
  ageRestriction: string;
  houseRules?: string[];
  paymentMethods?: string[];
}

export interface HostelListing {
  id: number;
  name: string;
  slug: string;
  location: string;
  city: string;
  country: string;
  rating: number;
  reviewCount: number;
  description: string;
  shortDescription: string;
  images: string[];
  amenities: string[];
  roomTypes: HostelRoomType[];
  policies: HostelPolicies;
  reviews: HostelReview[];
  contact: {
    phone: string;
    email: string;
    emergency?: string;
  };
  features: {
    freeBreakfast: boolean;
    freeWiFi: boolean;
    lockers: boolean;
    kitchen: boolean;
    laundry: boolean;
    bar: boolean;
    commonRoom: boolean;
    terrace: boolean;
    gym: boolean;
    bikeRental: boolean;
    tourDesk: boolean;
    airportShuttle?: boolean;
  };
  locationDetails: {
    latitude: number;
    longitude: number;
    distanceToCityCenter: string;
    nearbyAttractions: string[];
    publicTransport: string[];
  };
  tags: string[];
  isFeatured?: boolean;
  isPopular?: boolean;
  discount?: {
    percentage: number;
    description: string;
    validUntil: string;
  };
}

export const HOSTELLISTINGSAMPLE: HostelListing[] = [
  {
    id: 1,
    name: "Downtown Backpackers Hostel",
    slug: "downtown-backpackers-hostel",
    location: "123 Main Street, Downtown",
    city: "New York",
    country: "USA",
    rating: 4.5,
    reviewCount: 342,
    description:
      "Experience the heart of NYC at our vibrant, social hostel. Perfect for solo travelers and groups looking for an authentic city experience with modern comforts and a friendly atmosphere. Our prime location puts you within walking distance of Times Square, Broadway theaters, and the best restaurants in Midtown.",
    shortDescription:
      "Vibrant hostel in NYC's heart, perfect for solo travelers and groups.",
    images: [
      "/hostels/nyc/main.jpg",
      "/hostels/nyc/dorm1.jpg",
      "/hostels/nyc/common.jpg",
      "/hostels/nyc/kitchen.jpg",
      "/hostels/nyc/terrace.jpg",
    ],
    amenities: [
      "Free WiFi",
      "Free Breakfast",
      "Secure Lockers",
      "Shared Kitchen",
      "Air Conditioning",
      "Common Room TV",
      "Gym Access",
      "Bike Rental",
      "Laundry Facilities",
      "24/7 Reception",
      "Luggage Storage",
      "Tour Desk",
      "Game Room",
      "Outdoor Terrace",
      "Bar & Café",
    ],
    roomTypes: [
      {
        id: 1,
        name: "6-Bed Mixed Dorm",
        description:
          "Shared dormitory with comfortable bunk beds, personal lockers, reading lights, and USB ports",
        pricePerNight: 24,
        capacity: 6,
        beds: "6 Bunk Beds",
        availability: 3,
        features: [
          "Personal Locker",
          "Reading Light",
          "USB Port",
          "Privacy Curtain",
          "Power Outlet",
        ],
      },
      {
        id: 2,
        name: "4-Bed Female Dorm",
        description:
          "Female-only dormitory with enhanced privacy and security features",
        pricePerNight: 28,
        capacity: 4,
        beds: "4 Bunk Beds",
        availability: 2,
        features: [
          "Female Only",
          "Private Bathroom",
          "Makeup Mirror",
          "Hairdryer",
          "Extra Storage",
        ],
      },
      {
        id: 3,
        name: "Private Twin Room",
        description:
          "Private room with two single beds, perfect for friends traveling together",
        pricePerNight: 45,
        capacity: 2,
        beds: "2 Single Beds",
        availability: 1,
        features: [
          "Private Bathroom",
          "Flat-screen TV",
          "Work Desk",
          "Air Conditioning",
          "Mini Fridge",
        ],
      },
      {
        id: 4,
        name: "8-Bed Party Dorm",
        description: "Large dormitory perfect for groups and social travelers",
        pricePerNight: 20,
        capacity: 8,
        beds: "8 Bunk Beds",
        availability: 5,
        features: [
          "Group Discount",
          "Social Area",
          "Game Console",
          "Sound System",
          "Party Host",
        ],
      },
    ],
    policies: {
      checkIn: "2:00 PM - 11:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 48 hours before check-in",
      ageRestriction: "Guests must be 18+ or accompanied by adult",
      houseRules: [
        "No smoking indoors",
        "Quiet hours: 11PM-7AM",
        "No outside alcohol",
        "Respect other guests",
        "Clean up after yourself",
      ],
      paymentMethods: ["Credit Card", "PayPal", "Cash"],
    },
    reviews: [
      {
        id: 1,
        user: "Sarah M.",
        rating: 5,
        date: "2 weeks ago",
        comment:
          "Amazing location and super friendly staff! Made friends from all over the world. The free walking tour organized by the hostel was fantastic.",
        stayType: "Solo Traveler",
        travelerType: "Backpacker",
        nationality: "Australia",
      },
      {
        id: 2,
        user: "James K.",
        rating: 4,
        date: "1 month ago",
        comment:
          "Great value for money. Clean rooms and good facilities. The bar downstairs has great happy hour deals!",
        stayType: "Group Travel",
        travelerType: "Group",
        nationality: "UK",
      },
      {
        id: 3,
        user: "Lisa T.",
        rating: 5,
        date: "3 days ago",
        comment:
          "Perfect for budget travelers. Free breakfast was a nice bonus! The staff helped me book last-minute Broadway tickets.",
        stayType: "Solo Traveler",
        travelerType: "Budget Traveler",
        nationality: "Canada",
      },
    ],
    contact: {
      phone: "+1 (212) 555-7890",
      email: "info@downtownbackpackers.com",
      emergency: "+1 (212) 555-9111",
    },
    features: {
      freeBreakfast: true,
      freeWiFi: true,
      lockers: true,
      kitchen: true,
      laundry: true,
      bar: true,
      commonRoom: true,
      terrace: true,
      gym: true,
      bikeRental: true,
      tourDesk: true,
      airportShuttle: true,
    },
    locationDetails: {
      latitude: 40.758,
      longitude: -73.9855,
      distanceToCityCenter: "0.3 miles",
      nearbyAttractions: [
        "Times Square",
        "Broadway",
        "Empire State Building",
        "Bryant Park",
      ],
      publicTransport: [
        "Subway: 42nd St Station (5 min walk)",
        "Bus: M42 (2 min walk)",
      ],
    },
    tags: [
      "Party Hostel",
      "City Center",
      "Social",
      "24/7 Reception",
      "Free Breakfast",
    ],
    isFeatured: true,
    isPopular: true,
  },
  {
    id: 2,
    name: "Beachside Bunkhouse",
    slug: "beachside-bunkhouse",
    location: "456 Ocean Drive",
    city: "Miami",
    country: "USA",
    rating: 4.3,
    reviewCount: 189,
    description:
      "Right on the beach! Wake up to ocean views and fall asleep to the sound of waves. Perfect for surfers, beach lovers, and anyone wanting to experience Miami's vibrant beach culture.",
    shortDescription:
      "Beachfront hostel with ocean views and surfboard rentals.",
    images: [
      "/hostels/miami/beachview.jpg",
      "/hostels/miami/dorm.jpg",
      "/hostels/miami/pool.jpg",
      "/hostels/miami/bar.jpg",
      "/hostels/miami/surfboards.jpg",
    ],
    amenities: [
      "Free WiFi",
      "Beachfront Location",
      "Surfboard Rental",
      "Swimming Pool",
      "BBQ Area",
      "Outdoor Bar",
      "Hammocks",
      "Beach Towels",
      "Sunscreen Station",
      "Beach Volleyball",
    ],
    roomTypes: [
      {
        id: 1,
        name: "8-Bed Ocean View Dorm",
        description: "Dormitory with direct ocean views and balcony access",
        pricePerNight: 32,
        capacity: 8,
        beds: "8 Bunk Beds",
        availability: 4,
        features: [
          "Ocean View",
          "Private Balcony",
          "Sea Breeze",
          "Surfboard Rack",
        ],
      },
      {
        id: 2,
        name: "Private Beach Hut",
        description: "Private bungalow steps from the beach",
        pricePerNight: 65,
        capacity: 2,
        beds: "1 Queen Bed",
        availability: 2,
        features: [
          "Private Entrance",
          "Ensuite Bathroom",
          "Mini Kitchen",
          "Beach Chairs",
        ],
      },
    ],
    policies: {
      checkIn: "3:00 PM - 10:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 24 hours before check-in",
      ageRestriction: "18+ only",
      houseRules: [
        "No shoes indoors",
        "Beach towels provided",
        "Respect quiet hours",
        "Clean surfboards outside",
      ],
    },
    reviews: [
      {
        id: 1,
        user: "Carlos R.",
        rating: 5,
        date: "1 week ago",
        comment:
          "Perfect for surfers! The hostel organizes daily surf trips and the location can't be beaten.",
        stayType: "Solo Traveler",
        travelerType: "Surfer",
        nationality: "Brazil",
      },
    ],
    contact: {
      phone: "+1 (305) 555-1234",
      email: "stay@beachsidebunkhouse.com",
    },
    features: {
      freeBreakfast: false,
      freeWiFi: true,
      lockers: true,
      kitchen: true,
      laundry: true,
      bar: true,
      commonRoom: true,
      terrace: true,
      gym: false,
      bikeRental: true,
      tourDesk: true,
    },
    locationDetails: {
      latitude: 25.7617,
      longitude: -80.1918,
      distanceToCityCenter: "On the beach",
      nearbyAttractions: ["South Beach", "Ocean Drive", "Art Deco District"],
      publicTransport: ["Bus: 120 Beach Express"],
    },
    tags: ["Beachfront", "Surf Hostel", "Party", "Outdoor Activities"],
    isFeatured: true,
    discount: {
      percentage: 15,
      description: "Book 4 nights, get 15% off",
      validUntil: "2024-12-31",
    },
  },
  {
    id: 3,
    name: "Mountain Base Camp Hostel",
    slug: "mountain-base-camp-hostel",
    location: "789 Alpine Road",
    city: "Denver",
    country: "USA",
    rating: 4.7,
    reviewCount: 256,
    description:
      "The perfect basecamp for mountain adventures. We organize daily hiking trips, provide gear rental, and have a cozy fireplace lounge for sharing stories after a day on the trails.",
    shortDescription: "Adventure hostel for hikers and outdoor enthusiasts.",
    images: [
      "/hostels/denver/mountainview.jpg",
      "/hostels/denver/lodge.jpg",
      "/hostels/denver/fireplace.jpg",
      "/hostels/denver/gearroom.jpg",
      "/hostels/denver/hikinggroup.jpg",
    ],
    amenities: [
      "Free WiFi",
      "Gear Rental",
      "Fireplace Lounge",
      "Hot Tub",
      "Drying Room",
      "Hiking Maps",
      "Guided Tours",
      "Library",
      "Coffee Station",
      "Pet Friendly",
    ],
    roomTypes: [
      {
        id: 1,
        name: "6-Bed Hiker's Dorm",
        description: "Dormitory with gear storage and drying facilities",
        pricePerNight: 28,
        capacity: 6,
        beds: "6 Bunk Beds",
        availability: 3,
        features: ["Gear Storage", "Drying Rack", "Boot Dryer", "Trail Maps"],
      },
      {
        id: 2,
        name: "Private Cabin Room",
        description: "Private room with mountain views and fireplace",
        pricePerNight: 55,
        capacity: 2,
        beds: "1 Queen Bed",
        availability: 1,
        features: [
          "Mountain View",
          "Fireplace",
          "Private Bathroom",
          "Cabin Style",
        ],
      },
    ],
    policies: {
      checkIn: "2:00 PM - 9:00 PM",
      checkOut: "10:00 AM",
      cancellation: "Free cancellation up to 72 hours before check-in",
      ageRestriction: "All ages welcome",
      houseRules: [
        "Clean gear before storage",
        "Respect quiet hours",
        "No wet clothes in rooms",
        "Pets allowed with fee",
      ],
    },
    reviews: [
      {
        id: 1,
        user: "Emma L.",
        rating: 5,
        date: "2 months ago",
        comment:
          "Best hostel for hikers! The staff helped plan our routes and the gear rental was affordable.",
        stayType: "Group Travel",
        travelerType: "Hiker",
        nationality: "Germany",
      },
    ],
    contact: {
      phone: "+1 (303) 555-5678",
      email: "hello@mountainbasecamp.com",
    },
    features: {
      freeBreakfast: true,
      freeWiFi: true,
      lockers: true,
      kitchen: true,
      laundry: true,
      bar: false,
      commonRoom: true,
      terrace: true,
      gym: false,
      bikeRental: true,
      tourDesk: true,
    },
    locationDetails: {
      latitude: 39.7392,
      longitude: -104.9903,
      distanceToCityCenter: "30 min drive",
      nearbyAttractions: ["Rocky Mountains", "Trailheads", "National Parks"],
      publicTransport: ["Shuttle service available"],
    },
    tags: ["Adventure", "Mountains", "Hiking", "Cozy", "Pet Friendly"],
    isPopular: true,
  },
  {
    id: 4,
    name: "Historic Quarters Hostel",
    slug: "historic-quarters-hostel",
    location: "101 Old Town Square",
    city: "Boston",
    country: "USA",
    rating: 4.4,
    reviewCount: 178,
    description:
      "Stay in a beautifully restored historic building in the heart of Boston's most charming district. Perfect for history buffs and culture seekers.",
    shortDescription:
      "Historic building in Boston's Old Town, full of character.",
    images: [
      "/hostels/boston/historic.jpg",
      "/hostels/boston/library.jpg",
      "/hostels/boston/courtyard.jpg",
      "/hostels/boston/dorm.jpg",
      "/hostels/boston/common.jpg",
    ],
    amenities: [
      "Free WiFi",
      "Historic Building",
      "Library Lounge",
      "Courtyard Garden",
      "Free Walking Tours",
      "Tea & Coffee",
      "Board Games",
      "Reading Nooks",
      "Historical Exhibits",
    ],
    roomTypes: [
      {
        id: 1,
        name: "4-Bed Heritage Dorm",
        description:
          "Dormitory in original historic rooms with period features",
        pricePerNight: 26,
        capacity: 4,
        beds: "4 Bunk Beds",
        availability: 2,
        features: [
          "Original Features",
          "High Ceilings",
          "Historic Charm",
          "Large Windows",
        ],
      },
    ],
    policies: {
      checkIn: "2:00 PM - 8:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 48 hours before check-in",
      ageRestriction: "All ages welcome",
      houseRules: [
        "Respect historic features",
        "No loud noises after 10PM",
        "Books must stay in library",
      ],
    },
    reviews: [
      {
        id: 1,
        user: "Thomas W.",
        rating: 4,
        date: "3 weeks ago",
        comment:
          "Beautiful building with so much character. The free historical walking tour was excellent.",
        stayType: "Solo Traveler",
        travelerType: "History Buff",
        nationality: "UK",
      },
    ],
    contact: {
      phone: "+1 (617) 555-2468",
      email: "book@historichostel.com",
    },
    features: {
      freeBreakfast: true,
      freeWiFi: true,
      lockers: true,
      kitchen: true,
      laundry: true,
      bar: false,
      commonRoom: true,
      terrace: true,
      gym: false,
      bikeRental: false,
      tourDesk: true,
    },
    locationDetails: {
      latitude: 42.3601,
      longitude: -71.0589,
      distanceToCityCenter: "In historic district",
      nearbyAttractions: [
        "Freedom Trail",
        "Quincy Market",
        "Harvard University",
      ],
      publicTransport: ["T Station: 5 min walk"],
    },
    tags: ["Historic", "Cultural", "Quiet", "Character", "Walking Tours"],
  },
  {
    id: 5,
    name: "Digital Nomad Hub",
    slug: "digital-nomad-hub",
    location: "555 Tech Street",
    city: "Austin",
    country: "USA",
    rating: 4.6,
    reviewCount: 312,
    description:
      "Designed for digital nomads and remote workers. High-speed internet, coworking spaces, and a community of like-minded travelers. Weekly networking events and skill shares.",
    shortDescription:
      "Coworking hostel for digital nomads with high-speed internet.",
    images: [
      "/hostels/austin/coworking.jpg",
      "/hostels/austin/dorm.jpg",
      "/hostels/austin/workspace.jpg",
      "/hostels/austin/rooftop.jpg",
      "/hostels/austin/event.jpg",
    ],
    amenities: [
      "High-Speed WiFi",
      "Coworking Space",
      "Printing Services",
      "Private Booths",
      "24/7 Access",
      "Coffee Bar",
      "Standing Desks",
      "Meeting Rooms",
      "Skill Share Events",
      "Networking Mixers",
    ],
    roomTypes: [
      {
        id: 1,
        name: "6-Bed Nomad Dorm",
        description: "Dormitory with work desk and high-speed internet access",
        pricePerNight: 30,
        capacity: 6,
        beds: "6 Bunk Beds",
        availability: 4,
        features: ["Work Desk", "Fast WiFi", "Power Strip", "Privacy Screen"],
      },
      {
        id: 2,
        name: "Private Studio",
        description: "Private room with dedicated workspace",
        pricePerNight: 70,
        capacity: 1,
        beds: "1 Single Bed",
        availability: 2,
        features: [
          "Private Workspace",
          "Monitor Available",
          "Ergonomic Chair",
          "Soundproof",
        ],
      },
    ],
    policies: {
      checkIn: "Anytime (24/7 reception)",
      checkOut: "12:00 PM",
      cancellation: "Free cancellation up to 7 days before check-in",
      ageRestriction: "18+ only",
      houseRules: [
        "Respect quiet work hours",
        "No calls in dorm rooms",
        "Clean workspace after use",
        "Network responsibly",
      ],
    },
    reviews: [
      {
        id: 1,
        user: "Priya S.",
        rating: 5,
        date: "1 month ago",
        comment:
          "Perfect for remote work! The WiFi is blazing fast and the coworking community is amazing.",
        stayType: "Solo Traveler",
        travelerType: "Digital Nomad",
        nationality: "India",
      },
    ],
    contact: {
      phone: "+1 (512) 555-1357",
      email: "connect@nomadhub.com",
    },
    features: {
      freeBreakfast: true,
      freeWiFi: true,
      lockers: true,
      kitchen: true,
      laundry: true,
      bar: true,
      commonRoom: true,
      terrace: true,
      gym: false,
      bikeRental: true,
      tourDesk: false,
    },
    locationDetails: {
      latitude: 30.2672,
      longitude: -97.7431,
      distanceToCityCenter: "Downtown",
      nearbyAttractions: [
        "Tech Companies",
        "Coffee Shops",
        "Live Music Venues",
      ],
      publicTransport: ["Bus: MetroRapid"],
    },
    tags: [
      "Digital Nomad",
      "Coworking",
      "High-Speed WiFi",
      "Networking",
      "Modern",
    ],
    isFeatured: true,
  },
  {
    id: 6,
    name: "Zen Garden Hostel",
    slug: "zen-garden-hostel",
    location: "888 Peace Lane",
    city: "Portland",
    country: "USA",
    rating: 4.8,
    reviewCount: 145,
    description:
      "A tranquil oasis in the city. Yoga classes, meditation sessions, organic breakfast, and beautiful Japanese gardens. Perfect for travelers seeking peace and wellness.",
    shortDescription:
      "Wellness-focused hostel with yoga and meditation classes.",
    images: [
      "/hostels/portland/garden.jpg",
      "/hostels/portland/yoga.jpg",
      "/hostels/portland/tea.jpg",
      "/hostels/portland/dorm.jpg",
      "/hostels/portland/meditation.jpg",
    ],
    amenities: [
      "Free WiFi",
      "Daily Yoga Classes",
      "Meditation Garden",
      "Organic Breakfast",
      "Tea Ceremony",
      "Massage Room",
      "Herb Garden",
      "Book Exchange",
      "Quiet Zones",
      "Vegetarian Kitchen",
    ],
    roomTypes: [
      {
        id: 1,
        name: "4-Bed Zen Dorm",
        description: "Minimalist dormitory designed for peace and relaxation",
        pricePerNight: 27,
        capacity: 4,
        beds: "4 Single Beds",
        availability: 3,
        features: [
          "Minimalist Design",
          "Essential Oils",
          "Sleep Mask",
          "White Noise",
        ],
      },
      {
        id: 2,
        name: "Private Meditation Room",
        description: "Private room with meditation space and garden view",
        pricePerNight: 60,
        capacity: 1,
        beds: "1 Tatami Mat",
        availability: 1,
        features: ["Meditation Space", "Garden View", "Yoga Mat", "Incense"],
      },
    ],
    policies: {
      checkIn: "3:00 PM - 7:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 72 hours before check-in",
      ageRestriction: "16+ only",
      houseRules: [
        "Silence in meditation areas",
        "No shoes indoors",
        "Respect quiet hours",
        "Vegetarian kitchen only",
      ],
    },
    reviews: [
      {
        id: 1,
        user: "Maya K.",
        rating: 5,
        date: "2 weeks ago",
        comment:
          "The most peaceful hostel I've ever stayed at. The morning yoga sessions were transformative.",
        stayType: "Solo Traveler",
        travelerType: "Wellness Traveler",
        nationality: "Japan",
      },
    ],
    contact: {
      phone: "+1 (503) 555-3698",
      email: "peace@zengardenhostel.com",
    },
    features: {
      freeBreakfast: true,
      freeWiFi: true,
      lockers: true,
      kitchen: true,
      laundry: true,
      bar: false,
      commonRoom: true,
      terrace: true,
      gym: false,
      bikeRental: true,
      tourDesk: false,
    },
    locationDetails: {
      latitude: 45.5152,
      longitude: -122.6784,
      distanceToCityCenter: "15 min walk",
      nearbyAttractions: ["Japanese Garden", "Tea Houses", "Parks"],
      publicTransport: ["Streetcar: 5 min walk"],
    },
    tags: ["Wellness", "Yoga", "Meditation", "Quiet", "Organic", "Tranquil"],
  },
  {
    id: 7,
    name: "Party Palace Hostel",
    slug: "party-palace-hostel",
    location: "999 Bourbon Street",
    city: "New Orleans",
    country: "USA",
    rating: 4.2,
    reviewCount: 421,
    description:
      "The ultimate party hostel in the heart of New Orleans! Nightly events, live music, and the best location for experiencing the city's famous nightlife.",
    shortDescription: "Non-stop party hostel in the French Quarter.",
    images: [
      "/hostels/neworleans/party.jpg",
      "/hostels/neworleans/bar.jpg",
      "/hostels/neworleans/livemusic.jpg",
      "/hostels/neworleans/dorm.jpg",
      "/hostels/neworleans/rooftop.jpg",
    ],
    amenities: [
      "Free WiFi",
      "Nightly Parties",
      "Live Music",
      "Rooftop Bar",
      "Pool Table",
      "Karaoke",
      "Theme Nights",
      "DJ Equipment",
      "Party Host",
      "Bar Crawls",
    ],
    roomTypes: [
      {
        id: 1,
        name: "12-Bed Party Dorm",
        description: "Large dormitory for social butterflies and party lovers",
        pricePerNight: 22,
        capacity: 12,
        beds: "12 Bunk Beds",
        availability: 8,
        features: [
          "Soundproofing",
          "Party Lights",
          "Music System",
          "Social Host",
        ],
      },
      {
        id: 2,
        name: "Private Recovery Room",
        description: "Private quiet room for resting after the party",
        pricePerNight: 50,
        capacity: 2,
        beds: "1 Queen Bed",
        availability: 3,
        features: [
          "Soundproof",
          "Blackout Curtains",
          "Quiet Zone",
          "Recovery Kit",
        ],
      },
    ],
    policies: {
      checkIn: "Anytime (24/7)",
      checkOut: "12:00 PM",
      cancellation: "Free cancellation up to 24 hours before check-in",
      ageRestriction: "21+ only",
      houseRules: [
        "Party responsibly",
        "Respect other guests",
        "No outside alcohol",
        "Have fun!",
      ],
    },
    reviews: [
      {
        id: 1,
        user: "Diego M.",
        rating: 5,
        date: "1 week ago",
        comment:
          "Unforgettable experience! The hostel-organized bar crawls were epic and I made friends for life.",
        stayType: "Group Travel",
        travelerType: "Party Traveler",
        nationality: "Mexico",
      },
    ],
    contact: {
      phone: "+1 (504) 555-7890",
      email: "party@partypalace.com",
    },
    features: {
      freeBreakfast: false,
      freeWiFi: true,
      lockers: true,
      kitchen: true,
      laundry: true,
      bar: true,
      commonRoom: true,
      terrace: true,
      gym: false,
      bikeRental: false,
      tourDesk: true,
    },
    locationDetails: {
      latitude: 29.9511,
      longitude: -90.0715,
      distanceToCityCenter: "French Quarter",
      nearbyAttractions: [
        "Bourbon Street",
        "Frenchmen Street",
        "Jackson Square",
      ],
      publicTransport: ["Streetcar: 2 min walk"],
    },
    tags: ["Party", "Nightlife", "Social", "Live Music", "21+", "Events"],
    isPopular: true,
  },
  {
    id: 8,
    name: "Family-Friendly Hostel",
    slug: "family-friendly-hostel",
    location: "222 Family Avenue",
    city: "Orlando",
    country: "USA",
    rating: 4.5,
    reviewCount: 167,
    description:
      "Perfect for families traveling on a budget. Family rooms, kids' play area, and theme park shuttle service. We make family travel affordable and fun!",
    shortDescription:
      "Budget-friendly hostel designed for families with children.",
    images: [
      "/hostels/orlando/family.jpg",
      "/hostels/orlando/playroom.jpg",
      "/hostels/orlando/kitchen.jpg",
      "/hostels/orlando/pool.jpg",
      "/hostels/orlando/shuttle.jpg",
    ],
    amenities: [
      "Free WiFi",
      "Kids Play Area",
      "Family Kitchen",
      "Theme Park Shuttle",
      "Baby Equipment",
      "Family Games",
      "Child Safety",
      "Laundry Service",
      "High Chairs",
      "Strollers",
    ],
    roomTypes: [
      {
        id: 1,
        name: "Family Room (4 people)",
        description: "Private room with two bunk beds and ensuite bathroom",
        pricePerNight: 75,
        capacity: 4,
        beds: "2 Bunk Beds",
        availability: 2,
        features: [
          "Private Bathroom",
          "Family Size",
          "Kids' Toys",
          "Safety Features",
        ],
      },
      {
        id: 2,
        name: "Family Suite (6 people)",
        description: "Large suite with separate parents' area",
        pricePerNight: 110,
        capacity: 6,
        beds: "1 Queen + 2 Bunk Beds",
        availability: 1,
        features: [
          "Two Rooms",
          "Kitchenette",
          "TV with Kids Channels",
          "Play Area",
        ],
      },
    ],
    policies: {
      checkIn: "2:00 PM - 8:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 7 days before check-in",
      ageRestriction: "All ages welcome",
      houseRules: [
        "Supervise children",
        "Family-friendly content only",
        "Respect quiet hours",
        "Clean up toys",
      ],
    },
    reviews: [
      {
        id: 1,
        user: "The Johnson Family",
        rating: 5,
        date: "3 weeks ago",
        comment:
          "Saved so much money on our Disney trip! The kids loved the playroom and the shuttle was so convenient.",
        stayType: "Family Travel",
        travelerType: "Family",
        nationality: "USA",
      },
    ],
    contact: {
      phone: "+1 (407) 555-2468",
      email: "family@familyhostel.com",
    },
    features: {
      freeBreakfast: true,
      freeWiFi: true,
      lockers: true,
      kitchen: true,
      laundry: true,
      bar: false,
      commonRoom: true,
      terrace: true,
      gym: false,
      bikeRental: false,
      tourDesk: true,
    },
    locationDetails: {
      latitude: 28.5383,
      longitude: -81.3792,
      distanceToCityCenter: "Near theme parks",
      nearbyAttractions: ["Disney World", "Universal Studios", "SeaWorld"],
      publicTransport: ["Free theme park shuttle"],
    },
    tags: ["Family", "Kids", "Theme Parks", "Budget", "Safe", "Convenient"],
  },
];

// Helper functions for filtering and sorting
export const filterHostelsByCity = (city: string): HostelListing[] => {
  return HOSTELLISTINGSAMPLE.filter(
    (hostel) => hostel.city.toLowerCase() === city.toLowerCase(),
  );
};

export const filterHostelsByTag = (tag: string): HostelListing[] => {
  return HOSTELLISTINGSAMPLE.filter((hostel) =>
    hostel.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase())),
  );
};

export const sortHostelsByPrice = (
  ascending: boolean = true,
): HostelListing[] => {
  return [...HOSTELLISTINGSAMPLE].sort((a, b) => {
    const priceA = Math.min(...a.roomTypes.map((r) => r.pricePerNight));
    const priceB = Math.min(...b.roomTypes.map((r) => r.pricePerNight));
    return ascending ? priceA - priceB : priceB - priceA;
  });
};

export const sortHostelsByRating = (): HostelListing[] => {
  return [...HOSTELLISTINGSAMPLE].sort((a, b) => b.rating - a.rating);
};

export const getFeaturedHostels = (): HostelListing[] => {
  return HOSTELLISTINGSAMPLE.filter((hostel) => hostel.isFeatured);
};

export const getPopularHostels = (): HostelListing[] => {
  return HOSTELLISTINGSAMPLE.filter((hostel) => hostel.isPopular);
};
