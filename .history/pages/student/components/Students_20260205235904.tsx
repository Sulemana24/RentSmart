"use client";

import React, { useEffect, useState } from "react";
import { FiPlus, FiEye, FiMessageCircle, FiX, FiSearch, FiTrash2, FiUser, FiCalendar, FiHome, FiFilter } from "react-icons/fi";
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
      toast.error("Failed to load students");
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
    if (!name || !room || !checkIn) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      await addDoc(collection(db, "students"), newStudent);
      toast.success("Student added successfully");
      setShowAddModal(false);
      setNewStudent({ name: "", room: "", checkIn: "", status: "New" });
      fetchStudents();
    } catch (err) {
      toast.error("Failed to add student");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await deleteDoc(doc(db, "students", id));
      toast.success("Student removed");
      fetchStudents();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleView = (student: Student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const closeModals = () => {
    setShowViewModal(false);
    setShowAddModal(false);
    setSelectedStudent(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF4FA1]"></div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Student Directory</h2>
          <p className="text-sm text-gray-500">Manage and monitor resident occupancy</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-[#FF4FA1] text-white rounded-xl shadow-lg shadow-[#FF4FA1]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 font-semibold"
        >
          <FiPlus strokeWidth={3} />
          Add Student
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Residents", count: students.length, color: "text-[#00CFFF]", bg: "bg-[#00CFFF]/10" },
          { label: "New Entries", count: students.filter(s => s.status === "New").length, color: "text-[#FF4FA1]", bg: "bg-[#FF4FA1]/10" },
          { label: "Leaving Soon", count: students.filter(s => s.status === "Leaving Soon").length, color: "text-yellow-500", bg: "bg-yellow-500/10" },
        ].map((stat, idx) => (
          <div key={idx} className={`${stat.bg} rounded-2xl p-5 border border-white/10`}>
            <div className={`text-3xl font-black ${stat.color}`}>{stat.count}</div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Controls: Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by name or room..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-[#00CFFF] transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <FiFilter className="text-gray-400" />
          <select 
            className="bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-lg outline-none cursor-pointer"
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
      <div className="grid grid-cols-1 gap-3">
        {filteredStudents.length > 0 ? filteredStudents.map((student) => (
          <div
            key={student.id}
            className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[#FF4FA1]">
                <FiUser size={24} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-gray-900 dark:text-white">{student.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                    student.status === "Active" ? "bg-green-100 text-green-600" :
                    student.status === "New" ? "bg-[#00CFFF]/10 text-[#00CFFF]" : "bg-yellow-100 text-yellow-600"
                  }`}>
                    {student.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1"><FiHome /> Room {student.room}</span>
                  <span className="flex items-center gap-1"><FiCalendar /> Joined {student.checkIn}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-4 md:mt-0 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleView(student)} className="p-2 bg-[#00CFFF]/10 text-[#00CFFF] rounded-lg hover:bg-[#00CFFF] hover:text-white transition-colors">
                <FiEye size={18} />
              </button>
              <button onClick={() => toast("Messaging coming soon")} className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors">
                <FiMessageCircle size={18} />
              </button>
              <button onClick={() => handleDelete(student.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 text-gray-500">No students found matching your search.</div>
        )}
      </div>

      {/* View Modal */}
      {showViewModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-[#FF4FA1]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#FF4FA1]">
                <FiUser size={40} />
              </div>
              <h3 className="text-2xl font-bold dark:text-white">{selectedStudent.name}</h3>
              <p className="text-[#00CFFF] font-medium">Room {selectedStudent.room}</p>
            </div>
            
            <div className="space-y-4 border-t border-gray-100 dark:border-gray-700 pt-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="font-bold">{selectedStudent.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Check-In Date</span>
                <span className="font-bold">{selectedStudent.checkIn}</span>
              </div>
            </div>

            <button onClick={closeModals} className="w-full mt-8 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Close Profile
            </button>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">New Registration</h3>
              <button onClick={closeModals} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleAddStudent(); }} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">Full Name</label>
                <input
                  type="text" name="name" placeholder="John Doe"
                  value={newStudent.name} onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl outline-none focus:ring-2 focus:ring-[#FF4FA1]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">Room Number</label>
                  <input
                    type="text" name="room" placeholder="101"
                    value={newStudent.room} onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl outline-none focus:ring-2 focus:ring-[#FF4FA1]"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">Status</label>
                  <select
                    name="status" value={newStudent.status} onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl outline-none focus:ring-2 focus:ring-[#FF4FA1]"
                  >
                    <option value="New">New</option>
                    <option value="Active">Active</option>
                    <option value="Leaving Soon">Leaving Soon</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">Check-In Date</label>
                <input
                  type="date" name="checkIn"
                  value={newStudent.checkIn} onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl outline-none focus:ring-2 focus:ring-[#FF4FA1]"
                  required
                />
              </div>

              <button type="submit" className="w-full bg-[#FF4FA1] text-white py-4 rounded-xl font-bold shadow-lg shadow-[#FF4FA1]/20 mt-4 hover:bg-[#FF4FA1]/90 transition-all">
                Confirm Registration
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;