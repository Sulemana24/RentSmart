"use client";
import {
  FiPlus,
  FiCalendar,
  FiMessageSquare,
  FiDownload,
} from "react-icons/fi";

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  color: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

const QuickActions = ({ actions }: QuickActionsProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className="flex flex-col items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className={`text-2xl mb-2 ${action.color}`}>{action.icon}</div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {action.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
