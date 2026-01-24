"use client";
import { FiChevronRight } from "react-icons/fi";

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
}

interface TableProps {
  title?: string;
  items: any[];
  columns: Column[];
  viewAllText?: string;
  showPagination?: boolean;
  totalItems?: number;
}

const Table = ({
  title,
  items,
  columns,
  viewAllText,
  showPagination = false,
  totalItems = 0,
}: TableProps) => {
  const renderCell = (item: any, column: Column) => {
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
        const color = column.render ? column.render(item) : "gray";
        return (
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full bg-${color}-500`}></div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {item.tenant}
            </span>
          </div>
        );

      case "details":
        return (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {column.render ? column.render(item) : item[column.key]}
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
        return column.render ? column.render(item) : item[column.key];

      case "actions":
        return (
          <div className="flex items-center gap-2">
            {column.render ? (
              column.render(item)
            ) : (
              <>
                <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#00CFFF] hover:bg-[#00CFFF]/10 rounded-lg transition-colors">
                  👁️
                </button>
                <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-500 hover:bg-green-500/10 rounded-lg transition-colors">
                  ✏️
                </button>
                <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#FF4FA1] hover:bg-[#FF4FA1]/10 rounded-lg transition-colors">
                  🗑️
                </button>
              </>
            )}
          </div>
        );

      default:
        return <div className={column.className}>{item[column.key]}</div>;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      {title && (
        <div className="flex items-center justify-between mb-6">
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
                {items.map((item) => (
                  <tr
                    key={item.id}
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

          {showPagination && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {items.length} of {totalItems}
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
          )}
        </>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
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
