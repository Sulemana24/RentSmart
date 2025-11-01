"use client";
import { useRouter } from "next/navigation";
import BookingSection from "./BookingSection";
import ReviewSection from "./ReviewSection";
import BookingForm from "../booking/BookingForm";
import { useState } from "react";

export default function PropertyDetail({ property }: { property: any }) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Use the actual images array from property data - fallback to single image array
  const propertyImages = property.images || [property.image];
  const hasMultipleImages = propertyImages.length > 1;

  // Helper functions to format the data from property
  const getDurationText = () => {
    if (
      !property.acceptableDurations ||
      property.acceptableDurations.length === 0
    ) {
      return "Flexible tenancy";
    }

    const durations = property.acceptableDurations;
    if (durations.length === 1) {
      return `${durations[0]}-year tenancy`;
    }

    const min = Math.min(...durations);
    const max = Math.max(...durations);
    return `${min}-${max} year tenancy options`;
  };

  const getAgentFeeText = () => {
    if (property.agentFeePercentage === 0) {
      return "No agent fees";
    }
    return `${property.agentFeePercentage}% agent fee`;
  };

  const getWalkingFeeText = () => {
    if (property.walkingFee === 0) {
      return "No walking fee";
    }
    return `Ghc${property.walkingFee} walking fee`;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === propertyImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? propertyImages.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Handle Book Now functionality - opens the booking form
  const handleBookNow = () => {
    setShowBookingForm(true);
  };

  // Handle Contact functionality
  const handleContact = () => {
    const contactInfo = {
      hostName: "Property Owner",
      propertyName: property.name,
      phone: "+233 12 345 6789",
      email: `host-${property.id}@rentalgh.com`,
    };

    alert(
      `Contact Information:\n\nHost: ${contactInfo.hostName}\nProperty: ${contactInfo.propertyName}\nPhone: ${contactInfo.phone}\nEmail: ${contactInfo.email}\n\nWe'll connect you with the host shortly!`
    );
  };

  // Handle form submission
  const handleFormSubmit = (formData: any) => {
    // You can handle the form submission here
    console.log("Booking form submitted:", formData);
    console.log("Property:", property);

    // Show success message
    alert(
      `Booking confirmed for ${property.name}! We'll send a confirmation email shortly.`
    );

    // Close the form
    setShowBookingForm(false);
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowBookingForm(false);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="mb-6 inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-pink-600 transition-colors"
        >
          <span className="text-lg">←</span> Back to Listings
        </button>

        {/* Hero Section */}
        <div className="relative w-full h-80 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl group mb-12">
          {/* Main Image - Using img tag instead of Image component */}
          <img
            src={propertyImages[currentImageIndex]}
            alt={property.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
          />

          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-6">
            <h1 className="text-white text-4xl md:text-5xl font-bold drop-shadow-lg">
              {property.name}
            </h1>
          </div>

          {/* Navigation Arrows - Only show if multiple images */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Image Counter */}
          {hasMultipleImages && (
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {propertyImages.length}
            </div>
          )}
        </div>

        {/* Thumbnail Gallery - Only show if multiple images */}
        {hasMultipleImages && (
          <div className="flex gap-2 mb-12 overflow-x-auto pb-4">
            {propertyImages.map((image: string, index: number) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  currentImageIndex === index
                    ? "border-[#FF4FA1] ring-2 ring-[#FF4FA1] ring-opacity-50"
                    : "border-gray-300 hover:border-[#00CFFF]"
                }`}
              >
                <img
                  src={image}
                  alt={`${property.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-10">
            {/* Location + Rating */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <p className="text-gray-500 dark:text-gray-400 text-lg flex items-center gap-2">
                📍{" "}
                <span>
                  {" "}
                  {property.address?.city}, {property.address?.state}
                </span>
              </p>
              <div className="flex items-center bg-yellow-100 dark:bg-yellow-800/30 px-3 py-1 rounded-full shadow-sm">
                <span className="text-yellow-500 text-lg mr-1">★</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  {property.rating}
                </span>
              </div>
            </div>

            {/* Property Details Section - Fetching from property data */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Property Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/*Beds */}
                <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-lg p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-blue-500">🛏️</span>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                      Number of Beds Available
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 ml-8">
                    {property.beds}
                  </p>
                  <p className="text-xs text-gray-500 ml-8 mt-1">
                    Available beds for occupants
                  </p>
                </div>

                {/* Duration */}
                <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-lg p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-blue-500">📅</span>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                      Tenancy Duration
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 ml-8">
                    {getDurationText()}
                  </p>
                  {property.acceptableDurations && (
                    <p className="text-xs text-gray-500 ml-8 mt-1">
                      Available: {property.acceptableDurations.join(", ")} year
                      {property.acceptableDurations.length > 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                {/* Agent Fees */}
                <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-lg p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-green-500">💼</span>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                      Agent Fees
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 ml-8">
                    {getAgentFeeText()}
                  </p>
                  {property.agentFeePercentage > 0 && (
                    <p className="text-xs text-gray-500 ml-8 mt-1">
                      On property price
                    </p>
                  )}
                </div>

                {/* Walking Fee */}
                <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-lg p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-purple-500">🚶‍♂️</span>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                      Walking Fee
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 ml-8">
                    {getWalkingFeeText()}
                  </p>
                  {property.walkingFee > 0 && (
                    <p className="text-xs text-gray-500 ml-8 mt-1">
                      One-time viewing assistance fee
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                About this property
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {property.description}
              </p>
            </section>

            {/* Amenities */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Amenities
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.amenities?.map((amenity: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-center space-x-3 bg-white/70 dark:bg-gray-800/60 backdrop-blur-lg p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-pink-400 hover:bg-pink-50/50 dark:hover:bg-pink-900/10 transition-all duration-300"
                  >
                    <span className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-pulse"></span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {amenity}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Reviews Section */}
            <ReviewSection reviews={property.reviews || []} />

            {/* Review Button */}
            <button className="w-full bg-gray-500 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              Write a Review
            </button>
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <BookingSection
                price={property.price}
                onBookNow={handleBookNow}
                onContact={handleContact}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Book {property.name}
                </h2>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                {property.address?.city}, {property.address?.state}
              </p>
              <div>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="font-semibold text-gray-600">
                    {property.rating}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="text-[#FF4FA1] font-bold text-xl">
                    Ghc {property.price}/year
                  </span>
                </div>

                {/* Property Details in Modal - Fetching from property data */}
                <div className="mt-3 space-y-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-semibold">Tenancy:</span>
                    <span>{getDurationText()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Agent Fees:</span>
                    <span>{getAgentFeeText()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Walking Fee:</span>
                    <span>{getWalkingFeeText()}</span>
                  </div>
                  {property.acceptableDurations && (
                    <div className="flex justify-between">
                      <span className="font-semibold">
                        Available Durations:
                      </span>
                      <span>
                        {property.acceptableDurations.join(", ")} year
                        {property.acceptableDurations.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-gray-700 text-xs mt-2">
                  **All fees will be calculated and displayed during checkout
                </p>
              </div>
            </div>

            {/* Booking Form */}
            <div className="p-6">
              <BookingForm onSubmit={handleFormSubmit} property={property} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
