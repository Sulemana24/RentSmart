"use client";

import React, { useState, useMemo } from "react";
import { 
  FiPlus, FiEye, FiSearch, FiUser, 
  FiCalendar, FiHome, FiLoader, FiPhone, 
  FiX, FiFilter, FiMessageCircle, FiTrash2, FiZap, FiSend 
} from "react-icons/fi";
import toast from "react-hot-toast";

// --- MOCK DATA ---
const MOCK_STUDENTS = [
  { id: "1", name: "Kwame Asante", phone: "024 123 4567", room: "101", checkIn: "2024-01-15", status: "Active", email: "kwame@example.com" },
  { id: "2", name: "Ama Serwaa", phone: "055 987 6543", room: "104", checkIn: "2024-02-01", status: "Active", email: "ama@example.com" },
  { id: "3", name: "John Mensah", phone: "020 444 5555", room: "105", checkIn: "2023-09-10", status: "Leaving Soon", email: "john@example.com" },
  { id: "4", name: "Kofi Ansah", phone: "027 333 2222", room: "201", checkIn: "2024-03-01", status: "New", email: "kofi@example.com" },
];

const MOCK_ROOMS = Array.from({ length: 50 }, (_, i) => ({
  id: `r${i}`,
  roomNumber: `${100 + i + 1}`,
}));

const Students: React.FC = () => {
  // Global App States
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [roomSearch, setRoomSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Modal Control States
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [modalType, setModalType] = useState<"view" | "message" | "delete" | null>(null);

  // Form State
  const [newStudent, setNewStudent] = useState({
    name: "",
    phone: "",
    room: "",
    checkIn: new Date().toISOString().split('T')[0],
    status: "New",
  });

  // --- LOGIC HANDLERS ---

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

  const magicAssignRoom = () => {
    if (availableRooms.length > 0) {
      setNewStudent({ ...newStudent, room: availableRooms[0].roomNumber });
      toast("Magic Assign: Room " + availableRooms[0].roomNumber + " selected!", { icon: '✨' });
    } else {
      toast.error("No rooms available for auto-assign");
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.room) return toast.error("Please select a room");
    setSubmitting(true);
    setTimeout(() => {
      setStudents([{ id: Date.now().toString(), ...newStudent, email: "new@example.com" }, ...students]);
      setSubmitting(false);
      setShowAddModal(false);
      toast.success(`${newStudent.name} enrolled successfully!`);
      setNewStudent({ name: "", phone: "", room: "", checkIn: new Date().toISOString().split('T')[0], status: "New" });
    }, 1000);
  };

  const handleDelete = () => {
    setStudents(students.filter(s => s.id !== selectedStudent.id));
    toast.success("Resident record removed");
    setModalType(null);
  };

  const openActionModal = (student: any, type: "view" | "message" | "delete") => {
    setSelectedStudent(student);
    setModalType(type);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Student Management</h2>
            <p className="text-sm text-gray-500 mt-1">Manage residents and room assignments</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-[#FF4FA1] text-white rounded-xl hover:bg-[#FF4FA1]/90 flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-95 shadow-lg shadow-[#FF4FA1]/20"
          >
            <FiPlus strokeWidth={3} /> Add Student
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
              <div className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" placeholder="Search by name or room..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 ring-[#00CFFF]/30 transition-all text-sm"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl outline-none text-sm font-medium cursor-pointer"
            value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
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
            <div key={student.id} className="group flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all hover:shadow-md">
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
                    }`}>{student.status}</span>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[#00CFFF] font-bold"><FiHome size={12}/> {student.room}</span>
                    <span className="flex items-center gap-1"><FiCalendar size={12}/> {student.checkIn}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => openActionModal(student, 'view')} className="flex-1 md:flex-none px-4 py-2 bg-[#00CFFF] text-white rounded-lg text-xs font-bold hover:bg-[#00CFFF]/90 flex items-center justify-center gap-2 transition-all">
                  <FiEye /> View
                </button>
                <button onClick={() => openActionModal(student, 'message')} className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                  <FiMessageCircle size={18} />
                </button>
                <button onClick={() => openActionModal(student, 'delete')} className="p-2 text-gray-400 hover:text-red-500 transition-all">
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* 1. Enrollment Modal (With Magic Assign) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold">New Student Enrollment</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><FiX /></button>
            </div>
            <form onSubmit={handleAddStudent} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Full Name" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl outline-none border dark:border-gray-600" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
                <input required placeholder="Phone" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl outline-none border dark:border-gray-600" value={newStudent.phone} onChange={e => setNewStudent({...newStudent, phone: e.target.value})} />
              </div>
              <div className="bg-gray-900 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#00CFFF] uppercase tracking-widest">Room Picker</span>
                  <button type="button" onClick={magicAssignRoom} className="flex items-center gap-1 text-[10px] font-bold text-white bg-[#FF4FA1] px-2 py-1 rounded-md hover:scale-105 transition-all">
                    <FiZap /> Magic Assign
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {availableRooms.map(r => (
                    <button key={r.id} type="button" onClick={() => setNewStudent({...newStudent, room: r.roomNumber})} className={`py-2 rounded-lg text-xs font-bold transition-all ${newStudent.room === r.roomNumber ? 'bg-[#00CFFF] text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                      {r.roomNumber}
                    </button>
                  ))}
                </div>
              </div>
              <button disabled={submitting} className="w-full py-4 bg-[#FF4FA1] text-white rounded-xl font-bold uppercase tracking-widest hover:bg-[#FF4FA1]/90 shadow-lg shadow-[#FF4FA1]/20">
                {submitting ? <FiLoader className="animate-spin mx-auto" /> : "Complete Enrollment"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. View/Message/Delete Modal Switcher */}
      {modalType && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-bold capitalize">{modalType} Resident</h3>
              <button onClick={() => setModalType(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><FiX /></button>
            </div>
            
            <div className="p-8">
              {modalType === 'view' && (
                <div className="space-y-4 text-center">
                  <div className="w-20 h-20 bg-[#00CFFF]/10 text-[#00CFFF] rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiUser size={40} />
                  </div>
                  <h4 className="text-2xl font-black">{selectedStudent?.name}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl"><p className="text-gray-400 text-[10px] uppercase font-bold">Room</p><p className="font-bold">{selectedStudent?.room}</p></div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl"><p className="text-gray-400 text-[10px] uppercase font-bold">Joined</p><p className="font-bold">{selectedStudent?.checkIn}</p></div>
                  </div>
                </div>
              )}

              {modalType === 'message' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">Sending to: <b>{selectedStudent?.name}</b></p>
                  <textarea rows={4} placeholder="Type your message here..." className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl outline-none border dark:border-gray-600 focus:ring-2 ring-[#00CFFF]/20 transition-all"></textarea>
                  <button onClick={() => {toast.success("Message sent!"); setModalType(null)}} className="w-full py-4 bg-[#00CFFF] text-white rounded-xl font-bold flex items-center justify-center gap-2">
                    <FiSend /> Send Direct Message
                  </button>
                </div>
              )}

              {modalType === 'delete' && (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto">
                    <FiTrash2 size={30} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">Are you sure?</h4>
                    <p className="text-sm text-gray-500 mt-2">This will permanently remove <b>{selectedStudent?.name}</b> from the system.</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setModalType(null)} className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl font-bold">Cancel</button>
                    <button onClick={handleDelete} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-200">Delete</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;