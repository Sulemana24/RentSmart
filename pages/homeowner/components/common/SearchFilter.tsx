import { FiFilter, FiSearch } from "react-icons/fi";

interface SearchFilterProps {
  placeholder: string;
  onFilter: () => void;
}

const SearchFilter = ({ placeholder, onFilter }: SearchFilterProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 md:w-64">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
        />
      </div>
      <button
        onClick={onFilter}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <FiFilter />
        Filter
      </button>
    </div>
  );
};

export default SearchFilter;
