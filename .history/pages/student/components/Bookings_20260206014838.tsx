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
import { FiPlus, FiCheck, FiX, FiEye, FiFilter, FiSearch, FiTrash2, FiLoader } from "react-icons/fi";
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
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | "All">("All");
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const [newBooking, setNewBooking] = useState({
    type: bookingTypes[0],
    student: "",
    date: format(new Date(), "yyyy-MM-dd"),
    duration: "",
    status: "Pending",
  });

  const fetchBookings = async (loadMore = false) => {
    try {
      if (loadMore) setLoadingMore(true);
      else {
        setLoading(true);
        setLastDoc(null);
      }

      let bookingsQuery = collection(db, "bookings");
      let constraints: any[] = [orderBy("date", "desc"), limit(PAGE_SIZE)];

      if (filterStatus !== "All") {
        constraints.unshift(where("status", "==", filterStatus));
      }
      if (loadMore && lastDoc) {
        constraints.push(startAfter(lastDoc));
      }

      const q = query(bookingsQuery, ...constraints);
      const snapshot = await getDocs(q);

      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Booking, "id">),
      }));

      setBookings((prev) => (loadMore ? [...prev, ...fetched] : fetched));
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [filterStatus]);

  // Derived stats
  const stats = useMemo(() => ({
    total: bookings.length,
    pending: bookings.filter(b => b.status === "Pending").length,
    confirmed: bookings.filter(b => b.status === "Confirmed").length,
  }), [bookings]);

  // Filtered view based on search
  const filteredBookings = bookings.filter(b => 
    b.student.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateStatus = async (id: string, status: Booking["status"]) => {
    setUpdatingId(id);
    try {
      await updateDoc(doc(db, "bookings", id), { status });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch (err) {
      alert("Error updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      await deleteDoc(doc(db, "bookings", id));
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      alert("Error deleting booking");
    }
  };

  const handleAddBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(false);
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "bookings"), newBooking);
      setBookings(prev => [{ id: docRef.id, ...newBooking } as Booking, ...prev]);
    } catch (err) {
      alert("Failed to add");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-1 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Search and Action Bar */}
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
            {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF4FA1] to-[#FF7EB3] text-white rounded-xl font-bold shadow-lg hover:shadow-[#FF4FA1]/20 transition-all active:scale-95"
          >
            <FiPlus /> <span className="hidden sm:inline">New Booking</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Active View", value: filteredBookings.length, color: "text-[#00CFFF]", bg: "bg-[#00CFFF]/10" },
          { label: "Pending", value: stats.pending, color: "text-yellow-500", bg: "bg-yellow-500/10" },
          { label: "Confirmed", value: stats.confirmed, color: "text-green-500", bg: "bg-green-500/10" },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Bookings Table/List */}
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
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center font-bold text-gray-500 dark:text-gray-300">
                          {booking.student.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-sm">{booking.student}</p>
                          <p className="text-[11px] text-gray-400 font-medium">{format(new Date(booking.date), "dd MMM yyyy")}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{booking.type}</p>
                      <p className="text-xs text-[#00CFFF] font-medium">{booking.duration}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        booking.status === "Confirmed" ? "bg-green-100 text-green-600 dark:bg-green-500/10" :
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
                              onClick={() => updateStatus(booking.id, "Confirmed")}
                              className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg"
                              title="Approve"
                            >
                              <FiCheck size={18} />
                            </button>
                            <button 
                              onClick={() => updateStatus(booking.id, "Rejected")}
                              className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                              title="Reject"
                            >
                              <FiX size={18} />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => deleteBooking(booking.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                          title="Delete"
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
              className="text-xs font-bold text-[#00CFFF] uppercase tracking-widest hover:underline"
            >
              {loadingMore ? "Loading..." : "Load more entries"}
            </button>
          </div>
        )}
      </div>

      {/* Modal - same as your original with improved styling */}
      {adding && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleAddBooking} className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-5 border border-white/20">
            <h3 className="text-xl font-black text-gray-900 dark:text-white">Create New Entry</h3>
            {/* ... Form Fields ... */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Student Name"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none outline-none focus:ring-2 focus:ring-[#FF4FA1]"
                  required
                  onChange={(e) => setNewBooking({...newBooking, student: e.target.value})}
                />
                <input
                  type="date"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none outline-none focus:ring-2 focus:ring-[#FF4FA1]"
                  value={newBooking.date}
                  onChange={(e) => setNewBooking({...newBooking, date: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Duration (e.g. 1 Year)"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border-none outline-none focus:ring-2 focus:ring-[#FF4FA1]"
                  required
                  onChange={(e) => setNewBooking({...newBooking, duration: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={() => setAdding(false)} className="flex-1 py-3 font-bold text-gray-400 hover:text-gray-600">Cancel</button>
              <button type="submit" className="flex-1 py-3 bg-[#FF4FA1] text-white font-bold rounded-xl shadow-lg shadow-[#FF4FA1]/30">Confirm</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Bookings;