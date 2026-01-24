"use client";
import { FiPlus, FiCheck, FiX, FiEye } from "react-icons/fi";
import BookingStats from "./common/BookingStats";
import BookingList from "./common/BookingList";

const Bookings = () => {
  const bookingStats = [
    { label: "Tour Bookings", count: "8", color: "bg-[#00CFFF]" },
    { label: "Rental Bookings", count: "12", color: "bg-[#FF4FA1]" },
    { label: "Pending Approval", count: "3", color: "bg-yellow-500" },
  ];

  const bookings = [
    {
      id: 1,
      type: "Tour Booking",
      property: "Luxury Apartment",
      date: "2024-03-15",
      time: "2:00 PM",
      status: "Confirmed",
    },
    {
      id: 2,
      type: "Rental Booking",
      property: "Modern House",
      date: "2024-03-20",
      time: "10:00 AM",
      status: "Pending",
    },
    {
      id: 3,
      type: "Tour Booking",
      property: "Studio Apartments",
      date: "2024-03-18",
      time: "3:30 PM",
      status: "Cancelled",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Bookings Management
          </h2>
          <button className="px-4 py-2 bg-[#FF4FA1] text-white rounded-lg hover:bg-[#FF4FA1]/90 flex items-center gap-2">
            <FiPlus />
            New Booking
          </button>
        </div>

        <BookingStats stats={bookingStats} />

        <BookingList bookings={bookings} />
      </div>
    </div>
  );
};

export default Bookings;
