"use client";
import {
  FiHome,
  FiList,
  FiPlus,
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiMessageSquare,
  FiHelpCircle,
  FiSettings,
} from "react-icons/fi";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection,
  isMobile = false,
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <FiHome /> },
    { id: "rooms", label: "Rooms", icon: <FiList /> },
    { id: "add-room", label: "Add Room", icon: <FiPlus /> },
    { id: "students", label: "Students", icon: <FiUsers /> },
    { id: "bookings", label: "Bookings", icon: <FiCalendar /> },
    { id: "payments", label: "Payments", icon: <FiDollarSign /> },
    { id: "messages", label: "Messages", icon: <FiMessageSquare /> },
    { id: "support", label: "Support", icon: <FiHelpCircle /> },
    { id: "settings", label: "Settings", icon: <FiSettings /> },
  ];

  if (isMobile) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
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
    );
  }

  return (
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
  );
};

export default Sidebar;
