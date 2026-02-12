"use client";

import React, { useState } from "react";
import { 
  FiHelpCircle, FiSettings, FiShield, FiBell, 
  FiLock, FiUser, FiHome, FiAlertCircle 
} from "react-icons/fi";
import toast from "react-hot-toast";

interface SettingsProps {
  section: string;
}

const Settings: React.FC<SettingsProps> = ({ section }) => {
  const isSupport = section === "support";
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      toast.success("Branch configurations updated!");
      setIsSaving(false);
    }, 1000);
  };

  if (isSupport) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                SUPPORT CENTER
              </h2>
              <p className="text-[10px] font-black text-[#00CFFF] uppercase tracking-[0.3em] mt-1">Admin Assistance Protocol</p>
            </div>
            <button className="p-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-500/30 hover:scale-105 transition-transform">
              Emergency Conduct Report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { title: "Support Ticket", desc: "Log system issues", action: "Open Tkt", icon: <FiAlertCircle /> },
              { title: "Active Cases", desc: "Monitor resolution", action: "View All", icon: <FiShield /> },
              { title: "Knowledge Base", desc: "Branch protocols", action: "Read Wiki", icon: <FiHelpCircle /> },
              { title: "Direct Contact", desc: "Speak to Dev Team", action: "Call Now", icon: <FiUser /> },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800/50 border border-transparent hover:border-[#00CFFF]/30 rounded-[2rem] p-6 transition-all group"
              >
                <div className="text-2xl text-[#00CFFF] mb-4 p-3 bg-white dark:bg-gray-800 w-fit rounded-xl shadow-sm">
                  {item.icon}
                </div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white mb-1 uppercase tracking-tight">
                  {item.title}
                </h3>
                <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-4 leading-tight">
                  {item.desc}
                </p>
                <button className="w-full py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-[9px] font-black uppercase tracking-widest group-hover:bg-[#00CFFF] group-hover:text-white group-hover:border-[#00CFFF] transition-all">
                  {item.action}
                </button>
              </div>
            ))}
          </div>

          {/* Recent Discipline/Support Tickets */}
          <div className="bg-gray-50 dark:bg-gray-800/30 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#00CFFF] rounded-full animate-pulse"></span>
              Recent Dispatch Logs
            </h3>
            <div className="space-y-4">
              {[
                { id: "LOG-992", subject: "Conduct Portal Sync Error", status: "In Progress", type: "System" },
                { id: "LOG-990", subject: "Database Backup - Discipline Branch", status: "Resolved", type: "Security" },
                { id: "LOG-989", subject: "New Admin Credentials Request", status: "Open", type: "Access" },
              ].map((ticket, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-50 dark:border-gray-800 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-[9px] font-black px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-400 uppercase">
                      {ticket.type}
                    </div>
                    <div>
                      <div className="font-black text-sm text-gray-900 dark:text-white tracking-tight">
                        {ticket.subject}
                      </div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase">
                        Ref: {ticket.id}
                      </div>
                    </div>
                  </div>
                  <div className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${
                    ticket.status === "Resolved" ? "bg-green-500 text-white" : "bg-orange-500 text-white"
                  }`}>
                    {ticket.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Settings Section ---
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-2xl">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
            SYSTEM SETTINGS
          </h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-1">Global Configuration</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Branch Info */}
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h3 className="text-xs font-black text-[#00CFFF] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <FiHome /> Entity Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Hostel Identity", val: "University Hostel Complex" },
                  { label: "Chief Warden", val: "Mr. Samuel Asante" },
                  { label: "Primary Gateway", val: "hostel@university.edu.gh" },
                  { label: "Emergency Line", val: "+233 24 123 4567" },
                ].map((f, i) => (
                  <div key={i}>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">{f.label}</label>
                    <input
                      type="text"
                      defaultValue={f.val}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#00CFFF] transition-all"
                    />
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xs font-black text-[#00CFFF] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <FiBell /> Branch Notifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Discipline Alerts", desc: "New infraction triggers" },
                  { label: "Financial Sync", desc: "Daily revenue summaries" },
                  { label: "Support Ping", desc: "Immediate ticket alerts" },
                  { label: "System Health", desc: "Database & Cloud status" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition-all">
                    <input
                      type="checkbox"
                      defaultChecked={index !== 2}
                      className="w-5 h-5 text-[#00CFFF] bg-gray-200 border-none rounded-lg focus:ring-[#00CFFF]"
                    />
                    <div>
                      <p className="text-xs font-black text-gray-900 dark:text-white uppercase">{item.label}</p>
                      <p className="text-[10px] font-bold text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Security & Actions */}
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800">
              <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <FiLock /> Security
              </h3>
              <button className="w-full py-4 mb-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-900 hover:text-white dark:hover:bg-[#00CFFF] transition-all">
                Rotate Access Keys
              </button>
              <button className="w-full py-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all">
                Hard System Reset
              </button>
            </div>

            <div className="bg-[#00CFFF] p-8 rounded-[2rem] text-white shadow-xl shadow-[#00CFFF]/20">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-80">Branch Status</p>
              <h4 className="text-xl font-black mb-4 tracking-tighter italic">Discipline_v2.0_Stable</h4>
              <p className="text-[11px] font-bold leading-relaxed opacity-90">
                All today's commits are being staged for deployment to the main cluster.
              </p>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-end gap-4 mt-12 pt-8 border-t border-gray-50 dark:border-gray-800">
          <button className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            Discard
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-10 py-4 bg-gray-900 dark:bg-[#00CFFF] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            {isSaving ? "STAGING..." : "PUSH CONFIGURATIONS"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;