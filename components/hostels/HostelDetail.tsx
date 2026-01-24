"use client";
import { useRouter } from "next/navigation";
import HostelBookingSection from "./BookingSection";
import ReviewSection from "../property/ReviewSection";
import HostelBookingForm from "../booking/HostelBookingForm";
import { useState } from "react";

export default function HostelDetail({ hostel }: { hostel: any }) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  const hostelImages = hostel.images || [hostel.image];
  const hasMultipleImages = hostelImages.length > 1;

  const getRoomCapacityText = (room: any) => {
    if (room.capacity === 1) return "1 person";
    return `${room.capacity} people`;
  };

  const getAmenityIcon = (amenity: string) => {
    const iconMap: Record<string, string> = {
      "Free WiFi": "📶",
      "Free Breakfast": "🍳",
      Lockers: "🔒",
      "Shared Kitchen": "🍴",
      "Air Conditioning": "❄️",
      "Common Room TV": "📺",
      "Gym Access": "💪",
      "Bike Rental": "🚲",
      "Laundry Facilities": "🧺",
      "24/7 Reception": "🏪",
      "Luggage Storage": "🧳",
      "Tour Desk": "🗺️",
      Bar: "🍻",
      "Game Room": "🎮",
      "Outdoor Terrace": "🌿",
      "Female Only Floor": "👩",
    };
    return iconMap[amenity] || "✅";
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === hostelImages.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? hostelImages.length - 1 : prev - 1,
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Handle Book Now functionality
  const handleBookNow = (room?: any) => {
    if (room) {
      setSelectedRoom(room);
    }
    setShowBookingForm(true);
  };

  // Handle Contact functionality
  const handleContact = () => {
    const contactInfo = {
      hostelName: hostel.name,
      managerName: "Hostel Manager",
      phone: hostel.contact?.phone || "+233 12 345 6789",
      email: hostel.contact?.email || `hostel-${hostel.id}@staygh.com`,
      emergencyContact: hostel.contact?.emergency || "+233 99 888 7777",
    };

    alert(
      `Contact Information:\n\nHostel: ${contactInfo.hostelName}\nManager: ${contactInfo.managerName}\nPhone: ${contactInfo.phone}\nEmail: ${contactInfo.email}\nEmergency: ${contactInfo.emergencyContact}\n\nAvailable 24/7 for assistance!`,
    );
  };

  // Handle form submission
  const handleFormSubmit = (formData: any) => {
    const bookingDetails = {
      hostel: hostel.name,
      room: selectedRoom ? selectedRoom.name : formData.roomType,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: formData.guests,
      nights: calculateNights(formData.checkIn, formData.checkOut),
      total: calculateTotal(formData),
    };

    console.log("Hostel booking submitted:", bookingDetails);
    console.log("Hostel:", hostel);

    // Show success message
    alert(
      `Booking confirmed for ${hostel.name}!\n\n` +
        `Room: ${bookingDetails.room}\n` +
        `Dates: ${bookingDetails.checkIn} to ${bookingDetails.checkOut}\n` +
        `Guests: ${bookingDetails.guests}\n` +
        `Total: $${bookingDetails.total}\n\n` +
        `We'll send a confirmation email shortly.`,
    );

    // Close the form
    setShowBookingForm(false);
    setSelectedRoom(null);
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = (formData: any) => {
    const room = hostel.roomTypes.find(
      (r: any) => r.id === parseInt(formData.roomType),
    );
    if (!room) return 0;

    const nights = calculateNights(formData.checkIn, formData.checkOut);
    const basePrice = room.pricePerNight * nights;
    const serviceFee = basePrice * 0.15; // 15% service fee
    return (basePrice + serviceFee).toFixed(2);
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowBookingForm(false);
      setSelectedRoom(null);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
        {/* Back Button */}
        <button
          onClick={() => router.push("/hostels")}
          className="mb-6 inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-hostel-primary transition-colors"
        >
          <span className="text-lg">←</span> Back to Hostels
        </button>

        {/* Hero Section */}
        <div className="relative w-full h-80 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl group mb-12">
          {/* Main Image */}
          <img
            src={hostelImages[currentImageIndex]}
            alt={hostel.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
          />

          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-6">
            <div>
              <h1 className="text-white text-4xl md:text-5xl font-bold drop-shadow-lg mb-2">
                {hostel.name}
              </h1>
              <div className="flex items-center gap-2 text-white/90">
                <span>📍</span>
                <span>
                  {hostel.location}, {hostel.city}, {hostel.country}
                </span>
              </div>
            </div>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-6 left-6 bg-hostel-primary text-white px-4 py-2 rounded-full font-bold flex items-center gap-1 shadow-lg">
            <span>★</span>
            <span>{hostel.rating}</span>
            <span className="text-sm font-normal ml-1">
              ({hostel.reviewCount} reviews)
            </span>
          </div>

          {/* Navigation Arrows */}
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
            <div className="absolute top-6 right-6 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {hostelImages.length}
            </div>
          )}
        </div>

        {/* Thumbnail Gallery */}
        {hasMultipleImages && (
          <div className="flex gap-2 mb-12 overflow-x-auto pb-4">
            {hostelImages.map((image: string, index: number) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  currentImageIndex === index
                    ? "border-hostel-primary ring-2 ring-hostel-primary ring-opacity-50"
                    : "border-gray-300 hover:border-hostel-secondary"
                }`}
              >
                <img
                  src={image}
                  alt={`${hostel.name} view ${index + 1}`}
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
            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                About this hostel
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {hostel.description}
              </p>
            </section>

            {/* Room Types Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Available Room Types
              </h2>
              <div className="space-y-6">
                {hostel.roomTypes?.map((room: any, index: number) => (
                  <div
                    key={index}
                    className={`bg-white/70 dark:bg-gray-800/60 backdrop-blur-lg p-6 rounded-2xl shadow-sm border transition-all duration-300 ${
                      selectedRoom?.id === room.id
                        ? "border-hostel-primary border-2"
                        : "border-gray-100 dark:border-gray-700 hover:border-hostel-primary"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {room.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {room.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-hostel-primary">
                          ${room.pricePerNight}
                          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            /night
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {room.availability} available
                        </div>
                      </div>
                    </div>

                    {/* Room Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-gray-500">👥</span>
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                            Capacity
                          </h4>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 ml-6">
                          {getRoomCapacityText(room)}
                        </p>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-gray-500">🛏️</span>
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                            Beds
                          </h4>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 ml-6">
                          {room.beds}
                        </p>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-gray-500">🏷️</span>
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                            Type
                          </h4>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 ml-6">
                          {room.capacity > 1 ? "Shared Dorm" : "Private"}
                        </p>
                      </div>
                    </div>

                    {/* Room Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.features?.map((feature: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-hostel-primary/10 text-hostel-primary dark:text-hostel-secondary rounded-full text-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Book Room Button */}
                    <button
                      onClick={() => handleBookNow(room)}
                      className="w-full bg-hostel-primary text-white py-3 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      Book This Room - ${room.pricePerNight}/night
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Amenities */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Hostel Amenities
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hostel.amenities?.map((amenity: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-center space-x-3 bg-white/70 dark:bg-gray-800/60 backdrop-blur-lg p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-hostel-primary hover:bg-hostel-primary/5 transition-all duration-300"
                  >
                    <span className="text-lg">{getAmenityIcon(amenity)}</span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {amenity}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Hostel Policies */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Hostel Policies
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-lg p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-blue-500">⏰</span>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                      Check-in / Check-out
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 ml-8">
                    {hostel.policies?.checkIn || "2:00 PM"} /{" "}
                    {hostel.policies?.checkOut || "11:00 AM"}
                  </p>
                </div>

                <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-lg p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-green-500">📋</span>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                      Cancellation Policy
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 ml-8">
                    {hostel.policies?.cancellation ||
                      "Free cancellation 48 hours before"}
                  </p>
                </div>

                <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-lg p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-purple-500">🔞</span>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                      Age Restriction
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 ml-8">
                    {hostel.policies?.ageRestriction || "18+ only"}
                  </p>
                </div>

                <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-lg p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-red-500">🚫</span>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                      House Rules
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 ml-8">
                    No smoking • Quiet hours 11PM-7AM
                  </p>
                </div>
              </div>
            </section>

            {/* Reviews Section */}
            <ReviewSection reviews={hostel.reviews || []} />

            {/* Review Button */}
            <button className="w-full bg-gray-500 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              Write a Review
            </button>
          </div>

          {/* Right Column - Quick Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <HostelBookingSection
                hostel={hostel}
                onBookNow={() => handleBookNow()}
                onContact={handleContact}
                selectedRoom={selectedRoom}
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Book {hostel.name}
                </h2>
                <button
                  onClick={() => {
                    setShowBookingForm(false);
                    setSelectedRoom(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {hostel.location}, {hostel.city}, {hostel.country}
              </p>
              <div>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="font-semibold text-gray-600 dark:text-gray-300">
                    {hostel.rating}
                  </span>
                  <span className="mx-2 text-gray-400">•</span>
                  {selectedRoom ? (
                    <span className="text-hostel-primary font-bold text-xl">
                      ${selectedRoom.pricePerNight}/night
                    </span>
                  ) : (
                    <span className="text-gray-600 dark:text-gray-400">
                      Select a room type
                    </span>
                  )}
                </div>

                {/* Selected Room Details */}
                {selectedRoom && (
                  <div className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-semibold">Selected Room:</span>
                      <span>{selectedRoom.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Capacity:</span>
                      <span>{getRoomCapacityText(selectedRoom)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Beds:</span>
                      <span>{selectedRoom.beds}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Available:</span>
                      <span>{selectedRoom.availability} left</span>
                    </div>
                  </div>
                )}

                <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                  **Service fee (15%) will be added during checkout
                </p>
              </div>
            </div>

            {/* Booking Form */}
            <div className="p-6">
              <HostelBookingForm
                onSubmit={handleFormSubmit}
                hostel={hostel}
                selectedRoom={selectedRoom}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
