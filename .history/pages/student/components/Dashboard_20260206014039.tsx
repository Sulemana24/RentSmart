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
  FiPieChart,
} from "react-icons/fi";

interface DashboardProps {
  hostelName?: string; // Prop to take the logged-in hostel name
}

const Dashboard: React.FC<DashboardProps> = ({ hostelName = "Royal Heights Hostel" }) => {
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
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all">
        <div className="relative w-full sm:w-96 group">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00CFFF] transition-colors" />
          <input 
            type="text" 
            placeholder="Search students, rooms, or transactions..." 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#00CFFF]/50 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          <button className="relative p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all active:scale-90">
            <FiBell size={20} />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800" />
          </button>
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#00CFFF] to-[#FF4FA1] p-0.5">
            <div className="h-full w-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center font-bold text-xs">
              AD
            </div>
          </div>
        </div>
      </div>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-8 bg-[#00CFFF] rounded-full" />
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {hostelName}
            </h1>
          </div>
          <p className="text-sm text-gray-500 ml-4 font-medium">
            {greeting}! Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">System Status</p>
            <p className="text-sm font-semibold text-green-500 flex items-center justify-end gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" /> Live
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {dashboardStats.map((stat, index) => (
          <div
            key={index}
            className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.color} group-hover:rotate-12 transition-transform`}>
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
            <div className="absolute -right-4 -bottom-4 text-gray-50 dark:text-gray-700/20 group-hover:text-[#00CFFF]/10 transition-colors pointer-events-none">
               {React.cloneElement(stat.icon as React.ReactElement, { size: 100 })}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-lg">
                <FiActivity />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">Recent Activity</h3>
            </div>
            <Link href="/Bookings" className="text-[10px] font-bold text-[#00CFFF] hover:text-[#FF4FA1] transition-colors uppercase tracking-widest">
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-700 flex-grow">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-5 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 shadow-sm group-hover:from-[#00CFFF] group-hover:to-[#00CFFF] group-hover:text-white transition-all">
                    {booking.student.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{booking.student}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${
                        booking.status === "Confirmed" ? "bg-green-100 text-green-600 dark:bg-green-500/20" : "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20"
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5 truncate font-medium">{booking.type} • {booking.duration}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 flex items-center gap-3">
                  <div className="hidden sm:block">
                    <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">{booking.date}</p>
                  </div>
                  <FiChevronRight className="text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Actions & Occupancy */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FiPlus className="text-[#00CFFF]" /> Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.path}
                  className={`flex items-center gap-4 p-4 rounded-xl border border-transparent transition-all group hover:border-gray-200 dark:hover:border-gray-600 ${action.bgColor} hover:shadow-md active:scale-[0.98]`}
                >
                  <div className={`text-xl ${action.color} group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                    {action.label}
                  </span>
                  <FiChevronRight className="ml-auto text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* New Feature: Live Occupancy Visualizer */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
               <h3 className="font-bold text-gray-900 dark:text-white text-sm">Occupancy Rate</h3>
               <FiPieChart className="text-purple-500" />
            </div>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                    High
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold inline-block text-purple-600">
                    86%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-purple-100 dark:bg-gray-700">
                <div style={{ width: "86%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"></div>
              </div>
              <p className="text-[10px] text-gray-400 font-medium leading-tight">6 rooms currently undergoing maintenance or vacant.</p>
            </div>
          </div>

          {/* Revenue Target Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-black rounded-2xl p-6 text-white shadow-xl overflow-hidden relative group">
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Target Achievement</p>
              <h4 className="text-2xl font-black mb-4 group-hover:text-[#00CFFF] transition-colors">65%</h4>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#00CFFF] w-[65%] rounded-full shadow-[0_0_15px_rgba(0,207,255,0.8)] transition-all duration-1000" />
              </div>
              <p className="text-[10px] text-gray-400 mt-3 font-medium leading-relaxed">Keep going! You're ₵7.5k away from your monthly goal.</p>
            </div>
            <FiTrendingUp className="absolute -right-2 -bottom-2 text-white/5 group-hover:text-white/10 transition-colors" size={120} />
          </div>
        </div>
      </div>
      
      {/* Footer Payment Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white">Recent Payments</h3>
            <Link href="/Payments" className="text-[10px] font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase">Details</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {payments.map((payment) => (
            <div key={payment.id} className="p-4 rounded-xl border border-gray-50 dark:border-gray-700 hover:border-[#00CFFF]/30 hover:shadow-md transition-all bg-gray-50/30 dark:bg-gray-900/20 group">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-black text-gray-400 uppercase group-hover:text-[#00CFFF] transition-colors">{payment.room}</span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  payment.status === "Paid" ? "text-green-500 bg-green-50 dark:bg-green-500/10" : "text-red-500 bg-red-50 dark:bg-red-500/10"
                }`}>
                  {payment.status}
                </span>
              </div>
              <p className="font-black text-lg text-gray-900 dark:text-white">{payment.amount}</p>
              <p className="text-[11px] text-gray-500 mt-1 font-semibold">{payment.student}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;