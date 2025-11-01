"use client";
import { useState } from "react";
import OrderSummary from "./OrderSummary";

interface BookingFormProps {
  onSubmit?: (formData: any) => void;
  property?: any;
}

const BookingForm = ({ onSubmit, property }: BookingFormProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    duration: "",
  });

  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  // Get duration options based on property's acceptable durations
  const getDurationOptions = () => {
    const acceptableDurations = property?.acceptableDurations || [1];
    const defaultOptions = [
      { value: "1", label: "1 Year" },
      { value: "2", label: "2 Years" },
      { value: "3", label: "3 Years" },
      { value: "4", label: "4 Years" },
      { value: "5", label: "5 Years" },
    ];

    // Filter to only show acceptable durations for this property
    return defaultOptions.filter((option) =>
      acceptableDurations.includes(parseInt(option.value))
    );
  };

  const durationOptions = getDurationOptions();

  // Set default duration if not set and options are available
  if (!formData.duration && durationOptions.length > 0) {
    setFormData((prev) => ({ ...prev, duration: durationOptions[0].value }));
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Calculate fees and total using property-specific fees and duration
  const calculateBookingDetails = () => {
    const propertyPrice = property?.price || 0;
    const agentFeePercentage = property?.agentFeePercentage || 5;
    const walkingFee = property?.walkingFee || 50;
    const duration = parseInt(formData.duration) || 1;

    // Calculate total property price based on duration
    const totalPropertyPrice = propertyPrice * duration;

    // Calculate agent fee based on total property price
    const agentFee = (totalPropertyPrice * agentFeePercentage) / 100;

    // Walking fee remains fixed regardless of duration
    const subtotal = totalPropertyPrice;
    const total = subtotal + agentFee + walkingFee;

    return {
      propertyName: property?.name || "Property",
      propertyImage: property?.images?.[0] || property?.image,
      price: propertyPrice,
      totalPropertyPrice,
      duration,
      agentFee,
      agentFeePercentage,
      walkingFee,
      subtotal,
      total,
      startDate: new Date().toLocaleDateString(),
      acceptableDurations: property?.acceptableDurations || [1],
    };
  };

  const handleProceedToCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.phone ||
      !formData.duration ||
      !formData.email
    ) {
      alert("Please fill in all required information.");
      return;
    }

    // Calculate booking details and show order summary
    const details = calculateBookingDetails();
    setBookingDetails(details);
    setShowOrderSummary(true);
  };

  const handleConfirmBooking = () => {
    // Prepare data for Paystack payment
    const paymentData = {
      ...formData,
      ...bookingDetails,
      propertyId: property?.id,
    };

    // Call the onSubmit prop if provided
    if (onSubmit) {
      onSubmit(paymentData);
    } else {
      // Initialize Paystack payment
      initializePaystackPayment(paymentData);
    }
  };

  const initializePaystackPayment = (paymentData: any) => {
    // Paystack payment integration
    const handler = (window as any).PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: paymentData.email,
      amount: paymentData.total * 100, // Convert to kobo
      currency: "GHS",
      ref: `BOOK-${Date.now()}`,
      metadata: {
        custom_fields: [
          {
            display_name: "First Name",
            variable_name: "first_name",
            value: paymentData.firstName,
          },
          {
            display_name: "Last Name",
            variable_name: "last_name",
            value: paymentData.lastName,
          },
          {
            display_name: "Phone",
            variable_name: "phone",
            value: paymentData.phone,
          },
          {
            display_name: "Duration",
            variable_name: "duration",
            value: paymentData.duration,
          },
          {
            display_name: "Property",
            variable_name: "property_id",
            value: paymentData.propertyId,
          },
        ],
      },
      callback: function (response: any) {
        alert("Payment successful! Booking confirmed.");
        console.log("Payment response:", response);
      },
      onClose: function () {
        alert("Payment window closed.");
      },
    });

    handler.openIframe();
  };

  const handleBackToForm = () => {
    setShowOrderSummary(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-[#FF4FA1] p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">
          {showOrderSummary ? "Review Your Order" : "Complete Your Booking"}
        </h2>
        <p className="text-white/90 text-lg">
          {showOrderSummary
            ? "Confirm your booking details and proceed to payment"
            : "Secure your stay in just a few steps"}
        </p>
      </div>

      <div className="p-8">
        {!showOrderSummary ? (
          // Booking Form
          <form onSubmit={handleProceedToCheckout} className="space-y-8">
            {/* Contact Information Section */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-gray-950 border-2 border-gray-200 rounded-xl focus:border-[#00CFFF] focus:ring-2 focus:ring-[#00CFFF]/20 transition-all duration-300 bg-gray-50/50 hover:bg-white"
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-gray-950 border-2 border-gray-200 rounded-xl focus:border-[#00CFFF] focus:ring-2 focus:ring-[#00CFFF]/20 transition-all duration-300 bg-gray-50/50 hover:bg-white"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-gray-950 border-2 border-gray-200 rounded-xl focus:border-[#00CFFF] focus:ring-2 focus:ring-[#00CFFF]/20 transition-all duration-300 bg-gray-50/50 hover:bg-white"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-gray-950 border-2 border-gray-200 rounded-xl focus:border-[#00CFFF] focus:ring-2 focus:ring-[#00CFFF]/20 transition-all duration-300 bg-gray-50/50 hover:bg-white"
                    placeholder="+233 XX XXX XXXX"
                    required
                  />
                </div>
              </div>

              {/* Duration Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Rental Duration *
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-gray-950 border-2 border-gray-200 rounded-xl focus:border-[#00CFFF] focus:ring-2 focus:ring-[#00CFFF]/20 transition-all duration-300 bg-gray-50/50 hover:bg-white"
                  required
                >
                  <option value="">Select duration</option>
                  {durationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {formData.duration && (
                  <p className="text-sm text-gray-500 mt-1">
                    Selected: {formData.duration} Year
                    {formData.duration !== "1" ? "s" : ""} • Total: Ghc{" "}
                    {(property?.price || 0) * parseInt(formData.duration)}
                  </p>
                )}
                {property?.acceptableDurations && (
                  <p className="text-xs text-blue-600 mt-1">
                    Available durations:{" "}
                    {property.acceptableDurations.join(", ")} year
                    {property.acceptableDurations.length > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="w-full bg-[#00CFFF] hover:bg-[#FF4FA1] text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center justify-center space-x-2">
                  Proceed to Checkout
                </div>
              </button>
              <p className="text-center text-gray-500 text-sm mt-3">
                Your booking is secured with our privacy protection
              </p>
            </div>
          </form>
        ) : (
          // Order Summary and Payment Section
          <div className="space-y-8">
            <OrderSummary bookingDetails={bookingDetails} />

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={handleBackToForm}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300"
              >
                Back to Form
              </button>
              <button
                onClick={handleConfirmBooking}
                className="w-full bg-[#00CFFF] hover:bg-[#FF4FA1] text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>Pay Ghc {bookingDetails?.total}</span>
                </div>
              </button>
            </div>

            <p className="text-center text-gray-500 text-sm">
              Secure payment powered by Paystack
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
