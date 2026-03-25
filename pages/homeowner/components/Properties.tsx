"use client";
import { useRouter } from "next/navigation";

import { useEffect, useState, useRef } from "react";
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
  FiTrendingUp,
  FiZap,
  FiCalendar,
  FiLock,
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
  Timestamp,
  deleteField,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "../../../components/ToastProvider";
import { useUserPlan } from "@/lib/user-plan-context";
import { getRemainingProperties, canAddProperty } from "@/utils/plans";
import UpgradePlanModal from "@/components/UpgradePlanModal";

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
  featuredExpiry?: any;
  featuredSince?: any;
  featuredPlan?: string;
  hasVirtualTour?: boolean;
}

// Interface for rating data
interface RatingData {
  averageRating: number;
  totalReviews: number;
}

const Properties = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [ratings, setRatings] = useState<Map<string, RatingData>>(new Map());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Featured Property States
  const [isFeaturedModalOpen, setIsFeaturedModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPaystackReady, setIsPaystackReady] = useState(false);

  const router = useRouter();
  const paystackLoadAttempted = useRef(false);
  const { userPlan, loading: planLoading } = useUserPlan();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Get Paystack public key
  const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  useEffect(() => {
    if (!paystackPublicKey) {
      console.error("Paystack public key is missing!");
      showToast({
        title: "Configuration Error",
        message:
          "Payment system is not properly configured. Please contact support.",
        type: "error",
      });
    } else {
      console.log(
        "Paystack key available:",
        paystackPublicKey.substring(0, 8) + "...",
      );
    }
  }, [paystackPublicKey, showToast]);

  // Load Paystack script (exactly like booking form)
  useEffect(() => {
    if (paystackLoadAttempted.current) return;
    paystackLoadAttempted.current = true;

    const loadPaystackScript = () => {
      // Check if already loaded
      if ((window as any).PaystackPop) {
        console.log("Paystack already loaded");
        setIsPaystackReady(true);
        return;
      }

      // Check if script is already added
      if (document.getElementById("paystack-script")) {
        const checkInterval = setInterval(() => {
          if ((window as any).PaystackPop) {
            setIsPaystackReady(true);
            clearInterval(checkInterval);
          }
        }, 100);
        return;
      }

      // Create and add script
      const script = document.createElement("script");
      script.id = "paystack-script";
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;

      script.onload = () => {
        console.log("Paystack script loaded");
        setTimeout(() => {
          if ((window as any).PaystackPop) {
            setIsPaystackReady(true);
          } else {
            console.error("PaystackPop not available after script load");
          }
        }, 500);
      };

      script.onerror = () => {
        console.error("Failed to load Paystack script");
        showToast({
          title: "Error",
          message:
            "Payment system failed to load. Please refresh and try again.",
          type: "error",
        });
      };

      document.body.appendChild(script);
    };

    loadPaystackScript();
  }, [showToast]);

  // Fetch properties from Firestore
  useEffect(() => {
    fetchProperties();
  }, []);

  // Set up an interval to check for expired featured properties (every hour)
  useEffect(() => {
    const checkExpiredFeatured = setInterval(() => {
      checkAndUpdateExpiredFeatured();
    }, 3600000); // Check every hour

    return () => clearInterval(checkExpiredFeatured);
  }, [properties]);

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

      // Check if featured properties have expired
      await checkAndUpdateExpiredFeatured(propertiesData);

      // Get fresh data after updates
      const freshSnapshot = await getDocs(q);
      const freshPropertiesData: Property[] = freshSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Property[];

      setProperties(freshPropertiesData);
      await fetchRatingsForProperties(freshPropertiesData);
    } catch (err) {
      console.error("Error fetching properties:", err);
      showToast({
        title: "Error",
        message: "Failed to load properties",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkAndUpdateExpiredFeatured = async (propertiesList?: Property[]) => {
    const now = new Date();
    const propsToCheck = propertiesList || properties;

    for (const prop of propsToCheck) {
      if (prop.featured && prop.featuredExpiry) {
        const expiryDate =
          prop.featuredExpiry.toDate?.() || new Date(prop.featuredExpiry);

        if (expiryDate < now) {
          // Property has expired, update in database
          try {
            await updateDoc(doc(db, "properties", prop.id), {
              featured: false,
              featuredExpiry: deleteField(),
              featuredPlan: deleteField(),
              featuredSince: deleteField(),
            });

            // Update local state
            setProperties((prev) =>
              prev.map((p) =>
                p.id === prop.id
                  ? {
                      ...p,
                      featured: false,
                      featuredExpiry: undefined,
                      featuredPlan: undefined,
                      featuredSince: undefined,
                    }
                  : p,
              ),
            );

            console.log(
              `Property ${prop.name} has been removed from featured listings`,
            );
          } catch (error) {
            console.error(`Error updating expired property ${prop.id}:`, error);
          }
        }
      }
    }
  };

  const fetchRatingsForProperties = async (propertiesList: Property[]) => {
    try {
      const ratingsMap = new Map<string, RatingData>();

      const reviewsRef = collection(db, "reviews");
      const reviewsSnapshot = await getDocs(reviewsRef);

      const reviewsByProperty = new Map<string, any[]>();
      reviewsSnapshot.docs.forEach((doc) => {
        const review = doc.data();
        const propertyId = review.propertyId;
        if (propertyId) {
          if (!reviewsByProperty.has(propertyId)) {
            reviewsByProperty.set(propertyId, []);
          }
          reviewsByProperty.get(propertyId)!.push(review);
        }
      });

      for (const property of propertiesList) {
        const propertyReviews = reviewsByProperty.get(property.id) || [];
        if (propertyReviews.length > 0) {
          const totalRating = propertyReviews.reduce(
            (sum, review) => sum + (review.rating || 0),
            0,
          );
          const averageRating = totalRating / propertyReviews.length;
          ratingsMap.set(property.id, {
            averageRating: Number(averageRating.toFixed(1)),
            totalReviews: propertyReviews.length,
          });
        } else {
          ratingsMap.set(property.id, {
            averageRating: property.rating || 0,
            totalReviews: 0,
          });
        }
      }

      setRatings(ratingsMap);
    } catch (err) {
      console.error("Error fetching ratings:", err);
    }
  };

  const handleView = (property: Property) => {
    setSelectedProperty(property);
    setIsViewModalOpen(true);
  };

  const handleEdit = (property: Property) => {
    router.push(`/property/edit/${property.id}`);
  };

  const openDeleteModal = (property: Property) => {
    setSelectedProperty(property);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedProperty) return;

    setDeleting(true);
    try {
      const bookingsRef = collection(db, "bookings");
      const bookingsQuery = query(
        bookingsRef,
        where("propertyId", "==", selectedProperty.id),
        where("bookingStatus", "in", ["confirmed", "pending"]),
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);

      if (!bookingsSnapshot.empty) {
        showToast({
          title: "Error",
          message:
            "Cannot delete property with active bookings. Please cancel all bookings first.",
          type: "error",
        });
        setIsDeleteModalOpen(false);
        setDeleting(false);
        return;
      }

      await deleteDoc(doc(db, "properties", selectedProperty.id));
      setProperties((prev) => prev.filter((p) => p.id !== selectedProperty.id));
      showToast({
        title: "Success",
        message: "Property deleted successfully!",
        type: "success",
      });
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      console.error("Error deleting property:", err);
      if (err.code === "permission-denied") {
        showToast({
          title: "Error",
          message: "You don't have permission to delete this property",
          type: "error",
        });
      } else {
        showToast({
          title: "Error",
          message: "Failed to delete property. Please try again.",
          type: "error",
        });
      }
    } finally {
      setDeleting(false);
    }
  };

  // Handle Featured Property - Only allow toggling if NOT featured
  const handleToggleFeatured = (property: Property) => {
    // If already featured, don't allow toggling - show message
    if (isPropertyFeatured(property)) {
      const expiryDate =
        property.featuredExpiry?.toDate?.() ||
        new Date(property.featuredExpiry);
      const daysRemaining = Math.ceil(
        (expiryDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24),
      );
      showToast({
        title: "Already Featured",
        message: `This property is already featured! It will remain featured for ${daysRemaining} more day(s). The status cannot be changed until it expires.`,
        type: "error",
      });
      return;
    }

    // If not featured, open modal to select plan
    setSelectedProperty(property);
    setIsFeaturedModalOpen(true);
  };

  // Initialize Paystack Payment (exactly like booking form)
  const initializePayment = () => {
    if (!selectedProperty || !user) return;

    if (!isPaystackReady || !(window as any).PaystackPop) {
      showToast({
        title: "Payment System Loading",
        message: "Please wait a moment and try again.",
        type: "error",
      });
      return;
    }

    if (!paystackPublicKey) {
      showToast({
        title: "Configuration Error",
        message:
          "Payment system is not properly configured. Please contact support.",
        type: "error",
      });
      return;
    }

    const amount = selectedPlan === "monthly" ? 20 : 200;
    const durationMonths = selectedPlan === "monthly" ? 1 : 12;
    const amountInPesewas = Math.round(amount * 100);

    if (amountInPesewas <= 0) {
      showToast({
        title: "Error",
        message: "Invalid payment amount. Please try again.",
        type: "error",
      });
      return;
    }

    setIsProcessingPayment(true);

    try {
      const reference = `FTR-${selectedProperty.id}-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;

      const handler = (window as any).PaystackPop.setup({
        key: paystackPublicKey,
        email: user.email || "customer@example.com",
        amount: amountInPesewas,
        currency: "GHS",
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Property ID",
              variable_name: "property_id",
              value: selectedProperty.id,
            },
            {
              display_name: "Property Name",
              variable_name: "property_name",
              value: selectedProperty.name,
            },
            {
              display_name: "Plan Type",
              variable_name: "plan_type",
              value: selectedPlan,
            },
            {
              display_name: "Duration Months",
              variable_name: "duration_months",
              value: durationMonths.toString(),
            },
            {
              display_name: "User ID",
              variable_name: "user_id",
              value: user.uid || "",
            },
          ],
        },
        callback: function (response: any) {
          console.log("Payment successful:", response);

          // Update property as featured after successful payment
          updatePropertyAsFeatured(durationMonths, response.reference);
        },
        onClose: function () {
          console.log("Payment window closed");
          setIsProcessingPayment(false);
          showToast({
            title: "Payment Cancelled",
            message:
              "You closed the payment window. You can try again anytime.",
            type: "error",
          });
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error("Paystack initialization error:", error);
      setIsProcessingPayment(false);
      showToast({
        title: "Payment Error",
        message:
          "Unable to initialize payment. Please check your internet connection and try again.",
        type: "error",
      });
    }
  };

  const updatePropertyAsFeatured = async (
    durationMonths: number,
    paymentReference: string,
  ) => {
    try {
      // Calculate expiry date starting from TODAY (the day of successful payment)
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + durationMonths);

      // Set to end of day for consistency
      expiryDate.setHours(23, 59, 59, 999);

      await updateDoc(doc(db, "properties", selectedProperty!.id), {
        featured: true,
        featuredExpiry: Timestamp.fromDate(expiryDate),
        featuredSince: Timestamp.fromDate(new Date()),
        featuredPlan: selectedPlan,
        featuredPaymentReference: paymentReference,
        featuredPaymentDate: Timestamp.fromDate(new Date()),
      });

      // Update local state
      setProperties((prev) =>
        prev.map((p) =>
          p.id === selectedProperty!.id
            ? {
                ...p,
                featured: true,
                featuredExpiry: expiryDate,
                featuredSince: new Date(),
                featuredPlan: selectedPlan,
              }
            : p,
        ),
      );

      const durationText =
        durationMonths === 1 ? "1 month" : `${durationMonths} months`;
      showToast({
        title: "Success!",
        message: `${selectedProperty!.name} is now featured for ${durationText}! It will automatically expire on ${expiryDate.toLocaleDateString()}.`,
        type: "success",
      });

      setIsFeaturedModalOpen(false);
      setSelectedProperty(null);
      setIsProcessingPayment(false);
    } catch (error) {
      console.error("Error updating property:", error);
      showToast({
        title: "Error",
        message:
          "Payment successful but failed to update property status. Please contact support.",
        type: "error",
      });
      setIsProcessingPayment(false);
    }
  };

  const isPropertyFeatured = (property: Property): boolean => {
    if (!property.featured) return false;
    if (property.featuredExpiry) {
      const expiryDate =
        property.featuredExpiry.toDate?.() || new Date(property.featuredExpiry);
      const now = new Date();
      return expiryDate > now;
    }
    return true;
  };

  const getDaysRemaining = (property: Property): number | null => {
    if (!property.featuredExpiry) return null;
    const expiryDate =
      property.featuredExpiry.toDate?.() || new Date(property.featuredExpiry);
    const now = new Date();
    if (expiryDate <= now) return null;
    return Math.ceil(
      (expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24),
    );
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

  // Get rating for a property
  const getPropertyRating = (propertyId: string): RatingData => {
    return ratings.get(propertyId) || { averageRating: 0, totalReviews: 0 };
  };

  // Format expiry date
  const formatExpiryDate = (expiry: any): string => {
    if (!expiry) return "";
    const date = expiry.toDate?.() || new Date(expiry);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const remainingSlots = userPlan
    ? getRemainingProperties(properties.length, userPlan.planId)
    : 5;

  // Table columns with Featured Toggle (locked when featured)
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
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-900 dark:text-white">
                {item.name}
              </p>
              {isPropertyFeatured(item) && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-full">
                  <FiZap className="w-3 h-3" />
                  Featured
                </span>
              )}
            </div>
            {item.address && (
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                <FiMapPin className="w-3 h-3" />
                {item.address.city}, {item.address.country}
              </p>
            )}
            {isPropertyFeatured(item) && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                Featured until: {formatExpiryDate(item.featuredExpiry)}
                {getDaysRemaining(item) &&
                  ` (${getDaysRemaining(item)} days left)`}
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
          {item.category || item.type || "N/A"}
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
      key: "rating",
      label: "Rating",
      type: "custom" as const,
      render: (item: Property) => {
        const rating = getPropertyRating(item.id);
        return rating.averageRating > 0 ? (
          <div className="flex items-center gap-1">
            <FiStar className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {rating.averageRating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">
              ({rating.totalReviews})
            </span>
          </div>
        ) : (
          <span className="text-xs text-gray-400">No ratings</span>
        );
      },
    },
    {
      key: "featured",
      label: "Featured",
      type: "custom" as const,
      render: (item: Property) => {
        const isFeatured = isPropertyFeatured(item);
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFeatured(item);
              }}
              disabled={isFeatured}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                isFeatured
                  ? "bg-yellow-500 cursor-not-allowed opacity-75"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              }`}
              title={
                isFeatured
                  ? "Cannot change featured status - property is already featured"
                  : "Click to feature this property"
              }
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isFeatured ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            {isFeatured && (
              <FiLock
                className="w-3 h-3 text-gray-400"
                title="Locked - Cannot change featured status"
              />
            )}
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      type: "actions" as const,
      actions: [
        {
          icon: <FiEye />,
          color: "text-[#00CFFF] hover:bg-[#00CFFF]/10",
          onClick: (item: Property) => handleView(item),
          title: "View Property",
        },
        {
          icon: <FiEdit />,
          color: "text-green-500 hover:bg-green-500/10",
          onClick: (item: Property) => handleEdit(item),
          title: "Edit Property",
        },
        {
          icon: <FiTrash2 />,
          color: "text-[#FF4FA1] hover:bg-[#FF4FA1]/10",
          onClick: (item: Property) => openDeleteModal(item),
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

        {!planLoading && userPlan && (
          <div className="mb-6">
            {remainingSlots === 0 ? (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-yellow-600 dark:text-yellow-400 font-medium">
                      Property Limit Reached
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You've reached the maximum of {userPlan.maxProperties}{" "}
                      properties on your {userPlan.planName} plan.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:shadow-lg transition-all text-sm"
                  >
                    Upgrade Plan
                  </button>
                </div>
              </div>
            ) : remainingSlots < 3 && remainingSlots > 0 ? (
              <div className="p-3 bg-blue-500/10 border border-blue-500 rounded-lg">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                      You have {remainingSlots} slot
                      {remainingSlots !== 1 ? "s" : ""} remaining
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Upgrade to Agent Pro for more properties and features
                    </p>
                  </div>
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:shadow-lg transition-all text-xs"
                  >
                    Upgrade
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

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

      {/* Featured Property Modal */}
      {isFeaturedModalOpen && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full transform animate-in slide-in-from-bottom-4 duration-300 shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
                    <FiTrendingUp className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Feature Your Property
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedProperty.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsFeaturedModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Get more visibility by featuring your property. Featured
                  properties appear at the top of search results and get a
                  special badge. Your property will be automatically removed
                  from featured listings when the period ends.
                </p>

                {/* Plan Selection */}
                <div className="space-y-3">
                  <div
                    onClick={() => setSelectedPlan("monthly")}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPlan === "monthly"
                        ? "border-yellow-500 bg-yellow-500/5"
                        : "border-gray-200 dark:border-gray-700 hover:border-yellow-500/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <FiCalendar className="w-4 h-4 text-yellow-500" />
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            Monthly Plan
                          </h4>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Feature your property for 30 days
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          ₵20
                        </p>
                        <p className="text-xs text-gray-500">per month</p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedPlan("yearly")}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPlan === "yearly"
                        ? "border-yellow-500 bg-yellow-500/5"
                        : "border-gray-200 dark:border-gray-700 hover:border-yellow-500/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <FiZap className="w-4 h-4 text-yellow-500" />
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            Yearly Plan
                          </h4>
                          <span className="px-2 py-0.5 text-xs font-semibold bg-green-500/20 text-green-600 rounded-full">
                            Save ₵40
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Feature your property for 12 months
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          ₵200
                        </p>
                        <p className="text-xs text-gray-500 line-through">
                          ₵240
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={initializePayment}
                  disabled={!isPaystackReady || isProcessingPayment}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    isPaystackReady && !isProcessingPayment
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:shadow-lg"
                      : "bg-gray-400 cursor-not-allowed text-gray-200"
                  }`}
                >
                  {isProcessingPayment ? (
                    <>
                      <FiLoader className="animate-spin" />
                      Processing...
                    </>
                  ) : isPaystackReady ? (
                    <>
                      <FiZap />
                      Pay ₵{selectedPlan === "monthly" ? "20" : "200"}
                    </>
                  ) : (
                    "Loading Payment..."
                  )}
                </button>
                <button
                  onClick={() => setIsFeaturedModalOpen(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-medium hover:border-gray-400 transition-all"
                >
                  Cancel
                </button>
              </div>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                Secure payment powered by Paystack. Your property will be
                featured immediately after successful payment and automatically
                expire after the selected period.
              </p>
            </div>
          </div>
        </div>
      )}

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
                {isPropertyFeatured(selectedProperty) && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-semibold flex items-center gap-1">
                    <FiZap className="w-4 h-4" />
                    Featured
                  </div>
                )}
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
                      {(() => {
                        const rating = getPropertyRating(selectedProperty.id);
                        return rating.averageRating > 0
                          ? rating.averageRating.toFixed(1)
                          : "N/A";
                      })()}
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
                    onClick={() => {
                      setIsViewModalOpen(false);
                      handleToggleFeatured(selectedProperty);
                    }}
                    disabled={isPropertyFeatured(selectedProperty)}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                      isPropertyFeatured(selectedProperty)
                        ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:shadow-lg"
                    }`}
                  >
                    <FiZap />
                    {isPropertyFeatured(selectedProperty)
                      ? "Already Featured"
                      : "Feature Property"}
                  </button>
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

      <UpgradePlanModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPropertyCount={properties.length}
        onUpgradeComplete={() => {
          fetchProperties();
        }}
      />
    </div>
  );
};

export default Properties;
