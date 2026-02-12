"use client";

import React, { useEffect, useState } from "react";
import { FiPlus, FiEye, FiMessageCircle, FiX, FiSearch, FiTrash2, FiUser, FiCalendar, FiHome, FiFilter, FiLoader } from "react-icons/fi";
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

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // New state for button loading
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newStudent, setNewStudent] = useState({
    name: "",
    room: "",
    checkIn: "",
    status: "New",
  });

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
      toast.error("Failed to load student directory");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Search and Filter Logic
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

  const handleAddStudent = async () => {
    const { name, room, checkIn } = newStudent;
    
    // Validation
    if (!name.trim() || !room.trim() || !checkIn) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "students"), {
        ...newStudent,
        createdAt: new Date().toISOString()
      });
      
      toast.success(`${name} registered successfully!`);
      setShowAddModal(false);
      
      // Reset Form
      setNewStudent({ name: "", room: "", checkIn: "", status: "New" });
      
      // Refresh list
      await fetchStudents();
    } catch (err) {
      console.error(err);
      toast.error("Cloud Error: Could not save student data.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove ${name}?`)) return;
    
    const loadingToast = toast.loading(`Deleting ${name}...`);
    try {
      await deleteDoc(doc(db, "students", id));
      toast.success("Student record deleted", { id: loadingToast });
      fetchStudents();
    } catch (err) {
      toast.error("Failed to delete record", { id: loadingToast });
    }
  };

  const handleView = (student: Student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const closeModals = () => {
    if (submitting) return; // Prevent closing while saving
    setShowViewModal(false);
    setShowAddModal(false);
    setSelectedStudent(null);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4FA1]"></div>
      <p className="text-gray-500 font-medium animate-pulse">Syncing Database...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Student Directory</h2>
          <p className="text-sm text-gray-500 font-medium">Manage and monitor resident occupancy</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-[#FF4FA1] text-white rounded-2xl shadow-lg shadow-[#FF4FA1]/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 font-bold"
        >
          <FiPlus strokeWidth={3} className="text-xl" />
          Register Student
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Residents", count: students.length, color: "text-[#00CFFF]", bg: "bg-[#00CFFF]/10" },
          { label: "New Entries", count: students.filter(s => s.status === "New").length, color: "text-[#FF4FA1]", bg: "bg-[#FF4FA1]/10" },
          { label: "Leaving Soon", count: students.filter(s => s.status === "Leaving Soon").length, color: "text-yellow-500", bg: "bg-yellow-500/10" },
        ].map((stat, idx) => (
          <div key={idx} className={`${stat.bg} rounded-3xl p-6 border border-white/5 shadow-sm`}>
            <div className={`text-4xl font-black ${stat.color}`}>{stat.count}</div>
            <div className="text-xs font-black uppercase tracking-widest text-gray-500 mt-2">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input 
            type="text"
            placeholder="Search by name or room number..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#00CFFF] transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 px-2 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <FiFilter className="text-gray-400 ml-2" />
          <select 
            className="bg-transparent px-4 py-3 rounded-xl outline-none cursor-pointer font-bold text-sm text-gray-600 dark:text-gray-300"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="New">New</option>
            <option value="Leaving Soon">Leaving Soon</option>
          </select>
        </div>
      </div>

      {/* Student List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredStudents.length > 0 ? filteredStudents.map((student) => (
          <div
            key={student.id}
            className="group flex flex-col md:flex-row md:items-center justify-between p-5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none transition-all duration-300"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-[#FF4FA1] border border-gray-100 dark:border-gray-600 group-hover:bg-[#FF4FA1] group-hover:text-white transition-colors duration-300">
                <FiUser size={28} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-black text-gray-900 dark:text-white text-lg">{student.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    student.status === "Active" ? "bg-green-100 text-green-600" :
                    student.status === "New" ? "bg-[#00CFFF]/10 text-[#00CFFF]" : "bg-yellow-100 text-yellow-600"
                  }`}>
                    {student.status}
                  </span>
                </div>
                <div className="flex items-center gap-5 mt-1 text-xs text-gray-500 font-bold uppercase tracking-tight">
                  <span className="flex items-center gap-1.5"><FiHome className="text-[#00CFFF]" /> Room {student.room}</span>
                  <span className="flex items-center gap-1.5"><FiCalendar className="text-[#00CFFF]" /> Joined {student.checkIn}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-5 md:mt-0">
              <button onClick={() => handleView(student)} title="View Profile" className="p-3 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-2xl hover:bg-[#00CFFF] hover:text-white transition-all">
                <FiEye size={20} />
              </button>
              <button onClick={() => toast.success("Messaging system loading...")} className="p-3 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-2xl hover:bg-[#00CFFF] hover:text-white transition-all">
                <FiMessageCircle size={20} />
              </button>
              <button onClick={() => handleDelete(student.id, student.name)} title="Delete Record" className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                <FiTrash2 size={20} />
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-32 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <FiSearch className="mx-auto text-4xl text-gray-300 mb-4" />
            <p className="text-gray-500 font-bold italic">No matching student records found.</p>
          </div>
        )}
      </div>

      {/* View Student Modal */}
      {showViewModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-[40px] p-10 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-white/20">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-[#FF4FA1]/10 rounded-[32px] flex items-center justify-center mx-auto mb-6 text-[#FF4FA1] border-2 border-[#FF4FA1]/20">
                <FiUser size={48} />
              </div>
              <h3 className="text-3xl font-black dark:text-white tracking-tight">{selectedStudent.name}</h3>
              <p className="text-[#00CFFF] font-black uppercase tracking-widest text-sm mt-1">Room {selectedStudent.room}</p>
            </div>
            
            <div className="space-y-5 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl mb-8">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase text-gray-400">Current Status</span>
                <span className="font-bold text-gray-900 dark:text-white">{selectedStudent.status}</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-5">
                <span className="text-xs font-black uppercase text-gray-400">Check-In Date</span>
                <span className="font-bold text-gray-900 dark:text-white">{selectedStudent.checkIn}</span>
              </div>
            </div>

            <button onClick={closeModals} className="w-full py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
              Close Profile
            </button>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-[32px] p-8 max-w-md w-full shadow-2xl relative border border-white/20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">New Registration</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Enrollment Form</p>
              </div>
              <button onClick={closeModals} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-colors">
                <FiX size={24} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleAddStudent(); }} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Student Full Name</label>
                <input
                  type="text" name="name" placeholder="Enter name"
                  value={newStudent.name} onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-2xl outline-none focus:border-[#FF4FA1] transition-all font-bold"
                  required disabled={submitting}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Room Assignment</label>
                  <input
                    type="text" name="room" placeholder="Ex: 104"
                    value={newStudent.room} onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-2xl outline-none focus:border-[#FF4FA1] transition-all font-bold"
                    required disabled={submitting}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Status</label>
                  <select
                    name="status" value={newStudent.status} onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-2xl outline-none focus:border-[#FF4FA1] transition-all font-bold appearance-none"
                    disabled={submitting}
                  >
                    <option value="New">New</option>
                    <option value="Active">Active</option>
                    <option value="Leaving Soon">Leaving Soon</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Check-In Date</label>
                <input
                  type="date" name="checkIn"
                  value={newStudent.checkIn} onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-transparent rounded-2xl outline-none focus:border-[#FF4FA1] transition-all font-bold"
                  required disabled={submitting}
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-[#FF4FA1] text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#FF4FA1]/30 mt-4 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-3"
              >
                {submitting ? (
                  <>
                    <FiLoader className="animate-spin text-xl" />
                    Processing...
                  </>
                ) : "Confirm Registration"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;