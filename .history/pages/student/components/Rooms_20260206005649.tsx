"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit,
  FiTrash2,
  FiUser,
  FiX,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";

// ... (Room and ToastMessage interfaces remain the same as your snippet)

interface Room {
  id: number;
  roomNumber: string;
  type: string;
  status: "Occupied" | "Available" | "Maintenance";
  price: string;
  student: string;
  floor: string;
  lastCleaned: string;
}

interface ToastMessage {
  id: number;
  text: string;
  type: "success" | "error" | "info";
}

const Modal: React.FC<{
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}> = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-5 sm:p-8 border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{title}</h3>
        <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
          <FiX size={20} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const Rooms: React.FC = () => {
  // Mock Data (Expanded to show pagination)
  const initialRooms: Room[] = [
    { id: 1, roomNumber: "101", type: "Single Room", status: "Occupied", price: "₵300/month", student: "Kwame Asante", floor: "1st", lastCleaned: "2024-03-20" },
    { id: 2, roomNumber: "102", type: "Double Room", status: "Available", price: "₵500/month", student: "Vacant", floor: "1st", lastCleaned: "2024-03-21" },
    { id: 3, roomNumber: "103", type: "Single Room", status: "Maintenance", price: "₵300/month", student: "N/A", floor: "1st", lastCleaned: "2024-03-15" },
    { id: 4, roomNumber: "201", type: "Triple Room", status: "Occupied", price: "₵700/month", student: "Alice Boateng", floor: "2nd", lastCleaned: "2024-03-19" },
    { id: 5, roomNumber: "202", type: "Single Room", status: "Available", price: "₵300/month", student: "Vacant", floor: "2nd", lastCleaned: "2024-03-22" },
    { id: 6, roomNumber: "301", type: "Double Room", status: "Occupied", price: "₵500/month", student: "John Doe", floor: "3rd", lastCleaned: "2024-03-18" },
  ];

  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  
  // --- Enhanced Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [activeModal, setActiveModal] = useState<"view" | "edit" | "delete" | "add" | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<Omit<Room, "id">>({
    roomNumber: "", type: "Single Room", status: "Available", price: "", student: "Vacant", floor: "1st", lastCleaned: new Date().toISOString().split('T')[0]
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterType]);

  const addToast = (text: string, type: ToastMessage["type"] = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter(r => {
      const matchesSearch = r.roomNumber.includes(searchTerm) || r.student.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "All" || r.status === filterStatus;
      const matchesType = filterType === "All" || r.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [rooms, searchTerm, filterStatus, filterType]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const currentData = filteredRooms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const openEdit = (room: Room) => {
    setSelectedRoom(room);
    setFormData({ ...room });
    setActiveModal("edit");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setRooms(prev => prev.map(r => r.id === selectedRoom?.id ? { ...formData, id: r.id } : r));
    addToast(`Room ${formData.roomNumber} updated!`);
    setActiveModal(null);
  };

  const handleDelete = () => {
    setRooms(prev => prev.filter(r => r.id !== selectedRoom?.id));
    addToast(`Room deleted`, "error");
    setActiveModal(null);
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden px-1">
      {/* Toast Container */}
      <div className="fixed top-5 right-5 z-[70] flex flex-col gap-2 max-w-[90vw]">
        {toasts.map(t => (
          <div key={t.id} className={`px-4 py-3 rounded-xl shadow-2xl text-white font-bold flex items-center gap-2 animate-in slide-in-from-right-full ${t.type === 'success' ? 'bg-green-600' : t.type === 'error' ? 'bg-[#FF4FA1]' : 'bg-blue-600'}`}>
            <FiCheckCircle className="shrink-0" /> {t.text}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        {/* --- Header & Search Bar --- */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight italic uppercase">Room Inventory</h2>
            <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-1">Live Occupancy Management</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 sm:min-w-[300px]">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search room or student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF]/50 outline-none transition-all text-sm font-medium"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-5 py-3 border rounded-xl font-bold text-sm transition-all ${showFilters ? 'bg-[#00CFFF] border-[#00CFFF] text-white shadow-lg shadow-[#00CFFF]/20' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'}`}
            >
              <FiFilter /> Filters
            </button>
          </div>
        </div>

        {/* --- Filter Panel --- */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 p-5 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl dark:text-white text-sm font-bold outline-none">
                <option value="All">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Room Type</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl dark:text-white text-sm font-bold outline-none">
                <option value="All">All Types</option>
                <option value="Single Room">Single Room</option>
                <option value="Double Room">Double Room</option>
                <option value="Triple Room">Triple Room</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={() => { setFilterStatus("All"); setFilterType("All"); setSearchTerm(""); }} className="text-xs font-black text-[#FF4FA1] hover:underline px-2 py-3 transition-all uppercase tracking-tighter">Reset All</button>
            </div>
          </div>
        )}

        {/* --- Table View --- */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="text-left py-4 px-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Room / Floor</th>
                <th className="text-left py-4 px-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="text-left py-4 px-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Billing</th>
                <th className="text-left py-4 px-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Occupant</th>
                <th className="text-right py-4 px-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {currentData.length > 0 ? currentData.map((room) => (
                <tr key={room.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-all">
                  <td className="py-5 px-4">
                    <div className="font-black text-gray-900 dark:text-white">Room {room.roomNumber}</div>
                    <div className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase">{room.type} • {room.floor} Floor</div>
                  </td>
                  <td className="py-5 px-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        room.status === "Occupied" ? "bg-green-500/10 text-green-600" :
                        room.status === "Available" ? "bg-[#00CFFF]/10 text-[#00CFFF]" :
                        "bg-yellow-500/10 text-yellow-600"
                    }`}>
                      {room.status}
                    </span>
                  </td>
                  <td className="py-5 px-4 font-bold text-gray-700 dark:text-gray-300 text-sm">{room.price}</td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                        <FiUser className="text-gray-400" size={14} />
                      </div>
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{room.student}</span>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setSelectedRoom(room); setActiveModal("view"); }} className="p-2 text-gray-400 hover:text-[#00CFFF] hover:bg-[#00CFFF]/10 rounded-xl transition-all"><FiEye size={18} /></button>
                      <button onClick={() => openEdit(room)} className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-500/10 rounded-xl transition-all"><FiEdit size={18} /></button>
                      <button onClick={() => { setSelectedRoom(room); setActiveModal("delete"); }} className="p-2 text-gray-400 hover:text-[#FF4FA1] hover:bg-[#FF4FA1]/10 rounded-xl transition-all"><FiTrash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-gray-500 font-bold uppercase text-xs tracking-widest">No matching records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- Enhanced Pagination Section --- */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Showing Results</p>
            <p className="text-sm font-black text-gray-900 dark:text-white">
              {filteredRooms.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredRooms.length)} <span className="text-gray-400 font-bold mx-1">of</span> {filteredRooms.length}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* First Page */}
            <button 
              disabled={currentPage === 1}
              onClick={() => goToPage(1)}
              className="p-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-20 transition-all"
              title="First Page"
            >
              <FiChevronsLeft size={18} />
            </button>

            {/* Previous */}
            <button 
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-black text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-20 transition-all"
            >
              <FiChevronLeft /> <span className="hidden sm:inline">PREV</span>
            </button>

            {/* Page Numbers */}
            <div className="hidden sm:flex items-center gap-2 mx-2">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // Show only a few pages around the current one if many exist
                if (totalPages > 5 && Math.abs(pageNum - currentPage) > 1 && pageNum !== 1 && pageNum !== totalPages) {
                    if (Math.abs(pageNum - currentPage) === 2) return <span key={pageNum} className="text-gray-400">...</span>;
                    return null;
                }
                return (
                  <button 
                    key={pageNum} 
                    onClick={() => goToPage(pageNum)}
                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === pageNum ? 'bg-[#00CFFF] text-white shadow-lg shadow-[#00CFFF]/30 scale-110' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next */}
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => goToPage(currentPage + 1)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-black text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-20 transition-all"
            >
              <span className="hidden sm:inline">NEXT</span> <FiChevronRight />
            </button>

            {/* Last Page */}
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => goToPage(totalPages)}
              className="p-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-20 transition-all"
              title="Last Page"
            >
              <FiChevronsRight size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* ... (Edit, View, Delete Modal logic remains same as your original) */}
    </div>
  );
};

export default Rooms;