"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import OrderSummary from "./OrderSummary";
import { useAuth } from "@/lib/auth-context";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useToast } from "../ToastProvider";

interface BookingFormProps {
  onSubmit?: (formData: any) => void;
  property?: any;
}

interface DurationOption {
  value: string;
  label: string;
  years: number;
  months: number;
}

const generateBookingPin = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let pin = "";
  for (let i = 0; i < 6; i++) {
    pin += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pin;
};

const BookingForm = ({ onSubmit, property }: BookingFormProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    duration: "",
  });

  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);
  const [isPaystackReady, setIsPaystackReady] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { showToast } = useToast();
  const paystackLoadAttempted = useRef(false);

  // Get Paystack public key
  const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  useEffect(() => {
    if (!paystackPublicKey) {
      console.error("Paystack public key is missing!");
      showToast({
        title: "Configuration Error",
        message:
          "Payment system is not properly configured. Please contact support.",
      });
    } else {
      console.log(
        "Paystack key available:",
        paystackPublicKey.substring(0, 8) + "...",
      );
    }
  }, [paystackPublicKey, showToast]);

  // Load Paystack script
  useEffect(() => {
    if (paystackLoadAttempted.current) return;
    paystackLoadAttempted.current = true;

    const loadPaystackScript = () => {
      // Check if already loaded
      if ((window as any).PaystackPop) {
        console.log("Paystack already loaded");
        setIsPaystackReady(true);
        return;
      }

      // Check if script is already added
      if (document.getElementById("paystack-script")) {
        const checkInterval = setInterval(() => {
          if ((window as any).PaystackPop) {
            setIsPaystackReady(true);
            clearInterval(checkInterval);
          }
        }, 100);
        return;
      }

      // Create and add script
      const script = document.createElement("script");
      script.id = "paystack-script";
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;

      script.onload = () => {
        console.log("Paystack script loaded");
        setTimeout(() => {
          if ((window as any).PaystackPop) {
            setIsPaystackReady(true);
          } else {
            console.error("PaystackPop not available after script load");
          }
        }, 500);
      };

      script.onerror = () => {
        console.error("Failed to load Paystack script");
        showToast({
          title: "Error",
          message:
            "Payment system failed to load. Please refresh and try again.",
        });
      };

      document.body.appendChild(script);
    };

    loadPaystackScript();
  }, [showToast]);

  const handleCopyPin = async (pin: string) => {
    try {
      await navigator.clipboard.writeText(pin);

      showToast({
        title: "Copied!",
        message: "Booking PIN copied to clipboard",
      });
    } catch (err) {
      showToast({
        title: "Error",
        message: "Failed to copy PIN",
      });
    }
  };

  // Fetch user data from Firestore if logged in
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;
      const db = getFirestore();
      const docRef = doc(db, "users", user.uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setFormData((prev) => ({
          ...prev,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
        }));
      }
    };
    fetchUserData();
  }, [user]);

  const durationOptions = useMemo(() => {
    if (!property) return [];

    let acceptableDurationsInMonths: number[] = property.acceptableDurations;

    if (
      !acceptableDurationsInMonths ||
      !Array.isArray(acceptableDurationsInMonths)
    ) {
      acceptableDurationsInMonths = [12, 24, 36, 48, 60];
    }

    const options: DurationOption[] = acceptableDurationsInMonths
      .map((months: number) => {
        const years = months / 12;

        if (years % 1 === 0) {
          return {
            value: months.toString(),
            label: `${years} Year${years > 1 ? "s" : ""}`,
            years: years,
            months: months,
          };
        }
        return null;
      })
      .filter((opt): opt is DurationOption => opt !== null);

    return options;
  }, [property]);

  useEffect(() => {
    if (!formData.duration && durationOptions.length > 0) {
      setFormData((prev) => ({ ...prev, duration: durationOptions[0].value }));
    }
  }, [durationOptions]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateBookingDetails = () => {
    const propertyPrice = property?.price || 0;
    const agentFeePercentage = property?.agentFeePercentage || 5;
    const walkingFee = property?.walkingFee || 50;
    const durationInMonths = parseInt(formData.duration) || 12;
    const durationInYears = durationInMonths / 12;

    const totalPropertyPrice = propertyPrice * durationInMonths;
    const agentFee = (totalPropertyPrice * agentFeePercentage) / 100;
    const subtotal = totalPropertyPrice;
    const total = subtotal + agentFee + walkingFee;

    return {
      propertyName: property?.name || "Property",
      propertyId: property?.id,
      propertyImage: property?.images?.[0] || property?.image,
      price: propertyPrice,
      totalPropertyPrice,
      durationInMonths,
      durationInYears,
      durationLabel: `${durationInYears} Year${durationInYears > 1 ? "s" : ""}`,
      agentFee,
      agentFeePercentage,
      walkingFee,
      subtotal,
      total,
      startDate: new Date().toLocaleDateString(),
      acceptableDurations: property?.acceptableDurations || [12],
    };
  };

  const handleProceedToCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.phone ||
      !formData.duration ||
      !formData.email
    ) {
      showToast({
        title: "Error",
        message: "Please fill in all required information.",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast({
        title: "Error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    setBookingDetails(calculateBookingDetails());
    setShowOrderSummary(true);
  };

  const saveBookingToDatabase = async (paymentData: any, response: any) => {
    const bookingPin = generateBookingPin();

    const cleanPaymentData = {
      firstName: paymentData.firstName?.trim() || "Guest",
      lastName: paymentData.lastName?.trim() || "User",
      email: paymentData.email?.trim() || "",
      phone: paymentData.phone?.trim() || "",
      durationInMonths: Number(paymentData.durationInMonths) || 0,
      durationInYears: Number(paymentData.durationInYears) || 0,
      durationLabel: paymentData.durationLabel || "",
      propertyName: paymentData.propertyName || "Unknown Property",
      propertyId: paymentData.propertyId || "",
      propertyImage: paymentData.propertyImage || "",
      price: Number(paymentData.price) || 0,
      totalPropertyPrice: Number(paymentData.totalPropertyPrice) || 0,
      agentFee: Number(paymentData.agentFee) || 0,
      agentFeePercentage: Number(paymentData.agentFeePercentage) || 0,
      walkingFee: Number(paymentData.walkingFee) || 0,
      subtotal: Number(paymentData.subtotal) || 0,
      total: Number(paymentData.total) || 0,
      startDate: paymentData.startDate || new Date().toLocaleDateString(),
    };

    const bookingToSave = {
      ...cleanPaymentData,
      bookingPin,
      paymentReference: response.reference,
      paymentStatus: "paid",
      bookingStatus: "pending",
      paymentDate: new Date().toISOString(),
      createdAt: serverTimestamp(),
      userId: user?.uid || null,
      timestamp: Date.now(),
    };

    const db = getFirestore();
    const bookingsCollection = collection(db, "bookings");
    const docRef = await addDoc(bookingsCollection, bookingToSave);

    const propertyRef = doc(db, "properties", paymentData.propertyId);

    await updateDoc(propertyRef, {
      status: "booked",
    });

    return { bookingPin, docRefId: docRef.id };
  };

  const handleConfirmBooking = () => {
    if (!bookingDetails) return;

    if (!isPaystackReady || !(window as any).PaystackPop) {
      showToast({
        title: "Payment System Loading",
        message: "Please wait a moment and try again.",
      });
      return;
    }

    if (!paystackPublicKey) {
      showToast({
        title: "Configuration Error",
        message:
          "Payment system is not properly configured. Please contact support.",
      });
      return;
    }

    setIsProcessingPayment(true);

    const paymentData = {
      ...formData,
      ...bookingDetails,
      propertyId: property?.id,
      userId: user?.uid || null,
    };

    const amountInGHS = paymentData.total;
    const amountInPesewas = Math.round(amountInGHS * 100);

    if (amountInPesewas <= 0) {
      showToast({
        title: "Error",
        message: "Invalid payment amount. Please try again.",
      });
      setIsProcessingPayment(false);
      return;
    }

    try {
      const reference = `BOOK-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;

      const handler = (window as any).PaystackPop.setup({
        key: paystackPublicKey,
        email: paymentData.email,
        amount: amountInPesewas,
        currency: "GHS",
        ref: reference,
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
              display_name: "Duration (Months)",
              variable_name: "duration_months",
              value: paymentData.durationInMonths?.toString() || "0",
            },
            {
              display_name: "Property ID",
              variable_name: "property_id",
              value: paymentData.propertyId || "",
            },
            {
              display_name: "Property Name",
              variable_name: "property_name",
              value: paymentData.propertyName || "",
            },
          ],
        },
        callback: function (response: any) {
          console.log("Payment successful:", response);

          saveBookingToDatabase(paymentData, response)
            .then(({ bookingPin, docRefId }) => {
              console.log("Booking saved successfully with PIN:", bookingPin);

              const newBooking = {
                ...paymentData,
                bookingPin,
                paymentReference: response.reference,
                bookingId: docRefId,
                paymentDate: new Date().toLocaleString(),
              };

              // 🔥 FORCE React to re-render properly
              setTimeout(() => {
                setConfirmedBooking(newBooking);
                setShowOrderSummary(false);
                setShowConfirmationModal(true);
                setIsProcessingPayment(false);
              }, 0);
            })
            .catch((error) => {
              console.error("Error saving booking:", error);
              setIsProcessingPayment(false);
            });
        },
        onClose: function () {
          console.log("Payment window closed");
          setIsProcessingPayment(false);
          showToast({
            title: "Payment Cancelled",
            message:
              "You closed the payment window. You can try again anytime.",
          });
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error("Paystack initialization error:", error);
      setIsProcessingPayment(false);
      showToast({
        title: "Payment Error",
        message:
          "Unable to initialize payment. Please check your internet connection and try again.",
      });
    }
  };

  const handleBackToForm = () => setShowOrderSummary(false);
  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    // Reset the form after closing
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      duration: "",
    });
    setBookingDetails(null);
    setConfirmedBooking(null);
  };

  const currentDurationInMonths = parseInt(formData.duration);
  const currentDurationInYears = isNaN(currentDurationInMonths)
    ? 0
    : currentDurationInMonths / 12;

  return (
    <>
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
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
            <form onSubmit={handleProceedToCheckout} className="space-y-8">
              {/* Show user info only if not logged in */}
              {!user && (
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
                        placeholder="Enter your first name"
                        required
                        className="w-full px-4 py-3 text-gray-950 border-2 border-gray-200 rounded-xl focus:border-[#00CFFF] focus:ring-2 focus:ring-[#00CFFF]/20 transition-all duration-300 bg-gray-50/50 hover:bg-white"
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
                        placeholder="Enter your last name"
                        required
                        className="w-full px-4 py-3 text-gray-950 border-2 border-gray-200 rounded-xl focus:border-[#00CFFF] focus:ring-2 focus:ring-[#00CFFF]/20 transition-all duration-300 bg-gray-50/50 hover:bg-white"
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
                        placeholder="your.email@example.com"
                        required
                        className="w-full px-4 py-3 text-gray-950 border-2 border-gray-200 rounded-xl focus:border-[#00CFFF] focus:ring-2 focus:ring-[#00CFFF]/20 transition-all duration-300 bg-gray-50/50 hover:bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+233 XX XXX XXXX"
                        required
                        className="w-full px-4 py-3 text-gray-950 border-2 border-gray-200 rounded-xl focus:border-[#00CFFF] focus:ring-2 focus:ring-[#00CFFF]/20 transition-all duration-300 bg-gray-50/50 hover:bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Rental Duration */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Rental Duration *
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 text-gray-950 border-2 border-gray-200 rounded-xl focus:border-[#00CFFF] focus:ring-2 focus:ring-[#00CFFF]/20 transition-all duration-300 bg-gray-50/50 hover:bg-white"
                >
                  <option value="">Select duration</option>
                  {durationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {formData.duration && (
                  <div className="mt-3 p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Selected Duration:
                      </span>
                      <span className="text-base font-semibold text-blue-600 dark:text-blue-400">
                        {currentDurationInYears} Year
                        {currentDurationInYears !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Duration in Months:
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {currentDurationInMonths} months
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 mt-2 border-t border-blue-200 dark:border-blue-800">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Total Property Cost:
                      </span>
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">
                        Ghc {(property?.price || 0) * currentDurationInMonths}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="w-full bg-[#00CFFF] hover:bg-[#FF4FA1] text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Proceed to Checkout
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-8">
              <OrderSummary bookingDetails={bookingDetails} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={handleBackToForm}
                  disabled={isProcessingPayment}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back to Form
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={!isPaystackReady || isProcessingPayment}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-lg shadow-lg transform transition-all duration-300 ${
                    isPaystackReady && !isProcessingPayment
                      ? "bg-[#00CFFF] hover:bg-[#FF4FA1] hover:scale-105 text-white"
                      : "bg-gray-400 cursor-not-allowed text-gray-200"
                  }`}
                >
                  {isProcessingPayment
                    ? "Processing..."
                    : isPaystackReady
                      ? `Pay Ghc ${bookingDetails?.total}`
                      : "Loading Payment..."}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && confirmedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-xl transform animate-in slide-in-from-bottom-4 duration-300 shadow-2xl max-h-[90vh] my-6 sm:my-10 flex flex-col">
            {/* Success Header */}
            <div className="bg-[#FF4FA1] p-6 sm:p-8 text-white text-center">
              <div className="w-16 h-16 sm:w-20 md:w-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg
                  className="w-8 h-8 sm:w-10 md:w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">
                Payment Confirmed!
              </h3>
              <p className="text-white/90 mt-1 sm:mt-2 text-sm sm:text-base">
                Your payment has been confirmed successfully
              </p>
            </div>

            {/* Booking Details */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto scrollbar-thin">
              {/* Booking PIN - Highlighted */}
              <div className="bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-3 sm:p-4 text-center">
                <p className="text-xs sm:text-sm font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Booking PIN
                </p>
                <div
                  onClick={() => handleCopyPin(confirmedBooking.bookingPin)}
                  className="flex items-center justify-between gap-3 mt-2 px-4 py-3 bg-amber-100 hover:bg-amber-200 cursor-pointer rounded-xl transition-all"
                >
                  <span className="text-2xl font-mono font-bold text-amber-800 tracking-widest">
                    {confirmedBooking.bookingPin}
                  </span>

                  <span className="text-xs font-semibold text-amber-700 bg-white px-2 py-1 rounded-md">
                    Tap to copy
                  </span>
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                  Please save this PIN for future reference
                </p>
              </div>

              {/* Property Details */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Property Details
                </p>
                <p className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg break-words">
                  {confirmedBooking.propertyName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {confirmedBooking.durationLabel} •{" "}
                  {confirmedBooking.durationInMonths} months
                </p>
              </div>

              {/* Customer Details */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Customer Details
                </p>
                <p className="text-gray-900 dark:text-white text-sm sm:text-base break-words">
                  {confirmedBooking.firstName} {confirmedBooking.lastName}
                </p>
                <div className="space-y-1 mt-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
                    {confirmedBooking.email}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {confirmedBooking.phone}
                  </p>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Payment Summary
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Property Cost:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      Ghc {confirmedBooking.totalPropertyPrice}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Agent Fee ({confirmedBooking.agentFeePercentage}%):
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      Ghc {confirmedBooking.agentFee}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Walking Fee:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      Ghc {confirmedBooking.walkingFee}
                    </span>
                  </div>
                  <div className="flex justify-between text-base sm:text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                    <span className="text-gray-900 dark:text-white">
                      Total Paid:
                    </span>
                    <span className="text-green-600 dark:text-green-400">
                      Ghc {confirmedBooking.total}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Reference */}
              <div className="pb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Payment Reference
                </p>
                <p className="text-xs font-mono text-gray-500 dark:text-gray-400 break-all">
                  {confirmedBooking.paymentReference}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Booked on: {confirmedBooking.paymentDate}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 sm:p-6 pt-0 space-y-3">
              <button
                onClick={() => {
                  handleCloseConfirmationModal();

                  window.location.href = "/dashboard";
                }}
                className="w-full bg-[#FF4FA1] text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base"
              >
                View My Bookings
              </button>
              <button
                onClick={handleCloseConfirmationModal}
                className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300 py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingForm;
