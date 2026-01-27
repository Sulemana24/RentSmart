import React from "react";
import { FiBell, FiMenu, FiMoon, FiSun, FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  profileOpen: boolean;
  setProfileOpen: (open: boolean) => void;
  handleLogout: () => void;
  profileDropdownRef: React.RefObject<HTMLDivElement>;
  profileButtonRef: React.RefObject<HTMLButtonElement>;
  setShowMobileMenu: (show: boolean | ((prev: boolean) => boolean)) => void; // ✅ Updated type
}

const Header: React.FC<HeaderProps> = ({
  darkMode,
  toggleDarkMode,
  profileOpen,
  setProfileOpen,
  handleLogout,
  profileDropdownRef,
  profileButtonRef,
  setShowMobileMenu,
}) => {
  const router = useRouter();

  const toggleMobileMenu = () => {
    setShowMobileMenu((prev: boolean) => !prev); // ✅ Now TypeScript knows this is valid
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMobileMenu}
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
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
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
                        router.push("/admin/settings");
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
  );
};

export default Header;
