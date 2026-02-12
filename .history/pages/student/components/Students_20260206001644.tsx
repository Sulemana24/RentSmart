"use client";

import React, { useEffect, useState } from "react";
import { FiPlus, FiEye, FiMessageCircle, FiX, FiSearch, FiTrash2, FiUser, FiCalendar, FiHome, FiFilter, FiLoader, FiZap, FiCheckCircle } from "react-icons/fi";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";

interface Student {
  id: string;
  name: string;
  room: string;
  checkIn: string;
  status: "Active" | "New" | "Leaving Soon" | string;
}

const ROOM_INVENTORY = ["101", "102", "103", "104", "105", "201", "202", "203", "204", "205"];

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); 
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newStudent, setNewStudent] = useState({
    name: "",
    room: "",
    checkIn: "",
    status: "New",
  });

  const occupiedRooms = students.map((s) => s.room);
  const availableRooms = ROOM_INVENTORY.filter((r) => !occupiedRooms.includes(r));

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "students"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Student, "id">),
      }));
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      toast.error("Database Sync Failed.");
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
        s.room.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterStatus !== "All") {
      result = result.filter((s) => s.status === filterStatus);
    }
    setFilteredStudents(result);
  }, [searchTerm, filterStatus, students]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const handleAutoAssign = () => {
    if (availableRooms.length === 0) {
      toast.error("Fully booked!");
      return;
    }
    setNewStudent({ ...newStudent, room: availableRooms[0] });
    toast.success(`Room ${availableRooms[0]} assigned!`, { icon: '✨' });
  };

  const handleAddStudent = async () => {
    const { name, room, checkIn } = newStudent;
    if (!name.trim() || !room || !checkIn) {
      toast.error("Complete all fields, please!");
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "students"), {
        ...newStudent,
        createdAt: new Date().toISOString()
      });
      toast.success("Welcome to the family!");
      setShowAddModal(false);
      setNewStudent({ name: "", room: "", checkIn: "", status: "New" });
      await fetchStudents();
    } catch (err) {
      toast.error("Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Remove ${name}?`)) return;
    try {
      await deleteDoc(doc(db, "students", id));
      toast.success("Record cleared");
      fetchStudents();
    } catch (err) {
      toast.error("Delete failed.");
    }
  };

  const closeModals = () => {
    if (submitting) return; 
    setShowViewModal(false);
    setShowAddModal(false);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4FA1]"></div>
      <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Syncing Students...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Resident List</h2>
          <p className="text-sm text-[#FF4FA1] font-bold uppercase tracking-wider">{availableRooms.length} Spaces Left</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-8 py-4 bg-[#FF4FA1] text-white rounded-[24px] shadow-xl shadow-[#FF4FA1]/20 hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-2 font-black uppercase text-xs"
        >
          <FiPlus strokeWidth={4} className="text-lg" />
          Add Resident
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Residents", count: students.length, color: "text-[#00CFFF]", bg: "bg-[#00CFFF]/5" },
          { label: "Available", count: availableRooms.length, color: "text-[#FF4FA1]", bg: "bg-[#FF4FA1]/5" },
          { label: "Urgent", count: students.filter(s => s.status === "Leaving Soon").length, color: "text-amber-500", bg: "bg-amber-500/5" },
        ].map((stat, idx) => (
          <div key={idx} className={`${stat.bg} rounded-[32px] p-8 border border-white/10`}>
            <div className={`text-5xl font-black ${stat.color}`}>{stat.count}</div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-2">{stat.label}</div>
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
            className="w-full pl-14 pr-6 py-4 bg-white dark:bg-gray-800 rounded-[22px] outline-none shadow-sm focus:ring-4 ring-[#00CFFF]/10 transition-all font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="px-6 py-4 bg-white dark:bg-gray-800 rounded-[22px] outline-none font-bold text-sm shadow-sm cursor-pointer hover:bg-gray-50"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="New">New</option>
          <option value="Leaving Soon">Leaving Soon</option>
        </select>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredStudents.map((student) => (
          <div key={student.id} className="group flex flex-col md:flex-row items-center justify-between p-6 bg-white dark:bg-gray-800 rounded-[30px] border border-gray-50 dark:border-gray-700 hover:shadow-2xl hover:shadow-[#00CFFF]/5 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[22px] bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-[#FF4FA1] group-hover:bg-[#FF4FA1] group-hover:text-white transition-all duration-500">
                <FiUser size={30} />
              </div>
              <div>
                <h3 className="font-black text-xl text-gray-900 dark:text-white">{student.name}</h3>
                <div className="flex gap-4 mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <span className="flex items-center gap-1"><FiHome className="text-[#00CFFF]" /> {student.room}</span>
                  <span className="flex items-center gap-1"><FiCalendar className="text-[#00CFFF]" /> {student.checkIn}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
               <button onClick={() => handleDelete(student.id, student.name)} className="p-4 text-gray-300 hover:text-red-500 transition-colors"><FiTrash2 size={20} /></button>
               <button onClick={() => { setSelectedStudent(student); setShowViewModal(true); }} className="px-6 py-3 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-tighter">View Profile</button>
            </div>
          </div>
        ))}
      </div>

      {/* Cute Registration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xl flex items-center justify-center z-[100] p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-[40px] p-8 md:p-10 max-w-xl w-full shadow-2xl relative animate-in zoom-in-95">
            <button onClick={closeModals} className="absolute right-8 top-8 p-3 bg-gray-50 rounded-full hover:rotate-90 transition-all"><FiX /></button>
            
            <div className="mb-10 text-center md:text-left">
              <span className="px-4 py-1.5 bg-[#FF4FA1]/10 text-[#FF4FA1] rounded-full text-[10px] font-black uppercase tracking-widest">Enrollment 2026</span>
              <h3 className="text-4xl font-black mt-3 tracking-tight">New Student</h3>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleAddStudent(); }} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Full Legal Name</label>
                <input
                  type="text" name="name" placeholder="Johnny Appleseed"
                  value={newStudent.name} onChange={handleInputChange}
                  className="w-full px-6 py-5 bg-gray-50 dark:bg-gray-800 rounded-[24px] outline-none focus:ring-4 ring-[#FF4FA1]/10 font-bold text-lg transition-all"
                  required
                />
              </div>

              {/* Room Map Area */}
              <div className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">Select Available Room</label>
                  <button type="button" onClick={handleAutoAssign} className="flex items-center gap-1.5 text-[#00CFFF] font-black text-[10px] uppercase group">
                    <FiZap className="group-hover:animate-bounce" /> Auto-Assign
                  </button>
                </div>
                
                <div className="grid grid-cols-5 gap-3">
                  {ROOM_INVENTORY.map((r) => {
                    const isOccupied = occupiedRooms.includes(r);
                    const isSelected = newStudent.room === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        disabled={isOccupied}
                        onClick={() => setNewStudent({...newStudent, room: r})}
                        className={`py-3 rounded-2xl font-black text-xs transition-all flex flex-col items-center justify-center gap-1
                          ${isOccupied ? 'opacity-30 cursor-not-allowed line-through' : 
                            isSelected ? 'bg-[#FF4FA1] text-white shadow-lg scale-110' : 'bg-white dark:bg-gray-700 hover:border-[#00CFFF] border-2 border-transparent'}
                        `}
                      >
                        {r}
                        {isSelected && <FiCheckCircle size={10} />}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400">Check-In</label>
                  <input type="date" name="checkIn" value={newStudent.checkIn} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400">Status</label>
                  <select name="status" value={newStudent.status} onChange={handleInputChange} className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold appearance-none">
                    <option value="New">New</option>
                    <option value="Active">Active</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-[#FF4FA1] py-6 rounded-[28px] text-white font-black uppercase tracking-widest shadow-2xl shadow-[#FF4FA1]/30 hover:translate-y-[-2px] active:translate-y-0 transition-all flex items-center justify-center gap-4 text-sm"
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