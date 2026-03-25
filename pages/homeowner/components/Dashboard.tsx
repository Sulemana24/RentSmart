"use client";
import { useEffect, useState } from "react";
import {
  FiHome,
  FiCalendar,
  FiTrendingUp,
  FiUsers,
  FiPlus,
  FiDownload,
  FiMessageSquare,
  FiLoader,
  FiEye,
  FiEdit,
  FiTrash2,
  FiX,
  FiMapPin,
  FiUser,
  FiMail,
  FiClock,
  FiDollarSign,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import StatCard from "./common/StatCard";
import QuickActions from "./common/QuickActions";
import { useRouter } from "next/navigation";

interface Booking {
  id: string;
  type: string;
  property: string;
  propertyId: string;
  date: string;
  time?: string;
  status: string;
  total?: number;
  createdAt?: any;
  startDate?: string;
  endDate?: string;
  customerName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  bookingDate?: string;
  bookingTime?: string;
  durationInMonths?: number;
  guests?: number;
  specialRequests?: string;
  paymentMethod?: string;
  paymentStatus?: string;
}

interface Payment {
  id: string;
  tenant: string;
  property: string;
  amount: number;
  date: string;
  status: string;
  bookingId?: string;
  paymentReference?: string;
}

interface DashboardMetrics {
  totalProperties: number;
  activeBookings: number;
  monthlyRevenue: number;
  totalTenants: number;
  revenueChange: number;
  bookingsChange: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalProperties: 0,
    activeBookings: 0,
    monthlyRevenue: 0,
    totalTenants: 0,
    revenueChange: 0,
    bookingsChange: 0,
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [propertyIds, setPropertyIds] = useState<string[]>([]);

  // Modal states
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (user?.uid) {
      fetchPropertiesAndSetupRealtimeUpdates();
    }
  }, [user?.uid]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPropertiesAndSetupRealtimeUpdates = async () => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      const db = getFirestore();

      const propertiesRef = collection(db, "properties");
      const propertiesQuery = query(
        propertiesRef,
        where("hostId", "==", user.uid),
      );
      const propertiesSnapshot = await getDocs(propertiesQuery);
      const propertyIdsList = propertiesSnapshot.docs.map((doc) => doc.id);
      setPropertyIds(propertyIdsList);

      const totalProperties = propertyIdsList.length;

      if (propertyIdsList.length === 0) {
        setMetrics({
          totalProperties: 0,
          activeBookings: 0,
          monthlyRevenue: 0,
          totalTenants: 0,
          revenueChange: 0,
          bookingsChange: 0,
        });
        setRecentBookings([]);
        setRecentPayments([]);
        setLoading(false);
        return;
      }

      // Set up real-time listener for bookings
      setupRealtimeBookingsListener(propertyIdsList);

      // Update total properties in metrics
      setMetrics((prev) => ({
        ...prev,
        totalProperties,
      }));
    } catch (error) {
      console.error("Error fetching properties:", error);
      setLoading(false);
    }
  };

  const setupRealtimeBookingsListener = (propertyIdsList: string[]) => {
    const db = getFirestore();
    const bookingsRef = collection(db, "bookings");

    // Create queries for each property ID chunk (Firestore "in" limit of 10)
    const chunks = [];
    for (let i = 0; i < propertyIdsList.length; i += 10) {
      chunks.push(propertyIdsList.slice(i, i + 10));
    }

    // Set up listeners for each chunk
    const unsubscribeFunctions: (() => void)[] = [];

    chunks.forEach((chunk) => {
      const bookingsQuery = query(
        bookingsRef,
        where("propertyId", "in", chunk),
        orderBy("createdAt", "desc"),
      );

      const unsubscribe = onSnapshot(
        bookingsQuery,
        (snapshot) => {
          const allBookings: Booking[] = [];
          let confirmedBookings = 0;
          let currentMonthRevenue = 0;
          let previousMonthRevenueTotal = 0;
          const uniqueTenants = new Set<string>();

          // Get current month and previous month dates
          const now = new Date();
          const currentMonthStart = new Date(
            now.getFullYear(),
            now.getMonth(),
            1,
          );
          const previousMonthStart = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1,
          );
          const previousMonthEnd = new Date(
            now.getFullYear(),
            now.getMonth(),
            0,
          );

          snapshot.forEach((doc) => {
            const data = doc.data();
            const bookingStatus = data.bookingStatus?.toLowerCase();

            // Format booking for recent list
            const bookingType =
              data.bookingType ||
              (data.durationInMonths ? "Rental Booking" : "Tour Booking");

            const booking: Booking = {
              id: doc.id,
              type: bookingType,
              property: data.propertyName || "Unknown Property",
              propertyId: data.propertyId,
              date:
                data.startDate ||
                data.bookingDate ||
                (data.createdAt?.toDate
                  ? data.createdAt.toDate().toLocaleDateString()
                  : ""),
              time: data.bookingTime || "12:00 PM",
              status:
                bookingStatus === "confirmed"
                  ? "Confirmed"
                  : bookingStatus === "pending"
                    ? "Pending"
                    : "Cancelled",
              total: data.total,
              createdAt: data.createdAt,
              startDate: data.startDate,
              endDate: data.endDate,
              customerName:
                `${data.firstName || ""} ${data.lastName || ""}`.trim() ||
                "Unknown",
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              phone: data.phone,
              bookingDate: data.bookingDate,
              bookingTime: data.bookingTime,
              durationInMonths: data.durationInMonths,
              guests: data.guests,
              specialRequests: data.specialRequests,
              paymentMethod: data.paymentMethod,
              paymentStatus: data.paymentStatus,
            };

            allBookings.push(booking);

            // ✅ ONLY COUNT CONFIRMED BOOKINGS
            if (bookingStatus === "confirmed") {
              confirmedBookings++;

              // Add unique tenant
              if (data.email) {
                uniqueTenants.add(data.email);
              }

              // Calculate revenue for current month (from confirmed bookings only)
              const createdAt = data.createdAt?.toDate();
              if (createdAt && createdAt >= currentMonthStart) {
                currentMonthRevenue += data.total || 0;
              }

              // Calculate revenue for previous month (from confirmed bookings only)
              if (
                createdAt &&
                createdAt >= previousMonthStart &&
                createdAt <= previousMonthEnd
              ) {
                previousMonthRevenueTotal += data.total || 0;
              }
            }
          });

          // Sort recent bookings by date (newest first)
          const sortedRecentBookings = allBookings
            .sort((a, b) => {
              const dateA = a.createdAt?.toDate
                ? a.createdAt.toDate()
                : new Date(0);
              const dateB = b.createdAt?.toDate
                ? b.createdAt.toDate()
                : new Date(0);
              return dateB.getTime() - dateA.getTime();
            })
            .slice(0, 5);

          // Calculate revenue change percentage
          const revenueChange =
            previousMonthRevenueTotal > 0
              ? ((currentMonthRevenue - previousMonthRevenueTotal) /
                  previousMonthRevenueTotal) *
                100
              : currentMonthRevenue > 0
                ? 100
                : 0;

          // Calculate bookings change (compare current vs previous month for confirmed bookings)
          const currentMonthBookings = allBookings.filter((b) => {
            const createdAt = b.createdAt?.toDate();
            return (
              createdAt &&
              createdAt >= currentMonthStart &&
              b.status === "Confirmed"
            );
          }).length;

          const previousMonthBookings = allBookings.filter((b) => {
            const createdAt = b.createdAt?.toDate();
            return (
              createdAt &&
              createdAt >= previousMonthStart &&
              createdAt <= previousMonthEnd &&
              b.status === "Confirmed"
            );
          }).length;

          const bookingsChange =
            previousMonthBookings > 0
              ? ((currentMonthBookings - previousMonthBookings) /
                  previousMonthBookings) *
                100
              : currentMonthBookings > 0
                ? 100
                : 0;

          // Format recent payments (from confirmed bookings only)
          const recentPaymentsList: Payment[] = allBookings
            .filter((b) => b.status === "Confirmed" && b.total && b.total > 0)
            .map((b) => ({
              id: b.id,
              tenant: b.customerName || "Unknown",
              property: b.property,
              amount: b.total || 0,
              date: b.startDate || b.date,
              status: "Paid",
              bookingId: b.id,
            }))
            .slice(0, 5);

          setMetrics({
            totalProperties: propertyIdsList.length,
            activeBookings: confirmedBookings,
            monthlyRevenue: currentMonthRevenue,
            totalTenants: uniqueTenants.size,
            revenueChange: Math.round(revenueChange),
            bookingsChange: Math.round(bookingsChange),
          });

          setRecentBookings(sortedRecentBookings);
          setRecentPayments(recentPaymentsList);
          setLoading(false);
        },
        (error) => {
          console.error("Error in real-time listener:", error);
          setLoading(false);
        },
      );

      unsubscribeFunctions.push(unsubscribe);
    });

    // Cleanup function
    return () => {
      unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
    };
  };

  // Booking action handlers
  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsViewModalOpen(true);
  };

  const handleEditBooking = (booking: Booking) => {
    router.push(`/host/bookings/edit/${booking.id}`);
  };

  const handleDeleteBooking = async () => {
    if (!selectedBooking) return;

    setDeleting(true);
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, "bookings", selectedBooking.id));
      showToast("Booking deleted successfully!", "success");
      setIsDeleteModalOpen(false);
      setIsViewModalOpen(false);
    } catch (err: any) {
      console.error("Error deleting booking:", err);
      if (err.code === "permission-denied") {
        showToast("You don't have permission to delete this booking", "error");
      } else {
        showToast("Failed to delete booking. Please try again.", "error");
      }
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDeleteModalOpen(true);
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const db = getFirestore();
      await updateDoc(doc(db, "bookings", bookingId), {
        bookingStatus: newStatus.toLowerCase(),
        updatedAt: new Date(),
      });
      showToast(`Booking ${newStatus} successfully!`, "success");
    } catch (err: any) {
      console.error("Error updating booking status:", err);
      showToast("Failed to update booking status", "error");
    }
  };

  const dashboardStats = [
    {
      title: "Total Properties",
      value: metrics.totalProperties.toString(),
      change: `+${metrics.totalProperties > 0 ? metrics.totalProperties : 0}`,
      icon: <FiHome />,
      color: "text-[#00CFFF]",
      bgColor: "bg-[#00CFFF]/10",
    },
    {
      title: "Active Bookings",
      value: metrics.activeBookings.toString(),
      change: `${metrics.bookingsChange > 0 ? "+" : ""}${metrics.bookingsChange}%`,
      icon: <FiCalendar />,
      color: "text-[#FF4FA1]",
      bgColor: "bg-[#FF4FA1]/10",
    },
    {
      title: "Monthly Revenue",
      value: `₵${metrics.monthlyRevenue.toLocaleString()}`,
      change: `${metrics.revenueChange > 0 ? "+" : ""}${metrics.revenueChange}%`,
      icon: <FiTrendingUp />,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Tenants",
      value: metrics.totalTenants.toString(),
      change: `+${metrics.totalTenants > 0 ? metrics.totalTenants : 0}`,
      icon: <FiUsers />,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  /* const quickActions = [
    {
      label: "Add Property",
      icon: <FiPlus />,
      color: "text-[#00CFFF]",
      onClick: () => router.push("/properties/create"),
    },
    {
      label: "View Bookings",
      icon: <FiCalendar />,
      color: "text-[#FF4FA1]",
      onClick: () => router.push("/host/bookings"),
    },
    {
      label: "Send Message",
      icon: <FiMessageSquare />,
      color: "text-green-500",
      onClick: () => router.push("/messages"),
    },
    {
      label: "Generate Report",
      icon: <FiDownload />,
      color: "text-purple-500",
      onClick: () => router.push("/reports"),
    },
  ]; */

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
      case "cancelled":
        return "bg-red-500/10 text-red-600 dark:text-red-400";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-500 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FiLoader className="animate-spin text-4xl text-[#FF4FA1] mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading dashboard metrics...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Bookings
          </h3>
          {/* <button
            onClick={() => router.push("/host/bookings")}
            className="text-sm text-[#00CFFF] hover:text-[#FF4FA1] transition-colors"
          >
            View All
          </button> */}
        </div>
        <div className="space-y-4">
          {recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No recent bookings
              </p>
            </div>
          ) : (
            recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors group"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => handleViewBooking(booking)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.status)}`}
                    >
                      {booking.status}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {booking.type}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {booking.property} • {booking.date}
                    {booking.time && ` at ${booking.time}`}
                  </div>
                  {booking.customerName &&
                    booking.customerName !== "Unknown" && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Customer: {booking.customerName}
                      </div>
                    )}
                  {booking.total && booking.status === "Confirmed" && (
                    <div className="text-xs font-semibold text-[#FF4FA1] mt-1">
                      ₵{booking.total.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Payments
          </h3>
          {/* <button
            onClick={() => router.push("/host/payments")}
            className="text-sm text-[#00CFFF] hover:text-[#FF4FA1] transition-colors"
          >
            View All
          </button> */}
        </div>
        <div className="space-y-4">
          {recentPayments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No recent payments
              </p>
            </div>
          ) : (
            recentPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer"
                onClick={() =>
                  router.push(`/host/payments?payment=${payment.id}`)
                }
              >
                <div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        payment.status === "Paid"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    ></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {payment.tenant}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {payment.property} • {payment.date}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    ₵{payment.amount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">{payment.status}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {/*   <QuickActions actions={quickActions} /> */}

      {/* View Booking Modal */}
      {isViewModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform animate-in slide-in-from-bottom-4 duration-300 shadow-2xl">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Booking Details
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Booking ID: {selectedBooking.id}
                </p>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(selectedBooking.status)}`}
                  >
                    {selectedBooking.status}
                  </div>
                  {selectedBooking.status === "Pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          updateBookingStatus(selectedBooking.id, "Confirmed")
                        }
                        className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() =>
                          updateBookingStatus(selectedBooking.id, "Cancelled")
                        }
                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                {selectedBooking.total && (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#FF4FA1]">
                      ₵{selectedBooking.total.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Total Amount</p>
                  </div>
                )}
              </div>

              {/* Customer Information */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <FiUser className="w-4 h-4" />
                  Customer Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedBooking.customerName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-900 dark:text-white flex items-center gap-1">
                      <FiMail className="w-3 h-3" />
                      {selectedBooking.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedBooking.phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Guests</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedBooking.guests || "1"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <FiCalendar className="w-4 h-4" />
                  Booking Details
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Property
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedBooking.property}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Booking Type
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedBooking.type}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Booking Date
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedBooking.bookingDate || selectedBooking.date}
                    </span>
                  </div>
                  {selectedBooking.bookingTime && (
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <FiClock className="w-3 h-3" />
                        Time
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedBooking.bookingTime}
                      </span>
                    </div>
                  )}
                  {selectedBooking.startDate && (
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Start Date
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedBooking.startDate}
                      </span>
                    </div>
                  )}
                  {selectedBooking.endDate && (
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        End Date
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedBooking.endDate}
                      </span>
                    </div>
                  )}
                  {selectedBooking.durationInMonths && (
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Duration
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedBooking.durationInMonths} month(s)
                      </span>
                    </div>
                  )}
                  {selectedBooking.paymentMethod && (
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <FiDollarSign className="w-3 h-3" />
                        Payment Method
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedBooking.paymentMethod}
                      </span>
                    </div>
                  )}
                  {selectedBooking.paymentStatus && (
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Payment Status
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          selectedBooking.paymentStatus === "Paid"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {selectedBooking.paymentStatus}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Special Requests */}
              {selectedBooking.specialRequests && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Special Requests
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedBooking.specialRequests}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
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
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full transform animate-in slide-in-from-bottom-4 duration-300 shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <FiAlertCircle className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
                Delete Booking
              </h3>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this booking from{" "}
                {selectedBooking.customerName}? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteBooking}
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

export default Dashboard;
