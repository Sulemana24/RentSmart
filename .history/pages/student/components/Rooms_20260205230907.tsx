"use client";

import React, { useState, useMemo } from "react";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit,
  FiTrash2,
  FiUser,
} from "react-icons/fi";

// --- Interfaces ---

interface Room {
  id: number;
  roomNumber: string;
  type: string;
  status: "Occupied" | "Available" | "Maintenance";
  price: string;
  student: string;
}

interface ToastMessage {
  id: number;
  text: string;
  type: "success" | "error" | "info";
}

// --- Shared Modal Component ---

const Modal: React.FC<{
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}> = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">✕</button>
      </div>
      {children}
    </div>
  </div>
);

const Rooms: React.FC = () => {
  // --- Data & State ---
  const initialRooms: Room[] = [
    { id: 1, roomNumber: "101", type: "Single Room", status: "Occupied", price: "₵300/month", student: "Kwame Asante" },
    { id: 2, roomNumber: "102", type: "Double Room", status: "Available", price: "₵500/month", student: "Vacant" },
    { id: 3, roomNumber: "103", type: "Single Room", status: "Maintenance", price: "₵300/month", student: "N/A" },
    { id: 4, roomNumber: "104", type: "Triple Room", status: "Occupied", price: "₵700/month", student: "Group (3 students)" },
  ];

  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal & Edit States
  const [activeModal, setActiveModal] = useState<"view" | "edit" | "delete" | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [editForm, setEditForm] = useState<Omit<Room, "id">>({
    roomNumber: "", type: "", status: "Available", price: "", student: ""
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // --- Handlers ---

  const addToast = (text: string, type: ToastMessage["type"] = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  const handleEditClick = (room: Room) => {
    setSelectedRoom(room);
    setEditForm({ ...room });
    setActiveModal("edit");
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setRooms(prev => prev.map(r => r.id === selectedRoom?.id ? { ...selectedRoom, ...editForm } : r));
    setActiveModal(null);
    addToast(`Room ${editForm.roomNumber} updated successfully`);
  };

  const handleDelete = () => {
    if (selectedRoom) {
      setRooms(prev => prev.filter(r => r.id !== selectedRoom.id));
      addToast(`Room ${selectedRoom.roomNumber} deleted`, "error");
      setActiveModal(null);
    }
  };

  // --- Filter & Pagination Logic ---

  const filteredRooms = useMemo(() => {
    return rooms.filter(r => 
      r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.student.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rooms, searchTerm]);

  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const currentData = filteredRooms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Toast Notification Container */}
      <div className="fixed top-5 right-5 z-[60] flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className={`px-4 py-3 rounded-lg shadow-lg text-white font-medium animate-bounce ${t.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {t.text}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Room Management</h2>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent outline-none"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <FiFilter />
              Filter
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {["Room Number", "Type", "Status", "Price", "Occupant", "Actions"].map((head) => (
                  <th key={head} className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map((room) => (
                <tr key={room.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900 dark:text-white">{room.roomNumber}</div>
                  </td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{room.type}</td>
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
                      <FiUser className="text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">{room.student}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => { setSelectedRoom(room); setActiveModal("view"); }}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#00CFFF] hover:bg-[#00CFFF]/10 rounded-lg transition-colors"
                      >
                        <FiEye />
                      </button>
                      <button 
                        onClick={() => handleEditClick(room)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                      >
                        <FiEdit />
                      </button>
                      <button 
                        onClick={() => { setSelectedRoom(room); setActiveModal("delete"); }}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#FF4FA1] hover:bg-[#FF4FA1]/10 rounded-lg transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {currentData.length} of {filteredRooms.length} rooms
          </div>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button className="px-4 py-2 bg-[#00CFFF] text-white rounded-lg hover:bg-[#00CFFF]/90">
              {currentPage}
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* --- Modals Implementation --- */}
      
      {activeModal === "delete" && selectedRoom && (
        <Modal title="Delete Room" onClose={() => setActiveModal(null)}>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Are you sure you want to delete <span className="font-bold text-gray-900 dark:text-white">Room {selectedRoom.roomNumber}</span>?</p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setActiveModal(null)} className="px-4 py-2 text-gray-600 dark:text-gray-400">Cancel</button>
            <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Delete Room</button>
          </div>
        </Modal>
      )}

      {activeModal === "edit" && (
        <Modal title="Edit Room" onClose={() => setActiveModal(null)}>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room Number</label>
              <input 
                className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-[#00CFFF]"
                value={editForm.roomNumber}
                onChange={e => setEditForm({...editForm, roomNumber: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select 
                className="w-full p-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-[#00CFFF]"
                value={editForm.status}
                onChange={e => setEditForm({...editForm, status: e.target.value as any})}
              >
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 text-gray-500">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-[#00CFFF] text-white rounded-lg">Save Changes</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Rooms;