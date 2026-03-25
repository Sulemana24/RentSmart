"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";

import {
  FiUpload,
  FiTrash2,
  FiPlus,
  FiX,
  FiImage,
  FiMapPin,
  FiHome,
  FiTag,
  FiCheck,
  FiStar,
  FiWifi,
  FiZap,
  FiThermometer,
  FiCoffee,
  FiTruck,
  FiDroplet,
  FiShield,
  FiTv,
  FiWind,
  FiHeart,
  FiChevronDown,
  FiCamera,
  FiDollarSign,
  FiUser,
  FiClock,
  FiPackage,
  FiCheckCircle,
  FiEdit3,
  FiPlay,
  FiFileText,
  FiYoutube,
  FiExternalLink,
  FiVideo,
} from "react-icons/fi";
import {
  GiWashingMachine,
  GiElevator,
  GiFireExtinguisher,
  GiHouseKeys,
} from "react-icons/gi";
import {
  MdOutlineBalcony,
  MdPool,
  MdSecurity,
  MdOutlineYard,
  MdBathroom,
  MdBed,
} from "react-icons/md";
import { TbFridge } from "react-icons/tb";
import { useToast } from "../../../../components/ToastProvider";
import { IoBedOutline } from "react-icons/io5";
import { useUserPlan } from "@/lib/user-plan-context";
import { canAddProperty, getRemainingProperties } from "@/utils/plans";
import UpgradePlanModal from "@/components/UpgradePlanModal";

interface Property {
  id: string;
  name: string;
  host: string;
  hostId: string;
  price: number;
  beds: number;
  washrooms: number;
  agentFeePercentage: number;
  walkingFee: number;
  discount: string;
  address: {
    state: string;
    city: string;
    country: string;
  };
  description: string;
  category: string[];
  images: string[];
  image: string;
  amenities: string[];
  acceptableDurations: number[];
  featured: boolean;
  videos: string[];
  hasVirtualTour: boolean;
  rating?: number;
  reviews?: any[];
  createdAt?: any;
}

const PropertyForm = ({ onSubmit }: { onSubmit?: (formData: any) => void }) => {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const { showToast } = useToast();
  const [categoryInput, setCategoryInput] = useState("");
  const [videoInput, setVideoInput] = useState("");
  const { userPlan, loading: planLoading } = useUserPlan();
  const [existingProperties, setExistingProperties] = useState<Property[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    host: "",
    price: "",
    beds: "",
    washrooms: "",
    agentFeePercentage: "",
    walkingFee: "",
    discount: "",
    state: "",
    city: "",
    description: "",
  });

  const steps = [
    { id: 1, name: "Basic Info", icon: <FiEdit3 className="w-5 h-5" /> },
    { id: 2, name: "Location", icon: <FiMapPin className="w-5 h-5" /> },
    { id: 3, name: "Details", icon: <FiHome className="w-5 h-5" /> },
    { id: 4, name: "Media", icon: <FiCamera className="w-5 h-5" /> },
    { id: 5, name: "Finish", icon: <FiCheckCircle className="w-5 h-5" /> },
  ];

  // Get current user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const userSnap = await getDoc(doc(db, "users", user.uid));
        if (userSnap.exists()) {
          const data = userSnap.data();
          setForm((prev) => ({
            ...prev,
            host: `${data.firstName || ""} ${data.lastName || ""}`,
          }));
        }
      } catch (error) {}
    };
    fetchUser();
  }, []);

  // Fetch existing property count
  useEffect(() => {
    const fetchPropertyCount = async () => {
      const user = auth.currentUser;
      if (!user?.uid) return;

      try {
        const q = query(
          collection(db, "properties"),
          where("hostId", "==", user.uid),
        );
        const snapshot = await getDocs(q);
        setExistingProperties(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Property[],
        );
      } catch (error) {
        console.error("Error fetching property count:", error);
      }
    };

    fetchPropertyCount();
  }, []);

  // Check if user can add more properties
  const canAddMore = userPlan
    ? canAddProperty(existingProperties.length, userPlan.planId)
    : true;

  const remainingSlots = userPlan
    ? getRemainingProperties(existingProperties.length, userPlan.planId)
    : 5;

  const validateForm = (formObject: any) => {
    const errors: string[] = [];
    if (!formObject.name) errors.push("Property name is required");
    if (!formObject.state) errors.push("State is required");
    if (!formObject.city) errors.push("City is required");
    if (!formObject.description) errors.push("Description is required");
    if (uploadedImages.length === 0)
      errors.push("At least one image is required");
    if (uploadedVideos.length === 0)
      errors.push("At least one video is required");
    if (categories.length === 0)
      errors.push("At least one category is required");
    if (selectedDurations.length === 0)
      errors.push("Select at least one duration");
    if (parseInt(formObject.price) < 0) errors.push("Price cannot be negative");
    if (parseInt(formObject.beds) < 0) errors.push("Beds cannot be negative");
    if (parseInt(formObject.washrooms) < 0)
      errors.push("Washrooms cannot be negative");
    if (
      parseInt(formObject.agentFeePercentage) < 0 ||
      parseInt(formObject.agentFeePercentage) > 100
    ) {
      errors.push("Agent fee must be 0-100%");
    }
    if (parseInt(formObject.walkingFee) < 0)
      errors.push("Walking fee cannot be negative");
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check property limit first
    if (!canAddMore) {
      setShowUpgradeModal(true);
      return;
    }

    setLoading(true);

    const formObject = form;

    const errors = validateForm(formObject);
    if (errors.length > 0) {
      showToast({
        title: "Validation Error",
        message: errors.join("\n"),
        type: "error",
      });
      setLoading(false);
      return;
    }

    const propertyData = {
      id: crypto.randomUUID(),
      name: formObject.name,
      address: {
        state: formObject.state,
        city: formObject.city,
        country: "Ghana",
      },
      rating: 0,
      category: categories,
      price: parseInt(formObject.price) || 0,
      agentFeePercentage: parseInt(formObject.agentFeePercentage) || 0,
      walkingFee: parseInt(formObject.walkingFee) || 0,
      acceptableDurations: selectedDurations,
      beds: parseInt(formObject.beds) || 0,
      washrooms: parseInt(formObject.washrooms) || 0,
      image: uploadedImages[0] || "",
      images: uploadedImages,
      discount: formObject.discount || "",
      host: formObject.host,
      featured,
      description: formObject.description,
      amenities: selectedAmenities,
      reviews: [],
      createdAt: serverTimestamp(),
      hostId: auth.currentUser?.uid || "",
      videos: uploadedVideos,
      hasVirtualTour: uploadedVideos.length > 0,
    };

    try {
      const newDocRef = doc(db, "properties", propertyData.id);
      await setDoc(newDocRef, propertyData);
      showToast({
        title: "Success",
        message: "Property added successfully!",
        type: "success",
      });

      if (onSubmit) onSubmit(propertyData);

      // Reset form or redirect
      setTimeout(() => {
        window.location.href = "/homeowner/page";
      }, 2000);
    } catch (error: any) {
      showToast({
        title: "Property Creation Failed",
        message:
          "An error occurred while adding the property: " + error.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
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
    if (!categoryInput.trim()) return;

    setCategories((prev) => [...prev, categoryInput.trim()]);
    setCategoryInput("");
  };

  const removeCategory = (index: number) => {
    setCategories((prev) => prev.filter((_, i) => i !== index));
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setUploadedVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const allAmenities = [
    { icon: <FiWifi className="w-5 h-5" />, name: "Free WiFi" },
    { icon: <TbFridge className="w-5 h-5" />, name: "Refrigerator" },
    { icon: <IoBedOutline className="w-5 h-5" />, name: "Comfortable Bed" },
    { icon: <MdPool className="w-5 h-5" />, name: "Pool" },
    { icon: <FiThermometer className="w-5 h-5" />, name: "AC" },
    { icon: <FiCoffee className="w-5 h-5" />, name: "Kitchen" },
    { icon: <FiTruck className="w-5 h-5" />, name: "Free Parking" },
    { icon: <FiZap className="w-5 h-5" />, name: "Gym" },
    { icon: <FiShield className="w-5 h-5" />, name: "Security" },
    { icon: <MdOutlineYard className="w-5 h-5" />, name: "Garden" },
    { icon: <MdOutlineBalcony className="w-5 h-5" />, name: "Balcony" },
    { icon: <GiWashingMachine className="w-5 h-5" />, name: "Washing Machine" },
    { icon: <FiTv className="w-5 h-5" />, name: "TV" },
    { icon: <FiWind className="w-5 h-5" />, name: "Heating" },
    { icon: <FiHeart className="w-5 h-5" />, name: "Pet Friendly" },
    { icon: <GiElevator className="w-5 h-5" />, name: "Elevator" },
    { icon: <FiDroplet className="w-5 h-5" />, name: "24/7 Water" },
    { icon: <FiZap className="w-5 h-5" />, name: "Backup Generator" },
    { icon: <FiCamera className="w-5 h-5" />, name: "CCTV" },
    { icon: <GiFireExtinguisher className="w-5 h-5" />, name: "Fire Safety" },
    { icon: <MdSecurity className="w-5 h-5" />, name: "Gated Community" },
    { icon: <GiHouseKeys className="w-5 h-5" />, name: "Smart Lock" },
  ];

  const durationOptions = [6, 12, 18, 24, 36, 48, 60];

  function isValidVideoUrl(url: string) {
    return (
      url.includes("youtube.com/watch") ||
      url.includes("youtu.be/") ||
      url.includes("tiktok.com/")
    );
  }

  function convertToEmbedUrl(url: string) {
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1].split(/[?&]/)[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("youtube.com/watch")) {
      try {
        const id = new URL(url).searchParams.get("v");
        return `https://www.youtube.com/embed/${id}`;
      } catch {
        return url;
      }
    }
    if (url.includes("tiktok.com/")) {
      return url.replace(/\/v\/|\/video\//, "/embed/");
    }
    return url;
  }

  const StepProgress = () => (
    <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col lg:flex-row items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex flex-col md:flex-row items-center gap-2">
            <FiHome className="w-7 h-7 text-blue-600" />
            Add New Property
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Fill in the details to list your property
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mt-3">
            <FiClock className="w-4 h-4 mr-2" />
            Step {activeStep} of {steps.length}
          </span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
        <div
          className="absolute top-5 left-0 h-0.5 bg-blue-600 dark:bg-blue-500 transition-all duration-500"
          style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        <div className="flex justify-between relative z-10">
          {steps.map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveStep(step.id)}
              className={`flex flex-col items-center ${step.id === activeStep ? "text-blue-600 dark:text-blue-400" : step.id < activeStep ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-600"}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${step.id === activeStep ? "bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-600 dark:border-blue-400" : step.id < activeStep ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-600 dark:border-green-400" : "bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600"}`}
              >
                {step.id < activeStep ? (
                  <FiCheck className="w-5 h-5" />
                ) : (
                  step.icon
                )}
              </div>
              <span className="text-sm hidden md:block font-medium">
                {step.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FiEdit3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Basic Information
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter the basic details about your property
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FiHome className="w-4 h-4" />
                  Property Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Villa Ocean Breeze"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FiUser className="w-4 h-4" />
                  Host Name *
                </label>
                <input
                  type="text"
                  name="host"
                  className="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={form.host}
                  onChange={(e) => setForm({ ...form, host: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FiDollarSign className="w-4 h-4" />
                  Monthly Price (₵) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    ₵
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="3200"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <MdBed className="w-4 h-4" />
                  Number of Bedrooms *
                </label>
                <input
                  type="number"
                  name="beds"
                  value={form.beds}
                  onChange={(e) => setForm({ ...form, beds: e.target.value })}
                  className="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="3"
                  required
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <MdBathroom className="w-4 h-4" />
                  Number of Washrooms *
                </label>
                <input
                  type="number"
                  name="washrooms"
                  value={form.washrooms}
                  onChange={(e) =>
                    setForm({ ...form, washrooms: e.target.value })
                  }
                  className="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="3"
                  required
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FiTag className="w-4 h-4" />
                  Agent Fee (Optional)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="agentFeePercentage"
                    value={form.agentFeePercentage}
                    onChange={(e) =>
                      setForm({ ...form, agentFeePercentage: e.target.value })
                    }
                    className="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="5"
                    min="0"
                    max="100"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    %
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FiPackage className="w-4 h-4" />
                  Walking Fee (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    ₵
                  </span>
                  <input
                    type="number"
                    name="walkingFee"
                    value={form.walkingFee}
                    onChange={(e) =>
                      setForm({ ...form, walkingFee: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="50"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FiStar className="w-4 h-4" />
                  Discount Offer % (Optional)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="discount"
                    value={form.discount}
                    onChange={(e) =>
                      setForm({ ...form, discount: e.target.value })
                    }
                    min="0"
                    max="100"
                    placeholder="10"
                    className="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    % off
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Offer a discount percentage to attract more bookings
                </p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FiMapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Location Details
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Where is your property located?
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FiMapPin className="w-4 h-4" />
                  State/Region *
                </label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Greater Accra Region"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FiHome className="w-4 h-4" />
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Accra"
                  required
                />
              </div>

              <div className="md:col-span-3 space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FiFileText className="w-4 h-4" />
                  Detailed Description *
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={6}
                  className="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Describe your property in detail. Include features, unique selling points, nearby amenities, and any special notes..."
                  required
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-6">
                <div className="hidden md:block p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FiTag className=" w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Property Categories & Tags
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Add categories to help users find your property
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    type="text"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCategory();
                      }
                    }}
                    className="flex-1 px-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Add a category or tag (e.g., Luxury Villa, Pool, Free Parking)"
                  />

                  <button
                    type="button"
                    onClick={addCategory}
                    className="px-6 py-3.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors flex items-center gap-2 font-medium"
                  >
                    <FiPlus className="w-4 h-4" />
                    Add Tag
                  </button>
                </div>

                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full"
                      >
                        <span className="text-sm font-medium">{category}</span>
                        <button
                          type="button"
                          onClick={() => removeCategory(index)}
                          className="text-blue-600 dark:text-blue-400 hover:text-red-500 transition-colors"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
                <div className="hidden md:block p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FiCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Property Amenities
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Select all amenities available at your property
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {allAmenities.map((amenity) => (
                  <button
                    key={amenity.name}
                    type="button"
                    onClick={() => toggleAmenity(amenity.name)}
                    className={`p-4 rounded-xl border transition-all duration-200 text-left flex items-center gap-3 ${
                      selectedAmenities.includes(amenity.name)
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-400"
                        : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-500"
                    }`}
                  >
                    <div
                      className={`hidden sm:block p-2 rounded-lg ${selectedAmenities.includes(amenity.name) ? "bg-blue-100 dark:bg-blue-800/30" : "bg-gray-100 dark:bg-gray-600"}`}
                    >
                      {amenity.icon}
                    </div>
                    <span className="text-sm font-medium">{amenity.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Property Images */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FiImage className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Property Images
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Upload high-quality photos of your property
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors bg-gray-50 dark:bg-gray-900/50">
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

                    <UploadButton<OurFileRouter, "propertyImages">
                      endpoint="propertyImages"
                      onUploadBegin={() => setUploadingImages(true)}
                      onClientUploadComplete={(res) => {
                        setUploadingImages(false);
                        if (!res) return;
                        const urls = res.map((f) => f.url);
                        setUploadedImages((prev) => [...prev, ...urls]);
                      }}
                      onUploadError={(error) => {
                        setUploadingImages(false);
                        showToast({
                          title: "Image upload failed",
                          message: error.message,
                          type: "error",
                        });
                      }}
                      appearance={{
                        button:
                          "bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors",
                        allowedContent: "text-gray-500",
                      }}
                    />

                    {uploadingImages && (
                      <div className="text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        Uploading images...
                      </div>
                    )}
                  </div>
                </div>

                {uploadedImages.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Uploaded Images ({uploadedImages.length})
                      </h4>
                      <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <FiCamera className="w-4 h-4" />
                        First image will be used as main property image
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {uploadedImages.map((url, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                            <img
                              src={url}
                              alt={`Property image ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://via.placeholder.com/300x300?text=Image+Error";
                              }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                          {index === 0 && (
                            <div className="absolute bottom-2 left-2 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg shadow-sm">
                              <FiStar className="w-3 h-3 inline mr-1" />
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

            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <FiVideo className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Property Video
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Paste a single YouTube or TikTok link to showcase your
                    property
                  </p>
                </div>
              </div>

              <input
                type="url"
                placeholder="Paste YouTube or TikTok link"
                className="w-full px-4 py-3 border border-purple-200 dark:border-purple-700 rounded-xl mb-4 text-black"
                value={videoInput}
                onChange={(e) => setVideoInput(e.target.value)}
              />

              <button
                type="button"
                onClick={() => {
                  if (!isValidVideoUrl(videoInput)) {
                    showToast({
                      title: "Invalid URL",
                      message: "Enter a valid YouTube or TikTok link",
                      type: "error",
                    });
                    return;
                  }

                  setUploadedVideos((prev) => [...prev, videoInput]);
                  setVideoInput("");
                }}
                className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg"
              >
                Add Video
              </button>

              {uploadedVideos.map((video, index) => (
                <div key={index} className="mt-3 flex items-center gap-2">
                  <span className="text-sm">{video}</span>
                  <button onClick={() => removeVideo(index)}>
                    <FiTrash2 />
                  </button>
                </div>
              ))}

              {isValidVideoUrl(videoInput) && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                    Video Preview
                  </h4>
                  <div className="aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-black">
                    <iframe
                      src={convertToEmbedUrl(videoInput)}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                  <p className="text-sm text-purple-600 dark:text-purple-400 mt-3 flex items-center gap-2">
                    <FiVideo className="w-4 h-4" />
                    Virtual tour can increase booking rates by up to 40%
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FiClock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Acceptable Tenancy Durations
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Select all acceptable contract durations
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {durationOptions.map((duration) => (
                  <button
                    key={duration}
                    type="button"
                    onClick={() => toggleDuration(duration)}
                    className={`px-8 py-4 rounded-xl border transition-all duration-200 font-medium flex items-center justify-center gap-2 ${
                      selectedDurations.includes(duration)
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                    }`}
                  >
                    {selectedDurations.includes(duration) && (
                      <FiCheck className="w-4 h-4" />
                    )}
                    {duration} {duration === 1 ? "Month" : "Months"}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Property Banner */}
            {!planLoading && userPlan && !canAddMore && (
              <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 dark:text-yellow-400 font-medium">
                      You've reached your property limit (
                      {existingProperties.length}/{userPlan.maxProperties})
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Upgrade to{" "}
                      {userPlan.maxProperties === 5 ? "Agent Pro" : "Agency"}{" "}
                      plan to add more properties
                    </p>
                  </div>
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    Upgrade Now
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const NavigationButtons = () => (
    <div className=" bottom-6 mt-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-xl">
        <div className="flex flex-col items-center justify-between gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <span className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
                <FiImage className="w-3.5 h-3.5" />
                {uploadedImages.length} images
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full">
                <FiVideo className="w-3.5 h-3.5" />
                {uploadedVideos.length} videos
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full">
                <FiCheck className="w-3.5 h-3.5" />
                {selectedAmenities.length} amenities
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-full">
                <FiClock className="w-3.5 h-3.5" />
                {selectedDurations.length} durations
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeStep > 1 && (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep - 1)}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium flex items-center gap-2"
              >
                <FiChevronDown className="w-4 h-4 rotate-90" />
                Previous
              </button>
            )}

            {activeStep < steps.length ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep + 1)}
                className="px-8 py-3 bg-[#00CFFF] text-white rounded-xl font-bold hover:bg-[hsl(191,100%,60%)] transition-colors flex items-center gap-2"
              >
                Next Step
                <FiChevronDown className="w-4 h-4 -rotate-90" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || uploadedImages.length === 0 || !canAddMore}
                className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${
                  loading || uploadedImages.length === 0 || !canAddMore
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding Property...
                  </>
                ) : uploadedImages.length === 0 ? (
                  "Upload Images First"
                ) : !canAddMore ? (
                  "Upgrade to Add More"
                ) : (
                  <>
                    <FiCheck className="w-4 h-4" />
                    Add Property
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {uploadedImages.length === 0 && activeStep === 5 && (
          <div className="mt-4 text-sm text-red-500 dark:text-red-400 text-center flex items-center justify-center gap-2">
            <FiImage className="w-4 h-4" />
            Please upload at least one property image before submitting
          </div>
        )}

        {!canAddMore && activeStep === 5 && (
          <div className="mt-4 text-sm text-yellow-600 dark:text-yellow-400 text-center flex items-center justify-center gap-2">
            <FiStar className="w-4 h-4" />
            You've reached your property limit. Upgrade to add more properties.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <StepProgress />
      {renderStepContent()}
      <NavigationButtons />

      <input type="hidden" name="category" value={JSON.stringify(categories)} />
      <input
        type="hidden"
        name="amenities"
        value={JSON.stringify(selectedAmenities)}
      />
      <input
        type="hidden"
        name="acceptableDurations"
        value={JSON.stringify(selectedDurations)}
      />
      <input type="hidden" name="featured" value={featured.toString()} />
      <input
        type="hidden"
        name="hasVirtualTour"
        value={uploadedVideos.length > 0 ? "true" : "false"}
      />
      <input
        type="hidden"
        name="videos"
        value={JSON.stringify(uploadedVideos)}
      />

      <UpgradePlanModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPropertyCount={existingProperties.length}
        onUpgradeComplete={() => {
          // Refresh property count after upgrade
          const fetchPropertyCount = async () => {
            const user = auth.currentUser;
            if (!user?.uid) return;
            const q = query(
              collection(db, "properties"),
              where("hostId", "==", user.uid),
            );
            const snapshot = await getDocs(q);
            setExistingProperties(
              snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              })) as Property[],
            );
          };
          fetchPropertyCount();
          setShowUpgradeModal(false);
        }}
      />
    </form>
  );
};

export default PropertyForm;
