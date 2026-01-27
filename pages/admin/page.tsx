"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Properties from "./components/Properties";
import Payments from "./components/Payments";
import Bookings from "./components/Bookings";
import Users from "./components/Users";
import Messages from "./components/Messages";
import Support from "./components/Support";
import Settings from "./components/Settings";

interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
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

  const menuItems: MenuItem[] = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "properties", label: "Properties", icon: "🏠" },
    { id: "payments", label: "Payments", icon: "💰" },
    { id: "bookings", label: "Bookings", icon: "📅" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "messages", label: "Messages", icon: "💬" },
    { id: "support", label: "Support", icon: "🛟" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "properties":
        return <Properties />;
      case "payments":
        return <Payments />;
      case "bookings":
        return <Bookings />;
      case "users":
        return <Users />;
      case "messages":
        return <Messages />;
      case "support":
        return <Support />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
        handleLogout={handleLogout}
        profileDropdownRef={profileDropdownRef}
        profileButtonRef={profileButtonRef}
        setShowMobileMenu={setShowMobileMenu}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {showMobileMenu && (
          <div className="md:hidden mb-4">
            <Sidebar
              menuItems={menuItems}
              activeSection={activeSection}
              setActiveSection={(section) => {
                setActiveSection(section);
                setShowMobileMenu(false);
              }}
              isMobile={true}
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          <div className="hidden md:block w-full md:w-64 flex-shrink-0">
            <Sidebar
              menuItems={menuItems}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          </div>

          <div className="flex-1">{renderSection()}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
