"use client";

import React, { useState } from "react";
import {
  FiHome,
  FiUsers,
  FiTrendingUp,
  FiUser,
  FiChevronRight,
  FiPlus,
  FiDollarSign,
  FiDownload,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiArrowRight,
} from "react-icons/fi";

// --- Types ---
interface Stat {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  path: string;
}

const Dashboard: React.FC = () => {
  // --- State for Interactivity ---
  const [activeTab, setActiveTab] = useState<"bookings" | "payments" | "notifications">("bookings");
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Mock navigation function
  const navigateTo = (path: string) => {
    showToast(`Navigating to ${path}...`);
    // In a real app: router.push(path)
  };

  const dashboardStats: Stat[] = [
    {
      title: "Total Rooms",
      value: "42",
      change: "+5",
      icon: <FiHome />,
      color: "text-[#00CFFF]",
      bgColor: "bg-[#00CFFF]/10",
      path: "/rooms",
    },
    {
      title: "Occupied Rooms",
      value: "36",
      change: "+3",
      icon: <FiUsers />,
      color: "text-[#FF4FA1]",
      bgColor: "bg-[#FF4FA1]/10",
      path: "/occupancy",
    },
    {
      title: "Monthly Revenue",
      value: "₵12,500",
      change: "+18%",
      icon: <FiTrendingUp />,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      path: "/finance",
    },
    {
      title: "Total Students",
      value: "86",
      change: "+8",
      icon: <FiUser />,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      path: "/students",
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

  return (
    <div className="relative space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* --- Toast Notification --- */}
      {notification && (
        <div className="fixed top-4 right-4 z-[100] bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 border border-gray-700">
          <FiCheckCircle className="text-[#00CFFF]" />
          <span className="text-sm font-bold">{notification}</span>
        </div>
      )}

      {/* --- Stats Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => (
          <button
            key={index}
            onClick={() => navigateTo(stat.path)}
            className="bg-white dark:bg-gray-800 text-left rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.color} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <span className="text-xs font-black text-green-500 bg-green-500/10 px-2.5 py-1 rounded-lg">
                {stat.change}
              </span>
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              {stat.value}
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                {stat.title}
              </div>
              <FiArrowRight className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* --- Dynamic List Section --- */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pr-6">
              <div className="flex flex-1">
                <button 
                  onClick={() => setActiveTab("bookings")}
                  className={`px-6 py-4 text-sm font-bold transition-colors ${activeTab === 'bookings' ? 'text-[#00CFFF] border-b-2 border-[#00CFFF]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Recent Bookings
                </button>
                <button 
                  onClick={() => setActiveTab("payments")}
                  className={`px-6 py-4 text-sm font-bold transition-colors ${activeTab === 'payments' ? 'text-[#00CFFF] border-b-2 border-[#00CFFF]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Recent Payments
                </button>
              </div>
              <button 
                onClick={() => navigateTo(activeTab === 'bookings' ? '/bookings' : '/payments')}
                className="text-xs font-bold text-[#FF4FA1] hover:underline"
              >
                View All
              </button>
            </div>

            <div className="p-4 sm:p-6 min-h-[350px]">
              {activeTab === "bookings" ? (
                <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">
                  {bookings.map((booking) => (
                    <div 
                      key={booking.id} 
                      onClick={() => navigateTo(`/bookings/${booking.id}`)}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl hover:ring-2 ring-[#00CFFF]/20 hover:bg-white dark:hover:bg-gray-700 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-gray-400 shadow-sm">
                           <FiClock />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-black text-gray-900 dark:text-white">{booking.student}</span>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {booking.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 font-medium">{booking.type} • {booking.duration}</p>
                        </div>
                      </div>
                      <FiChevronRight className="text-gray-300 group-hover:text-[#00CFFF] transition-colors" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                  {payments.map((payment) => (
                    <div 
                      key={payment.id} 
                      onClick={() => navigateTo(`/payments/${payment.id}`)}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border-l-4 border-[#00CFFF] hover:bg-white dark:hover:bg-gray-700 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#00CFFF]/10 rounded-lg text-[#00CFFF]">
                          <FiDollarSign />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 dark:text-white">{payment.student}</p>
                          <p className="text-xs text-gray-500 font-medium">{payment.room} • {payment.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-gray-900 dark:text-white">{payment.amount}</p>
                        <p className={`text-[10px] font-bold ${payment.status === 'Paid' ? 'text-green-500' : 'text-red-500'}`}>{payment.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- Sidebar --- */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6">Operations</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Add Room", icon: <FiPlus />, color: "text-[#00CFFF]", path: "/rooms/new" },
                { label: "Check-in", icon: <FiUser />, color: "text-[#FF4FA1]", path: "/check-in" },
                { label: "Collect", icon: <FiDollarSign />, color: "text-green-500", path: "/billing" },
                { label: "Report", icon: <FiDownload />, color: "text-purple-500", path: "/reports" },
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigateTo(action.path)}
                  className="flex flex-col items-center justify-center p-4 border border-gray-100 dark:border-gray-700 rounded-2xl hover:bg-[#00CFFF]/5 hover:border-[#00CFFF]/30 transition-all active:scale-95 group"
                >
                  <div className={`text-xl mb-2 ${action.color} group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                  <div className="text-[10px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-tighter">
                    {action.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Functional Progress Card */}
          <div 
            onClick={() => navigateTo('/rooms')}
            className="bg-gradient-to-br from-[#00CFFF] to-[#009fbf] rounded-2xl p-6 text-white shadow-lg shadow-[#00CFFF]/20 cursor-pointer hover:brightness-110 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-black uppercase tracking-widest">Occupancy Rate</h4>
              <FiTrendingUp className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-black">85.7%</span>
              <span className="text-xs font-bold mb-1.5">+2.4%</span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
               <div className="bg-white h-full transition-all duration-1000" style={{ width: '85%' }}></div>
            </div>
            <p className="text-[10px] mt-4 font-medium text-white/80">Click to view available inventory.</p>
          </div>
        </div>
      </div>

      {/* --- Action Bar --- */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-500/10 text-yellow-600 rounded-full flex items-center justify-center text-xl shrink-0 animate-pulse">
            <FiAlertCircle />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">Attention Required</h4>
            <p className="text-sm text-gray-500">3 Maintenance requests are pending for over 48 hours.</p>
          </div>
        </div>
        <button 
          onClick={() => navigateTo('/maintenance')}
          className="w-full md:w-auto px-8 py-3 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-xl active:scale-95 transition-all"
        >
          Review Requests
        </button>
      </div>
    </div>
  );
};

export default Dashboard;