"use client";

import React, { useEffect, useState } from "react";
import { FiPlus, FiEye, FiMessageCircle, FiX, FiSearch, FiTrash2, FiUser, FiCalendar, FiHome, FiFilter, FiLoader, FiZap } from "react-icons/fi";
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

// Configuration for your building's rooms
const ALL_ROOMS = ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110"];

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

  // Calculate available rooms dynamically
  const occupiedRooms = students.map(s => s.room);
  const availableRooms = ALL_ROOMS.filter(room => !occupiedRooms.includes(room));

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
      toast.error("Critical: Could not reach database.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

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

  const autoAssignRoom = () => {
    if (availableRooms.length === 0) {
      toast.error("No rooms available!");
      return;
    }
    setNewStudent({ ...newStudent, room: availableRooms[0] });
    toast.success(`Assigned Room ${availableRooms[0]}`, { icon: '🪄' });
  };

  const handleAddStudent = async () => {
    const { name, room, checkIn } = newStudent;
    
    if (!name.trim() || !room || !checkIn) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "students"), {
        ...newStudent,
        createdAt: new Date().toISOString()
      });
      
      toast.success(`${name} registered to Room ${room}`);
      setShowAddModal(false);
      setNewStudent({ name: "", room: "", checkIn: "", status: "New" });
      await fetchStudents();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save. Check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Permanently remove ${name} from the system?`)) return;
    
    const loadingToast = toast.loading(`Deleting...`);
    try {
      await deleteDoc(doc(db, "students", id));
      toast.success("Record cleared", { id: loadingToast });
      fetchStudents();
    } catch (err) {
      toast.error("Delete failed. Refresh and try again.", { id: loadingToast });
    }
  };

  const closeModals = () => {
    if (submitting) return;
    setShowViewModal(false);
    setShowAddModal(false);
    setSelectedStudent(null);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4 text-[#FF4FA1]">
      <FiLoader className="animate-spin text-5xl" />
      <p className="font-black uppercase tracking-widest text-xs">Accessing Directory...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">Student Hub</h2>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">
            {availableRooms.length} Rooms Available
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-8 py-4 bg-[#FF4FA1] text-white rounded-2xl shadow-xl shadow-[#FF4FA1]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm"
        >
          <FiPlus strokeWidth={4} />
          New Entry
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-100/50 dark:shadow-none">
        <div className="relative flex-1">
          <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input 
            type="text"
            placeholder="Search by name or room..."
            className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl outline-none focus:ring-2 focus:ring-[#00CFFF] transition-all font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 rounded-2xl outline-none cursor-pointer font-black text-xs uppercase tracking-widest text-gray-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="New">New</option>
          <option value="Leaving Soon">Leaving Soon</option>
        </select>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredStudents.map((student) => (
          <div key={student.id} className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-[2rem] hover:border-[#00CFFF] transition-all duration-300">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-[#00CFFF]/10 flex items-center justify-center text-[#00CFFF]">
                <FiUser size={32} />
              </div>
              <div>
                <h3 className="font-black text-xl text-gray-900 dark:text-white">{student.name}</h3>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs font-black text-[#FF4FA1] uppercase tracking-tighter bg-[#FF4FA1]/10 px-2 py-1 rounded-md">Room {student.room}</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{student.status}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <button onClick={() => setSelectedStudent(student) || setShowViewModal(true)} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:bg-[#00CFFF] hover:text-white transition-all"><FiEye size={20}/></button>
              <button onClick={() => handleDelete(student.id, student.name)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><FiTrash2 size={20}/></button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-[3rem] p-10 max-w-md w-full shadow-2xl relative border border-white/10 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">Register Resident</h3>
              <button onClick={closeModals} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"><FiX size={24} /></button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleAddStudent(); }} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Full Name</label>
                <input
                  type="text" name="name" placeholder="Full name..."
                  value={newStudent.name} onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-[#FF4FA1] font-bold"
                  required disabled={submitting}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Room</label>
                  <div className="flex gap-2">
                    <select
                      name="room" value={newStudent.room} onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-[#FF4FA1] font-bold appearance-none cursor-pointer"
                      required disabled={submitting}
                    >
                      <option value="">Select...</option>
                      {availableRooms.map(r => <option key={r} value={r}>Room {r}</option>)}
                    </select>
                    <button 
                      type="button" onClick={autoAssignRoom}
                      className="p-4 bg-[#00CFFF]/10 text-[#00CFFF] rounded-2xl hover:bg-[#00CFFF] hover:text-white transition-all shadow-lg shadow-[#00CFFF]/20"
                      title="Auto-assign available room"
                    >
                      <FiZap />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Status</label>
                  <select
                    name="status" value={newStudent.status} onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-[#FF4FA1] font-bold"
                  >
                    <option value="New">New</option>
                    <option value="Active">Active</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Check-In Date</label>
                <input
                  type="date" name="checkIn"
                  value={newStudent.checkIn} onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-[#FF4FA1] font-bold"
                  required disabled={submitting}
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-[#FF4FA1] text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#FF4FA1]/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {submitting ? <FiLoader className="animate-spin" /> : "Confirm Registration"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;