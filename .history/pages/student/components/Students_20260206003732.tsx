"use client";

import React, { useState, useMemo } from "react";
import { 
  FiPlus, FiEye, FiSearch, FiUser, 
  FiCalendar, FiHome, FiLoader, FiPhone, 
  FiX, FiFilter, FiMessageCircle, FiTrash2 
} from "react-icons/fi";
import toast from "react-hot-toast";

// --- MOCK DATA ---
const MOCK_STUDENTS = [
  { id: "1", name: "Kwame Asante", phone: "024 123 4567", room: "101", checkIn: "2024-01-15", status: "Active" },
  { id: "2", name: "Ama Serwaa", phone: "055 987 6543", room: "104", checkIn: "2024-02-01", status: "Active" },
  { id: "3", name: "John Mensah", phone: "020 444 5555", room: "105", checkIn: "2023-09-10", status: "Leaving Soon" },
  { id: "4", name: "Kofi Ansah", phone: "027 333 2222", room: "201", checkIn: "2024-03-01", status: "New" },
];

const MOCK_ROOMS = Array.from({ length: 50 }, (_, i) => ({
  id: `r${i}`,
  roomNumber: `${100 + i + 1}`,
}));

const Students: React.FC = () => {
  // States
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [roomSearch, setRoomSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [newStudent, setNewStudent] = useState({
    name: "",
    phone: "",
    room: "",
    checkIn: new Date().toISOString().split('T')[0],
    status: "New",
  });

  // Filter Logic
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.room.includes(searchTerm);
      const matchesFilter = filterStatus === "All" || s.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filterStatus, students]);

  const availableRooms = useMemo(() => {
    const occupied = students.map(s => s.room);
    return MOCK_ROOMS
      .filter(r => !occupied.includes(r.roomNumber) && r.roomNumber.includes(roomSearch))
      .slice(0, 10);
  }, [roomSearch, students]);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.room) return toast.error("Please select a room");
    
    setSubmitting(true);
    setTimeout(() => {
      setStudents([{ id: Date.now().toString(), ...newStudent }, ...students]);
      setSubmitting(false);
      setShowAddModal(false);
      toast.success(`${newStudent.name} enrolled successfully!`);
      setNewStudent({ name: "", phone: "", room: "", checkIn: new Date().toISOString().split('T')[0], status: "New" });
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Student Management
            </h2>
            <p className="text-sm text-gray-500 mt-1">Manage residents and room assignments</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-[#FF4FA1] text-white rounded-xl hover:bg-[#FF4FA1]/90 flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-95 shadow-lg shadow-[#FF4FA1]/20"
          >
            <FiPlus strokeWidth={3} />
            Add Student
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Students", count: students.length, color: "text-[#00CFFF]", bg: "bg-[#00CFFF]/10" },
            { label: "New This Month", count: "8", color: "text-[#FF4FA1]", bg: "bg-[#FF4FA1]/10" },
            { label: "Graduating Soon", count: "12", color: "text-yellow-500", bg: "bg-yellow-500/10" },
          ].map((stat, index) => (
            <div key={index} className={`${stat.bg} rounded-2xl p-5 border border-white/50 dark:border-gray-600`}>
              <div className={`text-3xl font-black ${stat.color}`}>{stat.count}</div>
              <div className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search by name or room..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 ring-[#00CFFF]/30 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl outline-none text-sm font-medium cursor-pointer"
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
        <div className="space-y-3">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="group flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-4 mb-3 md:mb-0">
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 group-hover:bg-[#FF4FA1] group-hover:text-white transition-colors">
                  <FiUser size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-gray-900 dark:text-white">{student.name}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      student.status === "Active" ? "bg-green-100 text-green-600" : 
                      student.status === "New" ? "bg-blue-100 text-blue-600" : "bg-yellow-100 text-yellow-600"
                    }`}>
                      {student.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[#00CFFF] font-bold"><FiHome size={12}/> {student.room}</span>
                    <span className="flex items-center gap-1"><FiCalendar size={12}/> {student.checkIn}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex-1 md:flex-none px-4 py-2 bg-[#00CFFF] text-white rounded-lg text-xs font-bold hover:bg-[#00CFFF]/90 flex items-center justify-center gap-2">
                  <FiEye /> View
                </button>
                <button className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FiMessageCircle size={18} />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-500">
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {filteredStudents.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm italic">No students found matching your search.</div>
          )}
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold">New Student Enrollment</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><FiX /></button>
            </div>
            
            <form onSubmit={handleAddStudent} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input required type="text" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl outline-none focus:ring-2 ring-[#FF4FA1]/20 font-medium" 
                    value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <input required type="tel" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl outline-none focus:ring-2 ring-[#FF4FA1]/20 font-medium"
                    value={newStudent.phone} onChange={e => setNewStudent({...newStudent, phone: e.target.value})} />
                </div>
              </div>

              {/* Room Picker Section */}
              <div className="bg-gray-900 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#00CFFF] uppercase tracking-widest">Select Available Room</span>
                  <input 
                    type="text" placeholder="Search rooms..." 
                    className="bg-white/10 text-white text-xs px-3 py-1 rounded-md outline-none border border-white/10"
                    value={roomSearch} onChange={e => setRoomSearch(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {availableRooms.map(r => (
                    <button 
                      key={r.id} type="button"
                      onClick={() => setNewStudent({...newStudent, room: r.roomNumber})}
                      className={`py-2 rounded-lg text-xs font-bold transition-all ${newStudent.room === r.roomNumber ? 'bg-[#00CFFF] text-black shadow-lg shadow-[#00CFFF]/20' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                    >
                      {r.roomNumber}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Check-in Date</label>
                  <input type="date" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl font-medium" 
                    value={newStudent.checkIn} onChange={e => setNewStudent({...newStudent, checkIn: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Status</label>
                  <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl font-medium" 
                    value={newStudent.status} onChange={e => setNewStudent({...newStudent, status: e.target.value})}>
                    <option value="New">New</option>
                    <option value="Active">Active</option>
                  </select>
                </div>
              </div>

              <button 
                disabled={submitting}
                className="w-full py-4 bg-[#FF4FA1] text-white rounded-xl font-bold uppercase tracking-widest hover:bg-[#FF4FA1]/90 transition-all shadow-lg shadow-[#FF4FA1]/20 disabled:opacity-50"
              >
                {submitting ? <FiLoader className="animate-spin mx-auto" /> : "Complete Enrollment"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;