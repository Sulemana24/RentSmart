"use client";

import React, { useEffect, useState, useMemo } from "react";
import { FiPlus, FiX, FiSearch, FiTrash2, FiUser, FiCalendar, FiHome, FiLoader, FiZap, FiPhone, FiChevronRight } from "react-icons/fi";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, doc, deleteDoc, query, orderBy, where } from "firebase/firestore";
import toast from "react-hot-toast";

interface Student {
  id: string;
  name: string;
  phone: string;
  room: string;
  gender: string;
  checkIn: string;
  emergencyContact: string;
  status: string;
}

interface Room {
  id: string;
  roomNumber: string;
  type?: string;
}

const Students: React.FC = () => {
  // Data States
  const [students, setStudents] = useState<Student[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); 
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [roomSearch, setRoomSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Student Object
  const [newStudent, setNewStudent] = useState({
    name: "",
    phone: "",
    room: "",
    gender: "Male",
    checkIn: new Date().toISOString().split('T')[0],
    emergencyContact: "",
    status: "Active",
  });

  // 1. Fetch Rooms and Students from Firebase
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch Residents
      const sQuery = query(collection(db, "students"), orderBy("name", "asc"));
      const sSnap = await getDocs(sQuery);
      const sData = sSnap.docs.map(d => ({ id: d.id, ...d.data() } as Student));
      
      // Fetch Rooms (Collection: "rooms")
      const rQuery = query(collection(db, "rooms"), orderBy("roomNumber", "asc"));
      const rSnap = await getDocs(rQuery);
      const rData = rSnap.docs.map(d => ({ id: d.id, ...d.data() } as Room));

      setStudents(sData);
      setRooms(rData);
      setFilteredStudents(sData);
    } catch (err) {
      console.error(err);
      toast.error("Database connection failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // 2. Logic: Identify Available Rooms
  const occupiedRoomNumbers = useMemo(() => students.map(s => s.room), [students]);
  
  const availableRooms = useMemo(() => {
    return rooms.filter(r => 
      !occupiedRoomNumbers.includes(r.roomNumber) && 
      r.roomNumber.includes(roomSearch)
    ).slice(0, 10); // Performance: Only show top 10 matches while typing
  }, [rooms, occupiedRoomNumbers, roomSearch]);

  // 3. Search & Filter Residents
  useEffect(() => {
    let res = students;
    if (searchTerm) {
      res = res.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.room.includes(searchTerm)
      );
    }
    if (filterStatus !== "All") res = res.filter(s => s.status === filterStatus);
    setFilteredStudents(res);
  }, [searchTerm, filterStatus, students]);

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.room) return toast.error("Name and Room are required");
    setSubmitting(true);
    try {
      await addDoc(collection(db, "students"), { ...newStudent, createdAt: new Date().toISOString() });
      toast.success("Resident enrolled!");
      setShowAddModal(false);
      fetchData();
    } catch (e) {
      toast.error("Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteDoc(doc(db, "students", id));
      toast.success("Record deleted");
      fetchData();
    } catch (e) { toast.error("Delete failed"); }
  };

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-black">
      <div className="w-12 h-12 border-4 border-black border-t-[#FF4FA1] animate-spin rounded-full mb-4"></div>
      <p className="font-black uppercase tracking-tighter text-sm">Initializing 2026 Core...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-4 md:p-10 font-sans selection:bg-[#00CFFF]">
      
      {/* Dynamic Header */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b-8 border-black pb-8">
        <div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8]">
            Hub <span className="text-[#FF4FA1]">Portal</span>
          </h1>
          <p className="mt-4 font-bold text-lg uppercase flex items-center gap-2">
            <span className="bg-[#00CFFF] px-2 text-black">{rooms.length - occupiedRoomNumbers.length} Rooms Available</span>
            <span className="bg-black text-white dark:bg-white dark:text-black px-2">{students.length} Active</span>
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-black dark:bg-white text-white dark:text-black px-8 py-6 rounded-full font-black text-xl uppercase hover:bg-[#FF4FA1] dark:hover:bg-[#FF4FA1] transition-all active:scale-95 flex items-center gap-4"
        >
          <FiPlus strokeWidth={4} /> New Entry
        </button>
      </header>

      {/* Modern Search */}
      <section className="max-w-7xl mx-auto mb-10">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Search residents or room ID..." 
            className="w-full bg-transparent border-4 border-black dark:border-white p-6 text-2xl font-black placeholder:text-gray-300 dark:placeholder:text-gray-700 outline-none focus:bg-[#00CFFF] focus:text-black transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute right-6 top-1/2 -translate-y-1/2 text-4xl" />
        </div>
      </section>

      {/* Resident Table/Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
        {filteredStudents.map((s) => (
          <div key={s.id} className="border-4 border-black dark:border-white p-6 hover:translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all bg-white dark:bg-black group">
            <div className="flex justify-between items-start mb-8">
              <div className="text-5xl font-black text-[#FF4FA1]">#{s.room}</div>
              <button onClick={() => handleDelete(s.id)} className="p-2 hover:text-red-500"><FiTrash2 size={24}/></button>
            </div>
            <h3 className="text-3xl font-black uppercase mb-1 truncate">{s.name}</h3>
            <p className="font-bold flex items-center gap-2 mb-6 text-gray-500">
              <FiPhone /> {s.phone}
            </p>
            <div className="flex items-center justify-between border-t-4 border-black dark:border-white pt-4">
               <span className="font-black uppercase text-sm italic">{s.status}</span>
               <FiChevronRight className="group-hover:translate-x-2 transition-transform" size={24}/>
            </div>
          </div>
        ))}
      </div>

      {/* Ultra-Responsive Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-white dark:bg-black z-[1000] overflow-y-auto p-4 md:p-10 flex flex-col items-center">
          <div className="w-full max-w-4xl">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Registration</h2>
              <button onClick={() => setShowAddModal(false)} className="text-4xl hover:rotate-90 transition-transform"><FiX/></button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleAddStudent(); }} className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left Column: Personal Info */}
              <div className="space-y-8">
                <div className="flex flex-col border-b-4 border-black dark:border-white pb-2">
                  <label className="text-xs font-black uppercase mb-2">Full Legal Name</label>
                  <input required type="text" className="bg-transparent text-3xl font-black outline-none" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
                </div>
                <div className="flex flex-col border-b-4 border-black dark:border-white pb-2">
                  <label className="text-xs font-black uppercase mb-2">Phone</label>
                  <input required type="tel" className="bg-transparent text-3xl font-black outline-none" value={newStudent.phone} onChange={e => setNewStudent({...newStudent, phone: e.target.value})} />
                </div>
                <div className="flex flex-col border-b-4 border-black dark:border-white pb-2">
                  <label className="text-xs font-black uppercase mb-2">Emergency Contact</label>
                  <input type="text" className="bg-transparent text-3xl font-black outline-none" placeholder="OPTIONAL" value={newStudent.emergencyContact} onChange={e => setNewStudent({...newStudent, emergencyContact: e.target.value})} />
                </div>
              </div>

              {/* Right Column: Room Engine */}
              <div className="bg-black text-white dark:bg-white dark:text-black p-8 flex flex-col justify-between">
                <div>
                  <label className="text-xs font-black uppercase mb-6 block">Select Available Room</label>
                  <input 
                    type="text" placeholder="SEARCH ROOMS..." 
                    className="w-full bg-transparent border-2 border-white dark:border-black p-4 mb-4 font-black outline-none"
                    value={roomSearch} onChange={e => setRoomSearch(e.target.value)}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    {availableRooms.map(r => (
                      <button 
                        key={r.id} type="button"
                        onClick={() => setNewStudent({...newStudent, room: r.roomNumber})}
                        className={`p-3 border-2 font-black transition-all ${newStudent.room === r.roomNumber ? 'bg-[#FF4FA1] border-[#FF4FA1]' : 'border-white dark:border-black hover:bg-[#00CFFF] hover:text-black'}`}
                      >
                        {r.roomNumber}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  disabled={submitting}
                  className="mt-10 w-full bg-[#00CFFF] text-black p-6 font-black text-2xl uppercase hover:bg-[#FF4FA1] transition-colors"
                >
                  {submitting ? "SYNCING..." : "CONFIRM ENTRY"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;