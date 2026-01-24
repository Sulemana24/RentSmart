"use client";
import {
  FiFilter,
  FiSearch,
  FiEye,
  FiEdit,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";
import Table from "./common/Table";
import SearchFilter from "./common/SearchFilter";

const Properties = () => {
  const properties = [
    {
      id: 1,
      name: "Luxury Apartment Accra",
      type: "Apartment",
      status: "Rented",
      price: "₵2,500/month",
      tenants: 3,
    },
    {
      id: 2,
      name: "Modern House East Legon",
      type: "House",
      status: "Available",
      price: "₵3,500/month",
      tenants: 0,
    },
    {
      id: 3,
      name: "Studio Apartments",
      type: "Studio",
      status: "Maintenance",
      price: "₵1,200/month",
      tenants: 1,
    },
    {
      id: 4,
      name: "Commercial Space Osu",
      type: "Commercial",
      status: "Rented",
      price: "₵5,000/month",
      tenants: 2,
    },
  ];

  const columns = [
    {
      key: "name",
      label: "Property",
      type: "text" as const,
      className: "font-medium text-gray-900 dark:text-white",
    },
    {
      key: "type",
      label: "Type",
      type: "text" as const,
    },
    {
      key: "status",
      label: "Status",
      type: "badge" as const,
      badgeColors: {
        Rented: "bg-green-500/10 text-green-600 dark:text-green-400",
        Available: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        Maintenance: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
      },
    },
    {
      key: "price",
      label: "Price",
      type: "text" as const,
      className: "font-medium text-gray-900 dark:text-white",
    },
    {
      key: "tenants",
      label: "Tenants",
      type: "custom" as const,
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <FiUsers className="text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">
            {item.tenants}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      type: "actions" as const,
      actions: [
        { icon: <FiEye />, color: "text-[#00CFFF] hover:bg-[#00CFFF]/10" },
        { icon: <FiEdit />, color: "text-green-500 hover:bg-green-500/10" },
        { icon: <FiTrash2 />, color: "text-[#FF4FA1] hover:bg-[#FF4FA1]/10" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Your Properties
          </h2>
          <SearchFilter
            placeholder="Search properties..."
            onFilter={() => console.log("Filter clicked")}
          />
        </div>

        <Table
          items={properties}
          columns={columns}
          showPagination={true}
          totalItems={properties.length}
        />
      </div>
    </div>
  );
};

export default Properties;
