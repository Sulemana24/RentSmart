"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
  FiHome,
  FiUsers,
  FiDollarSign,
  FiBarChart2,
  FiSettings,
  FiMessageSquare,
  FiHelpCircle,
  FiCalendar,
  FiPlus,
  FiTrash2,
  FiEdit,
  FiEye,
  FiCheck,
  FiX,
  FiTrendingUp,
  FiActivity,
  FiUserCheck,
  FiCreditCard,
  FiBell,
  FiSearch,
  FiFilter,
  FiDownload,
  FiChevronDown,
  FiChevronRight,
  FiMenu,
  FiSun,
  FiMoon,
  FiLogOut,
} from "react-icons/fi";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    const initialDarkMode =
      savedTheme === "dark" || (!savedTheme && prefersDark);
    setDarkMode(initialDarkMode);

    if (initialDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileButtonRef.current?.contains(event.target as Node)) {
        return;
      }

      if (
        profileOpen &&
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("role");
    localStorage.removeItem("adminData");
    setProfileOpen(false);

    router.push("/login");

    alert("Admin session ended successfully!");
  };

  const dashboardStats = [
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

  // Performance metrics
  const performanceMetrics = [
    { label: "Site Visits", value: "12.4K", change: "+18%" },
    { label: "Conversion Rate", value: "4.2%", change: "+2.1%" },
    { label: "Avg. Booking Value", value: "₵3,850", change: "+12%" },
    { label: "User Satisfaction", value: "4.8/5", change: "+0.3" },
  ];

  // Properties data
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
    {
      id: 5,
      name: "Family House Labone",
      owner: "Michael Johnson",
      type: "House",
      status: "Approved",
      price: "₵8,000/month",
      listed: "2024-03-08",
    },
  ];

  // Payments data
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

  // Bookings data
  const bookings = [
    {
      id: 1,
      user: "David Wilson",
      property: "Luxury Villa",
      type: "Tour",
      date: "2024-03-20",
      time: "10:00 AM",
      status: "Confirmed",
    },
    {
      id: 2,
      user: "Emily Brown",
      property: "Modern Apartment",
      type: "Rental",
      date: "2024-03-22",
      time: "2:30 PM",
      status: "Pending",
    },
    {
      id: 3,
      user: "James Miller",
      property: "Commercial Space",
      type: "Tour",
      date: "2024-03-18",
      time: "11:00 AM",
      status: "Completed",
    },
    {
      id: 4,
      user: "Lisa Taylor",
      property: "Family House",
      type: "Rental",
      date: "2024-03-25",
      time: "3:00 PM",
      status: "Cancelled",
    },
  ];

  // Support tickets
  const supportTickets = [
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

  // Menu items
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <FiBarChart2 /> },
    { id: "properties", label: "Properties", icon: <FiHome /> },
    { id: "payments", label: "Payments", icon: <FiDollarSign /> },
    { id: "bookings", label: "Bookings", icon: <FiCalendar /> },
    { id: "users", label: "Users", icon: <FiUsers /> },
    { id: "messages", label: "Messages", icon: <FiMessageSquare /> },
    { id: "support", label: "Support", icon: <FiHelpCircle /> },
    { id: "settings", label: "Settings", icon: <FiSettings /> },
  ];

  // Render active section content
  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {dashboardStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}
                    >
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

            {/* Performance Metrics */}
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

            {/* Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Properties */}
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
                  {properties.slice(0, 4).map((property) => (
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

              {/* Recent Payments */}
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
                  {payments.slice(0, 4).map((payment) => (
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

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
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
                ].map((action, index) => (
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

      case "properties":
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Properties Management
                </h2>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-[#00CFFF] text-white rounded-lg hover:bg-[#00CFFF]/90 flex items-center gap-2">
                    <FiPlus />
                    Add Property
                  </button>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search properties..."
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-48 md:w-64"
                    />
                  </div>
                  <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <FiFilter />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Property
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Owner
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Type
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Price
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((property) => (
                      <tr
                        key={property.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {property.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {property.listed}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                          {property.owner}
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                            {property.type}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              property.status === "Approved"
                                ? "bg-green-500/10 text-green-600"
                                : property.status === "Pending"
                                  ? "bg-yellow-500/10 text-yellow-600"
                                  : "bg-red-500/10 text-red-600"
                            }`}
                          >
                            {property.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                          {property.price}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#00CFFF] hover:bg-[#00CFFF]/10 rounded-lg transition-colors">
                              <FiEye />
                            </button>
                            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-500 hover:bg-green-500/10 rounded-lg transition-colors">
                              <FiEdit />
                            </button>
                            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#FF4FA1] hover:bg-[#FF4FA1]/10 rounded-lg transition-colors">
                              <FiTrash2 />
                            </button>
                            {property.status === "Pending" && (
                              <div className="flex items-center gap-1">
                                <button className="p-1.5 text-green-500 hover:bg-green-500/10 rounded-lg">
                                  <FiCheck />
                                </button>
                                <button className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg">
                                  <FiX />
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {properties.length} of 156 properties
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Previous
                  </button>
                  <button className="px-4 py-2 bg-[#00CFFF] text-white rounded-lg hover:bg-[#00CFFF]/90">
                    1
                  </button>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "payments":
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Payments Management
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
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
                ].map((stat, index) => (
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

      case "bookings":
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Bookings Management
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                  {
                    label: "Total Bookings",
                    value: "156",
                    color: "bg-[#00CFFF]/10 text-[#00CFFF]",
                  },
                  {
                    label: "Tour Bookings",
                    value: "89",
                    color: "bg-purple-500/10 text-purple-600",
                  },
                  {
                    label: "Rental Bookings",
                    value: "67",
                    color: "bg-green-500/10 text-green-600",
                  },
                  {
                    label: "Pending",
                    value: "12",
                    color: "bg-yellow-500/10 text-yellow-600",
                  },
                ].map((stat, index) => (
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

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        User
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Property
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Type
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Date & Time
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
                    {bookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                          {booking.user}
                        </td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                          {booking.property}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              booking.type === "Tour"
                                ? "bg-blue-500/10 text-blue-600"
                                : "bg-green-500/10 text-green-600"
                            }`}
                          >
                            {booking.type}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                          {booking.date} at {booking.time}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              booking.status === "Confirmed"
                                ? "bg-green-500/10 text-green-600"
                                : booking.status === "Pending"
                                  ? "bg-yellow-500/10 text-yellow-600"
                                  : booking.status === "Completed"
                                    ? "bg-blue-500/10 text-blue-600"
                                    : "bg-red-500/10 text-red-600"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#00CFFF] hover:bg-[#00CFFF]/10 rounded-lg">
                              <FiEye />
                            </button>
                            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-500 hover:bg-green-500/10 rounded-lg">
                              <FiEdit />
                            </button>
                            {booking.status === "Pending" && (
                              <button className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">
                                Approve
                              </button>
                            )}
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

      case "users":
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Users Management
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                  {
                    label: "Total Users",
                    value: "2,458",
                    icon: <FiUsers />,
                    color: "text-[#00CFFF]",
                  },
                  {
                    label: "Homeowners",
                    value: "156",
                    icon: <FiHome />,
                    color: "text-green-500",
                  },
                  {
                    label: "Renters",
                    value: "2,102",
                    icon: <FiUserCheck />,
                    color: "text-purple-500",
                  },
                  {
                    label: "Agents",
                    value: "200",
                    icon: <FiActivity />,
                    color: "text-[#FF4FA1]",
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6"
                  >
                    <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        User
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Role
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Joined
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
                    {[
                      {
                        name: "John Doe",
                        email: "john@example.com",
                        role: "Homeowner",
                        joined: "2024-01-15",
                        status: "Active",
                      },
                      {
                        name: "Sarah Smith",
                        email: "sarah@example.com",
                        role: "Agent",
                        joined: "2024-02-20",
                        status: "Active",
                      },
                      {
                        name: "Kwame Asante",
                        email: "kwame@example.com",
                        role: "Renter",
                        joined: "2024-03-01",
                        status: "Active",
                      },
                      {
                        name: "Ama Serwaa",
                        email: "ama@example.com",
                        role: "Homeowner",
                        joined: "2024-02-10",
                        status: "Inactive",
                      },
                      {
                        name: "Michael Johnson",
                        email: "michael@example.com",
                        role: "Agent",
                        joined: "2024-03-05",
                        status: "Active",
                      },
                    ].map((user, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                          {user.email}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              user.role === "Homeowner"
                                ? "bg-blue-500/10 text-blue-600"
                                : user.role === "Agent"
                                  ? "bg-green-500/10 text-green-600"
                                  : "bg-purple-500/10 text-purple-600"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                          {user.joined}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              user.status === "Active"
                                ? "bg-green-500/10 text-green-600"
                                : "bg-red-500/10 text-red-600"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#00CFFF] hover:bg-[#00CFFF]/10 rounded-lg">
                              <FiEye />
                            </button>
                            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-500 hover:bg-green-500/10 rounded-lg">
                              <FiEdit />
                            </button>
                            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#FF4FA1] hover:bg-[#FF4FA1]/10 rounded-lg">
                              <FiTrash2 />
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

      case "messages":
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Messages
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Contacts */}
              <div className="lg:col-span-1 border border-gray-200 dark:border-gray-700 rounded-xl">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Contacts
                  </h3>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {[
                    { name: "John Doe (Homeowner)", unread: 2 },
                    { name: "Sarah Smith (Agent)", unread: 0 },
                    { name: "Support Team", unread: 1 },
                    { name: "System Notifications", unread: 0 },
                    { name: "Kwame Asante (Renter)", unread: 3 },
                  ].map((contact, index) => (
                    <button
                      key={index}
                      className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative"
                    >
                      <div className="font-medium text-gray-900 dark:text-white">
                        {contact.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Last message 2 hours ago
                      </div>
                      {contact.unread > 0 && (
                        <div className="absolute right-4 top-4 bg-[#FF4FA1] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {contact.unread}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat */}
              <div className="lg:col-span-2 flex flex-col border border-gray-200 dark:border-gray-700 rounded-xl">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    John Doe (Homeowner)
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Property: Luxury Villa East Legon
                  </div>
                </div>

                <div className="flex-grow p-4 space-y-4 overflow-y-auto max-h-[400px]">
                  <div className="flex justify-start">
                    <div className="max-w-[70%] bg-gray-100 dark:bg-gray-700 rounded-xl p-3">
                      <div className="text-gray-900 dark:text-white">
                        Hi Admin, I'm having issues with my property listing
                      </div>
                      <div className="text-xs text-gray-500 mt-1">10:30 AM</div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-[70%] bg-[#00CFFF] text-white rounded-xl p-3">
                      <div>
                        Hi John, what seems to be the problem? I can help you
                        with that.
                      </div>
                      <div className="text-xs text-white/80 mt-1">10:35 AM</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-grow px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button className="px-6 py-3 bg-[#00CFFF] text-white rounded-lg hover:bg-[#00CFFF]/90">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "support":
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
                {[
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
                ].map((stat, index) => (
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

      case "settings":
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Admin Settings
              </h2>

              <div className="space-y-8">
                {/* General Settings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    General Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Site Name
                      </label>
                      <input
                        type="text"
                        defaultValue="RentSmart"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Commission Rate (%)
                      </label>
                      <input
                        type="number"
                        defaultValue="10"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        defaultValue="admin@rentsmart.com"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        defaultValue="+233 20 123 4567"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Settings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Email Settings
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        label: "Send booking confirmations",
                        defaultChecked: true,
                      },
                      { label: "Send payment receipts", defaultChecked: true },
                      {
                        label: "Send commission notifications",
                        defaultChecked: true,
                      },
                      { label: "Send system updates", defaultChecked: false },
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          defaultChecked={item.defaultChecked}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {item.label}
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
                      Change Admin Password
                    </button>
                    <button className="w-full md:w-auto px-6 py-3 border border-red-300 dark:border-red-600 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                      Clear All Data
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

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 text-gray-600 dark:text-gray-400"
              >
                <FiMenu className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {darkMode ? (
                  <FiSun className="w-5 h-5" />
                ) : (
                  <FiMoon className="w-5 h-5" />
                )}
              </button>

              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white relative">
                <FiBell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-[#FF4FA1] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </button>

              <div className="relative">
                <button
                  ref={profileButtonRef}
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <div className="w-8 h-8 rounded-full bg-[#00CFFF] flex items-center justify-center text-white font-semibold">
                    S
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Sule
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      System Administrator
                    </div>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${profileOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {profileOpen && (
                  <div
                    ref={profileDropdownRef}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                  >
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="font-medium text-gray-900 dark:text-white">
                        Sule
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        admin@rentsmart.com
                      </div>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          router.push("/admin/profile");
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Admin Profile
                      </button>
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          setActiveSection("settings");
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        System Settings
                      </button>
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          router.push("/admin/audit-log");
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Audit Log
                      </button>
                      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <FiLogOut className="w-4 h-4" />
                          Log Out Admin
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden mb-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 p-4 text-left transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                    activeSection === item.id
                      ? "bg-gray-50 dark:bg-gray-700 text-[#00CFFF]"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Desktop Menu */}
          <div className="hidden md:block w-full md:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-6">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 p-4 text-left transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                    activeSection === item.id
                      ? "bg-gray-50 dark:bg-gray-700 text-[#00CFFF]"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">{renderSection()}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
