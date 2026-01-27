import React from "react";
import { FiEye, FiEdit } from "react-icons/fi";

interface SupportTicket {
  id: string;
  user: string;
  subject: string;
  priority: string;
  status: string;
  created: string;
}

interface SupportStat {
  label: string;
  value: string;
  color: string;
}

const Support: React.FC = () => {
  const supportTickets: SupportTicket[] = [
    {
      id: "TKT-2024-001",
      user: "John Mensah",
      subject: "Payment Issue",
      priority: "High",
      status: "Open",
      created: "2024-03-14",
    },
    {
      id: "TKT-2024-002",
      user: "Sarah Johnson",
      subject: "Property Listing",
      priority: "Medium",
      status: "In Progress",
      created: "2024-03-12",
    },
    {
      id: "TKT-2024-003",
      user: "Kwame Asare",
      subject: "Account Access",
      priority: "Low",
      status: "Resolved",
      created: "2024-03-10",
    },
    {
      id: "TKT-2024-004",
      user: "Ama Boateng",
      subject: "Booking Problem",
      priority: "High",
      status: "Open",
      created: "2024-03-15",
    },
  ];

  const supportStats: SupportStat[] = [
    {
      label: "Open Tickets",
      value: "8",
      color: "bg-yellow-500/10 text-yellow-600",
    },
    {
      label: "In Progress",
      value: "5",
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "Resolved Today",
      value: "12",
      color: "bg-green-500/10 text-green-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Support Center
        </h2>

        <div className="overflow-x-auto mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Ticket ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  User
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Subject
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Priority
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Created
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {supportTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                    {ticket.id}
                  </td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                    {ticket.user}
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                    {ticket.subject}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ticket.priority === "High"
                          ? "bg-red-500/10 text-red-600"
                          : ticket.priority === "Medium"
                            ? "bg-yellow-500/10 text-yellow-600"
                            : "bg-blue-500/10 text-blue-600"
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ticket.status === "Open"
                          ? "bg-yellow-500/10 text-yellow-600"
                          : ticket.status === "In Progress"
                            ? "bg-blue-500/10 text-blue-600"
                            : "bg-green-500/10 text-green-600"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                    {ticket.created}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#00CFFF] hover:bg-[#00CFFF]/10 rounded-lg">
                        <FiEye />
                      </button>
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-500 hover:bg-green-500/10 rounded-lg">
                        <FiEdit />
                      </button>
                      {ticket.status === "Open" && (
                        <button className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">
                          Assign
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {supportStats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 text-center"
            >
              <div
                className={`text-3xl font-bold mb-2 ${stat.color.split(" ")[1]}`}
              >
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Support;
