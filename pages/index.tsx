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
  FiMapPin,
  FiCheckCircle,
  FiShield,
  FiChevronLeft,
  FiChevronDown,
} from "react-icons/fi";
import { HiOutlineFire } from "react-icons/hi";
import { TbHeartHandshake } from "react-icons/tb";

export default function Home() {
  const [properties, setProperties] = useState<PropertyProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [visiblePropertiesCount, setVisiblePropertiesCount] = useState(6);
  const [activeSection, setActiveSection] = useState<"all" | "top" | "new">(
    "all",
  );
  const [featuredIndex, setFeaturedIndex] = useState(0);

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

  const filteredProperties = properties.filter(searchProperties);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setVisiblePropertiesCount(6);
  };

  const loadMoreProperties = () => {
    setVisiblePropertiesCount((prev) => prev + 6);
  };

  const showAllProperties = () => {
    setSearchQuery("");
    setVisiblePropertiesCount(6);
    setActiveSection("all");
  };

  const featuredProperties = properties.filter((p) => p.featured);
  const nextFeatured = () => {
    setFeaturedIndex((prev) => (prev + 1) % featuredProperties.length);
  };

  const prevFeatured = () => {
    setFeaturedIndex(
      (prev) =>
        (prev - 1 + featuredProperties.length) % featuredProperties.length,
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-[#00CFFF] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-gray-600 dark:text-gray-400 font-medium">
          Discovering amazing properties...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-20 pb-20 bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 md:pt-32 md:pb-40 overflow-hidden">
        <div className="absolute inset-0 bg-gray-900">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-40"></div>
          <div className="absolute inset-0 bg-gray-900/70"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm px-5 py-3 rounded-full border border-white/10 mb-8">
              <HiOutlineFire className="w-5 h-5 text-[#FF4FA1]" />
              <span className="text-sm font-medium text-white">
                200+ Premium Properties Available
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight tracking-tight">
              <span className="text-white">FIND YOUR</span>
              <span className="block text-[#FF4FA1] mt-4">DREAM HOME</span>
            </h1>

            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Discover exceptional properties with verified details, transparent
              pricing, and premium amenities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() =>
                  document
                    .querySelector("#search-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-10 py-4 bg-[#FF4FA1] text-white rounded-xl text-lg font-bold hover:bg-[#FF4FA1]/90 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex items-center gap-3"
              >
                <span>Start Searching</span>
                <FiChevronRight className="w-6 h-6" />
              </button>
              <button
                onClick={() => setActiveSection("top")}
                className="px-10 py-4 bg-white/5 backdrop-blur-sm text-white rounded-xl text-lg font-bold hover:bg-white/10 transition-all duration-300 border border-white/20"
              >
                View Top Rated
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              value: "200+",
              label: "Premium Properties",
              icon: <FiTrendingUp />,
              color: "text-[#00CFFF]",
            },
            {
              value: "4.8",
              label: "Average Rating",
              icon: <FiStar />,
              color: "text-[#FF4FA1]",
            },
            {
              value: "24h",
              label: "New Listings Daily",
              icon: <FiClock />,
              color: "text-green-500",
            },
            {
              value: "98%",
              label: "Client Satisfaction",
              icon: <TbHeartHandshake />,
              color: "text-purple-500",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`p-3 rounded-xl bg-gray-50 dark:bg-gray-700 ${stat.color}`}
                >
                  <div className="text-2xl">{stat.icon}</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                Property Spotlight
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Featured properties with exceptional quality
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={prevFeatured}
                  className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                  aria-label="Previous properties"
                >
                  <FiChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-[#00CFFF] transition-colors" />
                </button>
                <button
                  onClick={nextFeatured}
                  className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                  aria-label="Next properties"
                >
                  <FiChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-[#00CFFF] transition-colors" />
                </button>
              </div>
            </div>
          </div>

          {featuredProperties.length > 0 && (
            <div className="relative">
              {/* Desktop: Grid Layout with 3 Cards */}
              <div className="hidden lg:grid grid-cols-3 gap-8">
                {[0, 1, 2].map((offset) => {
                  const index =
                    (featuredIndex + offset) % featuredProperties.length;
                  const property = featuredProperties[index];
                  return (
                    <div key={property.id} className="relative">
                      <PropertyCard property={property} />
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1.5 bg-[#FF4FA1] text-white rounded-lg font-bold text-xs">
                          FEATURED
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile & Tablet: Carousel */}
              <div className="lg:hidden relative">
                <div className="overflow-hidden rounded-2xl">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(-${featuredIndex * 100}%)`,
                    }}
                  >
                    {featuredProperties.map((property) => (
                      <div
                        key={property.id}
                        className="w-full flex-shrink-0 px-4"
                      >
                        <div className="relative">
                          <PropertyCard property={property} />
                          <div className="absolute top-4 left-4 z-10">
                            <span className="px-3 py-1.5 bg-[#FF4FA1] text-white rounded-lg font-bold text-xs">
                              FEATURED
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Navigation */}
                <div className="flex justify-center gap-3 mt-8">
                  {featuredProperties.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setFeaturedIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === featuredIndex
                          ? "w-6 bg-[#00CFFF]"
                          : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Mobile Arrows */}
                <div className="absolute top-1/2 left-4 transform -translate-y-1/2 lg:hidden">
                  <button
                    onClick={prevFeatured}
                    className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 group"
                    aria-label="Previous property"
                  >
                    <FiChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-[#00CFFF] transition-colors" />
                  </button>
                </div>

                <div className="absolute top-1/2 right-4 transform -translate-y-1/2 lg:hidden">
                  <button
                    onClick={nextFeatured}
                    className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 group"
                    aria-label="Next property"
                  >
                    <FiChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-[#00CFFF] transition-colors" />
                  </button>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center justify-between mt-10">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Showing{" "}
                    {Math.min(featuredIndex + 3, featuredProperties.length)} of{" "}
                    {featuredProperties.length} properties
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  {/* Desktop Dots */}
                  <div className="flex items-center gap-2">
                    {Array.from({
                      length: Math.ceil(featuredProperties.length / 3),
                    }).map((_, groupIndex) => (
                      <button
                        key={groupIndex}
                        onClick={() => setFeaturedIndex(groupIndex * 3)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          featuredIndex >= groupIndex * 3 &&
                          featuredIndex < (groupIndex + 1) * 3
                            ? "w-6 bg-[#00CFFF]"
                            : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                        }`}
                        aria-label={`Go to group ${groupIndex + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevFeatured}
                      className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2"
                      disabled={featuredIndex === 0}
                    >
                      <FiChevronLeft className="w-5 h-5" />
                      <span>Previous</span>
                    </button>
                    <button
                      onClick={nextFeatured}
                      className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2"
                      disabled={featuredIndex >= featuredProperties.length - 3}
                    >
                      <span>Next</span>
                      <FiChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {featuredProperties.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <FiStar className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                No Featured Properties
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Featured properties will appear here once they're added to the
                collection.
              </p>
            </div>
          )}
        </div>
      </section>

      <section
        id="search-section"
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Find Your Perfect Property
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Search through our curated collection of verified properties
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-6">
            <div className="relative">
              <div className="relative">
                <FiSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by location, property type, amenities, or price range..."
                  className="w-full pl-14 pr-40 py-5 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-[#00CFFF]/20 focus:border-[#00CFFF] bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#00CFFF] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#00CFFF]/90 transition-all duration-300"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              {[
                "Accra",
                "Kumasi",
                "Tamale",
                "Apartments",
                "Luxury",
                "₵1,500-₵3,000",
                "24h Water",
                "2+ Beds",
                "Gated Community",
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSearchQuery(tag)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:text-[#FF4FA1] dark:hover:text-[#FF4FA1] rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-700 font-medium"
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>

          {searchQuery && (
            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    Found{" "}
                    <span className="text-[#FF4FA1] font-bold">
                      {filteredProperties.length}
                    </span>{" "}
                    properties matching "
                    <span className="text-gray-900 dark:text-white font-bold">
                      {searchQuery}
                    </span>
                    "
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {filteredProperties.length === 0 ? (
                    <button
                      onClick={showAllProperties}
                      className="px-6 py-3 bg-[#00CFFF] text-white rounded-lg font-bold hover:bg-[#00CFFF]/90 transition-colors"
                    >
                      Show All Properties
                    </button>
                  ) : (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveSection("top")}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
              activeSection === "top"
                ? "bg-[#FF4FA1] text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
            }`}
          >
            <HiOutlineFire className="w-6 h-6" />
            Top Rated
          </button>
          <button
            onClick={() => setActiveSection("new")}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
              activeSection === "new"
                ? "bg-[#00CFFF] text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
            }`}
          >
            <FiClock className="w-6 h-6" />
            New Listings
          </button>
          <button
            onClick={() => setActiveSection("all")}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              activeSection === "all"
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
            }`}
          >
            All Properties
          </button>
        </div>
      </div>

      {searchQuery ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Search Results
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {filteredProperties.length} properties found for "{searchQuery}"
            </p>
            <button
              onClick={showAllProperties}
              className="mt-6 text-[#00CFFF] hover:text-[#FF4FA1] transition-colors font-bold flex items-center gap-2 mx-auto"
            >
              <span>Clear search and show all properties</span>
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>

          {filteredProperties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {hasMoreProperties && (
                <div className="text-center mt-16">
                  <button
                    onClick={loadMoreProperties}
                    className="bg-[#FF4FA1] text-white px-12 py-5 rounded-xl font-bold text-lg hover:bg-[#FF4FA1]/90 transition-all duration-300 hover:shadow-2xl flex items-center gap-3 mx-auto"
                  >
                    <span>Load More Properties</span>
                    <span className="text-sm opacity-90">
                      ({filteredProperties.length - visiblePropertiesCount}{" "}
                      remaining)
                    </span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <FiSearch className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  No Properties Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg">
                  We couldn't find any properties matching "
                  <span className="font-bold text-gray-900 dark:text-white">
                    {searchQuery}
                  </span>
                  ". Try different keywords or browse all properties.
                </p>
                <button
                  onClick={showAllProperties}
                  className="bg-[#00CFFF] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#00CFFF]/90 transition-all duration-300 flex items-center gap-3 mx-auto"
                >
                  <FiHome className="w-6 h-6" />
                  Browse All Properties
                </button>
              </div>
            </div>
          )}
        </section>
      ) : (
        <div className="space-y-20">
          {activeSection === "top" && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-12">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <HiOutlineFire className="w-10 h-10 text-[#FF4FA1]" />
                      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                        Top Rated Properties
                      </h2>
                    </div>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
                      Handpicked properties with excellent ratings and verified
                      quality
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <span className="px-5 py-2 bg-[#FF4FA1]/10 text-[#FF4FA1] rounded-full font-bold">
                      Premium Collection
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {topProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeSection === "new" && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-12">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <FiClock className="w-10 h-10 text-[#00CFFF]" />
                      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                        New Listings
                      </h2>
                    </div>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
                      Fresh properties recently added to our collection
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <span className="px-5 py-2 bg-[#00CFFF]/10 text-[#00CFFF] rounded-full font-bold">
                      Just Added
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {newListings.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeSection === "all" && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-12">
                <div className="mb-10">
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                    All Properties
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
                    Browse our complete collection of verified properties
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {displayedProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>

                {hasMoreProperties && (
                  <div className="text-center mt-16">
                    <button
                      onClick={loadMoreProperties}
                      className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-12 py-5 rounded-xl font-bold text-lg hover:opacity-90 transition-all duration-300 hover:shadow-2xl flex items-center gap-3 mx-auto"
                    >
                      <span>View More Properties</span>
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
