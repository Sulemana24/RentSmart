"use client";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import {
  FiFilter,
  FiSearch,
  FiEye,
  FiEdit,
  FiTrash2,
  FiUsers,
  FiX,
  FiLoader,
  FiHome,
  FiMapPin,
  FiStar,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import Table from "./common/Table";
import SearchFilter from "./common/SearchFilter";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  where,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";

interface Property {
  id: string;
  name: string;
  type?: string;
  status: "Rented" | "Available" | "Maintenance" | "booked";
  price: number;
  host: string;
  hostId: string;
  tenants?: number;
  image?: string;
  images?: string[];
  address?: {
    city: string;
    state: string;
    country: string;
  };
  rating?: number;
  amenities?: string[];
  beds?: number;
  acceptableDurations?: number[];
  agentFeePercentage?: number;
  walkingFee?: number;
  description?: string;
  videos?: string[];
  reviews?: any[];
  category?: string[];
  createdAt?: any;
  discount?: string;
  featured?: boolean;
  hasVirtualTour?: boolean;
}

const Properties = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const router = useRouter();

  // Fetch properties from Firestore
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "properties"),
        orderBy("createdAt", "desc"),
      );
      const snapshot = await getDocs(q);
      const propertiesData: Property[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Property[];
      setProperties(propertiesData);
    } catch (err) {
      console.error("Error fetching properties:", err);
      showToast("Failed to load properties", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ✅ FIXED: Action handlers now accept the entire property object
  const handleView = (property: Property) => {
    console.log("View clicked for property:", property.id);
    setSelectedProperty(property);
    setIsViewModalOpen(true);
  };

  const handleEdit = (property: Property) => {
    console.log("Edit clicked for property:", property.id);
    router.push(`/properties/edit/${property.id}`);
  };

  const openDeleteModal = (property: Property) => {
    console.log("Delete clicked for property:", property.id);
    setSelectedProperty(property);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedProperty) return;

    setDeleting(true);
    try {
      // Check if property has any active bookings before deleting
      const bookingsRef = collection(db, "bookings");
      const bookingsQuery = query(
        bookingsRef,
        where("propertyId", "==", selectedProperty.id),
        where("bookingStatus", "in", ["confirmed", "pending"]),
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);

      if (!bookingsSnapshot.empty) {
        showToast(
          "Cannot delete property with active bookings. Please cancel all bookings first.",
          "error",
        );
        setIsDeleteModalOpen(false);
        setDeleting(false);
        return;
      }

      await deleteDoc(doc(db, "properties", selectedProperty.id));
      setProperties((prev) => prev.filter((p) => p.id !== selectedProperty.id));
      showToast("Property deleted successfully!", "success");
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      console.error("Error deleting property:", err);
      if (err.code === "permission-denied") {
        showToast("You don't have permission to delete this property", "error");
      } else {
        showToast("Failed to delete property. Please try again.", "error");
      }
    } finally {
      setDeleting(false);
    }
  };

  // Filter properties based on search
  const filteredProperties = properties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address?.city?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Get status color for badge
  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "available":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "rented":
      case "booked":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "maintenance":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
    }
  };

  // Table columns
  const columns = [
    {
      key: "name",
      label: "Property",
      type: "custom" as const,
      render: (item: Property) => (
        <div className="flex items-center gap-3">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <FiHome className="text-gray-400" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {item.name}
            </p>
            {item.address && (
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                <FiMapPin className="w-3 h-3" />
                {item.address.city}, {item.address.country}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      type: "text" as const,
      render: (item: Property) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {item.type || "N/A"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      type: "custom" as const,
      render: (item: Property) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}
        >
          {item.status?.charAt(0).toUpperCase() + item.status?.slice(1) ||
            "N/A"}
        </span>
      ),
    },
    {
      key: "price",
      label: "Price",
      type: "custom" as const,
      render: (item: Property) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            ₵{item.price?.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">per month</p>
        </div>
      ),
    },
    {
      key: "tenants",
      label: "Tenants",
      type: "custom" as const,
      render: (item: Property) => (
        <div className="flex items-center gap-2">
          <FiUsers className="text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">
            {item.tenants || 0}
          </span>
        </div>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      type: "custom" as const,
      render: (item: Property) =>
        item.rating ? (
          <div className="flex items-center gap-1">
            <FiStar className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {item.rating.toFixed(1)}
            </span>
          </div>
        ) : (
          <span className="text-xs text-gray-400">No ratings</span>
        ),
    },
    {
      key: "actions",
      label: "Actions",
      type: "actions" as const,
      actions: [
        {
          icon: <FiEye />,
          color: "text-[#00CFFF] hover:bg-[#00CFFF]/10",
          onClick: (item: Property) => handleView(item), // ✅ Pass the entire property
          title: "View Property",
        },
        {
          icon: <FiEdit />,
          color: "text-green-500 hover:bg-green-500/10",
          onClick: (item: Property) => handleEdit(item), // ✅ Pass the entire property
          title: "Edit Property",
        },
        {
          icon: <FiTrash2 />,
          color: "text-[#FF4FA1] hover:bg-[#FF4FA1]/10",
          onClick: (item: Property) => openDeleteModal(item), // ✅ Pass the entire property
          title: "Delete Property",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Your Properties
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage all your properties, view details, edit or delete
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF4FA1] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <FiLoader className="animate-spin text-4xl text-[#FF4FA1] mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Loading properties...
              </p>
            </div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiHome className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No properties found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm
                ? "Try a different search term"
                : "Get started by adding your first property"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => (window.location.href = "/properties/create")}
                className="px-6 py-2 bg-gradient-to-r from-[#FF4FA1] to-[#00CFFF] text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Add Your First Property
              </button>
            )}
          </div>
        ) : (
          <Table
            items={filteredProperties}
            columns={columns}
            showPagination={true}
            totalItems={filteredProperties.length}
          />
        )}
      </div>

      {/* View Property Modal */}
      {isViewModalOpen && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform animate-in slide-in-from-bottom-4 duration-300 shadow-2xl">
            {/* Modal Header */}
            <div className="relative">
              <div className="h-48 relative">
                <img
                  src={
                    selectedProperty.image ||
                    selectedProperty.images?.[0] ||
                    "https://via.placeholder.com/800x400"
                  }
                  alt={selectedProperty.name}
                  className="w-full h-full object-cover rounded-t-xl"
                />
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedProperty.name}
                    </h3>
                    {selectedProperty.address && (
                      <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">
                        <FiMapPin className="w-4 h-4" />
                        {selectedProperty.address.city},{" "}
                        {selectedProperty.address.country}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedProperty.status)}`}
                  >
                    {selectedProperty.status?.charAt(0).toUpperCase() +
                      selectedProperty.status?.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-[#FF4FA1]">
                      ₵{selectedProperty.price?.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">per month</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedProperty.beds || 0}
                    </p>
                    <p className="text-xs text-gray-500">Beds</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedProperty.tenants || 0}
                    </p>
                    <p className="text-xs text-gray-500">Tenants</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedProperty.rating?.toFixed(1) || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">Rating</p>
                  </div>
                </div>

                {selectedProperty.description && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedProperty.description}
                    </p>
                  </div>
                )}

                {selectedProperty.amenities &&
                  selectedProperty.amenities.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Amenities
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProperty.amenities.map((amenity, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-600 dark:text-gray-400"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleEdit(selectedProperty)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Edit Property
                  </button>
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="flex-1 border-2 border-gray-300 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-medium hover:border-gray-400 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full transform animate-in slide-in-from-bottom-4 duration-300 shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <FiAlertCircle className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
                Delete Property
              </h3>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete "{selectedProperty.name}"? This
                action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? (
                    <div className="flex items-center justify-center gap-2">
                      <FiLoader className="animate-spin" />
                      Deleting...
                    </div>
                  ) : (
                    "Delete"
                  )}
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-medium transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {toast.type === "success" ? (
              <FiCheck className="w-5 h-5" />
            ) : (
              <FiAlertCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;
