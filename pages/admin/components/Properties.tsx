import React from "react";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit,
  FiTrash2,
  FiCheck,
  FiX,
} from "react-icons/fi";

interface Property {
  id: number;
  name: string;
  owner: string;
  type: string;
  status: string;
  price: string;
  listed: string;
}

const Properties: React.FC = () => {
  const properties: Property[] = [
    {
      id: 1,
      name: "Luxury Villa East Legon",
      owner: "John Doe",
      type: "Villa",
      status: "Approved",
      price: "₵15,000/month",
      listed: "2024-03-01",
    },
    {
      id: 2,
      name: "Modern Apartment Osu",
      owner: "Sarah Smith",
      type: "Apartment",
      status: "Pending",
      price: "₵4,500/month",
      listed: "2024-03-05",
    },
    {
      id: 3,
      name: "Commercial Space Airport",
      owner: "Kwame Asante",
      type: "Commercial",
      status: "Approved",
      price: "₵25,000/month",
      listed: "2024-02-28",
    },
    {
      id: 4,
      name: "Studio Apartments Cantonments",
      owner: "Ama Serwaa",
      type: "Studio",
      status: "Rejected",
      price: "₵1,800/month",
      listed: "2024-03-10",
    },
    {
      id: 5,
      name: "Family House Labone",
      owner: "Michael Johnson",
      type: "House",
      status: "Approved",
      price: "₵8,000/month",
      listed: "2024-03-08",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Properties Management
          </h2>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-[#00CFFF] text-white rounded-lg hover:bg-[#00CFFF]/90 flex items-center gap-2">
              <FiPlus />
              Add Property
            </button>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties..."
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-48 md:w-64"
              />
            </div>
            <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
              <FiFilter />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Property
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Owner
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr
                  key={property.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {property.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {property.listed}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                    {property.owner}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                      {property.type}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        property.status === "Approved"
                          ? "bg-green-500/10 text-green-600"
                          : property.status === "Pending"
                            ? "bg-yellow-500/10 text-yellow-600"
                            : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {property.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                    {property.price}
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
                      {property.status === "Pending" && (
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 text-green-500 hover:bg-green-500/10 rounded-lg">
                            <FiCheck />
                          </button>
                          <button className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg">
                            <FiX />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {properties.length} of 156 properties
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

export default Properties;
