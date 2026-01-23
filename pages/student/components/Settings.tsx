"use client";
import { FiHelpCircle, FiSettings } from "react-icons/fi";

interface SettingsProps {
  section: string;
}

const Settings: React.FC<SettingsProps> = ({ section }) => {
  const isSupport = section === "support";

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
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
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
      </div>
    );
  }

  // Settings Section
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Account Settings
        </h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Profile Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hostel Name
                </label>
                <input
                  type="text"
                  defaultValue="University Hostel Complex"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Manager Name
                </label>
                <input
                  type="text"
                  defaultValue="Mr. Samuel Asante"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="hostel@university.edu.gh"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  defaultValue="+233 24 123 4567"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Hostel Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Hostel Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Total Rooms
                </label>
                <input
                  type="number"
                  defaultValue="42"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  defaultValue="University Campus, Accra"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Notification Preferences
            </h3>
            <div className="space-y-3">
              {[
                {
                  label: "Booking Notifications",
                  description: "Get notified about new booking requests",
                },
                {
                  label: "Payment Reminders",
                  description: "Receive reminders for overdue payments",
                },
                {
                  label: "Maintenance Alerts",
                  description: "Get alerts for maintenance requests",
                },
                {
                  label: "Security Updates",
                  description: "Receive security-related updates",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    defaultChecked={index < 2}
                    className="mt-1 w-4 h-4 text-[#00CFFF] bg-gray-700 border-gray-600 rounded focus:ring-[#00CFFF] focus:ring-2"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {item.label}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {item.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Security
            </h3>
            <div className="space-y-4">
              <button className="w-full md:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                Change Password
              </button>
              <button className="w-full md:w-auto px-6 py-3 border border-red-300 dark:border-red-600 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                Deactivate Account
              </button>
            </div>
          </div>

          {/* Save Changes */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Cancel
            </button>
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
