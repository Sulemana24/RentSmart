// File: data/homeownerData.ts
export const PROPERTIES = [
  {
    id: "p-1",
    name: "Sunset Villa",
    address: { city: "Accra", state: "Greater Accra" },
    beds: 3,
    price: 450,
    isActive: true,
    image: "https://source.unsplash.com/collection/483251/800x600",
    host: "Kwame Mensah",
  },
  {
    id: "p-2",
    name: "Lakeside Cottage",
    address: { city: "Kumasi", state: "Ashanti" },
    beds: 2,
    price: 300,
    isActive: false,
    image: "https://source.unsplash.com/collection/483251/801x601",
    host: "Kwame Mensah",
  },
];

export const BOOKINGS = [
  {
    id: "b-1",
    propertyId: "p-1",
    propertyName: "Sunset Villa",
    guestName: "Amina Abubakar",
    guestEmail: "amina@example.com",
    duration: "3 nights",
    startDate: "2025-09-10",
    amount: 1350,
    status: "pending",
  },
  {
    id: "b-2",
    propertyId: "p-2",
    propertyName: "Lakeside Cottage",
    guestName: "John Doe",
    guestEmail: "john@example.com",
    duration: "2 nights",
    startDate: "2025-10-01",
    amount: 600,
    status: "confirmed",
  },
];

export const PAYMENTS = [
  { id: "pm-1", brand: "Visa", last4: "4242", exp: "12/26" },
  { id: "pm-2", brand: "Mastercard", last4: "1111", exp: "03/27" },
];

export const USER = {
  id: "u-1",
  name: "Kwame Mensah",
  email: "kwame@example.com",
  phone: "+233 24 000 0000",
};

export const HELP_RESOURCES = [
  { id: "h-1", title: "Getting started as a homeowner", link: "#" },
  { id: "h-2", title: "How to manage bookings", link: "#" },
  { id: "h-3", title: "Payment & payouts", link: "#" },
];

const homeownerData = {
  PROPERTIES,
  BOOKINGS,
  PAYMENTS,
  USER,
  HELP_RESOURCES,
};

export default homeownerData;
