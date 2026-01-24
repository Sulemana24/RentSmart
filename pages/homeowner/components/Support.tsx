"use client";
import { FiPlus, FiList, FiHelpCircle, FiMessageSquare } from "react-icons/fi";

const Support = () => {
  const supportOptions = [
    {
      title: "Create Support Ticket",
      description: "Report issues or request assistance",
      icon: <FiPlus />,
      action: "Create Ticket",
    },
    {
      title: "View Open Tickets",
      description: "Check status of existing tickets",
      icon: <FiList />,
      action: "View Tickets",
    },
    {
      title: "FAQs",
      description: "Find answers to common questions",
      icon: <FiHelpCircle />,
      action: "Browse FAQs",
    },
    {
      title: "Contact Support",
      description: "Get in touch with our team",
      icon: <FiMessageSquare />,
      action: "Contact Now",
    },
  ];

  const recentTickets = [
    {
      id: "TKT-001",
      subject: "Plumbing Issue",
      status: "In Progress",
      date: "2024-03-10",
    },
    {
      id: "TKT-002",
      subject: "Electrical Problem",
      status: "Resolved",
      date: "2024-03-08",
    },
    {
      id: "TKT-003",
      subject: "Rent Payment Query",
      status: "Open",
      date: "2024-03-12",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Support Center
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {supportOptions.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="text-3xl text-[#00CFFF] mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {item.description}
              </p>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
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
            {recentTickets.map((ticket, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
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
                      ? "bg-green-500/10 text-green-600 dark:text-green-400"
                      : ticket.status === "In Progress"
                        ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                        : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
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
};

export default Support;
