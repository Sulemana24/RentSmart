"use client";

interface BookingStat {
  label: string;
  count: string;
  color: string;
}

interface BookingStatsProps {
  stats: BookingStat[];
}

const BookingStats = ({ stats }: BookingStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
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
  );
};

export default BookingStats;
