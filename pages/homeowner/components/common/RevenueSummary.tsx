"use client";

interface RevenueStat {
  label: string;
  value: string;
}

interface RevenueSummaryProps {
  stats: RevenueStat[];
}

const RevenueSummary = ({ stats }: RevenueSummaryProps) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Revenue Summary
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
          >
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {item.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueSummary;
