"use client";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FiSun, FiMoon, FiBell, FiLogOut } from "react-icons/fi";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  profileOpen: boolean;
  setProfileOpen: (open: boolean) => void;
  handleLogout: () => void;
  setActiveSection: (section: string) => void;
}

const Header = ({
  darkMode,
  toggleDarkMode,
  profileOpen,
  setProfileOpen,
  handleLogout,
  setActiveSection,
}: HeaderProps) => {
  const router = useRouter();
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const [userName, setUserName] = useState("Loading...");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userSnap = await getDoc(doc(db, "users", user.uid));
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserName(`${data.firstName || ""} ${data.lastName || ""}`);
          setUserRole(data.role || "");
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileButtonRef.current?.contains(event.target as Node)) return;

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
  }, [profileOpen, setProfileOpen]);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {userRole === "homeowner" ? "Homeowner Dashboard" : "Dashboard"}
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

            <div className="relative">
              <button
                ref={profileButtonRef}
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full bg-[#00CFFF] flex items-center justify-center text-white font-semibold">
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {userName || "User"}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {userRole || "Role"}
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
                        setActiveSection("settings");
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Profile Settings
                    </button>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        setActiveSection("settings");
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
  );
};

export default Header;
