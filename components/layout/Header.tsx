"use client";
import React, { useState } from "react";
import Logo from "../../public/images/logo.jpg";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [apartmentDropdownOpen, setApartmentDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bedroomType, setBedroomType] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement your search logic here
    console.log("Searching for:", searchQuery);
    console.log("Bedroom type:", bedroomType);
    // You can redirect to search results page or filter properties
  };

  const apartmentTypes = ["1 Bedroom", "2 Bedroom", "Others"];

  const handleApartmentTypeSelect = (type: string) => {
    setBedroomType(type);
    setApartmentDropdownOpen(false);
    // You can add additional logic here when a type is selected
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img src={Logo.src} alt="Logo" className="h-10 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {/* Properties Link */}
            <a
              href="#"
              className="text-gray-700 hover:text-[#FF4FA1] px-3 py-2 text-sm font-medium"
            >
              Properties
            </a>

            {/* Additional Navigation Items */}
            {["About", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-700 hover:text-[#FF4FA1] px-3 py-2 text-sm font-medium"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for properties, locations..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 text-gray-400 hover:text-[#FF4FA1] transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="bg-[#00CFFF] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#FF4FA1] transition">
              Booking Status
            </button>
            <button className="bg-[#FF4FA1] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#00CFFF] transition">
              Sign Up
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 hover:text-gray-900"
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
        <div className="md:hidden px-4 pb-4 space-y-3">
          <nav className="flex flex-col space-y-2">
            {/* Properties Link */}
            <a
              href="#"
              className="text-gray-700 hover:text-[#FF4FA1] block px-3 py-2 text-sm font-medium"
            >
              Properties
            </a>

            {/* Additional Mobile Navigation Items */}
            {["About", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-700 hover:text-[#FF4FA1] block px-3 py-2 text-sm font-medium"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Mobile Search */}
          <div className="mt-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search properties..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
              />
            </form>
          </div>

          {/* Mobile Auth Buttons */}
          <div className="mt-3 flex flex-col space-y-2">
            <button className="bg-[#00CFFF] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#FF4FA1] transition">
              Booking Status
            </button>
            <button className="bg-[#FF4FA1] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#00CFFF] transition">
              Sign Up
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
