import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";

interface BookingProps {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyImage: string;
  price: number;
  bookingStatus: string;
  startDate: string;
  durationInMonths: number;
  total: number;
  bookingPin?: string;
  paymentReference?: string;
  agentFee?: number;
  walkingFee?: number;
  totalPropertyPrice?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export default function BookedPropertiesDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<BookingProps | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.uid) return;
      setLoading(true);
      try {
        const db = getFirestore();
        const bookingsRef = collection(db, "bookings");
        const q = query(bookingsRef, where("userId", "==", user.uid));
        const snapshot = await getDocs(q);

        const data: BookingProps[] = snapshot.docs.map((doc) => {
          const b = doc.data();
          return {
            id: doc.id,
            propertyId: b.propertyId,
            propertyName: b.propertyName,
            propertyImage: b.propertyImage,
            price: b.price,
            bookingStatus: b.bookingStatus,
            startDate: b.startDate,
            durationInMonths: b.durationInMonths,
            total: b.total,
            bookingPin: b.bookingPin,
            paymentReference: b.paymentReference,
            agentFee: b.agentFee,
            walkingFee: b.walkingFee,
            totalPropertyPrice: b.totalPropertyPrice,
            firstName: b.firstName,
            lastName: b.lastName,
            email: b.email,
            phone: b.phone,
          };
        });

        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?.uid]);

  const handleViewDetails = (booking: BookingProps) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-[#FF4FA1] mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Loading your bookings...
          </p>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4 mt-9">
        <svg
          className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Bookings Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-6">
          You haven't booked any properties yet. Start exploring and book your
          first property!
        </p>
        <button
          onClick={() => (window.location.href = "/properties")}
          className="bg-[#FF4FA1] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
        >
          Browse Properties
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 mt-9">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Bookings
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            You have {bookings.length}{" "}
            {bookings.length === 1 ? "booking" : "bookings"} in total
          </p>
        </div>

        {/* Bookings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-[#FF4FA1]/30 dark:hover:border-[#FF4FA1]/30"
            >
              {/* Property Image */}
              <div className="relative overflow-hidden h-40 sm:h-44 md:h-48">
                <img
                  src={b.propertyImage}
                  alt={b.propertyName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Status Badge - Overlay on Image */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`inline-block px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-sm ${
                      b.bookingStatus === "pending"
                        ? "bg-yellow-500/90 text-white border border-yellow-400"
                        : b.bookingStatus === "confirmed"
                          ? "bg-green-500/90 text-white border border-green-400"
                          : "bg-gray-500/90 text-white border border-gray-400"
                    }`}
                  >
                    {b.bookingStatus.charAt(0).toUpperCase() +
                      b.bookingStatus.slice(1)}
                  </span>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-4 sm:p-5">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                  {b.propertyName}
                </h3>

                <div className="space-y-1.5 sm:space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Monthly Price
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                      Ghc {b.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Duration
                    </span>
                    <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                      {b.durationInMonths}{" "}
                      {b.durationInMonths === 1 ? "month" : "months"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Start Date
                    </span>
                    <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                      {new Date(b.startDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Total Amount
                    </span>
                    <span className="text-base sm:text-lg font-bold text-[#FF4FA1]">
                      Ghc {b.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() =>
                      (window.location.href = `/property/${b.propertyId}`)
                    }
                    className="flex-1 bg-[#FF4FA1]  text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    View Property
                  </button>
                  <button
                    onClick={() => handleViewDetails(b)}
                    className="flex-1 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:border-[#00CFFF] hover:text-[#00CFFF] transition-all duration-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Details Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl max-w-[95%] sm:max-w-md md:max-w-lg w-full max-h-[90vh] overflow-y-auto transform animate-in slide-in-from-bottom-4 duration-300 shadow-2xl">
            {/* Modal Header */}
            <div
              className={`p-5 sm:p-6 text-white text-center relative overflow-hidden ${
                selectedBooking.bookingStatus === "confirmed"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600"
                  : "bg-gradient-to-r from-yellow-500 to-orange-600"
              }`}
            >
              <div className="relative z-10">
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4`}
                >
                  {selectedBooking.bookingStatus === "confirmed" ? (
                    <svg
                      className="w-8 h-8 sm:w-10 sm:h-10"
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
                  ) : (
                    <svg
                      className="w-8 h-8 sm:w-10 sm:h-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">
                  Booking{" "}
                  {selectedBooking.bookingStatus === "confirmed"
                    ? "Confirmed"
                    : "Pending"}
                </h3>
                <p className="text-white/90 mt-1 text-xs sm:text-sm">
                  Booking ID: {selectedBooking.id.slice(0, 8)}...
                </p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              <div className="bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-3 sm:p-4 text-center">
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Booking PIN
                </p>
                <p className="text-2xl sm:text-3xl font-mono font-bold text-amber-700 dark:text-amber-300 mt-1">
                  {selectedBooking.bookingPin}
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                  Please save this PIN for future reference
                </p>
              </div>

              {/* Property Details */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Property Details
                </p>
                <div className="flex gap-3 sm:gap-4">
                  <img
                    src={selectedBooking.propertyImage}
                    alt={selectedBooking.propertyName}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                      {selectedBooking.propertyName}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {selectedBooking.durationInMonths} months • Starting{" "}
                      {new Date(selectedBooking.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              {selectedBooking.firstName && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Customer Details
                  </p>
                  <p className="text-gray-900 dark:text-white text-sm sm:text-base">
                    {selectedBooking.firstName} {selectedBooking.lastName}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 break-all">
                    {selectedBooking.email}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {selectedBooking.phone}
                  </p>
                </div>
              )}

              {/* Payment Summary */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Payment Summary
                </p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Property Cost:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      Ghc{" "}
                      {selectedBooking.totalPropertyPrice?.toLocaleString() ||
                        selectedBooking.price *
                          selectedBooking.durationInMonths}
                    </span>
                  </div>
                  {selectedBooking.agentFee && (
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Agent Fee:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        Ghc {selectedBooking.agentFee.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {selectedBooking.walkingFee && (
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Walking Fee:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        Ghc {selectedBooking.walkingFee.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                    <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                      Total Paid:
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-[#FF4FA1]">
                      Ghc {selectedBooking.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Reference */}
              {selectedBooking.paymentReference && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Payment Reference
                  </p>
                  <p className="text-[10px] sm:text-xs font-mono text-gray-600 dark:text-gray-400 break-all">
                    {selectedBooking.paymentReference}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-2">
                    Booked on:{" "}
                    {new Date(selectedBooking.startDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 sm:p-6 pt-0 space-y-3">
              <button
                onClick={() =>
                  (window.location.href = `/property/${selectedBooking.propertyId}`)
                }
                className="w-full bg-[#FF4FA1] py-2.5 sm:py-3 px-4 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
              >
                View Property
              </button>
              <button
                onClick={handleCloseModal}
                className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300 py-2.5 sm:py-3 px-4 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
