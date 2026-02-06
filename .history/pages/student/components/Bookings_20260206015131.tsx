"use client";

import { useEffect, useState, useMemo } from "react";
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
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FiPlus, FiCheck, FiX, FiEye, FiSearch, FiLoader, FiTrash2 } from "react-icons/fi";
import { format } from "date-fns";

interface Booking {
  id: string;
  type: string;
  student: string;
  date: string;
  duration: string;
  status: "Pending" | "Confirmed" | "Rejected" | "Approved";
}

const PAGE_SIZE = 5;

const Bookings: React.FC = () => {
  // Data State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  
  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // New Booking Form State
  const [newBooking, setNewBooking] = useState({
    type: "Room Booking",
    student: "",
    date: format(new Date(), "yyyy-MM-dd"),
    duration: "",
    status: "Pending",
  });

  // 1. Fetch Bookings Logic
  const fetchBookings = async (loadMore = false) => {
    try {
      if (loadMore) setLoadingMore(true);
      else setLoading(true);

      const bookingsRef = collection(db, "bookings");
      let constraints: any[] = [orderBy("date", "desc"), limit(PAGE_SIZE)];

      if (filterStatus !== "All") constraints.push(where("status", "==", filterStatus));
      if (loadMore && lastDoc) constraints.push(startAfter(lastDoc));

      const q = query(bookingsRef, ...constraints);
      const snapshot = await getDocs(q);
      
      const fetchedData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];

      setBookings(prev => loadMore ? [...prev, ...fetchedData] : fetchedData);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [filterStatus]);

  // 2. Search & Stats Memoization
  const filteredList = bookings.filter(b => 
    b.student.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = useMemo(() => ({
    total: bookings.length,
    pending: bookings.filter(b => b.status === "Pending").length,
    confirmed: bookings.filter(b => b.status === "Confirmed" || b.status === "Approved").length
  }), [bookings]);

  // 3. Actions
  const handleUpdateStatus = async (id: string, newStatus: Booking["status"]) => {
    setUpdatingId(id);
    try {
      await updateDoc(doc(db, "bookings", id), { status: newStatus });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (error) {
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "bookings"), newBooking);
      setBookings(prev => [{ id: docRef.id, ...newBooking } as Booking, ...prev]);
      setIsModalOpen(false);
      setNewBooking({ type: "Room Booking", student: "", date: format(new Date(), "yyyy-MM-dd"), duration: "", status: "Pending" });
    } catch (error) {
      alert("Error adding booking");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Booking Management</h2>
            <p className="text-xs text-gray-500">Handle room requests and transfers</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search student..." 
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-[#00CFFF] outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-[#FF4FA1] text-white rounded-lg hover:bg-[#FF4FA1]/90 flex items-center gap-2 shadow-lg shadow-[#FF4FA1]/20 transition-all active:scale-95"
            >
              <FiPlus /> New Booking
            </button>
          </div>
        </div>

        {/* Dynamic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Handled", count: stats.total, color: "bg-[#00CFFF]" },
            { label: "Confirmed/Approved", count: stats.confirmed, color: "bg-green-500" },
            { label: "Pending Approval", count: stats.pending, color: "bg-yellow-500" },
          ].map((stat, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-900/40 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
              <div className="text-2xl font-black text-gray-900 dark:text-white">{stat.count}</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex flex-col items-center py-12 text-gray-400">
              <FiLoader className="animate-spin text-2xl mb-2" />
              <p className="text-sm">Fetching records...</p>
            </div>
          ) : (
            filteredList.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:shadow-md transition-all bg-white dark:bg-gray-800/50 group"
              >
                <div className="mb-3 md:mb-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{booking.type}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                      booking.status === "Confirmed" || booking.status === "Approved" ? "bg-green-500/10 text-green-600" :
                      booking.status === "Pending" ? "bg-yellow-500/10 text-yellow-600" : "bg-red-500/10 text-red-600"
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-x-2">
                    <span className="font-bold text-gray-700 dark:text-gray-200">{booking.student}</span>
                    <span>•</span>
                    <span>{booking.date}</span>
                    <span>•</span>
                    <span className="text-[#00CFFF]">{booking.duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {booking.status === "Pending" && (
                    <>
                      <button 
                        disabled={updatingId === booking.id}
                        onClick={() => handleUpdateStatus(booking.id, "Confirmed")}
                        className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 flex items-center gap-1 disabled:opacity-50"
                      >
                        <FiCheck /> Approve
                      </button>
                      <button 
                        disabled={updatingId === booking.id}
                        onClick={() => handleUpdateStatus(booking.id, "Rejected")}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 flex items-center gap-1 disabled:opacity-50"
                      >
                        <FiX /> Reject
                      </button>
                    </>
                  )}
                  <button className="p-2 text-gray-400 hover:text-[#00CFFF] hover:bg-[#00CFFF]/10 rounded-lg transition-colors">
                    <FiEye />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More */}
        {lastDoc && !loading && (
          <button 
            onClick={() => fetchBookings(true)}
            className="w-full mt-4 py-2 text-xs font-bold text-gray-400 hover:text-[#00CFFF] uppercase tracking-widest transition-colors"
          >
            {loadingMore ? "Loading..." : "View More Bookings"}
          </button>
        )}
      </div>

      {/* New Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddBooking} className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-100 dark:border-gray-700 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create New Booking</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full mt-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-[#FF4FA1] outline-none"
                  onChange={(e) => setNewBooking({...newBooking, student: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Booking Type</label>
                <select 
                  className="w-full mt-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-[#FF4FA1] outline-none"
                  onChange={(e) => setNewBooking({...newBooking, type: e.target.value})}
                >
                  <option>Room Booking</option>
                  <option>Room Transfer</option>
                  <option>Extension Request</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Duration</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 1 Year"
                    className="w-full mt-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-[#FF4FA1] outline-none"
                    onChange={(e) => setNewBooking({...newBooking, duration: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</label>
                  <input 
                    type="date" 
                    className="w-full mt-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-[#FF4FA1] outline-none"
                    value={newBooking.date}
                    onChange={(e) => setNewBooking({...newBooking, date: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 font-bold text-gray-500 hover:text-gray-700">Cancel</button>
              <button type="submit" className="flex-1 py-2 bg-[#FF4FA1] text-white font-bold rounded-xl shadow-lg shadow-[#FF4FA1]/30">Save Entry</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Bookings;