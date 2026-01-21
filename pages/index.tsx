import axios from "axios";
import { useEffect, useState } from "react";
import PropertyCard from "../components/property/PropertyCard";
import { PROPERTYLISTINGSAMPLE } from "../constants/index";
import { PropertyProps } from "@/interfaces";
import {
  FiChevronRight,
  FiStar,
  FiTrendingUp,
  FiClock,
  FiSearch,
  FiHome,
} from "react-icons/fi";
import { HiOutlineFire } from "react-icons/hi";

export default function Home() {
  const [properties, setProperties] = useState<PropertyProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [visiblePropertiesCount, setVisiblePropertiesCount] = useState(6);
  const [activeSection, setActiveSection] = useState<"all" | "top" | "new">(
    "all",
  );

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get("/api/properties");
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setProperties(PROPERTYLISTINGSAMPLE);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Search function
  const searchProperties = (property: PropertyProps) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      property.name?.toLowerCase().includes(query) ||
      property.address.city?.toLowerCase().includes(query) ||
      property.description?.toLowerCase().includes(query) ||
      property.category?.includes(query) ||
      property.amenities?.some((feature) =>
        feature.toLowerCase().includes(query),
      ) ||
      property.price?.toString().includes(query)
    );
  };

  // Filter properties based on search
  const filteredProperties = properties.filter(searchProperties);

  // Filter top properties (high rating + discount)
  const topProperties = filteredProperties
    .filter((property) => property.rating >= 4.8 && property.discount)
    .slice(0, 6);

  const newListings = [...filteredProperties]
    .sort((a, b) => b.id - a.id)
    .slice(0, 6);

  const displayedProperties = filteredProperties.slice(
    0,
    visiblePropertiesCount,
  );
  const hasMoreProperties = visiblePropertiesCount < filteredProperties.length;

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setVisiblePropertiesCount(6);
  };

  // Load more properties
  const loadMoreProperties = () => {
    setVisiblePropertiesCount((prev) => prev + 6);
  };

  // Reset search and show all
  const showAllProperties = () => {
    setSearchQuery("");
    setVisiblePropertiesCount(6);
    setActiveSection("all");
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#FF4FA1] border-t-transparent"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Loading amazing properties...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 md:pt-28 md:pb-40 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <HiOutlineFire className="w-5 h-5 text-[#FF4FA1]" />
              <span className="text-sm font-medium">
                200+ Premium Properties
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Find Your Perfect
              <span className="block bg-[#FF4FA1] bg-clip-text text-transparent mt-2">
                Dream Home
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed">
              Discover amazing properties with exclusive deals. Your perfect
              home awaits!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() =>
                  document
                    .querySelector("#search-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 bg-[#FF4FA1] text-white rounded-xl text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Start Searching
                <FiChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveSection("top")}
                className="px-8 py-4 bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm text-white rounded-xl text-lg font-semibold hover:bg-white/20 dark:hover:bg-gray-800/50 transition-all duration-300 border border-white/20"
              >
                View Top Rated
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/*  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { value: "200+", label: "Properties", icon: <FiTrendingUp /> },
            { value: "4.8", label: "Avg Rating", icon: <FiStar /> },
            { value: "24h", label: "New Listings", icon: <FiClock /> },
            { value: "98%", label: "Satisfaction", icon: <FiStar /> },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg dark:shadow-xl border border-gray-100 dark:border-gray-700 text-center hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-gradient-to-r from-[#FF4FA1]/10 to-[#00CFFF]/10 dark:from-[#FF4FA1]/20 dark:to-[#00CFFF]/20 rounded-xl">
                  <div className="text-[#FF4FA1] dark:text-[#00CFFF] text-xl">
                    {stat.icon}
                  </div>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div> */}

      {/* Search Section */}
      <section
        id="search-section"
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-xl dark:shadow-2xl transition-all duration-300">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Find Your Dream Property
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
              Search from our curated selection of premium properties
            </p>
          </div>

          <form onSubmit={handleSearch} className="relative">
            <div className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by location, property type, features, price..."
                className="w-full pl-14 pr-6 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent bg-white dark:bg-gray-900/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-base md:text-lg transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-[#00CFFF]"
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
              </div>
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#00CFFF] text-white px-4 md:px-5 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Search
              </button>
            </div>

            {/* Quick Search Tags */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {[
                "Accra",
                "Apartments",
                "Luxury",
                "₵1,500-₵3,000",
                "Pool",
                "3+ Beds",
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSearchQuery(tag)}
                  className="px-3 py-1.5 text-xs md:text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-[#FF4FA1] dark:hover:text-[#FF4FA1] rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-700"
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>

          {/* Search Results Info */}
          {searchQuery && (
            <div className="mt-6 p-4 bg-gradient-to-r from-[#FF4FA1]/5 to-[#00CFFF]/5 dark:from-[#FF4FA1]/10 dark:to-[#00CFFF]/10 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 animate-fadeIn">
              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    Found{" "}
                    <span className="text-[#FF4FA1] dark:text-[#FF4FA1] font-bold">
                      {filteredProperties.length}
                    </span>{" "}
                    properties matching "
                    <span className="text-gray-900 dark:text-white font-semibold">
                      {searchQuery}
                    </span>
                    "
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {filteredProperties.length === 0 ? (
                    <button
                      onClick={showAllProperties}
                      className="px-4 py-2 bg-[#00CFFF]  text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      Show All Properties
                    </button>
                  ) : (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-gray-600"
                    >
                      Clear Search
                    </button>
                  )}

                  {filteredProperties.length > 0 && (
                    <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{filteredProperties.length} matches</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Navigation Tabs */}
      {!searchQuery && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
            <button
              onClick={() => setActiveSection("top")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeSection === "top"
                  ? "bg-gradient-to-r from-[#FF4FA1] to-pink-500 text-white shadow-lg"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <HiOutlineFire className="w-5 h-5" />
              Top Rated
            </button>
            <button
              onClick={() => setActiveSection("new")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeSection === "new"
                  ? "bg-gradient-to-r from-[#00CFFF] to-cyan-500 text-white shadow-lg"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <FiClock className="w-5 h-5" />
              New Listings
            </button>
            <button
              onClick={() => setActiveSection("all")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeSection === "all"
                  ? "bg-[#FF4FA1] text-white shadow-lg"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              All Properties
            </button>
          </div>
        </div>
      )}

      {searchQuery ? (
        /* Search Results Section */
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Search Results
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {filteredProperties.length} properties found for "{searchQuery}"
            </p>
            <button
              onClick={showAllProperties}
              className="mt-6 text-[#00CFFF] hover:text-[#FF4FA1] transition-colors font-medium flex items-center gap-2 mx-auto"
            >
              <span>Clear search and show all properties</span>
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>

          {filteredProperties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {displayedProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {/* View More Button for Search Results */}
              {hasMoreProperties && (
                <div className="text-center mt-12">
                  <button
                    onClick={loadMoreProperties}
                    className="bg-[#FF4FA1] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto"
                  >
                    Load More Properties
                    <span className="text-sm opacity-90">
                      ({filteredProperties.length - visiblePropertiesCount}{" "}
                      remaining)
                    </span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 rounded-full bg-[#00CFFF]/10 dark:bg-[#00CFFF]/20 flex items-center justify-center">
                    <FiSearch className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-[#FF4FA1] to-pink-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">0</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  No properties found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  We couldn't find any properties matching "
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {searchQuery}
                  </span>
                  ". Try different keywords or browse all properties.
                </p>
                <button
                  onClick={showAllProperties}
                  className="bg-[#00CFFF]  text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto"
                >
                  <FiHome className="w-5 h-5" />
                  Browse All Properties
                </button>
              </div>
            </div>
          )}
        </section>
      ) : (
        <div className="space-y-16">
          {/* Top Properties Section */}
          {activeSection === "top" && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <HiOutlineFire className="w-8 h-8 text-[#FF4FA1]" />
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        Top Rated Properties
                      </h2>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                      Handpicked selections with excellent ratings and great
                      deals
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <span className="text-sm font-medium px-4 py-2 bg-gradient-to-r from-[#FF4FA1]/10 to-pink-500/10 dark:from-[#FF4FA1]/20 dark:to-pink-500/20 text-[#FF4FA1] rounded-full">
                      Premium Collection
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {topProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* New Listings Section */}
          {activeSection === "new" && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <FiClock className="w-8 h-8 text-[#00CFFF]" />
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        New Listings
                      </h2>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                      Fresh properties just added to our collection
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <span className="text-sm font-medium px-4 py-2 bg-gradient-to-r from-[#00CFFF]/10 to-cyan-500/10 dark:from-[#00CFFF]/20 dark:to-cyan-500/20 text-[#00CFFF] rounded-full">
                      Just Added
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {newListings.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* All Properties Section */}
          {activeSection === "all" && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-10">
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                    All Properties
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                    Browse our complete collection of amazing properties
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {displayedProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>

                {/* View More Button for All Properties */}
                {hasMoreProperties && (
                  <div className="text-center mt-12">
                    <button
                      onClick={loadMoreProperties}
                      className="bg-[#FF4FA1] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto"
                    >
                      View More Properties
                      <span className="text-sm opacity-90">
                        ({properties.length - visiblePropertiesCount} remaining)
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
