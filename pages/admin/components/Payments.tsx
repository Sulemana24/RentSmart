import React from "react";
import { FiEye, FiBell, FiCheck } from "react-icons/fi";

interface Payment {
  id: number;
  agent: string;
  property: string;
  amount: string;
  commission: string;
  date: string;
  status: string;
}

interface RevenueStat {
  label: string;
  value: string;
  color: string;
}

const Payments: React.FC = () => {
  const payments: Payment[] = [
    {
      id: 1,
      agent: "John Doe",
      property: "Luxury Villa",
      amount: "₵15,000",
      commission: "₵1,500",
      date: "2024-03-15",
      status: "Paid",
    },
    {
      id: 2,
      agent: "Sarah Smith",
      property: "Modern Apartment",
      amount: "₵4,500",
      commission: "₵450",
      date: "2024-03-14",
      status: "Pending",
    },
    {
      id: 3,
      agent: "Kwame Asante",
      property: "Commercial Space",
      amount: "₵25,000",
      commission: "₵2,500",
      date: "2024-03-12",
      status: "Paid",
    },
    {
      id: 4,
      agent: "Ama Serwaa",
      property: "Studio Apartments",
      amount: "₵1,800",
      commission: "₵180",
      date: "2024-03-10",
      status: "Rejected",
    },
  ];

  const revenueStats: RevenueStat[] = [
    {
      label: "Total Revenue",
      value: "₵425,800",
      color: "bg-green-500/10 text-green-600",
    },
    {
      label: "Pending Payments",
      value: "₵24,300",
      color: "bg-yellow-500/10 text-yellow-600",
    },
    {
      label: "Commission Due",
      value: "₵42,580",
      color: "bg-blue-500/10 text-blue-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Payments Management
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {revenueStats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6"
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

        {/* Commission Notifications */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Send Commission Notifications
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option>Select Agent</option>
                <option>John Doe</option>
                <option>Sarah Smith</option>
                <option>Kwame Asante</option>
              </select>
              <input
                type="text"
                placeholder="Commission Amount"
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button className="px-4 py-3 bg-[#00CFFF] text-white rounded-lg hover:bg-[#00CFFF]/90 flex items-center justify-center gap-2">
                <FiBell />
                Notify Agent
              </button>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Agent
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Property
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Commission
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                    {payment.agent}
                  </td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                    {payment.property}
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                    {payment.amount}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-600 rounded-full text-xs font-medium">
                      {payment.commission}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                    {payment.date}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        payment.status === "Paid"
                          ? "bg-green-500/10 text-green-600"
                          : payment.status === "Pending"
                            ? "bg-yellow-500/10 text-yellow-600"
                            : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#00CFFF] hover:bg-[#00CFFF]/10 rounded-lg">
                        <FiEye />
                      </button>
                      {payment.status === "Pending" && (
                        <button className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 flex items-center gap-1">
                          <FiCheck />
                          Approve
                        </button>
                      )}
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#FF4FA1] hover:bg-[#FF4FA1]/10 rounded-lg">
                        <FiBell />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
