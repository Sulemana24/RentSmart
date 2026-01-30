import React from "react";
import {
  FiUsers,
  FiHome,
  FiUserCheck,
  FiActivity,
  FiEye,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";

interface User {
  name: string;
  email: string;
  role: string;
  joined: string;
  status: string;
}

interface UserStat {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const Users: React.FC = () => {
  const users: User[] = [
    {
      name: "John Doe",
      email: "john@example.com",
      role: "Homeowner",
      joined: "2024-01-15",
      status: "Active",
    },
    {
      name: "Sarah Smith",
      email: "sarah@example.com",
      role: "Agent",
      joined: "2024-02-20",
      status: "Active",
    },
    {
      name: "Kwame Asante",
      email: "kwame@example.com",
      role: "Renter",
      joined: "2024-03-01",
      status: "Active",
    },
    {
      name: "Ama Serwaa",
      email: "ama@example.com",
      role: "Homeowner",
      joined: "2024-02-10",
      status: "Inactive",
    },
    {
      name: "Michael Johnson",
      email: "michael@example.com",
      role: "Agent",
      joined: "2024-03-05",
      status: "Active",
    },
  ];

  const userStats: UserStat[] = [
    {
      label: "Total Users",
      value: "2,458",
      icon: <FiUsers />,
      color: "text-[#00CFFF]",
    },
    {
      label: "Homeowners",
      value: "156",
      icon: <FiHome />,
      color: "text-green-500",
    },
    {
      label: "Renters",
      value: "2,102",
      icon: <FiUserCheck />,
      color: "text-purple-500",
    },
    {
      label: "Agents",
      value: "200",
      icon: <FiActivity />,
      color: "text-[#FF4FA1]",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Users Management
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {userStats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6"
            >
              <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  User
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Role
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Joined
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                    {user.email}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === "Homeowner"
                          ? "bg-blue-500/10 text-blue-600"
                          : user.role === "Agent"
                            ? "bg-green-500/10 text-green-600"
                            : "bg-purple-500/10 text-purple-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                    {user.joined}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === "Active"
                          ? "bg-green-500/10 text-green-600"
                          : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#00CFFF] hover:bg-[#00CFFF]/10 rounded-lg">
                        <FiEye />
                      </button>
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-500 hover:bg-green-500/10 rounded-lg">
                        <FiEdit />
                      </button>
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#FF4FA1] hover:bg-[#FF4FA1]/10 rounded-lg">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
