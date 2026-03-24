"use client";

import React, { useState, useEffect } from "react";
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
  FiArrowUpRight,
  FiActivity,
  FiSearch,
  FiBell,
} from "react-icons/fi";

// Tip: You could later pass this as a prop or fetch it from a database
const HOSTEL_NAME = "Royal Heights Hostel";

const Dashboard: React.FC = () => {
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const dashboardStats = [
    { title: "Total Rooms", value: "42", change: "+5", icon: <FiHome />, color: "text-[#00CFFF]", bgColor: "bg-[#00CFFF]/10" },
    { title: "Occupied Rooms", value: "36", change: "+3", icon: <FiUsers />, color: "text-[#FF4FA1]", bgColor: "bg-[#FF4FA1]/10" },
    { title: "Monthly Revenue", value: "₵12,500", change: "+18%", icon: <FiTrendingUp />, color: "text-green-500", bgColor: "bg-green-500/10" },
    { title: "Total Students", value: "86", change: "+8", icon: <FiUser />, color: "text-purple-500", bgColor: "bg-purple-500/10" },
  ];

  const quickActions = [
    { label: "Add Room", icon: <FiPlus />, color: "text-[#00CFFF]", bgColor: "bg-[#00CFFF]/5", path: "/AddRoom" },
    { label: "Students", icon: <FiUsers />, color: "text-[#FF4FA1]", bgColor: "bg-[#FF4FA1]/5", path: "/Students" },
    { label: "Collect Payment", icon: <FiDollarSign />, color: "text-green-500", bgColor: "bg-green-500/5", path: "/Payments" },
    { label: "Generate Report", icon: <FiDownload />, color: "text-purple-500", bgColor: "bg-purple-500/5", path: "/Reports" },
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

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      
      {/* Search & Notification Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
        <div className="relative w-full sm:w-96">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search students, rooms, or transactions..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#00CFFF] outline-none"
          />
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          <button className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <FiBell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800" />
          </button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#00CFFF] to-[#FF4FA1]" />
        </div>
      </div>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            {HOSTEL_NAME}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {greeting}! Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">System Status</p>
            <p className="text-sm font-semibold text-green-500 flex items-center justify-end gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {dashboardStats.map((stat, index) => (
          <div
            key={index}
            className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.color} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">
                <FiArrowUpRight /> {stat.change}
              </div>
            </div>
            <div className="relative z-10">
              <div className="text-3xl font-black text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {stat.title}
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 text-gray-50 dark:text-gray-700/20 group-hover:text-gray-100 dark:group-hover:text-gray-700/40 transition-colors">
               {React.cloneElement(stat.icon as React.ReactElement, { size: 80 })}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-lg">
                <FiActivity />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">Recent Activity</h3>
            </div>
            <Link href="/Bookings" className="text-[10px] font-bold text-[#00CFFF] hover:underline uppercase tracking-widest">
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-700">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-5 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-500 text-xs">
                    {booking.student.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{booking.student}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${
                        booking.status === "Confirmed" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5 truncate">{booking.type} • {booking.duration}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-medium text-gray-400">{booking.date}</p>
                  <FiChevronRight className="inline-block ml-2 text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Actions & Revenue */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.path}
                  className={`flex items-center gap-4 p-4 rounded-xl border border-transparent transition-all group hover:border-gray-100 dark:hover:border-gray-700 ${action.bgColor} hover:shadow-sm active:scale-[0.98]`}
                >
                  <div className={`text-xl ${action.color} group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                    {action.label}
                  </span>
                  <FiChevronRight className="ml-auto text-gray-300 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-black rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Target Achievement</p>
              <h4 className="text-2xl font-black mb-4">65%</h4>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#00CFFF] w-[65%] rounded-full shadow-[0_0_10px_#00CFFF]" />
              </div>
              <p className="text-[10px] text-gray-400 mt-3 font-medium leading-relaxed">Keep going! You're ₵7.5k away from your monthly goal.</p>
            </div>
            <FiTrendingUp className="absolute -right-2 -bottom-2 text-white/5" size={100} />
          </div>
        </div>
      </div>
      
      {/* Footer Payment Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <h3 className="font-bold text-gray-900 dark:text-white mb-6">Recent Payments</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {payments.map((payment) => (
            <div key={payment.id} className="p-4 rounded-xl border border-gray-50 dark:border-gray-700 hover:border-[#00CFFF]/30 transition-colors bg-gray-50/30 dark:bg-transparent">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-black text-gray-400 uppercase">{payment.room}</span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  payment.status === "Paid" ? "text-green-500 bg-green-50 dark:bg-green-500/10" : "text-red-500 bg-red-50 dark:bg-red-500/10"
                }`}>
                  {payment.status}
                </span>
              </div>
              <p className="font-black text-gray-900 dark:text-white">{payment.amount}</p>
              <p className="text-[11px] text-gray-500 mt-1 font-medium">{payment.student}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;