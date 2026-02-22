"use client";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit,
  FiTrash2,
  FiUser,
} from "react-icons/fi";

interface RoomsProps {}

const Rooms: React.FC<RoomsProps> = () => {
  const rooms = [
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

  return (
    <div className="space-y-6">
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              <FiFilter />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Room Number
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Price
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
              {rooms.map((room) => (
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
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#00CFFF] hover:bg-[#00CFFF]/10 rounded-lg transition-colors">
                        <FiEye />
                      </button>
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-500 hover:bg-green-500/10 rounded-lg transition-colors">
                        <FiEdit />
                      </button>
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#FF4FA1] hover:bg-[#FF4FA1]/10 rounded-lg transition-colors">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {rooms.length} rooms
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Previous
            </button>
            <button className="px-4 py-2 bg-[#00CFFF] text-white rounded-lg hover:bg-[#00CFFF]/90">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
