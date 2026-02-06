"use client";

import React, { useState, useMemo } from "react";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit,
  FiTrash2,
  FiUser,
  FiPlus,
  FiX,
  FiCheckCircle,
  FiMapPin,
  FiTag,
} from "react-icons/fi";

// --- Interfaces ---

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

// --- Shared Components ---

const Modal: React.FC<{
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}> = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-5 sm:p-8 border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black text-gray-900 dark:text-white">{title}</h3>
        <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
          <FiX size={20} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const Rooms: React.FC = () => {
  const initialRooms: Room[] = [
    { id: 1, roomNumber: "101", type: "Single Room", status: "Occupied", price: "₵300/month", student: "Kwame Asante", floor: "1st", lastCleaned: "2024-03-20" },
    { id: 2, roomNumber: "102", type: "Double Room", status: "Available", price: "₵500/month", student: "Vacant", floor: "1st", lastCleaned: "2024-03-21" },
    { id: 3, roomNumber: "103", type: "Single Room", status: "Maintenance", price: "₵300/month", student: "N/A", floor: "1st", lastCleaned: "2024-03-15" },
    { id: 4, roomNumber: "201", type: "Triple Room", status: "Occupied", price: "₵700/month", student: "Group (3 students)", floor: "2nd", lastCleaned: "2024-03-19" },
  ];

  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [activeModal, setActiveModal] = useState<"view" | "edit" | "delete" | "add" | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<Omit<Room, "id">>({
    roomNumber: "", type: "Single Room", status: "Available", price: "", student: "Vacant", floor: "1st", lastCleaned: new Date().toISOString().split('T')[0]
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (text: string, type: ToastMessage["type"] = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  const openEdit = (room: Room) => {
    setSelectedRoom(room);
    setFormData({ ...room });
    setActiveModal("edit");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeModal === "edit" && selectedRoom) {
      setRooms(prev => prev.map(r => r.id === selectedRoom.id ? { ...formData, id: r.id } : r));
      addToast(`Room ${formData.roomNumber} updated!`);
      setActiveModal(null);
    } 
  };

  const handleDelete = () => {
    if (selectedRoom) {
      setRooms(prev => prev.filter(r => r.id !== selectedRoom.id));
      addToast(`Room deleted`, "error");
      setActiveModal(null);
    }
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter(r => {
      const matchesSearch = r.roomNumber.includes(searchTerm) || r.student.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "All" || r.status === filterStatus;
      const matchesType = filterType === "All" || r.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [rooms, searchTerm, filterStatus, filterType]);

  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const currentData = filteredRooms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Room Inventory</h2>
            <p className="text-sm text-gray-500 font-medium">Manage occupancy and room statuses</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 sm:min-w-[300px]">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search room or student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF]/50 focus:border-[#00CFFF] outline-none transition-all text-sm"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-5 py-3 border rounded-xl font-bold text-sm transition-all ${showFilters ? 'bg-[#00CFFF] border-[#00CFFF] text-white shadow-lg shadow-[#00CFFF]/20' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'}`}
            >
              <FiFilter /> Filter
            </button>
          </div>
        </div>

        {/* --- Dynamic Filter Panel --- */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 p-5 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Status</label>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-[#00CFFF]/30 text-sm font-medium"
              >
                <option value="All">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Room Category</label>
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-[#00CFFF]/30 text-sm font-medium"
              >
                <option value="All">All Types</option>
                <option value="Single Room">Single Room</option>
                <option value="Double Room">Double Room</option>
                <option value="Triple Room">Triple Room</option>
              </select>
            </div>
            <div className="flex items-end justify-center sm:justify-start">
              <button 
                onClick={() => { setFilterStatus("All"); setFilterType("All"); setSearchTerm(""); }}
                className="text-xs font-bold text-[#FF4FA1] hover:bg-[#FF4FA1]/10 px-4 py-2 rounded-lg transition-colors"
              >
                Clear All Parameters
              </button>
            </div>
          </div>
        )}

        {/* --- Mobile: Card List / Desktop: Table --- */}
        <div className="md:hidden space-y-4">
            {currentData.length > 0 ? currentData.map((room) => (
                <div key={room.id} className="p-5 border border-gray-100 dark:border-gray-700 rounded-2xl space-y-4 bg-white dark:bg-gray-800/50 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-black text-lg dark:text-white">Room {room.roomNumber}</h3>
                            <p className="text-xs text-gray-500 font-medium">{room.type} • Floor {room.floor}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            room.status === "Occupied" ? "bg-green-100 text-green-600" :
                            room.status === "Available" ? "bg-blue-100 text-blue-600" :
                            "bg-yellow-100 text-yellow-600"
                        }`}>
                            {room.status}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm py-2 border-y border-gray-50 dark:border-gray-700">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                            <FiUser className="text-gray-400" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Occupant</p>
                            <p className="font-bold text-gray-700 dark:text-gray-300 truncate">{room.student}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-[10px] font-bold text-gray-400 uppercase">Rate</p>
                             <p className="font-black text-[#00CFFF]">{room.price.split('/')[0]}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <button onClick={() => { setSelectedRoom(room); setActiveModal("view"); }} className="flex-1 py-2.5 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl flex items-center justify-center gap-2 text-xs font-bold active:scale-95 transition-all"><FiEye /> View</button>
                        <button onClick={() => openEdit(room)} className="flex-1 py-2.5 bg-gray-50 dark:bg-gray-700 text-green-600 rounded-xl flex items-center justify-center gap-2 text-xs font-bold active:scale-95 transition-all"><FiEdit /> Edit</button>
                        <button onClick={() => { setSelectedRoom(room); setActiveModal("delete"); }} className="p-2.5 text-[#FF4FA1] hover:bg-[#FF4FA1]/10 rounded-xl transition-all"><FiTrash2 size={20} /></button>
                    </div>
                </div>
            )) : (
                <div className="text-center py-10 bg-gray-50 dark:bg-gray-700/20 rounded-2xl">
                    <p className="text-gray-500 font-medium">No results found.</p>
                </div>
            )}
        </div>

        {/* --- Desktop Table View --- */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="text-left py-4 px-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Room Definition</th>
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
                    <div className="text-[11px] font-bold text-gray-400 mt-0.5">{room.type} • Floor {room.floor}</div>
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
                  <td className="py-5 px-4">
                    <div className="font-bold text-gray-700 dark:text-gray-300 text-sm">{room.price}</div>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                        <FiUser className="text-gray-400" />
                      </div>
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{room.student}</span>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setSelectedRoom(room); setActiveModal("view"); }} className="p-2 text-gray-400 hover:text-[#00CFFF] hover:bg-[#00CFFF]/10 rounded-xl transition-all"><FiEye size={18} /></button>
                      <button onClick={() => openEdit(room)} className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-500/10 rounded-xl transition-all"><FiEdit size={18} /></button>
                      <button onClick={() => { setSelectedRoom(room); setActiveModal("delete"); }} className="p-2 text-gray-400 hover:text-[#FF4FA1] hover:bg-[#FF4FA1]/10 rounded-xl transition-all"><FiTrash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-gray-500 font-medium">No results matched your current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- Responsive Pagination --- */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Page {currentPage} of {totalPages || 1}</p>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 transition-all shrink-0"
            >
              Prev
            </button>
            <div className="flex gap-1.5">
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-xs font-black transition-all shrink-0 ${currentPage === i + 1 ? 'bg-[#00CFFF] text-white shadow-lg shadow-[#00CFFF]/20' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 transition-all shrink-0"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* --- Responsive Modals (Edit/View/Delete) --- */}
      {/* (Remains functionally the same but with enhanced padding/rounded corners in the Modal component above) */}
      
      {activeModal === "edit" && (
        <Modal title="Configure Room" onClose={() => setActiveModal(null)}>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Room Code</label>
                <input required className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-[#00CFFF]/30 text-sm font-bold" value={formData.roomNumber} onChange={e => setFormData({...formData, roomNumber: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Floor Level</label>
                <input className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-[#00CFFF]/30 text-sm font-bold" value={formData.floor} onChange={e => setFormData({...formData, floor: e.target.value})} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Room Category</label>
              <select className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-[#00CFFF]/30 text-sm font-bold" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option>Single Room</option>
                <option>Double Room</option>
                <option>Triple Room</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Monthly Billing</label>
              <input required className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-[#00CFFF]/30 text-sm font-bold" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Assigned Resident</label>
              <input className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-[#00CFFF]/30 text-sm font-bold" value={formData.student} onChange={e => setFormData({...formData, student: e.target.value})} />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <button type="button" onClick={() => setActiveModal(null)} className="order-2 sm:order-1 px-6 py-3 text-gray-500 font-bold text-sm">Cancel</button>
              <button type="submit" className="order-1 sm:order-2 px-8 py-3 bg-[#00CFFF] text-white rounded-xl font-black uppercase tracking-widest text-sm shadow-xl shadow-[#00CFFF]/20 active:scale-95 transition-all">Update Room</button>
            </div>
          </form>
        </Modal>
      )}

      {activeModal === "view" && selectedRoom && (
        <Modal title={`Room Profile: ${selectedRoom.roomNumber}`} onClose={() => setActiveModal(null)}>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                    <p className="font-black text-[#00CFFF] text-sm">{selectedRoom.status}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Price</p>
                    <p className="font-black dark:text-white text-sm">{selectedRoom.price}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Level</p>
                    <p className="font-black dark:text-white text-sm">{selectedRoom.floor} Floor</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Last Log</p>
                    <p className="font-black dark:text-white text-xs">{selectedRoom.lastCleaned}</p>
                </div>
            </div>
            
            <div className="flex items-center gap-4 p-5 border border-[#00CFFF]/20 bg-[#00CFFF]/5 rounded-2xl">
               <div className="w-14 h-14 bg-[#00CFFF] text-white flex items-center justify-center rounded-2xl shadow-lg shadow-[#00CFFF]/20 text-2xl shrink-0"><FiUser /></div>
               <div className="overflow-hidden">
                   <p className="text-[10px] font-black text-[#00CFFF] uppercase tracking-[0.2em] mb-1">Primary Occupant</p>
                   <p className="font-black dark:text-white text-lg truncate">{selectedRoom.student}</p>
               </div>
            </div>

            <button onClick={() => setActiveModal(null)} className="w-full py-4 bg-gray-900 dark:bg-gray-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95">Dismiss Overview</button>
          </div>
        </Modal>
      )}

      {activeModal === "delete" && selectedRoom && (
        <Modal title="Security Confirmation" onClose={() => setActiveModal(null)}>
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-[#FF4FA1]/10 text-[#FF4FA1] rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl animate-bounce"><FiTrash2 /></div>
            <h4 className="text-xl font-black mb-2 dark:text-white">Delete Room Record?</h4>
            <p className="text-sm text-gray-500 px-4">This will permanently remove <span className="font-black text-gray-900 dark:text-white">Room {selectedRoom.roomNumber}</span> from the inventory database.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button onClick={() => setActiveModal(null)} className="order-2 sm:order-1 flex-1 py-4 text-gray-500 font-bold">Cancel</button>
            <button onClick={handleDelete} className="order-1 sm:order-2 flex-1 py-4 bg-[#FF4FA1] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-[#FF4FA1]/20 active:scale-95 transition-all">Authorize Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Rooms;