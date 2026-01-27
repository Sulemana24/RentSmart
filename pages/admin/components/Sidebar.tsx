import React from "react";

interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

interface SidebarProps {
  menuItems: MenuItem[];
  activeSection: string;
  setActiveSection: (section: string) => void;
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  menuItems,
  activeSection,
  setActiveSection,
  isMobile = false,
}) => {
  return (
    <div
      className={`${
        isMobile
          ? "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          : "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-6"
      }`}
    >
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
