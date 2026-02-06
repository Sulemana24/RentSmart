"use client";

import { useState, useMemo } from "react";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";

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

const Modal: React.FC<{
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}> = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          aria-label="Close modal"
        >
          ✕
        </button>
      </div>
      <div>{children}</div>
    </div>
  </div>
);

const Rooms: React.FC = () => {
  const roomsData: Room[] = [
    {
      id: 1,
      roomNumber: "101",
      type: "Single Room",
      status: "Occupied",
      price: "₵300/month",
      student: "Kwame Asante",
    },
    {
      id: 2,
      roomNumber: "102",
      type: "Double Room",
      status: "Available",
      price: "₵500/month",
      student: "Vacant",
    },
    {
      id: 3,
      roomNumber: "103",
      type: "Single Room",
      status: "Maintenance",
      price: "₵300/month",
      student: "N/A",
    },
    {
      id: 4,
      roomNumber: "104",
      type: "Triple Room",
      status: "Occupied",
      price: "₵700/month",
      student: "Group (3 students)",
    },
  ];

  const [rooms, setRooms] = useState<Room[]>(roomsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Room | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

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

  // Toast helper
  const addToast = (text: string, type: ToastMessage["type"] = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Filter rooms by search term
  const filteredRooms = useMemo(() => {
    if (!searchTerm) return rooms;
    const lowerTerm = searchTerm.toLowerCase();
    return rooms.filter(
      (room) =>
        room.roomNumber.toLowerCase().includes(lowerTerm) ||
        room.type.toLowerCase().includes(lowerTerm) ||
        room.student.toLowerCase().includes(lowerTerm) ||
        room.status.toLowerCase().includes(lowerTerm)
    );
  }, [searchTerm, rooms]);

  // Sort filtered rooms
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

  // Pagination slice
  const paginatedRooms = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedRooms.slice(start, start + itemsPerPage);
  }, [currentPage, itemsPerPage, sortedRooms]);

  const totalPages = Math.ceil(sortedRooms.length / itemsPerPage);

  // Sorting handler
  const handleSort = (field: keyof Room) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Delete handlers
  const handleDeleteClick = (room: Room) => {
    setRoomToDelete(room);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!roomToDelete) return;
    setRooms((prev) => prev.filter((r) => r.id !== roomToDelete.id));
    setShowDeleteModal(false);
    addToast(`Room ${roomToDelete.roomNumber} deleted`, "success");
    setRoomToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setRoomToDelete(null);
    addToast("Delete cancelled", "info");
  };

  // View handlers
  const handleView = (room: Room) => {
    setRoomToView(room);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setRoomToView(null);
  };

  // Edit handlers
  const handleEdit = (room: Room) => {
    setRoomToEdit(room);
    setEditForm({
      roomNumber: room.roomNumber,
      type: room.type,
      status: room.status,
      price: room.price,
      student: room.student,
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setRoomToEdit(null);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitEdit = () => {
    if (!roomToEdit) return;

    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomToEdit.id
          ? {
              ...room,
              roomNumber: editForm.roomNumber,
              type: editForm.type,
              status: editForm.status,
              price: editForm.price,
              student: editForm.student,
            }
          : room
      )
    );
    setShowEditModal(false);
    addToast(`Room ${editForm.roomNumber} updated`, "success");
    setRoomToEdit(null);
  };

  return (
    <div className="space-y-6 p-4 max-w-5xl mx-auto">
      {/*Toast container*/}
      <div
        aria-live="polite"
        className="fixed top-5 right-5 flex flex-col gap-2 z-50"
      >
        {toasts.map((toast) => (
          <div key={toast.id}
            className={`max-w-xs w-full rounded-lg p-4 text-white font-semibold shadow-lg ${
              toast.type === "success"
                ? "bg-green-600"
                : toast.type === "error"
                ? "bg-red-600"
                : "bg-blue-600"
            }`}
          >
            {toast.text}
          </div>
        ))}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && roomToDelete && (
        <Modal onClose={cancelDelete} title="Confirm Delete">
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            Are you sure you want to delete room {roomToDelete.roomNumber}?
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={cancelDelete}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 rounded-lg bg-[#FF4FA1] text-white hover:bg-[#FF4FA1]/90"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}

      {/* View modal */}
      {showViewModal && roomToView && (
        <Modal onClose={closeViewModal} title={`Room ${roomToView.roomNumber} Details`}>
          <div className="space-y-2 text-gray-900 dark:text-white">
            <p>
              <strong>Type:</strong> {roomToView.type}
            </p>
            <p>
              <strong>Status:</strong> {roomToView.status}
            </p>
            <p>
              <strong>Price:</strong> {roomToView.price}
            </p>
            <p>
              <strong>Occupant:</strong> {roomToView.student}
            </p>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={closeViewModal}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* Edit modal */}
      {showEditModal && roomToEdit && (
        <Modal onClose={closeEditModal} title={`Edit Room ${roomToEdit.roomNumber}`}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitEdit();
            }}
            className="space-y-4 text-gray-900 dark:text-white"
          >
            <div>
              <label className="block mb-1 font-medium">Room Number</label>
              <input
                name="roomNumber"
                value={editForm.roomNumber}
                onChange={handleEditChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Type</label>
              <input
                name="type"
                value={editForm.type}
                onChange={handleEditChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Status</label>
              <select
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-gray-900 dark:text-white"
                required
              >
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Price</label>
              <input
                name="price"
                value={editForm.price}
                onChange={handleEditChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Occupant</label>
              <input
                name="student"
                value={editForm.student}
                onChange={handleEditChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={closeEditModal}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#00CFFF] text-white hover:bg-[#00CFFF]/90"
              >
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Main table content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Room Management
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
              />
            </div>
            <button
              onClick={() => {
                setSortField("");
                setSortDirection("asc");
                setSearchTerm("");
                setCurrentPage(1);
              }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <FiFilter />
              Reset Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 cursor-pointer">
                <th
                  className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400"
                  onClick={() => handleSort("roomNumber")}
                >
                  Room Number{" "}
                  {sortField === "roomNumber" && (
                    <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
                  )}
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400"
                  onClick={() => handleSort("type")}
                >
                  Type{" "}
                  {sortField === "type" && (
                    <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
                  )}
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400"
                  onClick={() => handleSort("status")}
                >
                  Status{" "}
                  {sortField === "status" && (
                    <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
                  )}
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400"
                  onClick={() => handleSort("price")}
                >
                  Price{" "}
                  {sortField === "price" && (
                    <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
                  )}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Occupant
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedRooms.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-10 text-gray-500 dark:text-gray-400"
                  >
                    No rooms found.
                  </td>
                </tr>
              ) : (
                paginatedRooms.map((room) => (
                  <tr
                    key={room.id}
                    className="border-b border-gray-100 dark:border-gray-800
                    <tr
                    key={room.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                      {room.roomNumber}
                    </td>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                      {room.type}
                    </td>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                      {room.status}
                    </td>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                      {room.price}
                    </td>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                      {room.student}
                    </td>
                    <td className="py-4 px-4 flex gap-3 text-gray-600 dark:text-gray-300">
                      <button
                        onClick={() => handleView(room)}
                        aria-label={`View details of room ${room.roomNumber}`}
                        className="hover:text-[#00CFFF]"
                        title="View"
                      >
                        <FiEye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(room)}
                        aria-label={`Edit room ${room.roomNumber}`}
                        className="hover:text-[#00CFFF]"
                        title="Edit"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(room)}
                        aria-label={`Delete room ${room.roomNumber}`}
                        className="hover:text-[#FF4FA1]"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
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