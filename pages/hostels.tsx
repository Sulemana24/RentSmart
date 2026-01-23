"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FiSearch,
  FiFilter,
  FiMapPin,
  FiStar,
  FiUsers,
  FiHome,
} from "react-icons/fi";

const HostelsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const hostels = [
    {
      id: 1,
      name: "University Hostel Complex",
      location: "Accra, University Campus",
      price: "₵300/month",
      rating: 4.5,
      rooms: 42,
      occupancy: 36,
      image:
        "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800",
      amenities: ["WiFi", "AC", "Study Room", "24/7 Security"],
    },
    {
      id: 2,
      name: "Student Accommodation Center",
      location: "Legon, Near Campus",
      price: "₵350/month",
      rating: 4.2,
      rooms: 28,
      occupancy: 24,
      image:
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800",
      amenities: ["WiFi", "AC", "Laundry", "Cafeteria"],
    },
    {
      id: 3,
      name: "Campus Living Apartments",
      location: "East Legon",
      price: "₵400/month",
      rating: 4.7,
      rooms: 35,
      occupancy: 32,
      image:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800",
      amenities: ["WiFi", "AC", "Gym", "Pool", "Study Area"],
    },
    {
      id: 4,
      name: "Accra Student Hostel",
      location: "Osu, Accra",
      price: "₵280/month",
      rating: 4.0,
      rooms: 20,
      occupancy: 18,
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800",
      amenities: ["WiFi", "Security", "Common Kitchen"],
    },
  ];

  const filteredHostels = hostels.filter(
    (hostel) =>
      hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hostel.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#00CFFF] to-[#FF4FA1] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Student Accommodation
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Browse through our verified hostels with modern amenities
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search hostels by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-[#FF4FA1]"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#FF4FA1] text-white px-6 py-2 rounded-lg hover:bg-[#FF4FA1]/90 transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hostels Listing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
            Available Hostels ({filteredHostels.length})
          </h2>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
              <FiFilter />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
              <FiMapPin />
              Map View
            </button>
          </div>
        </div>

        {filteredHostels.length === 0 ? (
          <div className="text-center py-12">
            <FiHome className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No hostels found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHostels.map((hostel) => (
              <div
                key={hostel.id}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <img
                    src={hostel.image}
                    alt={hostel.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-[#FF4FA1] text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {hostel.price}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {hostel.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <FiStar className="text-yellow-500" />
                      <span className="font-semibold">{hostel.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
                    <FiMapPin />
                    <span>{hostel.location}</span>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <FiHome className="text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {hostel.rooms} rooms
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiUsers className="text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {hostel.occupancy} occupied
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Amenities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {hostel.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/hostels/${hostel.id}`}
                    className="block w-full text-center bg-[#00CFFF] text-white py-3 rounded-lg font-semibold hover:bg-[#00CFFF]/90 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-[#00CFFF]/10 to-[#FF4FA1]/10 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Are you a Hostel Manager?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            List your hostel and reach thousands of students
          </p>
          <Link
            href="/auth"
            className="inline-block bg-[#FF4FA1] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#FF4FA1]/90 transition-colors"
          >
            List Your Hostel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HostelsPage;
