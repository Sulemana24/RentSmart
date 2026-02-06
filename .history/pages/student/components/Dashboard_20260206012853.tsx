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

const Dashboard: React.FC = () => {
  const dashboardStats = [
    {
      title: "Total Rooms",
      value: "42",
      change: "+5",
      icon: <FiHome />,
      color: "text-[#00CFFF]",
      bgColor: "bg-[#00CFFF]/10",
      path: "/rooms"
    },
    {
      title: "Occupied Rooms",
      value: "36",
      change: "+3",
      icon: <FiUsers />,
      color: "text-[#FF4FA1]",
      bgColor: "bg-[#FF4FA1]/10",
      path: "/occupancy"
    },
    {
      title: "Monthly Revenue",
      value: "₵12,500",
      change: "+18%",
      icon: <FiTrendingUp />,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      path: "/finance"
    },
    {
      title: "Total Students",
      value: "86",
      change: "+8",
      icon: <FiUser />,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      path: "/students"
    },
  ];

  // Updated Quick Actions to link to your specific files
  const quickActions = [
    {
      label: "Add Room",
      icon: <FiPlus />,
      color: "text-[#00CFFF]",
      path: "/rooms/add", // Links to AddRoom.tsx
    },
    {
      label: "Students",
      icon: <FiUser />,
      color: "text-[#FF4FA1]",
      path: "/students", // Links to Students.tsx
    },
    {
      label: "Payments",
      icon: <FiDollarSign />,
      color: "text-green-500",
      path: "/payments.tsx", // Links to Payments.tsx
    },
    {
      label: "Reports",
      icon: <FiDownload />,
      color: "text-purple-500",
      path: "/reports", // Links to Reports.tsx
    },
  ];

  const bookings = [
    { id: 1, type: "Room Booking", student: "Ama Serwaa", date: "2024-03-15", status: "Confirmed" },
    { id: 2, type: "Room Transfer", student: "John Mensah", date: "2024-03-20", status: "Pending" },
    { id: 3, type: "Extension Request", student: "Kofi Ansah", date: "2024-03-18", status: "Approved" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Stats Grid - Now Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => (
          <Link 
            key={index} 
            href={stat.path}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.color} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <span className="text-sm font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded">
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.title}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Bookings</h3>
            <Link href="/bookings" className="text-sm text-[#00CFFF] font-bold hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {bookings.map((booking) => (
              <Link 
                href={`/bookings/${booking.id}`} 
                key={booking.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors group"
              >
                <div className="text-sm">
                  <p className="font-bold text-gray-900 dark:text-white">{booking.student}</p>
                  <p className="text-gray-500">{booking.type} • {booking.date}</p>
                </div>
                <FiChevronRight className="text-gray-300 group-hover:text-[#00CFFF]" />
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.path}
                className="flex flex-col items-center justify-center p-6 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-[#00CFFF]/5 hover:border-[#00CFFF]/20 transition-all group active:scale-95"
              >
                <div className={`text-3xl mb-3 ${action.color} group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <div className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest text-center">
                  {action.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;