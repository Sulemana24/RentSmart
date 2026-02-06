"use client";

import { useEffect, useState, useMemo } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FiPlus, FiCheck, FiX, FiEye, FiSearch, FiTrash2, FiLoader } from "react-icons/fi";
import { format } from "date-fns";

interface Booking {
  id: string;
  type: string;
  student: string;
  date: string;
  duration: string;
  status: "Pending" | "Confirmed" | "Rejected" | "Approved";
}

const PAGE_SIZE = 6;
const bookingTypes = ["Room Booking", "Room Transfer", "Extension Request"];
const statusOptions = ["Pending", "Confirmed", "Rejected", "Approved"];

const Bookings: React.FC = () => {
  // --- Data State ---
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  // --- UI State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // --- Form State ---
  const [newBooking, setNewBooking] = useState({
    type: bookingTypes[0],
    student: "",
    date: format(new Date(), "yyyy-MM-dd"),
    duration: "",
    status: "Pending",
  });

  // 1. Core Fetch Logic
  const fetchBookings = async (loadMore = false) => {
    try {
      if (loadMore) setLoadingMore(true);
      else {
        setLoading(true);
        setLastDoc(null);
      }

      const bookingsRef = collection(db, "bookings");
      let constraints: any[] = [orderBy("date", "desc"), limit(PAGE_SIZE)];

      if (filterStatus !== "All") constraints.push(where("status", "==", filterStatus));
      if (loadMore && lastDoc) constraints.push(startAfter(lastDoc));

      const q = query(bookingsRef, ...constraints);
      const snapshot = await getDocs(q);

      const fetchedData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Booking[];

      setBookings((prev) => (loadMore ? [...prev, ...fetchedData] : fetchedData));
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
    } catch (error) {
      console.error("Firebase Error:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  // 2. Search & Stats (Client-side)
  const filteredList = useMemo(() => {
    return bookings.filter((b) =>
      b.student.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [bookings, searchTerm]);

  const stats = useMemo(() => ({
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "Pending").length,
    confirmed: bookings.filter((b) => ["Confirmed", "Approved"].includes(b.status)).length,
  }), [bookings]);

  // 3. Actions
  const handleUpdateStatus = async (id: string, newStatus: Booking["status"]) => {
    setUpdatingId(id);
    try {
      await updateDoc(doc(db, "bookings", id), { status: newStatus });
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
    } catch (error) {
      alert("Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this record permanently?")) return;
    try {
      await deleteDoc(doc(db, "bookings", id));
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      alert("Delete failed");
    }
  };

  const handleAddBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "bookings"), newBooking);
      setBookings((prev) => [{ id: docRef.id, ...newBooking } as Booking, ...prev]);
      setIsModalOpen(false);
      setNewBooking({
        type: bookingTypes[0],
        student: "",
        date: format(new Date(), "yyyy-MM-dd"),
        duration: "",
        status: "Pending",
      });
    } catch (error) {
      alert("Error creating booking");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div className="relative w-full lg:w-96">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search student name..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#00CFFF] outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 lg:flex-none px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm font-medium focus:ring-2 focus:ring-[#00CFFF] outline-none"
          >
            <option value="All">All Status</option>
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF4FA1] to-[#FF7EB3] text-white rounded-xl font-bold shadow-lg hover:shadow-[#FF4FA1]/20 transition-all active:scale-95"
          >
            <FiPlus /> <span className="hidden sm:inline">New Booking</span>
          </button>
        </div>
      </div>

      {/* Dynamic Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Active View", value: filteredList.length, color: "text-[#00CFFF]" },
          { label: "Pending Approval", value: stats.pending, color: "text-yellow-500" },
          { label: "Confirmed Total", value: stats.confirmed, color: "text-green-500" },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Main Table Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
        {loading && !loadingMore ? (
          <div className="p-20 flex flex-col items-center justify-center text-gray-400 space-y-4">
            <FiLoader className="animate-spin text-3xl text-[#00CFFF]" />
            <p className="font-medium">Syncing with database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Booking Info</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {filteredList.map((booking) => (
                  <tr key={booking.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center font-bold text-gray-500 dark:text-gray-300">
                          {booking.student.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-sm">{booking.student}</p>
                          <p className="text-[11px] text-gray-400 font-medium">{booking.date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{booking.type}</p>
                      <p className="text-xs text-[#00CFFF] font-medium">{booking.duration}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        ["Confirmed", "Approved"].includes(booking.status) ? "bg-green-100 text-green-600 dark:bg-green-500/10" :
                        booking.status === "Pending" ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/10" :
                        "bg-red-100 text-red-600 dark:bg-red-500/10"
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {booking.status === "Pending" && (
                          <>
                            <button
                              disabled={updatingId === booking.id}
                              onClick={() => handleUpdateStatus(booking.id, "Confirmed")}
                              className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg disabled:opacity-50"
                            >
                              <FiCheck size={18} />
                            </button>
                            <button
                              disabled={updatingId === booking.id}
                              onClick={() => handleUpdateStatus(booking.id, "Rejected")}
                              className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg disabled:opacity-50"
                            >
                              <FiX size={18} />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleDelete(booking.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {lastDoc && !loading && (
          <div className="p-4 border-t border-gray-50 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/20 text-center">
            <button
              onClick={() => fetchBookings(true)}
              disabled={loadingMore}
              className="text-xs font-bold text-[#00CFFF] uppercase tracking-widest hover:underline disabled:opacity-50"
            >
              {loadingMore ? "Loading..." : "Load more entries"}
            </button>
          </div>
        )}
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleAddBooking} className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20 space-y-5">
            <h3 className="text-xl font-black text-gray-900 dark:text-white">New Booking</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Student Name</label>
                <input
                  type="text"
                  required
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none outline-none focus:ring-2 focus:ring-[#FF4FA1]"
                  onChange={(e) => setNewBooking({ ...newBooking, student: e.target.value })}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Type</label>
                <select
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none outline-none focus:ring-2 focus:ring-[#FF4FA1]"
                  onChange={(e) => setNewBooking({ ...newBooking, type: e.target.value })}
                >
                  {bookingTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Duration</label>
                  <input
                    type="text"
                    placeholder="6 Months"
                    required
                    className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none outline-none focus:ring-2 focus:ring-[#FF4FA1]"
                    onChange={(e) => setNewBooking({ ...newBooking, duration: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Date</label>
                  <input
                    type="date"
                    className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none outline-none focus:ring-2 focus:ring-[#FF4FA1]"
                    value={newBooking.date}
                    onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="flex-1 py-3 font-bold text-gray-400 hover:text-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex-1 py-3 bg-[#FF4FA1] text-white font-bold rounded-xl shadow-lg shadow-[#FF4FA1]/30 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Save Entry
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Bookings;