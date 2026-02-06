"use client";

import React from "react";
import Link from "next/link";
import {
  FiHome,
  FiUsers,
  FiTrendingUp,
  FiUser,
  FiChevronRight,
  FiPlus,
  FiDollarSign,
  FiDownload,
} from "react-icons/fi";

interface DashboardProps {
  // Props can be defined here
}

const Dashboard: React.FC<DashboardProps> = () => {
  const dashboardStats = [
    {
      title: "Total Rooms",
      value: "42",
      change: "+5",
      icon: <FiHome />,
      color: "text-[#00CFFF]",
      bgColor: "bg-[#00CFFF]/10",
    },
    {
      title: "Occupied Rooms",
      value: "36",
      change: "+3",
      icon: <FiUsers />,
      color: "text-[#FF4FA1]",
      bgColor: "bg-[#FF4FA1]/10",
    },
    {
      title: "Monthly Revenue",
      value: "₵12,500",
      change: "+18%",
      icon: <FiTrendingUp />,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Students",
      value: "86",
      change: "+8",
      icon: <FiUser />,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  const bookings = [
    { id: 1, type: "Room Booking", student: "Ama Serwaa", date: "2024-03-15", duration: "6 months", status: "Confirmed" },
    { id: 2, type: "Room Transfer", student: "John Mensah", date: "2024-03-20", duration: "Room 201 → 205", status: "Pending" },
    { id: 3, type: "Extension Request", student: "Kofi Ansah", date: "2024-03-18", duration: "+3 months", status: "Approved" },
  ];

  const payments = [
    { id: 1, student: "John Mensah", room: "Room 101", amount: "₵300", date: "2024-03-01", status: "Paid" },
    { id: 2, student: "Ama Serwaa", room: "Room 104", amount: "₵700", date: "2024-03-05", status: "Paid" },
    { id: 3, student: "Kwame Asante", room: "Room 103", amount: "₵300", date: "2024-03-10", status: "Overdue" },
  ];

  // Updated Quick Actions with paths that match your sidebar/routing structure
  const quickActions = [
    {
      label: "Add Room",
      icon: <FiPlus />,
      color: "text-[#00CFFF]",
      path: "/rooms", // Or "/rooms/add" if you have a specific form
    },
    {
      label: "Check-in Student",
      icon: <FiUser />,
      color: "text-[#FF4FA1]",
      path: "/students",
    },
    {
      label: "Collect Payment",
      icon: <FiDollarSign />,
      color: "text-green-500",
      path: "/payments",
    },
    {
      label: "Generate Report",
      icon: <FiDownload />,
      color: "text-purple-500",
      path: "/reports",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}>
                {stat.icon}
              </div>
              <span className="text-sm font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded">
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {stat.title}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Bookings
            </h3>
            <Link 
              href="/bookings" 
              className="text-sm text-[#00CFFF] hover:text-[#FF4FA1] transition-colors font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {bookings.slice(0, 3).map((booking) => (
              <Link
                href={`/bookings/${booking.id}`}
                key={booking.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        booking.status === "Confirmed"
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : booking.status === "Pending"
                            ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                            : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      {booking.status}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {booking.type}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {booking.student} • {booking.date}
                  </div>
                </div>
                <FiChevronRight className="text-gray-400 group-hover:text-[#00CFFF] transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Payments
            </h3>
            <Link 
              href="/payments" 
              className="text-sm text-[#00CFFF] hover:text-[#FF4FA1] transition-colors font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {payments.slice(0, 3).map((payment) => (
              <Link
                href={`/payments/${payment.id}`}
                key={payment.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        payment.status === "Paid"
                          ? "bg-green-500"
                          : payment.status === "Overdue"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                      }`}
                    ></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {payment.student}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {payment.room} • {payment.date}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {payment.amount}
                  </div>
                  <div
                    className={`text-[10px] font-bold uppercase ${
                      payment.status === "Paid"
                        ? "text-green-500"
                        : payment.status === "Overdue"
                          ? "text-red-500"
                          : "text-yellow-500"
                    }`}
                  >
                    {payment.status}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions - Linked to Sections */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.path}
              className="flex flex-col items-center justify-center p-6 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-[#00CFFF]/5 hover:border-[#00CFFF]/20 transition-all group active:scale-95"
            >
              <div className={`text-3xl mb-3 ${action.color} group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <div className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight text-center">
                {action.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;