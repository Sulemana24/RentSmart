"use client";
import { useState } from "react";
import { FiUpload, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import { UploadButton } from "@/lib/uploadthing";

interface PropertyFormProps {
  onSubmit: (formData: any) => void;
}

const PropertyForm = ({ onSubmit }: PropertyFormProps) => {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const formObject = Object.fromEntries(formData);

    // Add arrays to form data
    const completeData = {
      ...formObject,
      category: categories,
      amenities: selectedAmenities,
      acceptableDurations: selectedDurations,
      images: uploadedImages,
      featured,
      beds: parseInt(formObject.beds as string),
      price: parseInt(formObject.price as string),
      agentFeePercentage: parseInt(formObject.agentFeePercentage as string),
      walkingFee: parseInt(formObject.walkingFee as string),
      rating: 0,
      discount: formObject.discount || "",
      reviews: [],
      image: uploadedImages[0] || "",
    };

    onSubmit(completeData);
    setLoading(false);
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    );
  };

  const toggleDuration = (duration: number) => {
    setSelectedDurations((prev) =>
      prev.includes(duration)
        ? prev.filter((d) => d !== duration)
        : [...prev, duration],
    );
  };

  const addCategory = () => {
    const input = document.getElementById("categoryInput") as HTMLInputElement;
    if (input.value.trim()) {
      setCategories((prev) => [...prev, input.value.trim()]);
      input.value = "";
    }
  };

  const removeCategory = (index: number) => {
    setCategories((prev) => prev.filter((_, i) => i !== index));
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const allAmenities = [
    "Free WiFi",
    "Pool",
    "Air Conditioning",
    "Kitchen",
    "Free Parking",
    "Gym",
    "Security",
    "Garden",
    "Balcony",
    "Washing Machine",
    "TV",
    "Heating",
    "Pet Friendly",
    "Elevator",
    "Parking",
    "24/7 Water",
    "Backup Generator",
    "CCTV",
    "Swimming Pool",
    "Gated Community",
  ];

  const durationOptions = [1, 2, 3, 4, 5];

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {/* Basic Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Property Name *
            </label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
              placeholder="Villa Ocean Breeze"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Host Name *
            </label>
            <input
              type="text"
              name="host"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
              placeholder="Maltiti"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monthly Price (₵) *
            </label>
            <input
              type="number"
              name="price"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
              placeholder="3200"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Beds *
            </label>
            <input
              type="number"
              name="beds"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
              placeholder="3"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Agent Fee (%) *
            </label>
            <input
              type="number"
              name="agentFeePercentage"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
              placeholder="5"
              required
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Walking Fee (₵) *
            </label>
            <input
              type="number"
              name="walkingFee"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
              placeholder="50"
              required
              min="0"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Discount Offer %(Optional)
            </label>
            <input
              type="text"
              name="discount"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
              placeholder="10"
            />
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Location Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              State/Region *
            </label>
            <input
              type="text"
              name="state"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
              placeholder="Greater Accra Region"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              City *
            </label>
            <input
              type="text"
              name="city"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
              placeholder="Accra"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Country *
            </label>
            <input
              type="text"
              name="country"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
              placeholder="Ghana"
              required
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Property Description
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Detailed Description *
          </label>
          <textarea
            name="description"
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
            placeholder="Describe your property in detail. Include features, unique selling points, nearby amenities, and any special notes..."
            required
          />
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Property Images
        </h3>

        <div className="space-y-6">
          {/* UploadThing Button */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-[#00CFFF] transition-colors">
            <div className="flex flex-col items-center justify-center gap-4">
              <FiUpload className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              <div>
                <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                  Upload Property Images
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  PNG, JPG, WEBP up to 4MB each • Max 4 images
                </p>
              </div>
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  setUploadingImages(false);
                  console.log("Upload complete response:", res);

                  if (res && Array.isArray(res)) {
                    const newImages = res.map((file) => file.url);
                    setUploadedImages((prev) => [...prev, ...newImages]);
                  }
                }}
                onUploadBegin={() => {
                  setUploadingImages(true);
                }}
                onUploadError={(error: Error) => {
                  setUploadingImages(false);
                  console.error("Upload error:", error);
                  alert(`Upload failed: ${error.message}`);
                }}
                className="ut-button:bg-[#00CFFF] ut-button:text-white ut-button:hover:bg-[#00CFFF]/90 ut-button:px-6 ut-button:py-3 ut-button:rounded-lg ut-button:font-medium ut-button:ut-readying:bg-[#00CFFF]/50"
                config={{
                  mode: "auto",
                  appendOnPaste: true,
                }}
              />

              {uploadingImages && (
                <div className="text-sm text-[#00CFFF] font-medium flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#00CFFF] border-t-transparent rounded-full animate-spin"></div>
                  Uploading images...
                </div>
              )}
            </div>
          </div>

          {/* Uploaded Images Preview */}
          {uploadedImages.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Uploaded Images ({uploadedImages.length})
                </h4>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  First image will be used as main property image
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedImages.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                      <img
                        src={url}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/300x300?text=Image+Error";
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-[#00CFFF] text-white text-xs font-medium rounded">
                        Main Image
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Property Categories & Tags
        </h3>

        <div className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              id="categoryInput"
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
              placeholder="Add a category or tag (e.g., Luxury Villa, Pool, Free Parking)"
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addCategory())
              }
            />
            <button
              type="button"
              onClick={addCategory}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <FiPlus className="w-4 h-4" />
              Add
            </button>
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-[#00CFFF]/10 text-[#00CFFF] rounded-full"
                >
                  <span className="text-sm font-medium">{category}</span>
                  <button
                    type="button"
                    onClick={() => removeCategory(index)}
                    className="text-[#00CFFF] hover:text-[#FF4FA1]"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            type="hidden"
            name="category"
            value={JSON.stringify(categories)}
          />
        </div>
      </div>

      {/* Tenancy Durations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Acceptable Tenancy Durations
        </h3>

        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Select all acceptable contract durations (in years)
          </p>

          <div className="flex flex-wrap gap-3">
            {durationOptions.map((duration) => (
              <button
                key={duration}
                type="button"
                onClick={() => toggleDuration(duration)}
                className={`px-6 py-3 rounded-lg border transition-all duration-200 font-medium ${
                  selectedDurations.includes(duration)
                    ? "bg-[#00CFFF] text-white border-[#00CFFF] shadow-sm"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                }`}
              >
                {duration} {duration === 1 ? "Year" : "Years"}
              </button>
            ))}
          </div>

          <input
            type="hidden"
            name="acceptableDurations"
            value={JSON.stringify(selectedDurations)}
          />
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Property Amenities
        </h3>

        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Select all amenities available at this property
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allAmenities.map((amenity) => (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                  selectedAmenities.includes(amenity)
                    ? "bg-[#FF4FA1]/10 border-[#FF4FA1] text-[#FF4FA1]"
                    : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-[#00CFFF]"
                }`}
              >
                <div className="text-sm font-medium">{amenity}</div>
              </button>
            ))}
          </div>

          <input
            type="hidden"
            name="amenities"
            value={JSON.stringify(selectedAmenities)}
          />
        </div>
      </div>

      {/* Featured Property Toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Featured Property
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Feature this property prominently on the homepage
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#00CFFF]"></div>
          </label>
        </div>

        <input type="hidden" name="featured" value={featured.toString()} />
      </div>

      {/* Submit Section */}
      <div className="sticky bottom-6 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#00CFFF]"></span>
                {selectedAmenities.length} amenities
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#FF4FA1]"></span>
                {categories.length} categories
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                {uploadedImages.length} images
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                {selectedDurations.length} durations
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="px-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || uploadedImages.length === 0}
              className={`px-8 py-3 rounded-lg font-bold transition-all duration-300 ${
                loading || uploadedImages.length === 0
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  : "bg-[#00CFFF] text-white hover:bg-[#00CFFF]/90 hover:shadow-lg"
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding Property...
                </span>
              ) : uploadedImages.length === 0 ? (
                "Upload Images First"
              ) : (
                "Add Property"
              )}
            </button>
          </div>
        </div>

        {uploadedImages.length === 0 && (
          <div className="mt-4 text-sm text-red-500 dark:text-red-400 text-center">
            ⚠️ Please upload at least one property image before submitting
          </div>
        )}
      </div>
    </form>
  );
};

export default PropertyForm;
