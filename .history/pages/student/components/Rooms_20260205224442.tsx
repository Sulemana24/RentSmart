"use client";

import { useState, useMemo } from "react";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit,
  FiTrash2,
  FiUser,
  FiX,
  FiCheck,
} from "react-icons/fi";

interface Room {
  id: number;
  roomNumber: string;
  type: string;
  status: "Occupied" | "Available" | "Maintenance";
  price: string;
  student: string;
}

const Rooms: React.FC = () => {
  // Sample room data
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
    // Add more sample rooms as needed
  ];

  // States
  const [rooms, setRooms] = useState<Room[]>(roomsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Room | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  // Search filter
  const filteredRooms = useMemo(() => {
    if (!searchTerm) return rooms;

    return rooms.filter((room) => {
      const lowerTerm = searchTerm.toLowerCase();
      return (
        room.roomNumber.toLowerCase().includes(lowerTerm) ||
        room.type.toLowerCase().includes(lowerTerm) ||
        room.student.toLowerCase().includes(lowerTerm) ||
        room.status.toLowerCase().includes(lowerTerm)
      );
    });
  }, [searchTerm, rooms]);

  // Sort function
  const sortedRooms = useMemo(() => {
    if (!sortField) return filteredRooms;

    return [...filteredRooms].sort((a, b) => {
      let aField = a[sortField];
      let bField = b[sortField];

      // For price, remove currency symbol and parse number
      if (sortField === "price") {
        aField = Number(aField.replace(/[^\d]/g, ""));
        bField = Number(bField.replace(/[^\d]/g, ""));
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

  // Handlers
  const handleSort = (field: keyof Room) => {
    if (sortField === field) {
      // Toggle direction
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDeleteClick = (room: Room) => {
    setRoomToDelete(room);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!roomToDelete) return;
    setRooms((prev) => prev.filter((r) => r.id !== roomToDelete.id));
    setShowDeleteModal(false);
    setRoomToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setRoomToDelete(null);
  };

  // Placeholder for edit/view
  const handleEdit = (room: Room) => alert(`Edit room ${room.roomNumber}`);
  const handleView = (room: Room) => alert(`View room ${room.roomNumber}`);

  return (
    <div className="space-y-6">
      {/* Delete confirmation modal */}
      {showDeleteModal && roomToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-80 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Delete
            </h3>
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
          </div>
        </div>
      )}

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
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {room.roomNumber}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                      {room.type}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          room.status === "Occupied"
                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                            : room.status === "Available"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                        }`}
                      >
                        {room.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                      {room.price}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <FiUser className="text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {room.student}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(room)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#00CFFF] hover:bg-[#00CFFF]/10 rounded-lg transition-colors"
                          title="View"
                        >
                          <FiEye />
                        </button>
                        <button
                          onClick={() => handleEdit(room)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(room)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#FF4FA1] hover:bg-[#FF4FA1]/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {paginatedRooms.length} of {sortedRooms.length} rooms
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-4 py-2 rounded-lg ${
                    pageNum === currentPage
                      ? "bg-[#00CFFF] text-white"
                      : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
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