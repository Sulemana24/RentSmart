"use client";

import React, { useState, useMemo } from "react";
import { 
  FiPlus, FiEye, FiSearch, FiUser, 
  FiCalendar, FiHome, FiLoader, FiPhone, 
  FiX, FiMessageCircle, FiTrash2, FiZap, FiSend,
  FiMail, FiShield, FiClock, FiCheckCircle
} from "react-icons/fi";
import toast from "react-hot-toast";

// --- MOCK DATA ---
const MOCK_STUDENTS = [
  { id: "1", name: "Kwame Asante", phone: "024 123 4567", room: "101", checkIn: "2024-01-15", status: "Active", email: "kwame@example.com", gender: "Male", emergencyContact: "024 000 0000", period: "Full Year" },
  { id: "2", name: "Ama Serwaa", phone: "055 987 6543", room: "104", checkIn: "2024-02-01", status: "Active", email: "ama@example.com", gender: "Female", emergencyContact: "055 111 1111", period: "Semester" },
];

const MOCK_ROOMS = Array.from({ length: 50 }, (_, i) => ({
  id: `r${i}`,
  roomNumber: `${100 + i + 1}`,
}));

const Students: React.FC = () => {
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [roomSearch, setRoomSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [modalType, setModalType] = useState<"view" | "message" | "delete" | null>(null);

  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "Male",
    room: "",
    checkIn: new Date().toISOString().split('T')[0],
    period: "Semester",
    emergencyContact: "",
    status: "New",
  });

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
      toast.error("No rooms available");
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.room) return toast.error("Please select a room");
    setSubmitting(true);
    setTimeout(() => {
      setStudents([{ id: Date.now().toString(), ...newStudent }, ...students]);
      setSubmitting(false);
      setShowAddModal(false);
      toast.success(`${newStudent.name} enrolled successfully!`);
      setNewStudent({ name: "", email: "", phone: "", gender: "Male", room: "", checkIn: new Date().toISOString().split('T')[0], period: "Semester", emergencyContact: "", status: "New" });
    }, 1000);
  };

  const openActionModal = (student: any, type: "view" | "message" | "delete") => {
    setSelectedStudent(student);
    setModalType(type);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto px-4">
      {/* Dashboard Header Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Residents</h2>
            <p className="text-sm text-gray-500 font-medium mt-1">Manage enrollments and assignments</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-full md:w-auto px-8 py-4 bg-[#FF4FA1] text-white rounded-2xl hover:bg-[#FF4FA1]/90 flex items-center justify-center gap-3 font-bold text-sm transition-all active:scale-95 shadow-lg shadow-[#FF4FA1]/30"
          >
            <FiPlus strokeWidth={3} className="text-lg" /> New Enrollment
          </button>
        </div>

        {/* Quick Search & Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00CFFF] transition-colors" />
            <input 
              type="text" placeholder="Search name or room..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl outline-none focus:ring-4 ring-[#00CFFF]/10 focus:border-[#00CFFF]/50 transition-all text-sm font-medium"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <select 
              className="flex-1 lg:w-48 px-4 py-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl outline-none text-sm font-bold cursor-pointer"
              value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="New">New</option>
              <option value="Leaving Soon">Leaving Soon</option>
            </select>
          </div>
        </div>

        {/* Grid-based Student List for better responsiveness */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filteredStudents.map((student) => (
            <div key={student.id} className="group flex items-center justify-between p-5 border border-gray-100 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:bg-[#FF4FA1] group-hover:text-white transition-all transform group-hover:rotate-6">
                  <FiUser size={24} />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 dark:text-white mb-1">{student.name}</h4>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#00CFFF]">
                      <FiHome className="mb-0.5" /> {student.room}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                      <FiPhone className="mb-0.5" /> {student.phone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => openActionModal(student, 'view')} className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-[#00CFFF] hover:text-white transition-all">
                  <FiEye size={20} />
                </button>
                <button onClick={() => openActionModal(student, 'message')} className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-[#FF4FA1] hover:text-white transition-all">
                  <FiMessageCircle size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- REFINED ENROLLMENT MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-50 flex items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-2xl h-full sm:h-auto sm:max-h-[90vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
            
            {/* Modal Header - Fixed */}
            <div className="px-8 py-6 border-b dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 sticky top-0 z-10">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">New Enrollment</h3>
                <p className="text-[10px] uppercase font-bold text-[#FF4FA1] tracking-widest">Hostel Management System</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-all"><FiX size={24} /></button>
            </div>
            
            {/* Modal Body - Scrollable */}
            <form onSubmit={handleAddStudent} className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
              
              {/* Personal Section */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-[#FF4FA1]">
                  <FiUser strokeWidth={3} />
                  <span className="text-xs font-black uppercase tracking-tighter">Student Profile</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative group">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input required placeholder="Full Name" className="form-input-refined" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
                  </div>
                  <div className="relative group">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input required type="email" placeholder="Email Address" className="form-input-refined" value={newStudent.email} onChange={e => setNewStudent({...newStudent, email: e.target.value})} />
                  </div>
                  <div className="relative group">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input required placeholder="Primary Phone" className="form-input-refined" value={newStudent.phone} onChange={e => setNewStudent({...newStudent, phone: e.target.value})} />
                  </div>
                  <div className="relative group">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select className="form-input-refined appearance-none" value={newStudent.gender} onChange={e => setNewStudent({...newStudent, gender: e.target.value})}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Accommodation Section */}
              <div className="space-y-5 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#00CFFF]">
                    <FiHome strokeWidth={3} />
                    <span className="text-xs font-black uppercase tracking-tighter">Room Assignment</span>
                  </div>
                  <button type="button" onClick={magicAssignRoom} className="flex items-center gap-2 text-[10px] font-black text-white bg-[#00CFFF] px-4 py-2 rounded-xl hover:scale-105 transition-all shadow-lg shadow-[#00CFFF]/20">
                    <FiZap /> MAGIC ASSIGN
                  </button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {availableRooms.map(r => (
                    <button 
                      key={r.id} 
                      type="button" 
                      onClick={() => setNewStudent({...newStudent, room: r.roomNumber})} 
                      className={`group relative py-4 rounded-2xl text-xs font-black transition-all border-2 flex flex-col items-center justify-center gap-1 ${
                        newStudent.room === r.roomNumber 
                        ? 'bg-[#00CFFF] text-white border-[#00CFFF] shadow-lg shadow-[#00CFFF]/30' 
                        : 'bg-white dark:bg-gray-800 text-gray-500 border-transparent hover:border-gray-200 dark:hover:border-gray-600'
                      }`}
                    >
                      {newStudent.room === r.roomNumber && <FiCheckCircle className="absolute top-1 right-1 text-white" />}
                      <span className="opacity-60 font-medium">Room</span>
                      <span className="text-sm">{r.roomNumber}</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1"><FiCalendar /> Check-in Date</label>
                    <input type="date" className="form-input-refined w-full" value={newStudent.checkIn} onChange={e => setNewStudent({...newStudent, checkIn: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1"><FiClock /> Duration</label>
                    <select className="form-input-refined w-full appearance-none" value={newStudent.period} onChange={e => setNewStudent({...newStudent, period: e.target.value})}>
                      <option value="Semester">One Semester</option>
                      <option value="Full Year">Full Academic Year</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Emergency Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-yellow-500">
                  <FiShield strokeWidth={3} />
                  <span className="text-xs font-black uppercase tracking-tighter">Emergency Protocol</span>
                </div>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required placeholder="Emergency Contact Name & Phone" className="form-input-refined w-full" value={newStudent.emergencyContact} onChange={e => setNewStudent({...newStudent, emergencyContact: e.target.value})} />
                </div>
              </div>

              <button disabled={submitting} className="w-full py-5 bg-[#FF4FA1] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-[#FF4FA1]/90 shadow-2xl shadow-[#FF4FA1]/30 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
                {submitting ? <FiLoader className="animate-spin text-xl" /> : <>Finalize Enrollment</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Global Scoped Styles */}
      <style jsx>{`
        .form-input-refined {
          @apply w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl outline-none focus:ring-4 ring-[#FF4FA1]/10 focus:border-[#FF4FA1]/40 font-bold text-sm transition-all text-gray-900 dark:text-white;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        @media (prefers-color-scheme: dark) {
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #334155;
          }
        }
      `}</style>
    </div>
  );
};

export default Students;