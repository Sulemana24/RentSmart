import Link from "next/link";
import { PropertyProps } from "@/interfaces";
import { AiFillStar } from "react-icons/ai";
import { FaLocationDot } from "react-icons/fa6";
import { HiFire } from "react-icons/hi";

interface PropertyCardProps {
  property: PropertyProps;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/property/${property.id}`} passHref>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 dark:border-gray-800 relative">
        {/* Image Section */}
        <div className="relative w-full h-56 overflow-hidden">
          <img
            src={property.image}
            alt={property.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {property.discount && (
            <span className="absolute top-3 left-3 bg-pink-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">
              -{property.discount}%
            </span>
          )}

          {property.urgent && (
            <span className="absolute top-3 left-3 ml-20 bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <HiFire className="w-4 h-4" />
              Urgent
            </span>
          )}

          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-medium px-2 py-1 rounded-full shadow flex items-center">
            <AiFillStar className="inline-block text-yellow-400 m-0.5 " />
            {property.rating}
          </div>
        </div>

        <div className="p-5 space-y-2">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white truncate">
            {property.name}
          </h3>

          <p className="text-gray-500 text-sm flex items-center gap-1">
            <FaLocationDot className="" />
            {property.address.city}, {property.address.state}
          </p>

          <div className="flex flex-wrap gap-2 mt-2">
            {property.category?.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-lg font-bold text-pink-600">
              Ghc{property.price}/year
            </p>
            <button className="text-sm font-semibold text-white bg-pink-600 hover:bg-pink-700 transition px-4 py-2 rounded-xl shadow">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
