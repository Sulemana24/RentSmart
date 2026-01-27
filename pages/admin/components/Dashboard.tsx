import React from "react";
import {
  FiHome,
  FiUsers,
  FiDollarSign,
  FiCalendar,
  FiPlus,
  FiDownload,
  FiBell,
} from "react-icons/fi";

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface PerformanceMetric {
  label: string;
  value: string;
  change: string;
}

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  color: string;
}

const Dashboard: React.FC = () => {
  const dashboardStats: StatCard[] = [
    {
      title: "Total Properties",
      value: "156",
      change: "+12%",
      icon: <FiHome />,
      color: "text-[#00CFFF]",
      bgColor: "bg-[#00CFFF]/10",
    },
    {
      title: "Total Users",
      value: "2,458",
      change: "+8%",
      icon: <FiUsers />,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Revenue",
      value: "₵425,800",
      change: "+23%",
      icon: <FiDollarSign />,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Active Bookings",
      value: "89",
      change: "+15%",
      icon: <FiCalendar />,
      color: "text-[#FF4FA1]",
      bgColor: "bg-[#FF4FA1]/10",
    },
  ];

  const performanceMetrics: PerformanceMetric[] = [
    { label: "Site Visits", value: "12.4K", change: "+18%" },
    { label: "Conversion Rate", value: "4.2%", change: "+2.1%" },
    { label: "Avg. Booking Value", value: "₵3,850", change: "+12%" },
    { label: "User Satisfaction", value: "4.8/5", change: "+0.3" },
  ];

  const quickActions: QuickAction[] = [
    {
      label: "Add Property",
      icon: <FiPlus />,
      color: "text-[#00CFFF]",
    },
    {
      label: "Manage Users",
      icon: <FiUsers />,
      color: "text-green-500",
    },
    {
      label: "View Reports",
      icon: <FiDownload />,
      color: "text-purple-500",
    },
    {
      label: "Send Notification",
      icon: <FiBell />,
      color: "text-[#FF4FA1]",
    },
  ];

  const properties = [
    {
      id: 1,
      name: "Luxury Villa East Legon",
      owner: "John Doe",
      type: "Villa",
      status: "Approved",
      price: "₵15,000/month",
      listed: "2024-03-01",
    },
    {
      id: 2,
      name: "Modern Apartment Osu",
      owner: "Sarah Smith",
      type: "Apartment",
      status: "Pending",
      price: "₵4,500/month",
      listed: "2024-03-05",
    },
    {
      id: 3,
      name: "Commercial Space Airport",
      owner: "Kwame Asante",
      type: "Commercial",
      status: "Approved",
      price: "₵25,000/month",
      listed: "2024-02-28",
    },
    {
      id: 4,
      name: "Studio Apartments Cantonments",
      owner: "Ama Serwaa",
      type: "Studio",
      status: "Rejected",
      price: "₵1,800/month",
      listed: "2024-03-10",
    },
  ];

  const payments = [
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}>
                {stat.icon}
              </div>
              <span className="text-sm font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded">
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {stat.title}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Performance Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {performanceMetrics.map((metric, index) => (
            <div
              key={index}
              className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
            >
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {metric.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {metric.label}
              </div>
              <div className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full inline-block">
                {metric.change}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Properties
            </h3>
            <button className="text-sm text-[#00CFFF] hover:text-[#FF4FA1] transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {properties.map((property) => (
              <div
                key={property.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {property.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {property.owner} • {property.type}
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    property.status === "Approved"
                      ? "bg-green-500/10 text-green-600"
                      : property.status === "Pending"
                        ? "bg-yellow-500/10 text-yellow-600"
                        : "bg-red-500/10 text-red-600"
                  }`}
                >
                  {property.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Payments
            </h3>
            <button className="text-sm text-[#00CFFF] hover:text-[#FF4FA1] transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {payment.agent}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {payment.property} • {payment.date}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {payment.amount}
                  </div>
                  <div
                    className={`text-xs ${
                      payment.status === "Paid"
                        ? "text-green-500"
                        : payment.status === "Pending"
                          ? "text-yellow-500"
                          : "text-red-500"
                    }`}
                  >
                    {payment.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="flex flex-col items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className={`text-2xl mb-2 ${action.color}`}>
                {action.icon}
              </div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {action.label}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
