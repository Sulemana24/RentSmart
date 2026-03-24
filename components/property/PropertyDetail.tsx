"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BookingSection from "./BookingSection";
import ReviewSection from "./ReviewSection";
import BookingForm from "../booking/BookingForm";
import { useAuth } from "@/lib/auth-context";

import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { useToast } from "../ToastProvider";

interface Review {
  rating: number;
  comment: string;
  createdAt: any;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface Property {
  id: string;
  name: string;
  price: number;
  beds: number;
  rating: number;
  images: string[];
  description: string;
  amenities: string[];
  agentFeePercentage: number;
  walkingFee: number;
  acceptableDurations: number[];
  address: { city: string; state: string };
  reviews?: Review[];
  videoUrl?: string;
}

export default function PropertyDetail({ property }: { property: any }) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [reviews, setReviews] = useState(property.reviews || []);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const { showToast } = useToast();

  const propertyImages = property.images || [property.image];
  const hasMultipleImages = propertyImages.length > 1;
  const { user } = useAuth();

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const docRef = doc(db, "properties", property.id.toString());
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setVideoUrl(data.videoUrl || "");
        }
      } catch (error) {
        console.error("Error fetching video URL:", error);
      }
    };

    fetchVideoUrl();
  }, [property.id]);

  useEffect(() => {
    const docRef = doc(db, "properties", property.id.toString());

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Sort reviews by newest first
        const sortedReviews = (data.reviews || []).sort(
          (a: any, b: any) => b.createdAt?.toMillis() - a.createdAt?.toMillis(),
        );
        setReviews(sortedReviews);
      }
    });

    return () => unsubscribe();
  }, [property.id]);

  const averageRating =
    property.reviews && property.reviews.length > 0
      ? property.reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) /
        property.reviews.length
      : 0;

  // Virtual Tour URL - You can replace this with your actual virtual tour URL
  /*  const virtualTourUrl = property.videos || "https://example.com/virtual-tour"; */

  const handleAddReview = async () => {
    if (!user) {
      showToast({
        title: "Login Required",
        message: "Please log in to write a review.",
      });
      return;
    }

    if (newReview.rating === 0 || newReview.comment.trim() === "") {
      showToast({
        title: "Error",
        message: "Please provide a rating and comment!",
      });
      return;
    }

    try {
      const userSnap = await getDoc(doc(db, "users", user.uid));
      let fullName = "Anonymous";

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.firstName && userData.lastName) {
          fullName = `${userData.firstName} ${userData.lastName}`;
        } else if (userData.name) {
          fullName = userData.name;
        }
      }

      const reviewToAdd = {
        ...newReview,
        createdAt: new Date(),
        user: {
          id: user.uid,
          name: fullName,
          email: user.email,
        },
      };

      const docRef = doc(db, "properties", property.id.toString());

      await updateDoc(docRef, {
        reviews: arrayUnion(reviewToAdd),
      });

      setNewReview({ rating: 0, comment: "" });
      showToast({
        title: "Success",
        message: "Review submitted successfully!",
      });
    } catch (error) {
      console.error("Error saving review:", error);
      showToast({ title: "Error", message: "Failed to submit review." });
    }
  };

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
      prev === propertyImages.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? propertyImages.length - 1 : prev - 1,
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleBookNow = () => {
    if (!user) {
      showToast({
        title: "Login Required",
        message: "Please log in to book this property.",
      });
      return;
    }
    setShowBookingForm(true);
  };

  const handleContact = () => {
    const contactInfo = {
      hostName: "Property Owner",
      propertyName: property.name,
      phone: "+233 12 345 6789",
      email: `host-${property.id}@rentalgh.com`,
    };

    showToast({
      title: "Success",
      message: `Contact Information:\n\nHost: ${contactInfo.hostName}\nProperty: ${contactInfo.propertyName}\nPhone: ${contactInfo.phone}\nEmail: ${contactInfo.email}\n\nWe'll connect you with the host shortly!`,
    });
  };

  // Handler for virtual tour
  /* const handleVirtualTour = () => {
    window.open(virtualTourUrl, "_blank", "noopener,noreferrer");
  }; */

  const handleVirtualTour = () => {
    if (!videoUrl) {
      showToast({ title: "Error", message: "Video tour not available" });
      return;
    }
    window.open(videoUrl, "_blank", "noopener,noreferrer");
  };

  const handleFormSubmit = (formData: any) => {
    showToast({
      title: "Success",
      message: `Booking confirmed for ${property.name}! We'll send a confirmation email shortly.`,
    });
    /*  console.log("Booking form submitted:", formData);
    console.log("Property:", property);

    alert(
      `Booking confirmed for ${property.name}! We'll send a confirmation email shortly.`,
    ); */

    setShowBookingForm(false);
  };

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

        <div className="mb-12">
          <button
            onClick={handleVirtualTour}
            className="w-full flex items-center justify-center gap-3 bg-purple-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 group"
          >
            <svg
              className="w-6 h-6 group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
            <span className="text-lg">Take a Virtual Tour</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-2">
            Explore every corner of this property in detail
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-3 space-y-10">
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
                  {averageRating.toFixed(1)}
                </span>
                {reviews.length > 0 && (
                  <span className="ml-1 text-gray-500 dark:text-gray-400 text-sm">
                    ({reviews.length} review{reviews.length > 1 ? "s" : ""})
                  </span>
                )}
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
                      Available: {property.acceptableDurations.join(", ")}{" "}
                      months
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

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                About this property
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {property.description}
              </p>
            </section>

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

            <BookingSection
              price={property.price}
              onBookNow={handleBookNow}
              onContact={handleContact}
            />

            <ReviewSection reviews={reviews} />

            {/* Add Review */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200">
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Write a Review
              </h3>
              <div className="flex flex-col gap-4">
                {/* Star Rating Section */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setNewReview({ ...newReview, rating: star })
                        }
                        className="focus:outline-none transform transition-all duration-200 hover:scale-110"
                        aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                      >
                        <svg
                          className={`w-8 h-8 sm:w-10 sm:h-10 transition-all duration-200 ${
                            star <= (newReview.rating || 0)
                              ? "text-yellow-400 fill-yellow-400 drop-shadow-sm"
                              : "text-gray-300 dark:text-gray-600 fill-gray-300 dark:fill-gray-600 hover:text-gray-400 dark:hover:text-gray-500"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                    {newReview.rating > 0 && (
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        ({newReview.rating} out of 5)
                      </span>
                    )}
                  </div>
                </div>

                {/* Comment Section */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Review
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview({ ...newReview, comment: e.target.value })
                    }
                    placeholder="Share your experience with this property..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleAddReview}
                  disabled={!newReview.rating || !newReview.comment?.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="text-[#FF4FA1] font-bold text-xl">
                    Ghc {property.price}/month
                  </span>
                </div>

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
