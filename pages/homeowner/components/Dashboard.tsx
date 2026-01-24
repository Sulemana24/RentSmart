"use client";
import {
  FiHome,
  FiCalendar,
  FiTrendingUp,
  FiUsers,
  FiPlus,
  FiDownload,
  FiMessageSquare,
} from "react-icons/fi";
import StatCard from "./common/StatCard";

import QuickActions from "./common/QuickActions";

const Dashboard = () => {
  const dashboardStats = [
    {
      title: "Total Properties",
      value: "8",
      change: "+2",
      icon: <FiHome />,
      color: "text-[#00CFFF]",
      bgColor: "bg-[#00CFFF]/10",
    },
    {
      title: "Active Bookings",
      value: "12",
      change: "+3",
      icon: <FiCalendar />,
      color: "text-[#FF4FA1]",
      bgColor: "bg-[#FF4FA1]/10",
    },
    {
      title: "Monthly Revenue",
      value: "₵8,500",
      change: "+15%",
      icon: <FiTrendingUp />,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Tenants",
      value: "24",
      change: "+4",
      icon: <FiUsers />,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  const recentBookings = [
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

  const recentPayments = [
    {
      id: 1,
      tenant: "John Mensah",
      property: "Luxury Apartment",
      amount: "₵2,500",
      date: "2024-03-01",
      status: "Paid",
    },
    {
      id: 2,
      tenant: "Ama Serwaa",
      property: "Commercial Space",
      amount: "₵5,000",
      date: "2024-03-05",
      status: "Paid",
    },
    {
      id: 3,
      tenant: "Kwame Asante",
      property: "Studio Apartments",
      amount: "₵1,200",
      date: "2024-03-10",
      status: "Pending",
    },
  ];

  const quickActions = [
    {
      label: "Add Property",
      icon: <FiPlus />,
      color: "text-[#00CFFF]",
    },
    {
      label: "View Bookings",
      icon: <FiCalendar />,
      color: "text-[#FF4FA1]",
    },
    {
      label: "Send Message",
      icon: <FiMessageSquare />,
      color: "text-green-500",
    },
    {
      label: "Generate Report",
      icon: <FiDownload />,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Bookings
          </h3>
          <button className="text-sm text-[#00CFFF] hover:text-[#FF4FA1] transition-colors">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {recentBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
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
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {booking.type}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {booking.property} • {booking.date} at {booking.time}
                </div>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Payments
          </h3>
          <button className="text-sm text-[#00CFFF] hover:text-[#FF4FA1] transition-colors">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {recentPayments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      payment.status === "Paid"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  ></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {payment.tenant}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {payment.property} • {payment.date}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {payment.amount}
                </div>
                <div className="text-xs text-gray-500">{payment.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions actions={quickActions} />
    </div>
  );
};

export default Dashboard;
