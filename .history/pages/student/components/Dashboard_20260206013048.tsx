"use client";

import React, { useState } from "react";
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
  FiCheckCircle,
  FiClock,
  FiArrowUpRight,
} from "react-icons/fi";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"bookings" | "payments">("bookings");
  const [showToast, setShowToast] = useState(false);

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const dashboardStats = [
    { title: "Total Rooms", value: "42", change: "+5", icon: <FiHome />, color: "text-[#00CFFF]", bgColor: "bg-[#00CFFF]/10", path: "/rooms" },
    { title: "Occupancy", value: "85%", change: "+3%", icon: <FiUsers />, color: "text-[#FF4FA1]", bgColor: "bg-[#FF4FA1]/10", path: "/students" },
    { title: "Revenue", value: "₵12,500", change: "+18%", icon: <FiTrendingUp />, color: "text-green-500", bgColor: "bg-green-500/10", path: "/payments" },
    { title: "Students", value: "86", change: "+8", icon: <FiUser />, color: "text-purple-500", bgColor: "bg-purple-500/10", path: "/students" },
  ];

  const quickActions = [
    { label: "Add Room", icon: <FiPlus />, color: "text-[#00CFFF]", path: "/AddRoom" },
    { label: "Students", icon: <FiUsers />, color: "text-[#FF4FA1]", path: "/Students" },
    { label: "Collect", icon: <FiDollarSign />, color: "text-green-500", path: "/Payments" },
    { label: "Reports", icon: <FiDownload />, color: "text-purple-500", path: "/Reports" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- Notification Toast --- */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl border border-white/10 animate-in slide-in-from-right">
          <FiCheckCircle className="text-green-400" />
          <span className="text-sm font-bold tracking-tight">Data updated successfully</span>
        </div>
      )}

      {/* --- Pro Stats Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <Link key={index} href={stat.path} className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bgColor} ${stat.color} transition-transform group-hover:scale-110`}>
                {stat.icon}
              </div>
              <div className="flex items-center gap-1 text-xs font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">
                <FiArrowUpRight /> {stat.change}
              </div>
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{stat.value}</div>
            <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-1">{stat.title}</div>
            <div className={`absolute bottom-0 left-0 h-1 w-0 ${stat.color.replace('text', 'bg')} transition-all duration-500 group-hover:w-full`} />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- Activity Center (Tabbed) --- */}
        <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50 dark:border-gray-700">
            <div className="flex gap-8">
              {["bookings", "payments"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`text-sm font-black uppercase tracking-widest transition-all relative py-2 ${activeTab === tab ? "text-gray-900 dark:text-white" : "text-gray-400"}`}
                >
                  Recent {tab}
                  {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-1 bg-[#00CFFF] rounded-full animate-in zoom-in" />}
                </button>
              ))}
            </div>
            <button onClick={triggerToast} className="text-xs font-black text-[#FF4FA1] uppercase tracking-tighter hover:opacity-70 transition-opacity">
              Refresh Feed
            </button>
          </div>

          <div className="p-8">
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-5 rounded-3xl bg-gray-50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-100 dark:hover:border-gray-600 transition-all cursor-pointer group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:text-[#00CFFF] shadow-sm transition-colors">
                      <FiClock size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Student Name {item}</h4>
                      <p className="text-xs text-gray-500 font-medium">Standard Room • 12 March 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="hidden sm:block text-[10px] font-black uppercase bg-green-100 dark:bg-green-500/10 text-green-600 px-3 py-1 rounded-full tracking-widest">Completed</span>
                    <FiChevronRight className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- Quick Actions Sidebar --- */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-6">Operations</h3>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.path} className="flex flex-col items-center justify-center p-5 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 group/btn">
                    <div className={`${action.color} text-2xl mb-2 transition-transform group-hover/btn:scale-110`}>{action.icon}</div>
                    <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00CFFF] rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity" />
          </div>

          {/* Target Progress Card */}
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Monthly Target</h4>
              <span className="text-xs font-black text-gray-900 dark:text-white">₵20k</span>
            </div>
            <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-[#00CFFF] to-[#FF4FA1] w-[65%] rounded-full transition-all duration-1000 ease-out" />
            </div>
            <p className="text-xs text-gray-500 font-medium">You have reached <span className="text-gray-900 dark:text-white font-bold">65%</span> of your monthly goal.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;