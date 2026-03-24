"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  query,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FiPlus, FiCheck, FiX, FiEye, FiFilter } from "react-icons/fi";
import { format } from "date-fns";

interface Booking {
  id: string;
  type: string;
  student: string;
  date: string; // ISO string date
  duration: string;
  status: "Pending" | "Confirmed" | "Rejected" | "Approved";
}

const PAGE_SIZE = 5;

const bookingTypes = [
  "Room Booking",
  "Room Transfer",
  "Extension Request",
];

const statusOptions = [
  "Pending",
  "Confirmed",
  "Rejected",
  "Approved",
];

const Bookings: React.FC = () => {
  // State variables
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | "All">("All");
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // New booking form state
  const [newBooking, setNewBooking] = useState({
    type: bookingTypes[0],
    student: "",
    date: "",
    duration: "",
    status: "Pending",
  });

  // Fetch bookings with pagination and filtering
  const fetchBookings = async (loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setBookings([]);
        setLastDoc(null);
      }
      setError(null);

      let bookingsQuery = collection(db, "bookings");

      let q;

      // Build query with filters, ordering, limit, and pagination
      if (filterStatus !== "All") {
        q = query(
          bookingsQuery,
          where("status", "==", filterStatus),
          orderBy("date", "desc"),
          limit(PAGE_SIZE),
          ...(loadMore && lastDoc ? [startAfter(lastDoc)] : [])
        );
      } else {
        q = query(
          bookingsQuery,
          orderBy("date", "desc"),
          limit(PAGE_SIZE),
          ...(loadMore && lastDoc ? [startAfter(lastDoc)] : [])
        );
      }

      const snapshot = await getDocs(q);

      const newBookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Booking, "id">),
      }));

      setBookings((prev) => (loadMore ? [...prev, ...newBookings] : newBookings));
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  // Update booking status in Firestore
  const updateStatus = async (id: string, status: Booking["status"]) => {
    try {
      setUpdatingId(id);
      await updateDoc(doc(db, "bookings", id), { status });
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
    } catch (err) {
      console.error("Error updating booking status:", err);
      alert("Failed to update status. Try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewBooking((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Add new booking to Firestore
  const addBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newBooking.student.trim() || !newBooking.date || !newBooking.duration.trim()) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      const docRef = await addDoc(collection(db, "bookings"), {
        ...newBooking,
      });
      setBookings((prev) => [{ id: docRef.id, ...newBooking }, ...prev]);
      setAdding(false);
      // Reset form
      setNewBooking({
        type: bookingTypes[0],
        student: "",
        date: "",
        duration: "",
        status: "Pending",
      });
    } catch (err) {
      console.error("Error adding booking:", err);
      alert("Failed to add booking. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM dd, yyyy");
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Booking Management</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAdding(true)}
              className="px-4 py-2 bg-[#FF4FA1] text-white rounded-lg hover:bg-[#FF4FA1]/90 flex items-center gap-2"
            >
              <FiPlus /> New Booking
            </button>

            {/* Filter dropdown */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value="All">All Statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Room Bookings", count: bookings.filter(b => b.type === "Room Booking").length.toString(), color: "bg-[#00CFFF]" },
            { label: "Check-ins Today", count: "3", color: "bg-[#FF4FA1]" }, {/* TODO: update dynamically */}
            { label: "Pending Approval", count: bookings.filter(b => b.status === "Pending").length.toString(), color: "bg-yellow-500" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4`}
            >
              <div className={`text-2xl font-bold text-gray-900 dark:text-white`}>
                {stat.count}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Booking list */}
        {loading && !loadingMore && <div>Loading bookings...</div>}
        {error && <div className="text-red-500">{error}</div>}

        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="mb-3 md:mb-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-lg font-medium text-gray-900 dark:text-white">{booking.type}</div>
                  <div
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      booking.status === "Confirmed"
                        ? "bg-green-500/10 text-green-600"
                        : booking.status === "Pending"
                        ? "bg-yellow-500/10 text-yellow-600"
                        : booking.status === "Rejected"
                        ? "bg-red-500/10 text-red-600"
                        : "bg-blue-500/10 text-blue-600"
                    }`}
                  >
                    {booking.status}
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {booking.student} • {formatDate(booking.date)} • {booking.duration}
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

        {/* Load more */}
        {lastDoc && !loading && (
          <div className="mt-6 text-center">
            <button
              onClick={() => fetchBookings(true)}
              disabled={loadingMore}
              className="px-6 py-2 bg-[#00CFFF] text-white rounded-lg hover:bg-[#00CFFF]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>

      {/* Add Booking Modal */}
      {adding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={addBooking}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-700 space-y-4"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add New Booking</h3>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Booking Type</label>
              <select
                name="type"
                value={newBooking.type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                {bookingTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Student Name</label>
              <input
                type="text"
                name="student"
                value={newBooking.student}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Student Full Name"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
              <input
                type="date"
                name="date"
                value={newBooking.date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Duration</label>
              <input
                type="text"
                name="duration"
                value={newBooking.duration}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., 6 months, Room 201 → 205, +3 months"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select
                name="status"
                value={newBooking.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="px-6 py-2 border rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#FF4FA1] text-white rounded-lg hover:bg-[#FF4FA1]/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Adding..." : "Add Booking"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Bookings;