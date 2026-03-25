"use client";

import { useEffect, useState, useMemo } from "react";
import {
  collection, getDocs, doc, updateDoc, addDoc, deleteDoc,
  query, orderBy, limit, startAfter, DocumentData,
  QueryDocumentSnapshot, where, serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  FiPlus, FiCheck, FiX, FiEdit2, FiSearch, 
  FiTrash2, FiLoader, FiCalendar, FiUser, FiHash, FiAlertCircle, FiArrowRight 
} from "react-icons/fi";
import { format, differenceInDays, parseISO } from "date-fns";

interface Booking {
  id: string;
  type: string;
  student: string;
  studentEmail: string;
  roomNumber: string;
  startDate: string;
  endDate: string;
  duration: string;
  status: "Pending" | "Confirmed" | "Rejected" | "Approved";
  notes?: string;
  lastUpdated?: any;
}

const PAGE_SIZE = 6;
const bookingTypes = ["Room Booking", "Room Transfer", "Extension Request"];
const statusOptions = ["Pending", "Confirmed", "Rejected", "Approved"];

const Bookings: React.FC = () => {
  // --- STATE DEFINITIONS (Fixed missing states) ---
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  const initialFormState = {
    type: bookingTypes[0],
    student: "",
    studentEmail: "",
    roomNumber: "",
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
    duration: "0 days",
    status: "Pending" as Booking["status"],
    notes: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- DURATION CALCULATION ---
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const diff = differenceInDays(parseISO(formData.endDate), parseISO(formData.startDate));
      setFormData(prev => ({ ...prev, duration: `${diff >= 0 ? diff : 0} days` }));
    }
  }, [formData.startDate, formData.endDate]);

  // --- FIREBASE FETCH ---
  const fetchBookings = async (loadMore = false) => {
    try {
      if (loadMore) setLoadingMore(true);
      else { setLoading(true); setLastDoc(null); }
      
      const bookingsRef = collection(db, "bookings");
      let constraints: any[] = [orderBy("startDate", "desc"), limit(PAGE_SIZE)];
      if (filterStatus !== "All") constraints.push(where("status", "==", filterStatus));
      if (loadMore && lastDoc) constraints.push(startAfter(lastDoc));

      const q = query(bookingsRef, ...constraints);
      const snapshot = await getDocs(q);
      const fetchedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[];

      setBookings(prev => loadMore ? [...prev, ...fetchedData] : fetchedData);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [filterStatus]);

  const filteredList = useMemo(() => {
    return bookings.filter(b => 
      b.student.toLowerCase().includes(searchTerm.toLowerCase()) || 
      b.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [bookings, searchTerm]);

  // --- AVAILABILITY LOGIC ---
  const checkRoomAvailability = async (roomNo: string, start: string, end: string, excludeId?: string | null) => {
    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, where("roomNumber", "==", roomNo), where("status", "in", ["Confirmed", "Approved"]));
    const snapshot = await getDocs(q);
    return !snapshot.docs.some(doc => doc.id !== excludeId && start < doc.data().endDate && end > doc.data().startDate);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAvailabilityError(null);

    try {
      const isAvailable = await checkRoomAvailability(formData.roomNumber, formData.startDate, formData.endDate, editingId);
      if (!isAvailable) {
        setAvailabilityError(`Room ${formData.roomNumber} is unavailable for these dates.`);
        setIsSubmitting(false);
        return;
      }

      const { id, ...dataToSave } = formData as any;
      const submissionData = { ...dataToSave, lastUpdated: serverTimestamp() };

      if (editingId) {
        await updateDoc(doc(db, "bookings", editingId), submissionData);
      } else {
        await addDoc(collection(db, "bookings"), submissionData);
      }
      
      fetchBookings(); // Refresh list
      setIsModalOpen(false);
      setEditingId(null);
    } catch (error) {
      alert("Error saving data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const initiateSpecialRequest = (originalBooking: Booking, type: "Extension Request" | "Room Transfer") => {
    setEditingId(originalBooking.id);
    setFormData({ ...originalBooking, type, status: "Pending" });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete record?")) return;
    await deleteDoc(doc(db, "bookings", id));
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#00CFFF]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => { setEditingId(null); setFormData(initialFormState); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF4FA1] to-[#FF7EB3] text-white rounded-2xl font-bold shadow-lg"
        >
          <FiPlus /> New Booking
        </button>
      </div>

      {/* Main Table Content */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-xl">
        {loading && !loadingMore ? (
          <div className="p-20 flex flex-col items-center justify-center text-gray-400 gap-4">
            <FiLoader className="animate-spin text-4xl text-[#00CFFF]" />
            <p className="font-bold tracking-widest uppercase text-xs">Loading Bookings...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-gray-50 dark:bg-gray-900/50 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Room & Type</th>
                  <th className="px-6 py-4">Timeline</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {filteredList.map((booking) => (
                  <tr key={booking.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold">{booking.student}</p>
                      <p className="text-xs text-gray-400">{booking.studentEmail}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-[10px] font-bold">#{booking.roomNumber}</span>
                        <span className="text-[10px] font-black uppercase text-blue-500">{booking.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold">{booking.startDate} → {booking.endDate}</p>
                      <p className="text-[10px] text-[#00CFFF] uppercase font-black">{booking.duration}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-green-100 text-green-600">
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button title="Extend" onClick={() => initiateSpecialRequest(booking, "Extension Request")} className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg"><FiCalendar /></button>
                        <button title="Transfer" onClick={() => initiateSpecialRequest(booking, "Room Transfer")} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><FiArrowRight /></button>
                        <button onClick={() => handleDelete(booking.id)} className="p-2 text-gray-300 hover:text-red-500 rounded-lg"><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal - Simplified for brevity */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-xl font-black">{editingId ? `Update ${formData.type}` : "New Booking"}</h3>
            
            {availabilityError && <p className="text-red-500 text-xs font-bold">{availabilityError}</p>}
            
            <input required placeholder="Student Name" value={formData.student} onChange={e => setFormData({...formData, student: e.target.value})} className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-900 outline-none" />
            <input required placeholder="Room" value={formData.roomNumber} onChange={e => setFormData({...formData, roomNumber: e.target.value})} className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-900 outline-none" />
            
            <div className="grid grid-cols-2 gap-2">
                <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="p-3 rounded-xl bg-gray-100 dark:bg-gray-900" />
                <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="p-3 rounded-xl bg-gray-100 dark:bg-gray-900" />
            </div>

            <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-[#00CFFF] text-white font-black rounded-xl">
              {isSubmitting ? "Processing..." : "Confirm"}
            </button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="w-full text-gray-400 text-sm">Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Bookings;