import { useState } from "react";
import Link from "next/link";
import { PROPERTYLISTINGSAMPLE } from "@/constants";
import { MOCK_BOOKING_DATA } from "@/constants/bookingData";
import { PropertyProps } from "@/interfaces";

interface BookingStatus {
  bookingData: any;
  property: PropertyProps | null;
}

export default function BookingStatusPage() {
  const [bookingCode, setBookingCode] = useState("");
  const [bookingStatus, setBookingStatus] = useState<BookingStatus | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const checkBookingStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingCode.trim()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const booking = MOCK_BOOKING_DATA[bookingCode.toUpperCase()];

      if (booking) {
        // Find the corresponding property
        const property = PROPERTYLISTINGSAMPLE.find(
          (prop) => prop.id === booking.propertyId
        );

        setBookingStatus({
          bookingData: booking,
          property: property || null,
        });
      } else {
        setBookingStatus(null);
      }

      setIsLoading(false);
    }, 1000);
  };

  const calculateDurationInYears = (
    checkIn: string,
    checkOut: string
  ): number => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const durationInDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    const durationInYears = durationInDays / 365;
    return Math.round(durationInYears * 10) / 10; // Round to 1 decimal place
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "pending":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "completed":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmed";
      case "pending":
        return "Pending Approval";
      case "completed":
        return "Completed";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 text-white">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Booking Status
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-200">
            Check the status of your property bookings in real-time
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Booking Code Input Section */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">
            Check Your Booking Status
          </h2>
          <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
            Enter your 6-digit booking code to view your reservation details and
            current status
          </p>

          <form onSubmit={checkBookingStatus} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={bookingCode}
                onChange={(e) => setBookingCode(e.target.value)}
                placeholder="Enter booking code (e.g., ABC123)"
                className="flex-1 px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                maxLength={6}
              />
              <button
                type="submit"
                disabled={isLoading || !bookingCode.trim()}
                className="bg-[#FF4FA1] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#00CFFF] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Checking..." : "Check Status"}
              </button>
            </div>
          </form>

          {/* Sample Booking Codes Hint */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Try sample codes: ABC123, XYZ789, DEF456, GHI789, JKL012
            </p>
          </div>
        </div>

        {/* Booking Status Display */}
        {bookingStatus !== null && (
          <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
            {!bookingStatus.bookingData ? (
              <div className="text-center">
                <div className="text-6xl mb-4">❌</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Booking Not Found
                </h3>
                <p className="text-gray-400 mb-6">
                  We couldn't find a booking with the code "{bookingCode}".
                  Please check your code and try again.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      setBookingCode("");
                      setBookingStatus(null);
                    }}
                    className="bg-[#00CFFF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#FF4FA1] transition-colors duration-200"
                  >
                    Try Another Code
                  </button>
                  <Link href="/contact">
                    <button className="border border-gray-500 text-gray-300 px-6 py-3 rounded-lg font-semibold hover:border-[#00CFFF] hover:text-[#00CFFF] transition-colors duration-200">
                      Contact Support
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Status Header */}
                <div className="text-center">
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-full border text-sm font-semibold mb-4 ${getStatusColor(
                      bookingStatus.bookingData.status
                    )}`}
                  >
                    {getStatusText(bookingStatus.bookingData.status)}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {bookingStatus.property?.name || "Property Not Found"}
                  </h3>
                  <p className="text-gray-400">
                    Booking Code: {bookingStatus.bookingData.id}
                  </p>
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-700/50 rounded-xl p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm">Check-in</label>
                      <p className="text-white font-semibold">
                        {new Date(
                          bookingStatus.bookingData.checkIn
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm">Duration</label>
                      <p className="text-white font-semibold">
                        {calculateDurationInYears(
                          bookingStatus.bookingData.checkIn,
                          bookingStatus.bookingData.checkOut
                        )}{" "}
                        years
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm">
                        Property Price
                      </label>
                      <p className="text-white font-semibold">
                        Ghc{bookingStatus.property?.price}/year
                      </p>
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm">Host</label>
                      <p className="text-white font-semibold">
                        {bookingStatus.property?.host || "Not Available"}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">
                        Total Amount Paid
                      </label>
                      <p className="text-white font-semibold text-xl">
                        {bookingStatus.bookingData.totalAmount}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Location</label>
                      <p className="text-white font-semibold">
                        {bookingStatus.property?.address.city},{" "}
                        {bookingStatus.property?.address.state}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <button className="bg-[#FF4FA1] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#00CFFF] transition-colors duration-200">
                    Continue to Dashboard
                  </button>
                  <Link href="/contact">
                    <button className="border border-gray-500 text-gray-300 px-8 py-3 rounded-lg font-semibold hover:border-[#00CFFF] hover:text-[#00CFFF] transition-colors duration-200">
                      Contact Support
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      setBookingCode("");
                      setBookingStatus(null);
                    }}
                    className="border border-gray-500 text-gray-300 px-8 py-3 rounded-lg font-semibold hover:border-[#FF4FA1] hover:text-[#FF4FA1] transition-colors duration-200"
                  >
                    Check Another Booking
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Help Section */}
        {!bookingStatus && (
          <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700 mt-8">
            <div className="text-center">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold text-white mb-4">
                Need Help Finding Your Booking Code?
              </h3>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Your booking code was sent to your email after you made the
                reservation. Check your confirmation email or contact our
                support team for assistance.
              </p>
              <Link href="/contact">
                <button className="bg-[#00CFFF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#FF4FA1] transition-colors duration-200">
                  Contact Support Team
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
