"use client";

import { useState } from "react";
import { FiHelpCircle, FiSettings } from "react-icons/fi";
import { Dialog } from "@headlessui/react";
import toast from "react-hot-toast";

interface SettingsProps {
  section: string;
}

const Settings: React.FC<SettingsProps> = ({ section }) => {
  // Modal State
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  // Ticket Form
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    description: "",
  });

  const handleTicketSubmit = () => {
    if (ticketForm.subject.trim() === "" || ticketForm.description.trim() === "") {
      toast.error("Please fill in all fields");
      return;
    }

    toast.success("Support ticket submitted successfully!");
    setIsTicketModalOpen(false);

    setTicketForm({
      subject: "",
      description: "",
    });
  };

  const isSupport = section === "support";

  // ============================
  // SUPPORT SECTION
  // ============================
  if (isSupport) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Support Center
          </h2>

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
              },
              {
                title: "FAQs",
                description: "Find answers to common questions",
                action: "Browse FAQs",
              },
              {
                title: "Contact Support",
                description: "Get in touch with our team",
                action: "Contact Now",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="text-3xl text-[#00CFFF] mb-4">
                  <FiHelpCircle />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {item.description}
                </p>
                <button
                  onClick={item.onClick}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                {
                  id: "TKT-001",
                  subject: "Plumbing Issue - Room 103",
                  status: "In Progress",
                  date: "2024-03-10",
                },
                {
                  id: "TKT-002",
                  subject: "Electrical Problem - Common Area",
                  status: "Resolved",
                  date: "2024-03-08",
                },
                {
                  id: "TKT-003",
                  subject: "Rent Payment Query",
                  status: "Open",
                  date: "2024-03-12",
                },
                {
                  id: "TKT-004",
                  subject: "Security Camera Installation",
                  status: "Scheduled",
                  date: "2024-03-11",
                },
              ].map((ticket, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {ticket.subject}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {ticket.id} • {ticket.date}
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded text-sm ${
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
        <Dialog
          open={isTicketModalOpen}
          onClose={() => setIsTicketModalOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full">
              <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Create Support Ticket
              </Dialog.Title>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Subject"
                  value={ticketForm.subject}
                  onChange={(e) =>
                    setTicketForm({ ...ticketForm, subject: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />

                <textarea
                  placeholder="Describe the issue"
                  rows={4}
                  value={ticketForm.description}
                  onChange={(e) =>
                    setTicketForm({ ...ticketForm, description: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setIsTicketModalOpen(false)}
                    className="px-4 py-2 border rounded-lg dark:border-gray-600"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleTicketSubmit}
                    className="px-4 py-2 bg-[#00CFFF] text-white rounded-lg hover:bg-[#00CFFF]/90"
                  >
                    Submit Ticket
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Profile Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["Hostel Name", "Manager Name", "Email Address", "Phone Number"].map(
                (label, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {label}
                    </label>
                    <input
                      type={label.includes("Email") ? "email" : "text"}
                      defaultValue={
                        index === 0
                          ? "University Hostel Complex"
                          : index === 1
                          ? "Mr. Samuel Asante"
                          : index === 2
                          ? "hostel@university.edu.gh"
                          : "+233 24 123 4567"
                      }
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                )
              )}
            </div>
          </div>

          {/* Hostel Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Hostel Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["Total Rooms", "Address"].map((label, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                  </label>
                  <input
                    type={label === "Total Rooms" ? "number" : "text"}
                    defaultValue={index === 0 ? "42" : "University Campus, Accra"}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
            <div className="space-y-3">
              {[
                "Booking Notifications",
                "Payment Reminders",
                "Maintenance Alerts",
                "Security Updates",
              ].map((label, index) => (
                <label key={index} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked={index < 2}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-900 dark:text-white">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Security */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Security
            </h3>
            <div className="space-y-4">
              <button className="px-6 py-3 border rounded-lg">Change Password</button>
              <button className="px-6 py-3 border border-red-500 text-red-600 rounded-lg">
                Deactivate Account
              </button>
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end gap-3 pt-6 border-t dark:border-gray-700">
            <button className="px-6 py-3 border rounded-lg">Cancel</button>
            <button className="px-6 py-3 bg-[#00CFFF] text-white rounded-lg hover:bg-[#00CFFF]/90">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
