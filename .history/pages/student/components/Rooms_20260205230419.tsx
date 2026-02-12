"use client";

import React, { useState, useMemo } from "react";
import { FiSearch, FiFilter, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

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

// --- Shared Components ---

const Modal: React.FC<{
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}> = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 mx-4">
      <div className="flex justify-between items-center mb-4 border-b dark:border-gray-700 pb-2">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>
      </div>
      <div>{children}</div>
    </div>
  </div>
);

// --- Main Component ---

const Rooms: React.FC = () => {
  // Initial Data
  const roomsData: Room[] = [
    { id: 1, roomNumber: "101", type: "Single Room", status: "Occupied", price: "₵300/month", student: "Kwame Asante" },
    { id: 2, roomNumber: "102", type: "Double Room", status: "Available", price: "₵500/month", student: "Vacant" },
    { id: 3, roomNumber: "103", type: "Single Room", status: "Maintenance", price: "₵300/month", student: "N/A" },
    { id: 4, roomNumber: "104", type: "Triple Room", status: "Occupied", price: "₵700/month", student: "Group (3 students)" },
  ];

  // State Management
  const [rooms, setRooms] = useState<Room[]>(roomsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Room | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [roomToView, setRoomToView] = useState<Room | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);

  const [editForm, setEditForm] = useState({
    roomNumber: "",
    type: "",
    status: "Available" as Room["status"],
    price: "",
    student: "",
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // --- Helpers ---

  const addToast = (text: string, type: ToastMessage["type"] = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // --- Filtering & Sorting Logic ---

  const filteredRooms = useMemo(() => {
    if (!searchTerm) return rooms;
    const lowerTerm = searchTerm.toLowerCase();
    return rooms.filter((room) =>
      Object.values(room).some(val => 
        val.toString().toLowerCase().includes(lowerTerm)
      )
    );
  }, [searchTerm, rooms]);

  const sortedRooms = useMemo(() => {
    if (!sortField) return filteredRooms;

    return [...filteredRooms].sort((a, b) => {
      let aField = a[sortField];
      let bField = b[sortField];

      if (sortField === "price") {
        aField = Number((aField as string).replace(/[^\d]/g, ""));
        bField = Number((bField as string).replace(/[^\d]/g, ""));
      }

      if (aField < bField) return sortDirection === "asc" ? -1 : 1;
      if (aField > bField) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [sortField, sortDirection, filteredRooms]);

  const paginatedRooms = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedRooms.slice(start, start + itemsPerPage);
  }, [currentPage, sortedRooms]);

  const totalPages = Math.ceil(sortedRooms.length / itemsPerPage);

  // --- Action Handlers ---

  const handleSort = (field: keyof Room) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const confirmDelete = () => {
    if (!roomToDelete) return;
    setRooms((prev) => prev.filter((r) => r.id !== roomToDelete.id));
    setShowDeleteModal(false);
    addToast(`Room ${roomToDelete.roomNumber} deleted`, "success");
    setRoomToDelete(null);
  };

  const handleEdit = (room: Room) => {
    setRoomToEdit(room);
    setEditForm({ ...room });
    setShowEditModal(true);
  };

  const submitEdit = () => {
    if (!roomToEdit) return;
    setRooms((prev) =>
      prev.map((room) => (room.id === roomToEdit.id ? { ...room, ...editForm } : room))
    );
    setShowEditModal(false);
    addToast(`Room ${editForm.roomNumber} updated`, "success");
  };

  return (
    <div className="space-y-6 p-4 max-w-5xl mx-auto min-h-screen">
      
      {/* --- Toasts --- */}
      <div aria-live="polite" className="fixed top-5 right-5 flex flex-col gap-2 z-[60]">
        {toasts.map((toast) => (
          <div key={toast.id}
            className={`max-w-xs w-full rounded-lg p-4 text-white font-medium shadow-2xl animate-in slide-in-from-right-5 ${
              toast.type === "success" ? "bg-green-600" : toast.type === "error" ? "bg-red-600" : "bg-blue-600"
            }`}
          >
            {toast.text}
          </div>
        ))}
      </div>

      {/* --- Modals --- */}
      {showDeleteModal && roomToDelete && (
        <Modal onClose={() => setShowDeleteModal(false)} title="Confirm Delete">
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            Are you sure you want to delete room <strong>{roomToDelete.roomNumber}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 rounded-lg border dark:border-gray-600 text-gray-600 dark:text-gray-300">Cancel</button>
            <button onClick={confirmDelete} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600">Delete</button>
          </div>
        </Modal>
      )}

      {showViewModal && roomToView && (
        <Modal onClose={() => setShowViewModal(false)} title={`Room ${roomToView.roomNumber} Details`}>
          <div className="space-y-3 text-gray-800 dark:text-gray-200">
            <p><strong>Type:</strong> {roomToView.type}</p>
            <p><strong>Status:</strong> <span className="px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700">{roomToView.status}</span></p>
            <p><strong>Price:</strong> {roomToView.price}</p>
            <p><strong>Occupant:</strong> {roomToView.student}</p>
          </div>
          <button onClick={() => setShowViewModal(false)} className="mt-6 w-full py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">Close</button>
        </Modal>
      )}

      {showEditModal && (
        <Modal onClose={() => setShowEditModal(false)} title="Edit Room Information">
          <form onSubmit={(e) => { e.preventDefault(); submitEdit(); }} className="space-y-4">
            {["roomNumber", "type", "price", "student"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                <input
                  name={field}
                  value={(editForm as any)[field]}
                  onChange={(e) => setEditForm(p => ({ ...p, [field]: e.target.value }))}
                  className="w-full rounded-md border dark:border-gray-600 dark:bg-gray-700 p-2"
                  required
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={editForm.status}
                onChange={(e) => setEditForm(p => ({ ...p, status: e.target.value as any }))}
                className="w-full rounded-md border dark:border-gray-600 dark:bg-gray-700 p-2"
              >
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-gray-500">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-lg">Save Changes</button>
            </div>
          </form>
        </Modal>
      )}

      {/* --- Main Table Card --- */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Room Management</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-9 pr-4 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              onClick={() => { setSearchTerm(""); setSortField(""); setCurrentPage(1); }}
              className="p-2 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              title="Reset Filters"
            >
              <FiFilter />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 text-sm uppercase">
              <tr>
                {["roomNumber", "type", "status", "price"].map((key) => (
                  <th key={key} className="px-6 py-4 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => handleSort(key as any)}>
                    {key.replace(/([A-Z])/g, ' $1')} {sortField === key && (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                ))}
                <th className="px-6 py-4">Occupant</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {paginatedRooms.length > 0 ? (
                paginatedRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 font-medium dark:text-white">{room.roomNumber}</td>
                    <td className="px-6 py-4">{room.type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        room.status === "Available" ? "bg-green-100 text-green-700" : 
                        room.status === "Occupied" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{room.price}</td>
                    <td className="px-6 py-4">{room.student}</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-3">
                      <button onClick={() => { setRoomToView(room); setShowViewModal(true); }} className="text-gray-400 hover:text-blue-500"><FiEye size={18}/></button>
                      <button onClick={() => handleEdit(room)} className="text-gray-400 hover:text-green-500"><FiEdit size={18}/></button>
                      <button onClick={() => { setRoomToDelete(room); setShowDeleteModal(true); }} className="text-gray-400 hover:text-red-500"><FiTrash2 size={18}/></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No rooms match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- Pagination --- */}
        <div className="p-6 border-t dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/30">
          <span className="text-sm text-gray-500">Page {currentPage} of {totalPages || 1}</span>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(p => p - 1)}
              className="px-4 py-2 border dark:border-gray-600 rounded-lg disabled:opacity-30"
            >
              Previous
            </button>
            <button 
              disabled={currentPage === totalPages || totalPages === 0} 
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-4 py-2 border dark:border-gray-600 rounded-lg disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;