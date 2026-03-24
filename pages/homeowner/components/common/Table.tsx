"use client";
import { FiChevronRight, FiEdit, FiEye, FiTrash } from "react-icons/fi";

interface Column {
  key: string;
  label: string;
  type:
    | "text"
    | "badge"
    | "indicator"
    | "details"
    | "amount"
    | "custom"
    | "actions";
  className?: string;
  badgeColors?: Record<string, string>;
  render?: (item: any) => any;
  actions?: {
    icon: React.ReactNode;
    color: string;
    onClick?: (item: any) => void;
    title?: string;
  }[];
}

interface TableProps {
  title?: string;
  items: any[];
  columns: Column[];
  viewAllText?: string;
  showPagination?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const Table = ({
  title,
  items,
  columns,
  viewAllText,
  showPagination = false,
  totalItems = 0,
  itemsPerPage = 10,
  currentPage = 1,
  onPageChange,
}: TableProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const renderCell = (item: any, column: Column) => {
    // If there's a custom render function, use it regardless of type
    if (column.render) {
      return column.render(item);
    }

    switch (column.type) {
      case "badge":
        const badgeColor =
          column.badgeColors?.[item[column.key]] || "bg-gray-100 text-gray-800";
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColor}`}
          >
            {item[column.key]}
          </span>
        );

      case "indicator":
        return (
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full bg-${item[column.key]}-500`}
            ></div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {item.tenant}
            </span>
          </div>
        );

      case "details":
        return (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {item[column.key]}
          </div>
        );

      case "amount":
        return (
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {item[column.key]}
            </div>
            <div className="text-xs text-gray-500">{item.status}</div>
          </div>
        );

      case "custom":
        return item[column.key];

      case "actions":
        return (
          <div className="flex items-center gap-2">
            {column.actions?.map((action: any, index: number) => (
              <button
                key={index}
                onClick={() => action.onClick?.(item)}
                className={`p-2 rounded ${action.color} transition-colors`}
                title={action.title}
              >
                {action.icon}
              </button>
            ))}
          </div>
        );

      default:
        return <div className={column.className}>{item[column.key]}</div>;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      {title && (
        <div className="flex items-center justify-between p-6 pb-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          {viewAllText && (
            <button className="text-sm text-[#00CFFF] hover:text-[#FF4FA1] transition-colors">
              {viewAllText}
            </button>
          )}
        </div>
      )}

      {showPagination ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    {columns.map((column) => (
                      <td key={column.key} className="py-4 px-4">
                        {renderCell(item, column)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showPagination && totalPages > 1 && (
            <div className="flex items-center justify-between p-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {items.length} of {totalItems}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPageChange?.(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange?.(pageNum)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        currentPage === pageNum
                          ? "bg-gradient-to-r from-[#FF4FA1] to-[#00CFFF] text-white"
                          : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => onPageChange?.(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4 p-6">
          {items.map((item, index) => (
            <div
              key={item.id || index}
              className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer"
            >
              {columns.map((column) => (
                <div key={column.key} className="flex-1">
                  {renderCell(item, column)}
                </div>
              ))}
              {viewAllText && <FiChevronRight className="text-gray-400" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Table;
