import axios from "axios";
import { useEffect, useState } from "react";
import PropertyCard from "../components/property/PropertyCard";
import { PROPERTYLISTINGSAMPLE } from "../constants/index";
import { PropertyProps } from "@/interfaces";

export default function Home() {
  const [properties, setProperties] = useState<PropertyProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [visiblePropertiesCount, setVisiblePropertiesCount] = useState(6);
  const [activeSection, setActiveSection] = useState<"all" | "top" | "new">(
    "all"
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
        feature.toLowerCase().includes(query)
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

  // Filter new listings (using ID as proxy for newness)
  const newListings = [...filteredProperties]
    .sort((a, b) => b.id - a.id)
    .slice(0, 6);

  // Properties for current view (with pagination)
  const displayedProperties = filteredProperties.slice(
    0,
    visiblePropertiesCount
  );
  const hasMoreProperties = visiblePropertiesCount < filteredProperties.length;

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled automatically through state updates
    setVisiblePropertiesCount(6); // Reset to initial count when searching
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4FA1]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero Section with Background Image */}
      <section className="relative py-20 text-white">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect
              <span className="block text-[#00CFFF]">Home</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Discover amazing properties with exclusive deals. Move in now!
            </p>
          </div>
        </div>
      </section>

      {/* Global Search Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">
            Find Your Dream Property
          </h2>

          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by location, property type, features, price..."
              className="w-full px-6 py-4 border border-gray-600 rounded-xl focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent bg-gray-900/80 backdrop-blur-sm text-white placeholder-gray-400 text-lg"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#FF4FA1] transition-colors duration-200 p-2"
              aria-label="Search properties"
            >
              <svg
                className="w-6 h-6"
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

          {/* Search Results Info */}
          {searchQuery && (
            <div className="mt-2 text-center">
              <p className="text-gray-300">
                Found {filteredProperties.length} properties matching "
                {searchQuery}"
                {filteredProperties.length === 0 && (
                  <button
                    onClick={showAllProperties}
                    className="ml-2 text-[#00CFFF] hover:text-[#FF4FA1] transition-colors underline"
                  >
                    Show all properties
                  </button>
                )}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Show search results or regular sections */}
      {searchQuery ? (
        /* Search Results Section */
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Search Results
            </h2>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
              {filteredProperties.length} properties found for "{searchQuery}"
            </p>
            <button
              onClick={showAllProperties}
              className="mt-4 text-[#00CFFF] hover:text-[#FF4FA1] transition-colors underline"
            >
              Clear search and show all properties
            </button>
          </div>

          {filteredProperties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {/* View More Button for Search Results */}
              {hasMoreProperties && (
                <div className="text-center mt-12">
                  <button
                    onClick={loadMoreProperties}
                    className="bg-[#FF4FA1] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-200 shadow-lg"
                  >
                    Load More Properties (
                    {filteredProperties.length - visiblePropertiesCount}{" "}
                    remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400 mb-4">
                No properties found matching your search.
              </p>
              <button
                onClick={showAllProperties}
                className="bg-[#FF4FA1] text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-200"
              >
                Browse All Properties
              </button>
            </div>
          )}
        </section>
      ) : (
        /* Regular Sections (when no search) */
        <>
          {/* Top Properties Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-12 text-center lg:text-left">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Top Rated Properties
              </h2>
              <p className="text-lg md:text-xl text-gray-500 max-w-2xl">
                Handpicked selections with excellent ratings and great deals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </section>

          {/* New Listings Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center lg:text-left">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                New Listings
              </h2>
              <p className="text-lg md:text-xl text-gray-500 max-w-2xl lg:mx-0 mx-auto">
                Fresh properties just added to our collection
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newListings.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </section>

          {/* All Properties Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center lg:text-left">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                All Properties
              </h2>
              <p className="text-lg md:text-xl text-gray-500 max-w-2xl lg:mx-0 mx-auto">
                Browse our complete collection of amazing properties
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* View More Button for All Properties */}
            {hasMoreProperties && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMoreProperties}
                  className="bg-[#FF4FA1] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-200 shadow-lg"
                >
                  View More Properties (
                  {properties.length - visiblePropertiesCount} remaining)
                </button>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
