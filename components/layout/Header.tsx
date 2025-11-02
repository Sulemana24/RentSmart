"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Logo from "../../public/images/logo.jpg";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Booking Status", href: "/booking-status" },
  ];

  const handleSignUp = () => {
    // Close mobile menu if open
    setMenuOpen(false);
    // Redirect to auth page
    router.push("/auth");
  };

  const handleListProperty = () => {
    // Close mobile menu if open
    setMenuOpen(false);
    // Redirect to property listing page or auth if not logged in
    // For now, redirect to auth with homeowner focus
    router.push("/auth");
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <img
                src={Logo.src}
                alt="Logo"
                className="h-10 w-auto cursor-pointer"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-[#FF4FA1] px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleListProperty}
              className="bg-[#00CFFF] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#FF4FA1] transition-colors duration-200"
            >
              List Your Property
            </button>
            <button
              onClick={handleSignUp}
              className="bg-[#FF4FA1] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#00CFFF] transition-colors duration-200"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 hover:text-gray-900 p-2"
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
        <div className="md:hidden px-4 pb-4 space-y-3 bg-white border-t">
          <nav className="flex flex-col space-y-2 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 hover:text-[#FF4FA1] px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Auth Buttons */}
          <div className="mt-3 flex flex-col space-y-2 pt-2 border-t">
            <button
              onClick={handleListProperty}
              className="bg-[#00CFFF] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#FF4FA1] transition-colors duration-200"
            >
              List Your Property
            </button>
            <button
              onClick={handleSignUp}
              className="bg-[#FF4FA1] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#00CFFF] transition-colors duration-200"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
