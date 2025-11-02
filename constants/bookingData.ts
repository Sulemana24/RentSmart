import { PropertyProps } from "@/interfaces";

export interface BookingData {
  id: string;
  propertyId: number;
  bookingDate: string;
  checkIn: string;
  checkOut: string;
  status: "confirmed" | "pending" | "completed";
  totalAmount: string;
  property?: PropertyProps;
}

export const MOCK_BOOKING_DATA: Record<string, BookingData> = {
  ABC123: {
    id: "ABC123",
    propertyId: 1,
    bookingDate: "2024-01-10",
    checkIn: "2024-02-15",
    checkOut: "2024-02-20",
    status: "confirmed",
    totalAmount: "1,200",
  },
  XYZ789: {
    id: "XYZ789",
    propertyId: 2,
    bookingDate: "2024-02-01",
    checkIn: "2024-03-10",
    checkOut: "2024-03-17",
    status: "pending",
    totalAmount: "2,800",
  },
  DEF456: {
    id: "DEF456",
    propertyId: 3,
    bookingDate: "2023-12-15",
    checkIn: "2024-01-20",
    checkOut: "2024-01-25",
    status: "completed",
    totalAmount: "1,800",
  },
  GHI789: {
    id: "GHI789",
    propertyId: 6,
    bookingDate: "2023-11-20",
    checkIn: "2024-01-05",
    checkOut: "2024-01-12",
    status: "completed",

    totalAmount: "3,500",
  },
  JKL012: {
    id: "JKL012",
    propertyId: 11,
    bookingDate: "2024-01-25",
    checkIn: "2024-04-01",
    checkOut: "2024-04-08",
    status: "confirmed",
    totalAmount: "4,200",
  },
};
