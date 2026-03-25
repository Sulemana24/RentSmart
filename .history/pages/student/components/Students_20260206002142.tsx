"use client";

import React, { useEffect, useState, useMemo } from "react";
import { FiPlus, FiEye, FiX, FiSearch, FiTrash2, FiUser, FiCalendar, FiHome, FiFilter, FiLoader, FiZap, FiCheckCircle, FiPhone, FiInfo } from "react-icons/fi";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, doc, deleteDoc, query, orderBy } from "firebase/firestore";
import toast from "react-hot-toast";

interface Student {
  id: string;
  name: string;
  phone: string;
  room: string;
  gender: string;
  checkIn: string;
  emergencyContact: string;
  status: "Active" | "New" | "Leaving Soon" | string;
}

// Generating 1000 rooms for the inventory (e.g., Floors 1-10, 100 rooms each)
const ROOM_INVENTORY = Array.from({ length: 1000 }, (_, i) => {
  const floor = Math.floor(i / 100) + 1;
  const roomNum = (i % 100) + 1;
  return `${floor}${roomNum.toString().padStart(2, '0')}`;
});

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); 
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Room Picker States
  const [roomSearch, setRoomSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [newStudent, setNewStudent] = useState({
    name: "",
    phone: "",
    room: "",
    gender: "Other",
    checkIn: new Date().toISOString().split('T')[0],
    emergencyContact: "",
    status: "New",
  });

  const occupiedRooms = useMemo(() => students.map((s) => s.room), [students]);
  
  // High-performance filter for the 1000 rooms
  const availableRoomsList = useMemo(() => {
    return ROOM_INVENTORY.filter(r => 
      !occupiedRooms.includes(r) && 
      r.includes(roomSearch)
    ).slice(0, 12); // Only show top 12 matches for UI cleanliness
  }, [occupiedRooms, roomSearch]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "students"), orderBy("room", "asc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Student, "id">),
      }));
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      toast.error("Sync Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  useEffect(() => {
    let result = students;
    if (searchTerm) {
      result = result.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.room.includes(searchTerm)
      );
    }
    if (filterStatus !== "All") result = result.filter((s) => s.status === filterStatus);
    setFilteredStudents(result);
  }, [searchTerm, filterStatus, students]);

  const handleAutoAssign = () => {
    const firstFree = ROOM_INVENTORY.find(r => !occupiedRooms.includes(r));
    if (firstFree) {
      setNewStudent({ ...newStudent, room: firstFree });
      toast.success(`Assigned Room ${firstFree}`);
    }
  };

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.room || !newStudent.phone) {
      toast.error("Please fill essential fields");
      return;
    }
    setSubmitting(true);
    try {
      await addDoc(collection(db, "students"), { ...newStudent, createdAt: new Date().toISOString() });
      toast.success("Resident added successfully!");
      setShowAddModal(false);
      setNewStudent({ name: "", phone: "", room: "", gender: "Other", checkIn: "", emergencyContact: "", status: "New" });
      fetchStudents();
    } catch (err) {
      toast.error("Registration Error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 p-4 md:p-10 space-y-8 font-sans">
      
      {/* Header - Adaptive Layout */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-6 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Management Console</h1>
          <div className="flex items-center gap-3 text-sm font-bold text-gray-400 uppercase tracking-widest">
            <span className="flex items-center gap-1 text-[#FF4FA1]"><FiHome /> {ROOM_INVENTORY.length - occupiedRooms.length} Vacant</span>
            <span>•</span>
            <span className="text-[#00CFFF]">{students.length} Total Residents</span>
          </div>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-full lg:w-auto px-8 py-4 bg-gray-900 dark:bg-[#FF4FA1] text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl"
        >
          <FiPlus strokeWidth={3} /> Register New Resident
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 relative group">
          <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF4FA1] transition-colors" />
          <input 
            type="text" placeholder="Search by name, room number..."
            className="w-full pl-14 pr-6 py-5 bg-white dark:bg-gray-900 rounded-2xl outline-none shadow-sm focus:ring-4 ring-[#FF4FA1]/5 font-bold transition-all border border-gray-50 dark:border-gray-800"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="w-full px-6 py-5 bg-white dark:bg-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm outline-none border border-gray-50 dark:border-gray-800 cursor-pointer"
          value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="New">New</option>
          <option value="Leaving Soon">Leaving Soon</option>
        </select>
      </div>

      {/* Responsive Grid/List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
           <div className="col-span-full py-20 flex flex-col items-center opacity-50"><FiLoader className="animate-spin text-4xl mb-4" /><p className="font-black uppercase tracking-widest text-xs">Loading Secure Database...</p></div>
        ) : filteredStudents.map((student) => (
          <div key={student.id} className="bg-white dark:bg-gray-900 p-6 rounded-[32px] border border-gray-50 dark:border-gray-800 hover:shadow-2xl hover:shadow-[#00CFFF]/5 transition-all group relative overflow-hidden">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-[#FF4FA1] font-black group-hover:bg-[#FF4FA1] group-hover:text-white transition-all duration-500">
                  <FiUser size={24} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-gray-900 dark:text-white truncate max-w-[150px]">{student.name}</h3>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Room {student.room}</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${student.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                {student.status}
              </span>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-xs font-bold text-gray-500"><FiPhone className="text-[#00CFFF]" /> {student.phone}</div>
              <div className="flex items-center gap-3 text-xs font-bold text-gray-500"><FiCalendar className="text-[#00CFFF]" /> Joined {student.checkIn}</div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">Details</button>
              <button onClick={() => handleDelete(student.id, student.name)} className="p-3 text-gray-300 hover:text-red-500 transition-colors"><FiTrash2 /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Registration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-in slide-in-from-bottom-10">
            {/* Modal Header */}
            <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
              <div>
                <h2 className="text-2xl font-black tracking-tight">Resident Onboarding</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Global Property Management</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-4 hover:bg-white dark:hover:bg-gray-700 rounded-2xl transition-all shadow-sm"><FiX /></button>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleAddStudent(); }} className="p-8 overflow-y-auto space-y-8">
              
              {/* Personal Info Group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Full Name</label>
                  <input required type="text" value={newStudent.name} onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl outline-none focus:ring-2 ring-[#FF4FA1] font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Mobile Number</label>
                  <input required type="tel" value={newStudent.phone} onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})} className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl outline-none focus:ring-2 ring-[#FF4FA1] font-bold" />
                </div>
              </div>

              {/* Room Selection - Searchable */}
              <div className="p-6 bg-[#00CFFF]/5 rounded-[32px] border border-[#00CFFF]/10 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase text-[#00CFFF]">Room Assignment (1 of 1000)</label>
                  <button type="button" onClick={handleAutoAssign} className="text-[10px] font-black text-[#FF4FA1] underline underline-offset-4 uppercase italic">Magic Assign</button>
                </div>
                
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" placeholder="Type room number (e.g. 505)..."
                    className="w-full pl-12 pr-6 py-4 bg-white dark:bg-gray-800 rounded-xl outline-none font-bold shadow-inner"
                    value={roomSearch} onChange={(e) => setRoomSearch(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {availableRoomsList.map(r => (
                    <button 
                      key={r} type="button" 
                      onClick={() => setNewStudent({...newStudent, room: r})}
                      className={`py-3 rounded-xl font-black text-xs transition-all ${newStudent.room === r ? 'bg-gray-900 text-white scale-110 shadow-lg' : 'bg-white dark:bg-gray-800 hover:bg-gray-100'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                {roomSearch && availableRoomsList.length === 0 && <p className="text-[10px] text-center font-bold text-red-400 uppercase">No matching vacant rooms</p>}
              </div>

              {/* Secondary Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Gender</label>
                  <select value={newStudent.gender} onChange={(e) => setNewStudent({...newStudent, gender: e.target.value})} className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Emergency Contact (Optional)</label>
                  <input type="text" value={newStudent.emergencyContact} onChange={(e) => setNewStudent({...newStudent, emergencyContact: e.target.value})} placeholder="Parent/Guardian Name" className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold" />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                disabled={submitting}
                className="w-full py-6 bg-[#FF4FA1] text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#FF4FA1]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
              >
                {submitting ? <FiLoader className="animate-spin text-xl" /> : "Finalize Registration"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="text-center pb-10">
         <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em]">Campus Housing System v2.0 • 2026 Edition</p>
      </div>
    </div>
  );
};

export default Students;