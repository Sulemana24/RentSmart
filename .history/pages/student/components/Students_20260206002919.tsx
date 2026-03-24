"use client";

import React, { useEffect, useState, useMemo } from "react";
import { 
  FiPlus, FiEye, FiSearch, FiTrash2, FiUser, 
  FiCalendar, FiHome, FiLoader, FiZap, FiPhone, 
  FiX, FiCheckCircle, FiMessageCircle, FiChevronRight 
} from "react-icons/fi";
import { db } from "@/lib/firebase";
import { 
  collection, getDocs, addDoc, doc, 
  deleteDoc, query, orderBy, onSnapshot 
} from "firebase/firestore";
import toast from "react-hot-toast";

interface Student {
  id: string;
  name: string;
  phone: string;
  room: string;
  gender: string;
  checkIn: string;
  emergencyContact: string;
  status: "Active" | "New" | "Leaving Soon";
}

interface Room {
  id: string;
  roomNumber: string;
  status: "Available" | "Occupied" | "Maintenance";
}

const Students: React.FC = () => {
  // Data States
  const [students, setStudents] = useState<Student[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [roomSearch, setRoomSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [newStudent, setNewStudent] = useState({
    name: "",
    phone: "",
    room: "",
    gender: "Male",
    checkIn: new Date().toISOString().split('T')[0],
    emergencyContact: "",
    status: "New" as const,
  });

  // 1. Listen to Data from Firebase
  useEffect(() => {
    const qStudents = query(collection(db, "students"), orderBy("name", "asc"));
    const qRooms = query(collection(db, "rooms"), orderBy("roomNumber", "asc"));

    const unsubStudents = onSnapshot(qStudents, (snap) => {
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() } as Student)));
      setLoading(false);
    });

    const unsubRooms = onSnapshot(qRooms, (snap) => {
      setRooms(snap.docs.map(d => ({ id: d.id, ...d.data() } as Room)));
    });

    return () => { unsubStudents(); unsubRooms(); };
  }, []);

  // 2. High-Performance Filtering
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.room.includes(searchTerm);
      const matchesFilter = filterStatus === "All" || s.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [students, searchTerm, filterStatus]);

  // Logic: Only show available rooms that match search (limit to 12 for performance)
  const availableRoomsList = useMemo(() => {
    const occupied = students.map(s => s.room);
    return rooms
      .filter(r => !occupied.includes(r.roomNumber) && r.roomNumber.includes(roomSearch))
      .slice(0, 12);
  }, [rooms, students, roomSearch]);

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.room || !newStudent.phone) {
      return toast.error("Please fill in required fields!");
    }
    setSubmitting(true);
    try {
      await addDoc(collection(db, "students"), { ...newStudent, createdAt: new Date().toISOString() });
      toast.success(`${newStudent.name} has been enrolled!`);
      setShowAddModal(false);
      setNewStudent({ name: "", phone: "", room: "", gender: "Male", checkIn: new Date().toISOString().split('T')[0], emergencyContact: "", status: "New" });
    } catch (e) {
      toast.error("Database error. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <FiLoader className="animate-spin text-4xl text-[#FF4FA1] mb-4" />
      <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Syncing Database...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Resident Hub</h2>
          <p className="text-[#FF4FA1] font-bold text-sm uppercase tracking-widest mt-1">
            {rooms.length - students.length} Rooms Vacant • {students.length} Enrolled
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-[#FF4FA1] text-white px-8 py-4 rounded-2xl font-black uppercase text-xs shadow-lg shadow-[#FF4FA1]/20 hover:scale-105 active:scale-95 transition-all"
        >
          <FiPlus strokeWidth={3} /> Add New Student
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Residents", count: students.length, color: "text-[#00CFFF]", bg: "bg-[#00CFFF]/10" },
          { label: "New Entries", count: students.filter(s => s.status === "New").length, color: "text-[#FF4FA1]", bg: "bg-[#FF4FA1]/10" },
          { label: "Leaving Soon", count: students.filter(s => s.status === "Leaving Soon").length, color: "text-yellow-500", bg: "bg-yellow-500/10" },
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} p-6 rounded-3xl border border-white/20`}>
            <div className={`text-4xl font-black ${stat.color}`}>{stat.count}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00CFFF] transition-colors" />
          <input 
            type="text"
            placeholder="Search by name or room..."
            className="w-full pl-14 pr-6 py-4 bg-white dark:bg-gray-800 rounded-2xl border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-4 focus:ring-[#00CFFF]/20 outline-none font-bold transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="px-6 py-4 bg-white dark:bg-gray-800 rounded-2xl font-bold text-sm border-none ring-1 ring-gray-200 dark:ring-gray-700 outline-none cursor-pointer"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="New">New</option>
          <option value="Leaving Soon">Leaving Soon</option>
        </select>
      </div>

      {/* Student List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredStudents.map((student) => (
          <div 
            key={student.id}
            className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl hover:shadow-xl hover:shadow-[#00CFFF]/5 transition-all"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-gray-50 dark:bg-gray-700 rounded-2xl flex items-center justify-center text-[#FF4FA1] group-hover:bg-[#FF4FA1] group-hover:text-white transition-colors duration-500">
                <FiUser size={24} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">{student.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    student.status === "Active" ? "bg-green-100 text-green-600" : 
                    student.status === "New" ? "bg-blue-100 text-blue-600" : "bg-yellow-100 text-yellow-600"
                  }`}>
                    {student.status}
                  </span>
                </div>
                <div className="text-sm font-bold text-gray-400 mt-0.5 flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[#00CFFF]"><FiHome /> {student.room}</span>
                  <span className="flex items-center gap-1"><FiPhone /> {student.phone}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 md:mt-0">
              <button className="flex-1 md:flex-none px-6 py-3 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
                <FiEye /> View
              </button>
              <button className="p-3 text-gray-400 hover:text-red-500 transition-colors">
                <FiTrash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Resident Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black tracking-tight">Enroll Student</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Global Residence Management</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"><FiX /></button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleAddStudent(); }} className="p-8 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Full Name</label>
                  <input required type="text" className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl outline-none focus:ring-2 ring-[#FF4FA1] font-bold" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Mobile Phone</label>
                  <input required type="tel" className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl outline-none focus:ring-2 ring-[#FF4FA1] font-bold" value={newStudent.phone} onChange={e => setNewStudent({...newStudent, phone: e.target.value})} />
                </div>
              </div>

              <div className="p-6 bg-[#00CFFF]/5 rounded-3xl border border-[#00CFFF]/10 space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase text-[#00CFFF]">Room Assignment</label>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Synced with Firebase</span>
                </div>
                <input 
                  type="text" 
                  placeholder="Search available rooms (e.g. 505)..."
                  className="w-full px-5 py-3 bg-white dark:bg-gray-800 rounded-xl outline-none font-bold text-sm shadow-inner"
                  value={roomSearch} onChange={e => setRoomSearch(e.target.value)}
                />
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {availableRoomsList.map(r => (
                    <button 
                      key={r.id} type="button"
                      onClick={() => setNewStudent({...newStudent, room: r.roomNumber})}
                      className={`py-3 rounded-xl font-black text-xs transition-all ${newStudent.room === r.roomNumber ? 'bg-gray-900 text-white shadow-lg' : 'bg-white dark:bg-gray-800 hover:bg-[#00CFFF] hover:text-white'}`}
                    >
                      {r.roomNumber}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Check-in Date</label>
                  <input required type="date" className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold" value={newStudent.checkIn} onChange={e => setNewStudent({...newStudent, checkIn: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Status</label>
                  <select className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold" value={newStudent.status} onChange={e => setNewStudent({...newStudent, status: e.target.value as any})}>
                    <option value="New">New</option>
                    <option value="Active">Active</option>
                    <option value="Leaving Soon">Leaving Soon</option>
                  </select>
                </div>
              </div>

              <button 
                disabled={submitting}
                className="w-full py-6 bg-[#FF4FA1] text-white rounded-[30px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#FF4FA1]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {submitting ? <FiLoader className="animate-spin" /> : "Complete Registration"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;