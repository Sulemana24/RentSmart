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
  FiTrash2, FiLoader, FiCalendar, FiUser, FiHash, FiAlertCircle 
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
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
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

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const diff = differenceInDays(parseISO(formData.endDate), parseISO(formData.startDate));
      setFormData(prev => ({ ...prev, duration: `${diff >= 0 ? diff : 0} days` }));
      setAvailabilityError(null); // Clear error when dates change
    }
  }, [formData.startDate, formData.endDate, formData.roomNumber]);

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
      console.error(error);
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

  // --- THE AVAILABILITY FIX ---
  const checkRoomAvailability = async () => {
    const bookingsRef = collection(db, "bookings");
    // Query for the same room
    const q = query(
      bookingsRef, 
      where("roomNumber", "==", formData.roomNumber),
      where("status", "in", ["Confirmed", "Approved", "Pending"]) // Only check active bookings
    );
    
    const snapshot = await getDocs(q);
    const conflicts = snapshot.docs.filter(doc => {
      if (doc.id === editingId) return false; // Ignore current record if editing
      const data = doc.data();
      // Overlap Logic: (StartA < EndB) && (EndA > StartB)
      return formData.startDate < data.endDate && formData.endDate > data.startDate;
    });

    return conflicts.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAvailabilityError(null);

    try {
      const isAvailable = await checkRoomAvailability();
      
      if (!isAvailable) {
        setAvailabilityError(`Room ${formData.roomNumber} is already occupied for these dates.`);
        setIsSubmitting(false);
        return;
      }

      const submissionData = { ...formData, lastUpdated: serverTimestamp() };
      if (editingId) {
        await updateDoc(doc(db, "bookings", editingId), submissionData);
        setBookings(prev => prev.map(b => b.id === editingId ? { ...b, ...submissionData } : b));
      } else {
        const docRef = await addDoc(collection(db, "bookings"), submissionData);
        setBookings(prev => [{ id: docRef.id, ...submissionData } as Booking, ...prev]);
      }
      setIsModalOpen(false);
      setEditingId(null);
    } catch (error) {
      alert("Error saving booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: Booking["status"]) => {
    setUpdatingId(id);
    try {
      await updateDoc(doc(db, "bookings", id), { status: newStatus, lastUpdated: serverTimestamp() });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } finally { setUpdatingId(null); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete record?")) return;
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
            placeholder="Search student or email..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-[#00CFFF]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-sm font-bold outline-none"
          >
            <option value="All">All Status</option>
            {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <button
            onClick={() => { setEditingId(null); setFormData(initialFormState); setIsModalOpen(true); setAvailabilityError(null); }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF4FA1] to-[#FF7EB3] text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all"
          >
            <FiPlus /> <span>New</span>
          </button>
        </div>
      </div>

      {/* Main Table Content (Responsiveness Handled) */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-xl">
        {loading && !loadingMore ? (
          <div className="p-20 flex flex-col items-center justify-center text-gray-400 gap-4">
            <FiLoader className="animate-spin text-4xl text-[#00CFFF]" />
            <p className="font-bold tracking-widest uppercase text-xs">Syncing Cloud Data</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
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
                  <tr key={booking.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 dark:text-white">{booking.student}</p>
                      <p className="text-xs text-gray-400">{booking.studentEmail}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-[10px] font-bold">#{booking.roomNumber}</span>
                        <p className="text-sm font-medium">{booking.type}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{booking.startDate} → {booking.endDate}</p>
                      <p className="text-[10px] text-[#00CFFF] uppercase font-black">{booking.duration}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        ["Confirmed", "Approved"].includes(booking.status) ? "bg-green-100 text-green-600" :
                        booking.status === "Pending" ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setEditingId(booking.id); setFormData(booking as any); setIsModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><FiEdit2 size={16}/></button>
                        <button onClick={() => handleDelete(booking.id)} className="p-2 text-gray-300 hover:text-red-500 rounded-lg transition-colors"><FiTrash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form with Availability Error Handling */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md flex items-end md:items-center justify-center z-50 p-0 md:p-4">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-t-3xl md:rounded-3xl p-6 md:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4">
              <h3 className="text-xl font-black">{editingId ? "Update Booking" : "New Booking"}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full"><FiX /></button>
            </div>

            {availabilityError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 animate-pulse">
                <FiAlertCircle className="shrink-0" size={20} />
                <p className="text-xs font-bold">{availabilityError}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Student Name</label>
                <div className="relative mt-1">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required value={formData.student} onChange={e => setFormData({...formData, student: e.target.value})} className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none outline-none focus:ring-2 focus:ring-[#FF4FA1]" placeholder="John Doe" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Room Number</label>
                <div className="relative mt-1">
                  <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required value={formData.roomNumber} onChange={e => setFormData({...formData, roomNumber: e.target.value})} className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none outline-none focus:ring-2 focus:ring-[#FF4FA1]" placeholder="e.g. 101A" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Booking Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full mt-1 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none outline-none focus:ring-2 focus:ring-[#FF4FA1]">
                  {bookingTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Start Date</label>
                <input type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full mt-1 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none outline-none focus:ring-2 focus:ring-[#FF4FA1]" />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">End Date</label>
                <input type="date" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full mt-1 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none outline-none focus:ring-2 focus:ring-[#FF4FA1]" />
              </div>
            </div>

            <div className="bg-[#00CFFF]/5 p-4 rounded-2xl flex items-center justify-between border border-[#00CFFF]/20">
              <div className="flex items-center gap-2 text-[#00CFFF]">
                <FiCalendar /> <span className="text-xs font-black uppercase">Stay Duration</span>
              </div>
              <span className="font-black text-lg text-[#00CFFF]">{formData.duration}</span>
            </div>

            <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-gradient-to-r from-[#FF4FA1] to-[#FF7EB3] text-white font-black rounded-2xl shadow-xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {isSubmitting ? <FiLoader className="animate-spin" /> : editingId ? "Update Booking" : "Confirm Booking"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Bookings;