"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FiChevronDown } from "react-icons/fi";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Rooms from "./components/Rooms";
import AddRoom from "./components/AddRoom";
import Students from "./components/Students";
import Bookings from "./components/Bookings";
import Payments from "./components/Payments";
import Messages from "./components/Messages";
import Settings from "./components/Settings";
import { useToast } from "../../components/ToastProvider";

const HostelPage = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

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

  const handleLogout = async () => {
    setProfileOpen(false);

    await signOut(auth);

    localStorage.clear();
    sessionStorage.clear();

    showToast({
      title: "Success",
      message: "You have been logged out successfully!",
      type: "success",
    });
    router.replace("/");
  };

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "rooms":
        return <Rooms />;
      case "add-room":
        return <AddRoom />;
      case "students":
        return <Students />;
      case "bookings":
        return <Bookings />;
      case "payments":
        return <Payments />;
      case "messages":
        return <Messages />;
      case "support":
      case "settings":
        return <Settings section={activeSection} />;
      default:
        return <Dashboard />;
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "Home" },
    { id: "rooms", label: "Rooms", icon: "List" },
    { id: "add-room", label: "Add Room", icon: "Plus" },
    { id: "students", label: "Students", icon: "Users" },
    { id: "bookings", label: "Bookings", icon: "Calendar" },
    { id: "payments", label: "Payments", icon: "DollarSign" },
    { id: "messages", label: "Messages", icon: "MessageSquare" },
    { id: "support", label: "Support", icon: "HelpCircle" },
    { id: "settings", label: "Settings", icon: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
        handleLogout={handleLogout}
        setActiveSection={setActiveSection}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-2">
              {menuItems.find((item) => item.id === activeSection)?.icon && (
                <span>📊</span>
              )}
              <span className="font-medium text-gray-900 dark:text-white">
                {menuItems.find((item) => item.id === activeSection)?.label}
              </span>
            </div>
            <FiChevronDown
              className={`transition-transform ${showMobileMenu ? "rotate-180" : ""}`}
            />
          </button>

          {showMobileMenu && (
            <Sidebar
              activeSection={activeSection}
              setActiveSection={(section) => {
                setActiveSection(section);
                setShowMobileMenu(false);
              }}
              isMobile={true}
            />
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-full md:w-64 flex-shrink-0">
            <Sidebar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">{renderSection()}</div>
        </div>
      </div>
    </div>
  );
};

export default HostelPage;
