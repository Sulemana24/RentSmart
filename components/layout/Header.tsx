"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Logo from "../../public/images/logo.jpg";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import {
  FiSun,
  FiMoon,
  FiUser,
  FiLogOut,
  FiHome,
  FiInfo,
  FiMail,
  FiCalendar,
} from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { useToast } from "../ToastProvider";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userData, setUserData] = useState<{
    name?: string;
    role?: string;
    email?: string;
  } | null>(null);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { showToast } = useToast();

  const navItems = [
    { name: "Home", href: "/", icon: <FiHome /> },
    { name: "About", href: "/about", icon: <FiInfo /> },
    { name: "Contact", href: "/contact", icon: <FiMail /> },
    { name: "Booking Status", href: "/booking-status", icon: <FiCalendar /> },
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const role = localStorage.getItem("role");
      const uid = auth.currentUser?.uid;

      if (uid && role) {
        try {
          const snap = await getDoc(doc(db, "users", uid));
          if (snap.exists()) {
            const data = snap.data();
            setUserData({
              name: data.firstName || data.name || "User",
              role: data.role,
              email: data.email,
            });
          }
        } catch (err) {
          showToast({
            title: "Failed",
            message: "Failed to fetch user data!",
            type: "error",
          });
        }
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuButtonRef.current?.contains(event.target as Node)) return;

      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("role");
    setUserData(null);
    setProfileOpen(false);
    router.push("/");
  };

  const handleListProperty = () => router.push("/auth");
  const handleSignUp = () => router.push("/auth");

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800 transition-colors duration-200 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <div className="flex items-center gap-2 group">
                <img
                  src={Logo.src}
                  alt="Logo"
                  className="h-10 w-auto cursor-pointer transition-transform group-hover:scale-105"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-[#FF4FA1] dark:hover:text-[#FF4FA1] px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 group"
              >
                <span className="opacity-70 group-hover:opacity-100 transition-opacity">
                  {item.icon}
                </span>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Side - Auth & Dark Mode */}
          <div
            className="hidden md:flex items-center space-x-3 relative"
            ref={profileRef}
          >
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
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

            {userData ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 bg-[#FF4FA1] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-95 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <FiUser className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">{userData.name}</div>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform ${profileOpen ? "rotate-180" : ""}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="p-4 border-b dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {userData.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {userData.email}
                      </p>
                      <div className="mt-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[#FF4FA1]/10 to-[#00CFFF]/10 text-[#FF4FA1] dark:text-[#00CFFF]">
                          <HiOutlineBuildingOffice2 className="w-3 h-3" />
                          {userData.role}
                        </span>
                      </div>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => {
                          router.push(
                            userData.role === "homeowner"
                              ? "/homeowner"
                              : "/dashboard",
                          );
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <FiHome className="w-4 h-4" />
                        Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t dark:border-gray-700"
                      >
                        <FiLogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={handleListProperty}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#00CFFF] to-cyan-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                >
                  <HiOutlineBuildingOffice2 className="w-4 h-4" />
                  List Property
                </button>
                <button
                  onClick={handleSignUp}
                  className="bg-gradient-to-r from-[#FF4FA1] to-pink-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
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

            <button
              ref={menuButtonRef}
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-[#FF4FA1] dark:hover:text-[#FF4FA1] transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800 shadow-xl"
        >
          <nav className="px-4 py-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-[#FF4FA1] dark:hover:text-[#FF4FA1] px-3 py-3 text-sm font-medium transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 mb-1"
              >
                <span className="opacity-70">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="px-4 py-4 border-t dark:border-gray-800">
            {userData ? (
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {userData.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {userData.email}
                  </p>
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[#FF4FA1]/10 to-[#00CFFF]/10 text-[#FF4FA1] dark:text-[#00CFFF]">
                      <HiOutlineBuildingOffice2 className="w-3 h-3" />
                      {userData.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    router.push(
                      userData.role === "homeowner"
                        ? "/homeowner"
                        : "/dashboard",
                    );
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00CFFF] to-cyan-400 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-200"
                >
                  <FiHome className="w-4 h-4" />
                  Dashboard
                </button>

                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <FiLogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    handleListProperty();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00CFFF] to-cyan-400 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-200"
                >
                  <HiOutlineBuildingOffice2 className="w-4 h-4" />
                  List Your Property
                </button>

                <button
                  onClick={() => {
                    handleSignUp();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF4FA1] to-pink-400 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-200"
                >
                  <FiUser className="w-4 h-4" />
                  Sign Up / Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
