"use client";

import React, { useState, useMemo } from "react";
import { 
  FiPlus, FiEye, FiSearch, FiTrash2, FiUser, 
  FiCalendar, FiHome, FiLoader, FiPhone, 
  FiX, FiFilter, FiUserPlus, FiZap
} from "react-icons/fi";
import toast from "react-hot-toast";

// --- MOCK DATA FOR PREVIEW ---
const MOCK_STUDENTS = [
  { id: "1", name: "Kwame Asante", phone: "024 123 4567", room: "101", gender: "Male", checkIn: "2024-01-15", emergencyContact: "Mary Asante", status: "Active" },
  { id: "2", name: "Ama Serwaa", phone: "055 987 6543", room: "104", gender: "Female", checkIn: "2024-02-01", emergencyContact: "John Serwaa", status: "Active" },
  { id: "3", name: "John Mensah", phone: "020 444 5555", room: "105", gender: "Male", checkIn: "2023-09-10", emergencyContact: "Grace Mensah", status: "Leaving Soon" },
  { id: "4", name: "Kofi Ansah", phone: "027 333 2222", room: "201", gender: "Male", checkIn: "2024-03-01", emergencyContact: "Peter Ansah", status: "New" },
  { id: "5", name: "Abena Mansa", phone: "054 111 0000", room: "302", gender: "Female", checkIn: "2024-01-20", emergencyContact: "Sarah Mansa", status: "Active" },
];

const MOCK_ROOMS = Array.from({ length: 100 }, (_, i) => ({
  id: `r${i}`,
  roomNumber: `${Math.floor(i / 10) + 1}${ (i % 10 + 1).toString().padStart(2, '0') }`,
  status: "Available"
}));

const Students: React.FC = () => {
  const [students] = useState<any[]>(MOCK_STUDENTS);
  const [rooms] = useState<any[]>(MOCK_ROOMS);
  
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [roomSearch, setRoomSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [newStudent, setNewStudent] = useState({
    name: "",
    phone: "",
    room: "",
    gender: "Male",
    checkIn: new Date().toISOString().split('T')[0],
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

  const availableRoomsList = useMemo(() => {
    const occupied = students.map(s => s.room);
    return rooms
      .filter(r => !occupied.includes(r.roomNumber) && r.roomNumber.includes(roomSearch))
      .slice(0, 12);
  }, [roomSearch, rooms, students]);

  const handlePreviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Preview Mode: Student added successfully!");
      setSubmitting(false);
      setShowAddModal(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#FF4FA1] font-black uppercase text-xs tracking-[0.2em]">
             <FiZap size={14} /> Demo Preview Mode
          </div>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Student Manager</h2>
          <p className="text-gray-400 font-bold text-sm">
            {rooms.length - students.length} Vacant Units • System Active
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="group relative flex items-center justify-center gap-3 bg-[#FF4FA1] text-white px-10 py-5 rounded-2xl font-black uppercase text-xs shadow-lg shadow-[#FF4FA1]/30 hover:shadow-[#FF4FA1]/50 transition-all overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <FiUserPlus className="relative z-10" size={18} strokeWidth={3} /> 
          <span className="relative z-10">Add Resident</span>
        </button>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Students", count: students.length, color: "text-[#00CFFF]", bg: "bg-[#00CFFF]/10", icon: <FiUser /> },
          { label: "Check-ins Today", count: "3", color: "text-[#FF4FA1]", bg: "bg-[#FF4FA1]/10", icon: <FiCalendar /> },
          { label: "Available Rooms", count: rooms.length - students.length, color: "text-green-500", bg: "bg-green-500/10", icon: <FiHome /> },
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} p-8 rounded-[2rem] border border-white/20 flex items-center justify-between group hover:scale-[1.02] transition-transform`}>
            <div>
              <div className={`text-5xl font-black ${stat.color}`}>{stat.count}</div>
              <div className="text-xs font-black text-gray-500 uppercase tracking-widest mt-2">{stat.label}</div>
            </div>
            <div className={`text-3xl ${stat.color} opacity-20 group-hover:opacity-100 transition-opacity`}>{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-gray-100/50 dark:bg-gray-800/50 p-2 rounded-3xl">
        <div className="relative flex-1 group">
          <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF4FA1] transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search by name, room number..."
            className="w-full pl-16 pr-8 py-5 bg-white dark:bg-gray-800 rounded-[1.5rem] border-none shadow-sm focus:ring-4 focus:ring-[#FF4FA1]/10 outline-none font-bold transition-all text-gray-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative flex items-center">
          <FiFilter className="absolute left-5 text-[#00CFFF] z-10" />
          <select 
            className="pl-12 pr-10 py-5 bg-white dark:bg-gray-800 rounded-[1.5rem] font-black text-xs uppercase tracking-widest border-none shadow-sm outline-none cursor-pointer appearance-none min-w-[180px] relative"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="New">New</option>
            <option value="Leaving Soon">Leaving Soon</option>
          </select>
        </div>
      </div>

      {/* Student Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div 
            key={student.id}
            className="group relative bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:shadow-[#00CFFF]/10 transition-all duration-500 overflow-hidden"
          >
            <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl text-[10px] font-black uppercase tracking-widest z-10 ${
                student.status === "Active" ? "bg-green-500 text-white" : 
                student.status === "New" ? "bg-[#00CFFF] text-white" : "bg-yellow-500 text-white"
            }`}>
              {student.status}
            </div>

            <div className="flex flex-col h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center text-[#FF4FA1] group-hover:scale-110 transition-transform duration-500">
                  <FiUser size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white truncate max-w-[150px]">{student.name}</h3>
                  <p className="text-[#00CFFF] font-black text-sm uppercase">Room {student.room}</p>
                </div>
              </div>

              <div className="space-y-3 mb-8 flex-grow">
                <div className="flex items-center gap-3 text-sm font-bold text-gray-500 dark:text-gray-400">
                  <FiPhone className="text-[#FF4FA1]" /> {student.phone}
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-gray-500 dark:text-gray-400">
                  <FiCalendar className="text-[#FF4FA1]" /> Enrolled: {student.checkIn}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex-1 py-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#00CFFF] transition-colors">
                  <FiEye size={16} /> Details
                </button>
                <button className="p-4 text-gray-300 hover:text-red-500 transition-colors">
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Registration Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-[#FF4FA1] text-white rounded-2xl shadow-lg shadow-[#FF4FA1]/20">
                    <FiPlus size={24} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-3xl font-black tracking-tight">Register Student</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 italic">Housing Entry v2.0</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-4 hover:bg-white dark:hover:bg-gray-700 rounded-2xl transition-all shadow-sm"><FiX size={24}/></button>
            </div>

            <form onSubmit={handlePreviewSubmit} className="p-10 overflow-y-auto space-y-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-[#FF4FA1] ml-1">Full Legal Name</label>
                  <input required type="text" placeholder="e.g., John Doe" className="w-full px-8 py-5 bg-gray-100 dark:bg-gray-800 rounded-2xl outline-none focus:ring-4 ring-[#FF4FA1]/10 font-bold transition-all text-gray-900 dark:text-white" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-[#FF4FA1] ml-1">Active Contact</label>
                  <input required type="tel" placeholder="+233..." className="w-full px-8 py-5 bg-gray-100 dark:bg-gray-800 rounded-2xl outline-none focus:ring-4 ring-[#FF4FA1]/10 font-bold transition-all text-gray-900 dark:text-white" value={newStudent.phone} onChange={e => setNewStudent({...newStudent, phone: e.target.value})} />
                </div>
              </div>

              <div className="p-8 bg-gray-900 dark:bg-black rounded-[2rem] text-white space-y-6 shadow-2xl">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FiHome className="text-[#00CFFF]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#00CFFF]">Room Assignment Engine</span>
                  </div>
                </div>
                <div className="relative">
                  <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Search floor or room number..."
                    className="w-full pl-16 pr-8 py-4 bg-white/10 rounded-xl outline-none font-bold text-sm focus:bg-white/20 transition-all border border-white/5 text-white"
                    value={roomSearch} onChange={e => setRoomSearch(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {availableRoomsList.map(r => (
                    <button 
                      key={r.id} type="button"
                      onClick={() => setNewStudent({...newStudent, room: r.roomNumber})}
                      className={`py-3 rounded-xl font-black text-xs transition-all border-2 ${newStudent.room === r.roomNumber ? 'bg-[#00CFFF] border-[#00CFFF] text-black scale-110 shadow-lg' : 'bg-transparent border-white/10 hover:border-[#00CFFF] text-white'}`}
                    >
                      {r.roomNumber}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Gender</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Male", "Female"].map(g => (
                        <button key={g} type="button" onClick={() => setNewStudent({...newStudent, gender: g})} className={`py-4 rounded-xl font-black text-xs uppercase tracking-widest border-2 transition-all ${newStudent.gender === g ? 'border-[#FF4FA1] bg-[#FF4FA1]/5 text-[#FF4FA1]' : 'border-gray-100 dark:border-gray-800 text-gray-500'}`}>{g}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Registration Status</label>
                  <select className="w-full px-8 py-4 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold border-none text-gray-900 dark:text-white" value={newStudent.status} onChange={e => setNewStudent({...newStudent, status: e.target.value as any})}>
                    <option value="New">New Student</option>
                    <option value="Active">Regular Active</option>
                    <option value="Leaving Soon">Closing Soon</option>
                  </select>
                </div>
              </div>

              <button 
                disabled={submitting}
                className="w-full py-7 bg-[#FF4FA1] text-white rounded-3xl font-black uppercase tracking-[0.3em] shadow-2xl shadow-[#FF4FA1]/30 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-4 text-sm"
              >
                {submitting ? <FiLoader className="animate-spin text-2xl" /> : "Finalize Enrollment"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;