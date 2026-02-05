"use client";
import { useRouter } from "next/router";
import { FiSun, FiMoon, FiBell, FiLogOut, FiChevronDown } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  profileOpen: boolean;
  setProfileOpen: (open: boolean) => void;
  handleLogout: () => void;
  setActiveSection: (section: string) => void;
}

interface HostelData {
  hostelName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Add other fields you have in Firestore
}

const Header: React.FC<HeaderProps> = ({
  darkMode,
  toggleDarkMode,
  profileOpen,
  setProfileOpen,
  handleLogout,
  setActiveSection,
}) => {
  const router = useRouter();
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  const [user, setUser] = useState<any>(null);
  const [hostelData, setHostelData] = useState<HostelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userInitials, setUserInitials] = useState("HM");

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);

        // Fetch user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data() as HostelData;
            setHostelData(data);

            if (data.hostelName) {
              setUserInitials(
                data.hostelName
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2),
              );
            } else if (data.firstName && data.lastName) {
              setUserInitials(
                `${data.firstName[0]}${data.lastName[0]}`.toUpperCase(),
              );
            }
          }
        } catch (error) {
          console.error("Error fetching hostel data:", error);
        }
      } else {
        setUser(null);
        setHostelData(null);

        router.push("/");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const getUserDisplayName = () => {
    if (hostelData) {
      if (hostelData.hostelName) {
        return hostelData.hostelName;
      }
      if (hostelData.firstName && hostelData.lastName) {
        return `${hostelData.firstName} ${hostelData.lastName}`;
      }
    }
    return "Hostel Manager";
  };

  const getUserEmail = () => {
    if (hostelData?.email) {
      return hostelData.email;
    }
    if (user?.email) {
      return user.email;
    }
    return "hostel@example.com";
  };

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
  }, [profileOpen, setProfileOpen]);

  if (loading) {
    return (
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Loading...
              </h1>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {hostelData?.hostelName
                ? `${hostelData.hostelName} Dashboard`
                : "Hostel Manager Dashboard"}
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
                  {userInitials}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {getUserDisplayName()}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {user?.email || getUserEmail()}
                  </div>
                </div>
                <FiChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {profileOpen && (
                <div
                  ref={profileDropdownRef}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                >
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 mb-2">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {getUserDisplayName()}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {getUserEmail()}
                      </div>
                    </div>

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
