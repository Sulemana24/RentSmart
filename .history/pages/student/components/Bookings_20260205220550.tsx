"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Adjust path if needed
import { FiPlus, FiCheck, FiX, FiEye } from "react-icons/fi";

interface Booking {
  id: string;
  type: string;
  student: string;
  date: string;
  duration: string;
  status: string;
}

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch bookings from Firestore
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const querySnapshot = await getDocs(collection(db, "bookings"));
      const bookingsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Booking, "id">),
      }));
      setBookings(bookingsData);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Update booking status in Firestore
  const updateStatus = async (id: string, status: string) => {
    try {
      setUpdatingId(id);
      await updateDoc(doc(db, "bookings", id), { status });
      // Update UI optimistically:
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
    } catch (err) {
      console.error(`Error updating booking status:`, err);
      alert("Failed to update status. Try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div>Loading bookings...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Booking Management
          </h2>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-[#FF4FA1] text-white rounded-lg hover:bg-[#FF4FA1]/90 flex items-center gap-2">
              <FiPlus />
              New Booking
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Room Bookings", count: bookings.filter(b => b.type === "Room Booking").length.toString(), color: "bg-[#00CFFF]" },
            { label: "Check-ins Today", count: "3", color: "bg-[#FF4FA1]" }, {/* You can update this dynamically later */}
            { label: "Pending Approval", count: bookings.filter(b => b.status === "Pending").length.toString(), color: "bg-yellow-500" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"
            >
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.count}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="mb-3 md:mb-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-lg font-medium text-gray-900 dark:text-white">
                    {booking.type}
                  </div>
                  <div
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      booking.status === "Confirmed"
                        ? "bg-green-500/10 text-green-600"
                        : booking.status === "Pending"
                        ? "bg-yellow-500/10 text-yellow-600"
                        : "bg-blue-500/10 text-blue-600"
                    }`}
                  >
                    {booking.status}
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {booking.student} • {booking.date} • {booking.duration}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {booking.status === "Pending" && (
                  <>
                    <button
                      disabled={updatingId === booking.id}
                      onClick={() => updateStatus(booking.id, "Confirmed")}
                      className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiCheck />
                      Approve
                    </button>
                    <button
                      disabled={updatingId === booking.id}
                      onClick={() => updateStatus(booking.id, "Rejected")}
                      className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiX />
                      Reject
                    </button>
                  </>
                )}
                <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#00CFFF] hover:bg-[#00CFFF]/10 rounded-lg">
                  <FiEye />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bookings;