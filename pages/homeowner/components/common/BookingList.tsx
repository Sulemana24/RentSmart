"use client";
import { FiCheck, FiX, FiEye } from "react-icons/fi";

interface Booking {
  id: number;
  type: string;
  property: string;
  date: string;
  time: string;
  status: string;
}

interface BookingListProps {
  bookings: Booking[];
}

const BookingList = ({ bookings }: BookingListProps) => {
  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="mb-3 md:mb-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-lg font-medium text-gray-900 dark:text-white">
                {booking.type}
              </div>
              <div
                className={`px-2 py-1 rounded text-xs font-medium ${
                  booking.status === "Confirmed"
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : booking.status === "Pending"
                      ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                      : "bg-red-500/10 text-red-600 dark:text-red-400"
                }`}
              >
                {booking.status}
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {booking.property} • {booking.date} at {booking.time}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {booking.status === "Pending" && (
              <>
                <button className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 flex items-center gap-1">
                  <FiCheck />
                  Approve
                </button>
                <button className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 flex items-center gap-1">
                  <FiX />
                  Reject
                </button>
              </>
            )}
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#00CFFF] hover:bg-[#00CFFF]/10 rounded-lg transition-colors">
              <FiEye />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingList;
