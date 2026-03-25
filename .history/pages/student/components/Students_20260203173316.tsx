"use client";
import { FiPlus, FiEye } from "react-icons/fi";

const Students: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Student Management
          </h2>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-[#FF4FA1] text-white rounded-lg hover:bg-[#FF4FA1]/90 flex items-center gap-2">
              <FiPlus />
              Add Student
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Students", count: "86", color: "bg-[#00CFFF]" },
            { label: "New This Month", count: "8", color: "bg-[#FF4FA1]" },
            { label: "Graduating Soon", count: "12", color: "bg-yellow-500" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"
            >
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.count}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Student List */}
        <div className="space-y-4">
          {[
            {
              name: "Kwame Asante",
              room: "101",
              checkIn: "2024-01-15",
              status: "Active",
            },
            {
              name: "Ama Serwaa",
              room: "104",
              checkIn: "2024-02-01",
              status: "Active",
            },
            {
              name: "John Mensah",
              room: "105",
              checkIn: "2023-09-10",
              status: "Leaving Soon",
            },
            {
              name: "Kofi Ansah",
              room: "201",
              checkIn: "2024-03-01",
              status: "New",
            },
          ].map((student, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="mb-3 md:mb-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-lg font-medium text-gray-900 dark:text-white">
                    {student.name}
                  </div>
                  <div
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      student.status === "Active"
                        ? "bg-green-500/10 text-green-600"
                        : student.status === "New"
                          ? "bg-blue-500/10 text-blue-600"
                          : "bg-yellow-500/10 text-yellow-600"
                    }`}
                  >
                    {student.status}
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Room {student.room} • Check-in: {student.checkIn}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-[#00CFFF] text-white rounded-lg text-sm hover:bg-[#00CFFF]/90 flex items-center gap-1">
                  <FiEye />
                  View
                </button>
                <button className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Students;
