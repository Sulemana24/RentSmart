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
} from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import StatCard from "./common/StatCard";
import QuickActions from "./common/QuickActions";

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
  customerName?: string;
  email?: string;
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

  useEffect(() => {
    if (user?.uid) {
      fetchPropertiesAndSetupRealtimeUpdates();
    }
  }, [user?.uid]);

  const fetchPropertiesAndSetupRealtimeUpdates = async () => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      const db = getFirestore();

      // First, get all properties owned by this host
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
              customerName:
                `${data.firstName || ""} ${data.lastName || ""}`.trim() ||
                "Unknown",
              email: data.email,
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

  const quickActions = [
    {
      label: "Add Property",
      icon: <FiPlus />,
      color: "text-[#00CFFF]",
      onClick: () => (window.location.href = "/properties/create"),
    },
    {
      label: "View Bookings",
      icon: <FiCalendar />,
      color: "text-[#FF4FA1]",
      onClick: () => (window.location.href = "/host/bookings"),
    },
    {
      label: "Send Message",
      icon: <FiMessageSquare />,
      color: "text-green-500",
      onClick: () => (window.location.href = "/messages"),
    },
    {
      label: "Generate Report",
      icon: <FiDownload />,
      color: "text-purple-500",
      onClick: () => (window.location.href = "/reports"),
    },
  ];

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
          <button
            onClick={() => (window.location.href = "/host/bookings")}
            className="text-sm text-[#00CFFF] hover:text-[#FF4FA1] transition-colors"
          >
            View All
          </button>
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
                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer"
                onClick={() =>
                  (window.location.href = `/host/bookings?booking=${booking.id}`)
                }
              >
                <div>
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
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
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
          <button
            onClick={() => (window.location.href = "/host/payments")}
            className="text-sm text-[#00CFFF] hover:text-[#FF4FA1] transition-colors"
          >
            View All
          </button>
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
                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
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
      <QuickActions actions={quickActions} />
    </div>
  );
};

export default Dashboard;
