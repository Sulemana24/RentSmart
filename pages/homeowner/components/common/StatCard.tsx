interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const StatCard = ({
  title,
  value,
  change,
  icon,
  color,
  bgColor,
}: StatCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${bgColor} ${color}`}>{icon}</div>
        <span className="text-sm font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded">
          {change}
        </span>
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        {title}
      </div>
    </div>
  );
};

export default StatCard;
