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
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full p-6 border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
          <FiX size={20} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const Rooms: React.FC = () => {
  // --- Initial Data ---
  const initialRooms: Room[] = [
    { id: 1, roomNumber: "101", type: "Single Room", status: "Occupied", price: "₵300/month", student: "Kwame Asante", floor: "1st", lastCleaned: "2024-03-20" },
    { id: 2, roomNumber: "102", type: "Double Room", status: "Available", price: "₵500/month", student: "Vacant", floor: "1st", lastCleaned: "2024-03-21" },
    { id: 3, roomNumber: "103", type: "Single Room", status: "Maintenance", price: "₵300/month", student: "N/A", floor: "1st", lastCleaned: "2024-03-15" },
    { id: 4, roomNumber: "201", type: "Triple Room", status: "Occupied", price: "₵700/month", student: "Group (3 students)", floor: "2nd", lastCleaned: "2024-03-19" },
  ];

  // --- State ---
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal States
  const [activeModal, setActiveModal] = useState<"view" | "edit" | "delete" | "add" | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<Omit<Room, "id">>({
    roomNumber: "", type: "Single Room", status: "Available", price: "", student: "Vacant", floor: "1st", lastCleaned: new Date().toISOString().split('T')[0]
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // --- Helpers ---
  const addToast = (text: string, type: ToastMessage["type"] = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  // --- Action Handlers ---
  const openEdit = (room: Room) => {
    setSelectedRoom(room);
    setFormData({ ...room });
    setActiveModal("edit");
  };

  /* COMMENTED OUT ADD ROOM LOGIC
  const openAdd = () => {
    setFormData({ roomNumber: "", type: "Single Room", status: "Available", price: "", student: "Vacant", floor: "1st", lastCleaned: new Date().toISOString().split('T')[0] });
    setActiveModal("add");
  };
  */

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeModal === "edit" && selectedRoom) {
      setRooms(prev => prev.map(r => r.id === selectedRoom.id ? { ...formData, id: r.id } : r));
      addToast(`Room ${formData.roomNumber} updated!`);
    } else if (activeModal === "add") {
      setRooms(prev => [...prev, { ...formData, id: Date.now() }]);
      addToast(`New Room ${formData.roomNumber} added!`);
    }
    setActiveModal(null);
  };

  const handleDelete = () => {
    if (selectedRoom) {
      setRooms(prev => prev.filter(r => r.id !== selectedRoom.id));
      addToast(`Room deleted`, "error");
      setActiveModal(null);
    }
  };

  // --- Filter & Pagination Logic ---
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
    <div className="space-y-6">
      {/* Toast Container */}
      <div className="fixed top-5 right-5 z-[70] flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className={`px-4 py-3 rounded-lg shadow-xl text-white font-medium flex items-center gap-2 animate-in slide-in-from-right-full ${t.type === 'success' ? 'bg-green-600' : t.type === 'error' ? 'bg-[#FF4FA1]' : 'bg-blue-600'}`}>
            <FiCheckCircle /> {t.text}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        {/* --- Header & Search Bar --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Room Inventory</h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search room or student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] outline-none"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${showFilters ? 'bg-[#00CFFF]/10 border-[#00CFFF] text-[#00CFFF]' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'}`}
            >
              <FiFilter /> Filter
            </button>
            
            {/* COMMENTED OUT ADD ROOM BUTTON 
            <button 
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 bg-[#00CFFF] text-white rounded-lg hover:bg-[#00CFFF]/90 transition-all shadow-md active:scale-95"
            >
              <FiPlus /> Add Room
            </button> 
            */}
          </div>
        </div>

        {/* --- Filter Panel --- */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Status</label>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-md dark:text-white outline-none focus:ring-1 focus:ring-[#00CFFF]"
              >
                <option value="All">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Room Type</label>
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full p-2 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-md dark:text-white outline-none focus:ring-1 focus:ring-[#00CFFF]"
              >
                <option value="All">All Types</option>
                <option value="Single Room">Single Room</option>
                <option value="Double Room">Double Room</option>
                <option value="Triple Room">Triple Room</option>
              </select>
            </div>
            <div className="flex items-end">
              <button 
                onClick={() => { setFilterStatus("All"); setFilterType("All"); setSearchTerm(""); }}
                className="text-sm text-[#FF4FA1] hover:underline"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}

        {/* --- Table --- */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Room Info</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Pricing</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Occupant</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? currentData.map((room) => (
                <tr key={room.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                  <td className="py-4 px-4">
                    <div className="font-bold text-gray-900 dark:text-white">Room {room.roomNumber}</div>
                    <div className="text-xs text-gray-500">{room.type} • Floor {room.floor}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        room.status === "Occupied" ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                        room.status === "Available" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                        "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                    }`}>
                      {room.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">{room.price}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <FiUser className="text-gray-400" />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{room.student}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setSelectedRoom(room); setActiveModal("view"); }} className="p-2 text-gray-400 hover:text-[#00CFFF] hover:bg-[#00CFFF]/10 rounded-lg transition-all"><FiEye /></button>
                      <button onClick={() => openEdit(room)} className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-500/10 rounded-lg transition-all"><FiEdit /></button>
                      <button onClick={() => { setSelectedRoom(room); setActiveModal("delete"); }} className="p-2 text-gray-400 hover:text-[#FF4FA1] hover:bg-[#FF4FA1]/10 rounded-lg transition-all"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500">No rooms found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- Pagination --- */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">Showing {currentData.length} rooms</p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all ${currentPage === i + 1 ? 'bg-[#00CFFF] text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* --- Modals --- */}
      
      {activeModal === "edit" && (
        <Modal title="Edit Room Data" onClose={() => setActiveModal(null)}>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room Number</label>
                <input required className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-[#00CFFF]" value={formData.roomNumber} onChange={e => setFormData({...formData, roomNumber: e.target.value})} placeholder="e.g. 101" />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Floor</label>
                <input className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-[#00CFFF]" value={formData.floor} onChange={e => setFormData({...formData, floor: e.target.value})} placeholder="1st" />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                <select className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-[#00CFFF]" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option>Single Room</option>
                  <option>Double Room</option>
                  <option>Triple Room</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price</label>
                <input required className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-[#00CFFF]" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="₵300/month" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Occupant Name</label>
              <input className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-[#00CFFF]" value={formData.student} onChange={e => setFormData({...formData, student: e.target.value})} placeholder="Vacant" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 text-gray-500">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-[#00CFFF] text-white rounded-lg font-bold">Update Room</button>
            </div>
          </form>
        </Modal>
      )}

      {activeModal === "view" && selectedRoom && (
        <Modal title={`Room ${selectedRoom.roomNumber} Overview`} onClose={() => setActiveModal(null)}>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl grid grid-cols-2 gap-y-4">
              <div><p className="text-[10px] uppercase font-black text-gray-400">Current Status</p><p className="font-bold text-[#00CFFF]">{selectedRoom.status}</p></div>
              <div><p className="text-[10px] uppercase font-black text-gray-400">Monthly Price</p><p className="font-bold dark:text-white">{selectedRoom.price}</p></div>
              <div><p className="text-[10px] uppercase font-black text-gray-400">Room Type</p><p className="dark:text-white">{selectedRoom.type}</p></div>
              <div><p className="text-[10px] uppercase font-black text-gray-400">Last Maintenance</p><p className="dark:text-white">{selectedRoom.lastCleaned}</p></div>
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full py-3 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Close Portal</button>
          </div>
        </Modal>
      )}

      {activeModal === "delete" && selectedRoom && (
        <Modal title="Confirm Removal" onClose={() => setActiveModal(null)}>
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-[#FF4FA1]/10 text-[#FF4FA1] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"><FiTrash2 /></div>
            <p className="text-gray-600 dark:text-gray-400">You are about to delete <span className="font-bold text-gray-900 dark:text-white">Room {selectedRoom.roomNumber}</span>.</p>
          </div>
          <div className="flex justify-center gap-3 mt-6">
            <button onClick={() => setActiveModal(null)} className="px-6 py-2 text-gray-500">Cancel</button>
            <button onClick={handleDelete} className="px-6 py-2 bg-[#FF4FA1] text-white rounded-lg font-bold">Confirm Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Rooms;