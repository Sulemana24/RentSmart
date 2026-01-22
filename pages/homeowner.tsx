"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
  FiHome,
  FiPlus,
  FiList,
  FiCalendar,
  FiDollarSign,
  FiMessageSquare,
  FiHelpCircle,
  FiSettings,
  FiTrendingUp,
  FiUsers,
  FiClock,
  FiStar,
  FiEye,
  FiEdit,
  FiTrash2,
  FiCheck,
  FiX,
  FiDownload,
  FiFilter,
  FiSearch,
  FiBell,
  FiChevronRight,
  FiChevronDown,
  FiSun,
  FiMoon,
  FiLogOut,
} from "react-icons/fi";

const HomeownerDashboard = () => {
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
    localStorage.removeItem("role");
    localStorage.removeItem("userData");
    localStorage.removeItem("adminToken");

    setProfileOpen(false);

    router.push("/");

    alert("You have been logged out successfully!");
  };

  const dashboardStats = [
    {
      title: "Total Properties",
      value: "8",
      change: "+2",
      icon: <FiHome />,
      color: "text-[#00CFFF]",
      bgColor: "bg-[#00CFFF]/10",
    },
    {
      title: "Active Bookings",
      value: "12",
      change: "+3",
      icon: <FiCalendar />,
      color: "text-[#FF4FA1]",
      bgColor: "bg-[#FF4FA1]/10",
    },
    {
      title: "Monthly Revenue",
      value: "₵8,500",
      change: "+15%",
      icon: <FiTrendingUp />,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Tenants",
      value: "24",
      change: "+4",
      icon: <FiUsers />,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  // Mock data for properties
  const properties = [
    {
      id: 1,
      name: "Luxury Apartment Accra",
      type: "Apartment",
      status: "Rented",
      price: "₵2,500/month",
      tenants: 3,
    },
    {
      id: 2,
      name: "Modern House East Legon",
      type: "House",
      status: "Available",
      price: "₵3,500/month",
      tenants: 0,
    },
    {
      id: 3,
      name: "Studio Apartments",
      type: "Studio",
      status: "Maintenance",
      price: "₵1,200/month",
      tenants: 1,
    },
    {
      id: 4,
      name: "Commercial Space Osu",
      type: "Commercial",
      status: "Rented",
      price: "₵5,000/month",
      tenants: 2,
    },
  ];

  // Mock data for bookings
  const bookings = [
    {
      id: 1,
      type: "Tour Booking",
      property: "Luxury Apartment",
      date: "2024-03-15",
      time: "2:00 PM",
      status: "Confirmed",
    },
    {
      id: 2,
      type: "Rental Booking",
      property: "Modern House",
      date: "2024-03-20",
      time: "10:00 AM",
      status: "Pending",
    },
    {
      id: 3,
      type: "Tour Booking",
      property: "Studio Apartments",
      date: "2024-03-18",
      time: "3:30 PM",
      status: "Cancelled",
    },
  ];

  const payments = [
    {
      id: 1,
      tenant: "John Mensah",
      property: "Luxury Apartment",
      amount: "₵2,500",
      date: "2024-03-01",
      status: "Paid",
    },
    {
      id: 2,
      tenant: "Ama Serwaa",
      property: "Commercial Space",
      amount: "₵5,000",
      date: "2024-03-05",
      status: "Paid",
    },
    {
      id: 3,
      tenant: "Kwame Asante",
      property: "Studio Apartments",
      amount: "₵1,200",
      date: "2024-03-10",
      status: "Pending",
    },
  ];

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <FiHome /> },
    { id: "properties", label: "Properties", icon: <FiList /> },
    { id: "add-property", label: "Add Property", icon: <FiPlus /> },
    { id: "bookings", label: "Bookings", icon: <FiCalendar /> },
    { id: "payments", label: "Payments", icon: <FiDollarSign /> },
    { id: "messages", label: "Messages", icon: <FiMessageSquare /> },
    { id: "support", label: "Support", icon: <FiHelpCircle /> },
    { id: "settings", label: "Settings", icon: <FiSettings /> },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Bookings
                  </h3>
                  <button className="text-sm text-[#00CFFF] hover:text-[#FF4FA1] transition-colors">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {bookings.slice(0, 3).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              booking.status === "Confirmed"
                                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                : booking.status === "Pending"
                                  ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                                  : "bg-red-500/10 text-red-600 dark:text-red-400"
                            }`}
                          >
                            {booking.status}
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {booking.type}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {booking.property} • {booking.date} at {booking.time}
                        </div>
                      </div>
                      <FiChevronRight className="text-gray-400" />
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
                  {payments.slice(0, 3).map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              payment.status === "Paid"
                                ? "bg-green-500"
                                : "bg-yellow-500"
                            }`}
                          ></div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {payment.tenant}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {payment.property} • {payment.date}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {payment.amount}
                        </div>
                        <div className="text-xs text-gray-500">
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
                    label: "View Bookings",
                    icon: <FiCalendar />,
                    color: "text-[#FF4FA1]",
                  },
                  {
                    label: "Send Message",
                    icon: <FiMessageSquare />,
                    color: "text-green-500",
                  },
                  {
                    label: "Generate Report",
                    icon: <FiDownload />,
                    color: "text-purple-500",
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
                  Your Properties
                </h2>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 md:w-64">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search properties..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <FiFilter />
                    Filter
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
                        Type
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Price
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Tenants
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
                        </td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                          {property.type}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              property.status === "Rented"
                                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                : property.status === "Available"
                                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                  : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
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
                            <FiUsers className="text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {property.tenants}
                            </span>
                          </div>
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
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {properties.length} properties
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

      case "add-property":
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Add New Property
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Property Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
                    placeholder="Enter property name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Property Type
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent">
                    <option>Apartment</option>
                    <option>House</option>
                    <option>Studio</option>
                    <option>Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price per Month
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
                    placeholder="₵0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
                    placeholder="Enter location"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
                  placeholder="Describe your property..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of Bedrooms
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of Bathrooms
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#00CFFF] text-white rounded-lg hover:bg-[#00CFFF]/90"
                >
                  Add Property
                </button>
              </div>
            </form>
          </div>
        );

      case "bookings":
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Bookings Management
                </h2>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-[#FF4FA1] text-white rounded-lg hover:bg-[#FF4FA1]/90 flex items-center gap-2">
                    <FiPlus />
                    New Booking
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Tour Bookings", count: "8", color: "bg-[#00CFFF]" },
                  {
                    label: "Rental Bookings",
                    count: "12",
                    color: "bg-[#FF4FA1]",
                  },
                  {
                    label: "Pending Approval",
                    count: "3",
                    color: "bg-yellow-500",
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"
                  >
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.count}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="mb-3 md:mb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-lg font-medium text-gray-900 dark:text-white">
                          {booking.type}
                        </div>
                        <div
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            booking.status === "Confirmed"
                              ? "bg-green-500/10 text-green-600"
                              : booking.status === "Pending"
                                ? "bg-yellow-500/10 text-yellow-600"
                                : "bg-red-500/10 text-red-600"
                          }`}
                        >
                          {booking.status}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {booking.property} • {booking.date} at {booking.time}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {booking.status === "Pending" && (
                        <>
                          <button className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 flex items-center gap-1">
                            <FiCheck />
                            Approve
                          </button>
                          <button className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 flex items-center gap-1">
                            <FiX />
                            Reject
                          </button>
                        </>
                      )}
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#00CFFF] hover:bg-[#00CFFF]/10 rounded-lg">
                        <FiEye />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "payments":
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Payment Management
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Add Payment Method */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Add Payment Method
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <button className="w-full px-4 py-3 bg-[#00CFFF] text-white rounded-lg hover:bg-[#00CFFF]/90">
                      Add Payment Method
                    </button>
                  </div>
                </div>

                {/* Payment History */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Payment History
                  </h3>
                  <div className="space-y-3">
                    {payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {payment.tenant}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {payment.property}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {payment.amount}
                          </div>
                          <div className="text-xs text-gray-500">
                            {payment.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    View All Payments
                  </button>
                </div>
              </div>

              {/* Revenue Summary */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Revenue Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Revenue", value: "₵25,200" },
                    { label: "This Month", value: "₵8,500" },
                    { label: "Pending", value: "₵1,200" },
                    { label: "Collected", value: "₵24,000" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                    >
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {item.value}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
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
                    "John Mensah (Tenant)",
                    "Ama Serwaa (Tenant)",
                    "Admin Support",
                    "Maintenance Team",
                  ].map((contact, index) => (
                    <button
                      key={index}
                      className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="font-medium text-gray-900 dark:text-white">
                        {contact}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Last message 2 hours ago
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat */}
              <div className="lg:col-span-2 flex flex-col border border-gray-200 dark:border-gray-700 rounded-xl">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    John Mensah (Tenant)
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Apartment #302
                  </div>
                </div>

                <div className="flex-grow p-4 space-y-4 overflow-y-auto max-h-[400px]">
                  <div className="flex justify-start">
                    <div className="max-w-[70%] bg-gray-100 dark:bg-gray-700 rounded-xl p-3">
                      <div className="text-gray-900 dark:text-white">
                        Hi, there's an issue with the kitchen tap
                      </div>
                      <div className="text-xs text-gray-500 mt-1">10:30 AM</div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-[70%] bg-[#00CFFF] text-white rounded-xl p-3">
                      <div>
                        Thanks for letting me know. I'll send a plumber tomorrow
                        morning.
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {[
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
                ].map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="text-3xl text-[#00CFFF] mb-4">
                      {item.icon}
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
                              : "bg-blue-500/10 text-blue-600"
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

      case "settings":
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
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Iddi Sule"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue="iddi@gmail.com"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        defaultValue="+233 20 123 4567"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        defaultValue="RentSmart"
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
                        label: "Email notifications",
                        description:
                          "Receive email updates about bookings and payments",
                      },
                      {
                        label: "SMS notifications",
                        description: "Get text messages for urgent matters",
                      },
                      {
                        label: "Push notifications",
                        description:
                          "Receive push notifications on your device",
                      },
                      {
                        label: "Booking alerts",
                        description: "Get notified about new booking requests",
                      },
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="mt-1"
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

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Homeowner Dashboard
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

              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <FiBell className="w-5 h-5" />
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  ref={profileButtonRef}
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <div className="w-8 h-8 rounded-full bg-[#00CFFF] flex items-center justify-center text-white font-semibold">
                    IS
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Iddi Sule
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Homeowner
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

                {/* Dropdown Menu */}
                {profileOpen && (
                  <div
                    ref={profileDropdownRef}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                  >
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          router.push("/homeowner/profile");
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Profile Settings
                      </button>
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          router.push("/homeowner/settings");
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Account Settings
                      </button>
                      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <FiLogOut className="w-4 h-4" />
                        Log Out
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
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-2">
              {menuItems.find((item) => item.id === activeSection)?.icon}
              <span className="font-medium text-gray-900 dark:text-white">
                {menuItems.find((item) => item.id === activeSection)?.label}
              </span>
            </div>
            <FiChevronDown
              className={`transition-transform ${showMobileMenu ? "rotate-180" : ""}`}
            />
          </button>

          {showMobileMenu && (
            <div className="mt-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
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
          )}
        </div>

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

          <div className="flex-1">{renderSection()}</div>
        </div>
      </div>
    </div>
  );
};

export default HomeownerDashboard;
