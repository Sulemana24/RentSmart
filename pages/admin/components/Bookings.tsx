import React from "react";
import { FiEye, FiEdit } from "react-icons/fi";

interface Booking {
  id: number;
  user: string;
  property: string;
  type: string;
  date: string;
  time: string;
  status: string;
}

interface BookingStat {
  label: string;
  value: string;
  color: string;
}

const Bookings: React.FC = () => {
  const bookings: Booking[] = [
    {
      id: 1,
      user: "David Wilson",
      property: "Luxury Villa",
      type: "Tour",
      date: "2024-03-20",
      time: "10:00 AM",
      status: "Confirmed",
    },
    {
      id: 2,
      user: "Emily Brown",
      property: "Modern Apartment",
      type: "Rental",
      date: "2024-03-22",
      time: "2:30 PM",
      status: "Pending",
    },
    {
      id: 3,
      user: "James Miller",
      property: "Commercial Space",
      type: "Tour",
      date: "2024-03-18",
      time: "11:00 AM",
      status: "Completed",
    },
    {
      id: 4,
      user: "Lisa Taylor",
      property: "Family House",
      type: "Rental",
      date: "2024-03-25",
      time: "3:00 PM",
      status: "Cancelled",
    },
  ];

  const bookingStats: BookingStat[] = [
    {
      label: "Total Bookings",
      value: "156",
      color: "bg-[#00CFFF]/10 text-[#00CFFF]",
    },
    {
      label: "Tour Bookings",
      value: "89",
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      label: "Rental Bookings",
      value: "67",
      color: "bg-green-500/10 text-green-600",
    },
    {
      label: "Pending",
      value: "12",
      color: "bg-yellow-500/10 text-yellow-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Bookings Management
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {bookingStats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6"
            >
              <div
                className={`text-3xl font-bold mb-2 ${stat.color.split(" ")[1]}`}
              >
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  User
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Property
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Date & Time
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                    {booking.user}
                  </td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                    {booking.property}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.type === "Tour"
                          ? "bg-blue-500/10 text-blue-600"
                          : "bg-green-500/10 text-green-600"
                      }`}
                    >
                      {booking.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                    {booking.date} at {booking.time}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === "Confirmed"
                          ? "bg-green-500/10 text-green-600"
                          : booking.status === "Pending"
                            ? "bg-yellow-500/10 text-yellow-600"
                            : booking.status === "Completed"
                              ? "bg-blue-500/10 text-blue-600"
                              : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#00CFFF] hover:bg-[#00CFFF]/10 rounded-lg">
                        <FiEye />
                      </button>
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-500 hover:bg-green-500/10 rounded-lg">
                        <FiEdit />
                      </button>
                      {booking.status === "Pending" && (
                        <button className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">
                          Approve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
