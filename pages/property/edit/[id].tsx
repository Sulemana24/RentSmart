import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import {
  FiSave,
  FiX,
  FiLoader,
  FiHome,
  FiMapPin,
  FiDollarSign,
  FiUsers,
  FiStar,
  FiAlertCircle,
  FiCheck,
  FiImage,
  FiVideo,
} from "react-icons/fi";
import Head from "next/head";

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
    street?: string;
    zipCode?: string;
  };
  rating?: number;
  amenities?: string[];
  beds?: number;
  bedrooms?: number;
  bathrooms?: number;
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
  squareFeet?: number;
}

const EditProperty = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<Partial<Property>>({});
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"basic" | "details" | "media">(
    "basic",
  );

  // Fetch property data
  useEffect(() => {
    if (id && typeof id === "string") {
      fetchProperty(id);
    }
  }, [id]);

  const fetchProperty = async (propertyId: string) => {
    setLoading(true);
    try {
      const propertyRef = doc(db, "properties", propertyId);
      const propertySnap = await getDoc(propertyRef);

      if (propertySnap.exists()) {
        const propertyData = {
          id: propertySnap.id,
          ...propertySnap.data(),
        } as Property;

        // Check if user is authorized to edit this property
        if (propertyData.hostId !== user?.uid) {
          showToast("You don't have permission to edit this property", "error");
          setTimeout(() => router.push("/properties"), 2000);
          return;
        }

        setProperty(propertyData);
        setFormData(propertyData);
      } else {
        showToast("Property not found", "error");
        setTimeout(() => router.push("/properties"), 2000);
      }
    } catch (err) {
      console.error("Error fetching property:", err);
      showToast("Failed to load property", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      address: {
        ...(prev.address || {
          city: "",
          state: "",
          country: "",
          street: "",
          zipCode: "",
        }),
        [name]: value,
      },
    }));
  };

  const handleArrayChange = (field: string, value: string) => {
    const array = value.split(",").map((item) => item.trim());
    setFormData((prev) => ({ ...prev, [field]: array }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, status: e.target.value as any }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!property?.id) return;

    setSaving(true);
    try {
      const propertyRef = doc(db, "properties", property.id);

      // Remove id from update data
      const { id: _, ...updateData } = formData;

      await updateDoc(propertyRef, {
        ...updateData,
        updatedAt: new Date(),
      });

      showToast("Property updated successfully!", "success");

      // Redirect back to properties list after 1.5 seconds
      setTimeout(() => {
        router.push("/homeowner/page");
      }, 1500);
    } catch (err: any) {
      console.error("Error updating property:", err);
      if (err.code === "permission-denied") {
        showToast("You don't have permission to update this property", "error");
      } else {
        showToast("Failed to update property. Please try again.", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "available":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800";
      case "rented":
      case "booked":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "maintenance":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <FiLoader className="animate-spin text-4xl text-[#FF4FA1] mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Loading property...
          </p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <FiAlertCircle className="text-4xl text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Property not found
          </p>
          <button
            onClick={() => router.push("/properties")}
            className="px-4 py-2 bg-[#FF4FA1] text-white rounded-lg hover:shadow-lg transition-all"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Edit Property | Dashboard</title>
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Edit Property
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Update your property information
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push("/homeowner/page")}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="px-6 py-2 bg-[#FF4FA1] text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <FiLoader className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Status Banner */}
          <div
            className={`mb-6 p-4 rounded-lg border ${getStatusColor(property.status)}`}
          >
            <div className="flex items-center gap-2">
              <FiAlertCircle className="w-5 h-5" />
              <span className="font-medium">
                Current Status: {property.status}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
            <nav className="flex gap-6">
              <button
                onClick={() => setActiveTab("basic")}
                className={`pb-3 px-1 font-medium transition-colors ${
                  activeTab === "basic"
                    ? "text-[#FF4FA1] border-b-2 border-[#FF4FA1]"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Basic Information
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`pb-3 px-1 font-medium transition-colors ${
                  activeTab === "details"
                    ? "text-[#FF4FA1] border-b-2 border-[#FF4FA1]"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Details & Amenities
              </button>
              <button
                onClick={() => setActiveTab("media")}
                className={`pb-3 px-1 font-medium transition-colors ${
                  activeTab === "media"
                    ? "text-[#FF4FA1] border-b-2 border-[#FF4FA1]"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Media
              </button>
            </nav>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Tab */}
            {activeTab === "basic" && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
                {/* Property Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Property Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF4FA1] focus:border-transparent"
                    placeholder="Enter property name"
                  />
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Property Type
                  </label>
                  <select
                    name="type"
                    value={formData.type || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF4FA1] focus:border-transparent"
                  >
                    <option value="">Select type</option>
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Condo">Condo</option>
                    <option value="Studio">Studio</option>
                    <option value="Villa">Villa</option>
                    <option value="Townhouse">Townhouse</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status || "Available"}
                    onChange={handleStatusChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF4FA1] focus:border-transparent"
                  >
                    <option value="Available">Available</option>
                    <option value="Rented">Rented</option>
                    <option value="booked">Booked</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price (₵ per month) *
                  </label>
                  <div className="relative">
                    <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="price"
                      value={formData.price || ""}
                      onChange={handleNumberChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF4FA1] focus:border-transparent"
                      placeholder="Enter price"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <FiMapPin />
                    Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Street
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={formData.address?.street || ""}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF4FA1] focus:border-transparent"
                        placeholder="Street address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.address?.city || ""}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF4FA1] focus:border-transparent"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.address?.state || ""}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF4FA1] focus:border-transparent"
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.address?.country || ""}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF4FA1] focus:border-transparent"
                        placeholder="Country"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.address?.zipCode || ""}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF4FA1] focus:border-transparent"
                        placeholder="ZIP Code"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF4FA1] focus:border-transparent"
                    placeholder="Describe your property..."
                  />
                </div>
              </div>
            )}

            {/* Details Tab */}
            {activeTab === "details" && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms || formData.beds || 0}
                      onChange={handleNumberChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF4FA1] focus:border-transparent"
                      placeholder="Number of bedrooms"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms || 0}
                      onChange={handleNumberChange}
                      step="0.5"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF4FA1] focus:border-transparent"
                      placeholder="Number of bathrooms"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Square Feet
                    </label>
                    <input
                      type="number"
                      name="squareFeet"
                      value={formData.squareFeet || 0}
                      onChange={handleNumberChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF4FA1] focus:border-transparent"
                      placeholder="Square footage"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Max Tenants
                    </label>
                    <input
                      type="number"
                      name="tenants"
                      value={formData.tenants || 0}
                      onChange={handleNumberChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF4FA1] focus:border-transparent"
                      placeholder="Maximum number of tenants"
                    />
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amenities (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.amenities?.join(", ") || ""}
                    onChange={(e) =>
                      handleArrayChange("amenities", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF4FA1] focus:border-transparent"
                    placeholder="e.g., WiFi, Parking, AC, Pool"
                  />
                  {formData.amenities && formData.amenities.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Categories (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.category?.join(", ") || ""}
                    onChange={(e) =>
                      handleArrayChange("category", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF4FA1] focus:border-transparent"
                    placeholder="e.g., Luxury, Student, Family"
                  />
                </div>

                {/* Additional Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Agent Fee Percentage
                    </label>
                    <input
                      type="number"
                      name="agentFeePercentage"
                      value={formData.agentFeePercentage || ""}
                      onChange={handleNumberChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF4FA1] focus:border-transparent"
                      placeholder="e.g., 10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Walking Fee
                    </label>
                    <input
                      type="number"
                      name="walkingFee"
                      value={formData.walkingFee || ""}
                      onChange={handleNumberChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF4FA1] focus:border-transparent"
                      placeholder="Walking fee amount"
                    />
                  </div>
                </div>

                {/* Featured Property */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        featured: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-[#FF4FA1] rounded focus:ring-[#FF4FA1]"
                  />
                  <label
                    htmlFor="featured"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Feature this property
                  </label>
                </div>
              </div>
            )}

            {/* Media Tab */}
            {activeTab === "media" && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Main Image URL
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      name="image"
                      value={formData.image || ""}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF4FA1] focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  {formData.image && (
                    <div className="mt-3">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Images (comma-separated URLs)
                  </label>
                  <textarea
                    value={formData.images?.join(", ") || ""}
                    onChange={(e) =>
                      handleArrayChange("images", e.target.value)
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF4FA1] focus:border-transparent"
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  />
                  {formData.images && formData.images.length > 0 && (
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {formData.images.slice(0, 4).map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Videos (comma-separated URLs)
                  </label>
                  <textarea
                    value={formData.videos?.join(", ") || ""}
                    onChange={(e) =>
                      handleArrayChange("videos", e.target.value)
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF4FA1] focus:border-transparent"
                    placeholder="https://youtube.com/watch?v=..., https://vimeo.com/..."
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="hasVirtualTour"
                    checked={formData.hasVirtualTour || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        hasVirtualTour: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-[#FF4FA1] rounded focus:ring-[#FF4FA1]"
                  />
                  <label
                    htmlFor="hasVirtualTour"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Has Virtual Tour
                  </label>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

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
    </>
  );
};

export default EditProperty;
