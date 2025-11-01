"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import BookingSection from "./BookingSection";
import ReviewSection from "./ReviewSection";

export default function PropertyDetail({ property }: { property: any }) {
  const router = useRouter();

  return (
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
        <Image
          src={property.image}
          alt={property.name}
          fill
          priority
          className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-6">
          <h1 className="text-white text-4xl md:text-5xl font-bold drop-shadow-lg">
            {property.name}
          </h1>
        </div>
      </div>

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
          <ReviewSection reviews={property.reviews} />
        </div>

        {/* Right Column - Booking */}
        <div className="lg:col-span-1">
          <div className="sticky top-28">
            <BookingSection price={property.price} />
          </div>
        </div>
      </div>
    </div>
  );
}
