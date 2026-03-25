"use client";

import { useState } from "react";
import { FiHelpCircle, FiSettings, FiCheckCircle, FiShield, FiAlertTriangle, FiMail, FiPhone } from "react-icons/fi";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import toast from "react-hot-toast";

interface SettingsProps {
  section: string;
}

const Settings: React.FC<SettingsProps> = ({ section }) => {
  // Modal State
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Ticket Form
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "General",
    description: "",
  });

  const handleTicketSubmit = () => {
    if (ticketForm.subject.trim() === "" || ticketForm.description.trim() === "") {
      toast.error("Please fill in all fields");
      return;
    }

    toast.success("Support ticket TKT-005 generated successfully!");
    setIsTicketModalOpen(false);

    setTicketForm({
      subject: "",
      category: "General",
      description: "",
    });
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    setTimeout(() => {
      toast.success("Profile configurations updated");
      setIsSaving(false);
    }, 1000);
  };

  const isSupport = section === "support";

  // ============================
  // SUPPORT SECTION
  // ============================
  if (isSupport) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Support Center
            </h2>
            <div className="flex gap-2">
               <span className="flex items-center gap-1 text-[10px] font-bold bg-green-500/10 text-green-500 px-2 py-1 rounded-md uppercase">
                 <FiCheckCircle /> System Online
               </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              {
                title: "Create Support Ticket",
                description: "Report issues or request assistance",
                action: "Create Ticket",
                onClick: () => setIsTicketModalOpen(true),
              },
              {
                title: "View Open Tickets",
                description: "Check status of existing tickets",
                action: "View Tickets",
                onClick: () => toast("Redirecting to Ticket History...", { icon: '⏳' }),
              },
              {
                title: "FAQs",
                description: "Find answers to common questions",
                action: "Browse FAQs",
                onClick: () => toast.error("FAQ Database syncing..."),
              },
              {
                title: "Contact Support",
                description: "Get in touch with our team",
                action: "Contact Now",
                onClick: () => toast("Support line: +233 24 000 0000", { icon: '📞' }),
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-[#00CFFF]/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all cursor-default"
              >
                <div className="text-3xl text-[#00CFFF] mb-4 transition-transform group-hover:scale-110">
                  <FiHelpCircle />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                  {item.description}
                </p>
                <button
                  onClick={item.onClick}
                  className="w-full md:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-[#00CFFF] hover:text-white hover:border-[#00CFFF] transition-all font-medium"
                >
                  {item.action}
                </button>
              </div>
            ))}
          </div>

          {/* Recent Tickets */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Support Tickets
            </h3>
            <div className="space-y-3">
              {[
                { id: "TKT-001", subject: "Plumbing Issue - Room 103", status: "In Progress", date: "2024-03-10" },
                { id: "TKT-002", subject: "Electrical Problem - Common Area", status: "Resolved", date: "2024-03-08" },
                { id: "TKT-003", subject: "Rent Payment Query", status: "Open", date: "2024-03-12" },
                { id: "TKT-004", subject: "Security Camera Installation", status: "Scheduled", date: "2024-03-11" },
              ].map((ticket, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl border border-transparent hover:border-gray-100 dark:hover:border-gray-600 transition-all"
                >
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                        <FiSettings />
                     </div>
                     <div>
                        <div className="font-bold text-gray-900 dark:text-white tracking-tight">
                          {ticket.subject}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                          {ticket.id} • {ticket.date}
                        </div>
                     </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      ticket.status === "Resolved"
                        ? "bg-green-500/10 text-green-600"
                        : ticket.status === "In Progress"
                        ? "bg-yellow-500/10 text-yellow-600"
                        : ticket.status === "Scheduled"
                        ? "bg-blue-500/10 text-blue-600"
                        : "bg-gray-500/10 text-gray-600"
                    }`}
                  >
                    {ticket.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ======================
        SUPPORT TICKET MODAL
        ====================== */}
        <Transition show={isTicketModalOpen} as={Fragment}>
          <Dialog
            onClose={() => setIsTicketModalOpen(false)}
            className="relative z-50"
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
            </Transition.Child>

            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-lg w-full shadow-2xl border border-gray-100 dark:border-gray-700">
                  <Dialog.Title className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">
                    New Ticket
                  </Dialog.Title>
                  <p className="text-sm text-gray-500 mb-6 font-medium">Please describe your request in detail.</p>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Subject</label>
                      <input
                        type="text"
                        placeholder="Brief title of the issue"
                        value={ticketForm.subject}
                        onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                        className="w-full mt-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] outline-none transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Category</label>
                      <select 
                        value={ticketForm.category}
                        onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                        className="w-full mt-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none font-medium"
                      >
                        <option>General</option>
                        <option>Maintenance</option>
                        <option>Financial</option>
                        <option>Discipline/Security</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Description</label>
                      <textarea
                        placeholder="Provide all relevant details..."
                        rows={4}
                        value={ticketForm.description}
                        onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                        className="w-full mt-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] outline-none transition-all font-medium"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        onClick={() => setIsTicketModalOpen(false)}
                        className="px-6 py-2 font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        Discard
                      </button>

                      <button
                        onClick={handleTicketSubmit}
                        className="px-8 py-3 bg-[#00CFFF] text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-[#00CFFF]/20 hover:scale-[1.02] active:scale-95 transition-all"
                      >
                        Submit Dispatch
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    );
  }

  // ============================
  // SETTINGS SECTION
  // ============================
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Account Settings
        </h2>

        {/* Profile */}
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FiShield className="text-[#00CFFF]" /> Profile Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["Hostel Name", "Manager Name", "Email Address", "Phone Number"].map(
                (label, index) => (
                  <div key={index}>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">
                      {label}
                    </label>
                    <div className="relative">
                       {label.includes("Email") && <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />}
                       {label.includes("Phone") && <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />}
                       <input
                        type={label.includes("Email") ? "email" : "text"}
                        defaultValue={
                          index === 0 ? "University Hostel Complex" : 
                          index === 1 ? "Mr. Samuel Asante" : 
                          index === 2 ? "hostel@university.edu.gh" : "+233 24 123 4567"
                        }
                        className={`w-full ${index > 1 ? 'pl-11' : 'px-4'} py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] outline-none transition-all font-bold text-sm`}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Hostel Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FiSettings className="text-[#00CFFF]" /> Property Logistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["Total Rooms", "Address"].map((label, index) => (
                <div key={index}>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">
                    {label}
                  </label>
                  <input
                    type={label === "Total Rooms" ? "number" : "text"}
                    defaultValue={index === 0 ? "42" : "University Campus, Accra"}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] outline-none transition-all font-bold text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Notification Preferences
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Booking Notifications",
                "Payment Reminders",
                "Maintenance Alerts",
                "Security Updates",
              ].map((label, index) => (
                <label key={index} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={index < 2}
                    className="w-5 h-5 rounded border-gray-300 text-[#00CFFF] focus:ring-[#00CFFF] transition-all"
                  />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="pt-6 border-t dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Security & Maintenance
            </h3>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 border border-gray-200 dark:border-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                Change Password
              </button>
              <button 
                onClick={() => toast.error("Verification required to deactivate.")}
                className="px-6 py-3 border border-red-200 text-red-500 rounded-xl font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/10 transition-all flex items-center gap-2"
              >
                <FiAlertTriangle /> Deactivate Account
              </button>
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end gap-3 pt-6 border-t dark:border-gray-700">
            <button className="px-6 py-3 font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              Cancel
            </button>
            <button 
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="px-8 py-3 bg-[#00CFFF] text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-xl shadow-[#00CFFF]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
            >
              {isSaving ? "Saving..." : "Push Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;