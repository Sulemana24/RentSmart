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
            {["Rooms", "Hostel"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                {item}
              </a>
            ))}

            {/* Apartment Dropdown */}
            <div className="relative">
              <button
                onClick={() => setApartmentDropdownOpen(!apartmentDropdownOpen)}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium flex items-center"
              >
                Apartment
                <svg
                  className={`ml-1 w-4 h-4 transition-transform ${
                    apartmentDropdownOpen ? "rotate-180" : ""
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

              {apartmentDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  {apartmentTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleApartmentTypeSelect(type)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Search Bar - hide on small screens */}
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
            <button className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              Sign In
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
            {["Rooms", "Hostel"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-sm font-medium"
              >
                {item}
              </a>
            ))}

            {/* Mobile Apartment Dropdown */}
            <div className="space-y-1">
              <div className="text-gray-700 px-3 py-2 text-sm font-medium">
                Apartment Types:
              </div>
              {apartmentTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    handleApartmentTypeSelect(type);
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-600 hover:text-gray-900 px-6 py-1 text-sm"
                >
                  {type}
                </button>
              ))}
            </div>
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
            <button className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium text-left">
              Sign In
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
