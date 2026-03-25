import { useState } from "react";
import {
  FiCheck,
  FiX,
  FiEye,
  FiUser,
  FiHome,
  FiCalendar,
  FiClock,
  FiAlertCircle,
  FiLoader,
} from "react-icons/fi";

interface Booking {
  id: string;
  type: "Tour Booking" | "Rental Booking";
  property: string;
  propertyId: string;
  date: string;
  time?: string;
  status: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  durationInMonths?: number;
  total?: number;
  bookingPin?: string;
  startDate?: string;
  createdAt?: any;
}

interface BookingListProps {
  bookings: Booking[];
  onUpdateStatus?: (
    bookingId: string,
    newStatus: "Confirmed" | "Cancelled",
  ) => void;
  updatingStatus?: string | null;
}

const BookingList = ({
  bookings,
  onUpdateStatus,
  updatingStatus,
}: BookingListProps) => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Helper function to normalize status for display
  const normalizeStatus = (status: string) => {
    if (!status) return "Pending";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  // Helper function to check if status is pending (case insensitive)
  const isPending = (status: string) => {
    return status?.toLowerCase() === "pending";
  };

  // Helper function to check if status is confirmed (case insensitive)
  const isConfirmed = (status: string) => {
    return status?.toLowerCase() === "confirmed";
  };

  // Helper function to check if status is cancelled (case insensitive)
  const isCancelled = (status: string) => {
    return status?.toLowerCase() === "cancelled";
  };

  const getStatusColor = (status: string) => {
    const lowerStatus = status?.toLowerCase();
    switch (lowerStatus) {
      case "confirmed":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getTypeColor = (type: string) => {
    return type === "Tour Booking" ? "text-[#00CFFF]" : "text-[#FF4FA1]";
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200 dark:border-gray-700">
            <tr className="text-left">
              <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Booking Type
              </th>
              <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Customer
              </th>
              <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-4">
                  <span
                    className={`text-sm font-semibold ${getTypeColor(booking.type)}`}
                  >
                    {booking.type}
                  </span>
                </td>
                <td className="py-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                    {booking.property}
                  </p>
                  {booking.durationInMonths && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {booking.durationInMonths}{" "}
                      {booking.durationInMonths === 1 ? "month" : "months"}
                    </p>
                  )}
                </td>
                <td className="py-4 hidden md:table-cell">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {booking.customerName || "N/A"}
                  </p>
                  {booking.customerEmail && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                      {booking.customerEmail}
                    </p>
                  )}
                </td>
                <td className="py-4">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {new Date(booking.date).toLocaleDateString()}
                  </p>
                  {booking.time && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                      <FiClock className="w-3 h-3" />
                      {booking.time}
                    </p>
                  )}
                </td>
                <td className="py-4">
                  {booking.total ? (
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Ghc {booking.total.toLocaleString()}
                    </p>
                  ) : (
                    <span className="text-xs text-gray-400">N/A</span>
                  )}
                </td>
                <td className="py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}
                  >
                    {normalizeStatus(booking.status)}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleViewDetails(booking)}
                      className="p-2 text-gray-500 hover:text-[#00CFFF] transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="View Details"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    {/* Show confirm/cancel buttons only for pending bookings */}
                    {isPending(booking.status) && onUpdateStatus && (
                      <>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure you want to confirm this booking for ${booking.property}?`,
                              )
                            ) {
                              onUpdateStatus(booking.id, "Confirmed");
                              showToast(
                                "Booking confirmed successfully!",
                                "success",
                              );
                            }
                          }}
                          disabled={updatingStatus === booking.id}
                          className="p-2 text-green-500 hover:text-green-600 transition-colors rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 disabled:opacity-50"
                          title="Confirm Booking"
                        >
                          {updatingStatus === booking.id ? (
                            <FiLoader className="w-4 h-4 animate-spin" />
                          ) : (
                            <FiCheck className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure you want to cancel this booking for ${booking.property}?`,
                              )
                            ) {
                              onUpdateStatus(booking.id, "Cancelled");
                              showToast(
                                "Booking cancelled successfully!",
                                "success",
                              );
                            }
                          }}
                          disabled={updatingStatus === booking.id}
                          className="p-2 text-red-500 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                          title="Cancel Booking"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Booking Details Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl max-w-[95%] sm:max-w-md md:max-w-lg w-full max-h-[90vh] overflow-y-auto transform animate-in slide-in-from-bottom-4 duration-300 shadow-2xl">
            {/* Modal Header */}
            <div
              className={`p-5 sm:p-6 text-white text-center relative overflow-hidden ${
                isConfirmed(selectedBooking.status)
                  ? "bg-gradient-to-r from-green-500 to-emerald-600"
                  : isPending(selectedBooking.status)
                    ? "bg-gradient-to-r from-yellow-500 to-orange-600"
                    : "bg-gradient-to-r from-gray-500 to-gray-600"
              }`}
            >
              <div className="relative z-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  {isConfirmed(selectedBooking.status) ? (
                    <FiCheck className="w-8 h-8 sm:w-10 sm:h-10" />
                  ) : isPending(selectedBooking.status) ? (
                    <FiCalendar className="w-8 h-8 sm:w-10 sm:h-10" />
                  ) : (
                    <FiX className="w-8 h-8 sm:w-10 sm:h-10" />
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">
                  {selectedBooking.type} -{" "}
                  {normalizeStatus(selectedBooking.status)}
                </h3>
                <p className="text-white/90 mt-1 text-xs sm:text-sm">
                  Booking ID: {selectedBooking.id.slice(0, 8)}...
                </p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              {/* Booking PIN - Only for confirmed bookings */}
              {isConfirmed(selectedBooking.status) &&
                selectedBooking.bookingPin && (
                  <div className="bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-3 sm:p-4 text-center">
                    <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                      Booking PIN
                    </p>
                    <p className="text-2xl sm:text-3xl font-mono font-bold text-amber-700 dark:text-amber-300 mt-1">
                      {selectedBooking.bookingPin}
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                      Share this PIN with the customer for verification
                    </p>
                  </div>
                )}

              {/* Property Details */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FiHome className="w-4 h-4 text-gray-400" />
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Property Details
                  </p>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                      {selectedBooking.property}
                    </p>
                    {selectedBooking.durationInMonths && (
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Duration: {selectedBooking.durationInMonths}{" "}
                        {selectedBooking.durationInMonths === 1
                          ? "month"
                          : "months"}
                      </p>
                    )}
                    {selectedBooking.startDate && (
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Start Date:{" "}
                        {new Date(
                          selectedBooking.startDate,
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex items-center gap-2 mb-2">
                  <FiUser className="w-4 h-4 text-gray-400" />
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Customer Details
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-900 dark:text-white text-sm sm:text-base">
                    {selectedBooking.customerName || "N/A"}
                  </p>
                  {selectedBooking.customerEmail && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-all">
                      {selectedBooking.customerEmail}
                    </p>
                  )}
                  {selectedBooking.customerPhone && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {selectedBooking.customerPhone}
                    </p>
                  )}
                </div>
              </div>

              {/* Booking Schedule */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex items-center gap-2 mb-2">
                  <FiCalendar className="w-4 h-4 text-gray-400" />
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Schedule
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    Date: {new Date(selectedBooking.date).toLocaleDateString()}
                  </p>
                  {selectedBooking.time && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Time: {selectedBooking.time}
                    </p>
                  )}
                  {selectedBooking.createdAt && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Booked on:{" "}
                      {new Date(
                        selectedBooking.createdAt?.toDate(),
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Summary */}
              {selectedBooking.total && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Payment Summary
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Total Amount:
                    </span>
                    <span className="text-xl font-bold text-[#FF4FA1]">
                      Ghc {selectedBooking.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 sm:p-6 pt-0 space-y-3">
              {isPending(selectedBooking.status) && onUpdateStatus && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Confirm booking for ${selectedBooking.property}?`,
                        )
                      ) {
                        onUpdateStatus(selectedBooking.id, "Confirmed");
                        handleCloseModal();
                        showToast("Booking confirmed successfully!", "success");
                      }
                    }}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2.5 sm:py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Confirm Booking
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Cancel booking for ${selectedBooking.property}?`,
                        )
                      ) {
                        onUpdateStatus(selectedBooking.id, "Cancelled");
                        handleCloseModal();
                        showToast("Booking cancelled successfully!", "success");
                      }
                    }}
                    className="flex-1 border-2 border-red-500 text-red-500 py-2.5 sm:py-3 px-4 rounded-xl font-semibold hover:bg-red-500 hover:text-white transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
              <button
                onClick={() =>
                  (window.location.href = `/property/${selectedBooking.propertyId}`)
                }
                className="w-full bg-[#FF4FA1] text-white py-2.5 sm:py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                View Property
              </button>
              <button
                onClick={handleCloseModal}
                className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300 py-2.5 sm:py-3 px-4 rounded-xl font-medium transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === "success" ? (
                <FiCheck className="w-4 h-4" />
              ) : (
                <FiX className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingList;
