"use client";
import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiCheck,
  FiX,
  FiLoader,
  FiAlertCircle,
  FiDollarSign,
  FiUser,
  FiHome,
  FiClock,
  FiRefreshCw,
  FiMail,
  FiMapPin,
} from "react-icons/fi";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/router";

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
  paymentReference?: string;
}

const Payments = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Booking[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [propertyIds, setPropertyIds] = useState<string[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Booking | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Payment statistics
  const [stats, setStats] = useState({
    totalRevenue: 0,
    thisMonthRevenue: 0,
    pendingAmount: 0,
    collectedAmount: 0,
    totalTransactions: 0,
    successRate: 0,
  });

  useEffect(() => {
    if (user?.uid) {
      fetchPropertiesAndSetupRealtimePayments();
    }
  }, [user?.uid]);

  useEffect(() => {
    filterPayments();
  }, [searchTerm, statusFilter, payments]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPropertiesAndSetupRealtimePayments = async () => {
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

      if (propertyIdsList.length === 0) {
        setPayments([]);
        setFilteredPayments([]);
        setLoading(false);
        return;
      }

      // Set up real-time listener for bookings (payments)
      setupRealtimePaymentsListener(propertyIdsList);
    } catch (error) {
      console.error("Error fetching properties:", error);
      showToast("Failed to load payment data", "error");
      setLoading(false);
    }
  };

  const setupRealtimePaymentsListener = (propertyIdsList: string[]) => {
    const db = getFirestore();
    const bookingsRef = collection(db, "bookings");

    // Create queries for each property ID chunk (Firestore "in" limit of 10)
    const chunks = [];
    for (let i = 0; i < propertyIdsList.length; i += 10) {
      chunks.push(propertyIdsList.slice(i, i + 10));
    }

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
          const allPayments: Booking[] = [];
          let totalRevenue = 0;
          let thisMonthRevenue = 0;
          let pendingAmount = 0;
          let collectedAmount = 0;
          let successCount = 0;

          // Get current month dates
          const now = new Date();
          const currentMonthStart = new Date(
            now.getFullYear(),
            now.getMonth(),
            1,
          );

          snapshot.forEach((doc) => {
            const data = doc.data();
            const bookingStatus = data.bookingStatus?.toLowerCase();

            // Only include confirmed bookings (which have payments)
            if (bookingStatus === "confirmed") {
              const paymentStatus = data.paymentStatus || "Paid";
              const amount = data.total || 0;

              // Format booking for payment list
              const payment: Booking = {
                id: doc.id,
                type:
                  data.bookingType ||
                  (data.durationInMonths ? "Rental Booking" : "Tour Booking"),
                property: data.propertyName || "Unknown Property",
                propertyId: data.propertyId,
                date:
                  data.startDate ||
                  data.bookingDate ||
                  (data.createdAt?.toDate
                    ? data.createdAt.toDate().toLocaleDateString()
                    : ""),
                time: data.bookingTime || "12:00 PM",
                status: paymentStatus,
                total: amount,
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
                paymentStatus: paymentStatus,
                paymentReference: data.paymentReference,
              };

              allPayments.push(payment);

              // Calculate statistics
              totalRevenue += amount;

              if (paymentStatus === "Paid") {
                collectedAmount += amount;
                successCount++;

                // Check if payment is from current month
                const paymentDate = data.createdAt?.toDate();
                if (paymentDate && paymentDate >= currentMonthStart) {
                  thisMonthRevenue += amount;
                }
              } else if (paymentStatus === "Pending") {
                pendingAmount += amount;
              }
            }
          });

          const successRate =
            allPayments.length > 0
              ? (successCount / allPayments.length) * 100
              : 0;

          setStats({
            totalRevenue,
            thisMonthRevenue,
            pendingAmount,
            collectedAmount,
            totalTransactions: allPayments.length,
            successRate: Math.round(successRate),
          });

          setPayments(allPayments);
          setFilteredPayments(allPayments);
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

  const filterPayments = () => {
    let filtered = [...payments];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.customerName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payment.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.paymentReference
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (payment) =>
          payment.status.toLowerCase() === statusFilter.toLowerCase(),
      );
    }

    setFilteredPayments(filtered);
  };

  const handleViewPayment = (payment: Booking) => {
    setSelectedPayment(payment);
    setIsViewModalOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return `₵${amount?.toLocaleString() || 0}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-500 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Transaction ID",
      "Customer Name",
      "Email",
      "Property",
      "Amount",
      "Date",
      "Status",
      "Payment Method",
      "Reference",
    ];

    const csvData = filteredPayments.map((payment) => [
      payment.id,
      payment.customerName,
      payment.email || "",
      payment.property,
      payment.total || 0,
      payment.date,
      payment.status,
      payment.paymentMethod || "",
      payment.paymentReference || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showToast("Payments exported successfully!", "success");
  };

  const revenueStats = [
    {
      label: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: FiDollarSign,
      color: "text-[#FF4FA1]",
    },
    {
      label: "This Month",
      value: formatCurrency(stats.thisMonthRevenue),
      icon: FiCalendar,
      color: "text-[#00CFFF]",
    },
    {
      label: "Pending",
      value: formatCurrency(stats.pendingAmount),
      icon: FiClock,
      color: "text-yellow-500",
    },
    {
      label: "Collected",
      value: formatCurrency(stats.collectedAmount),
      icon: FiCheck,
      color: "text-green-500",
    },
    {
      label: "Transactions",
      value: stats.totalTransactions.toString(),
      icon: FiDollarSign,
      color: "text-purple-500",
    },
    {
      label: "Success Rate",
      value: `${stats.successRate}%`,
      icon: FiCheck,
      color: "text-blue-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FiLoader className="animate-spin text-4xl text-[#FF4FA1] mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading payment data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Payment Management
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Track and manage all payment transactions from confirmed bookings
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-[#FF4FA1] text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
            >
              <FiDownload className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {revenueStats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.label}
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer, property, email, or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF4FA1] focus:border-transparent"
            />
          </div>
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF4FA1] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Payments Table */}
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiDollarSign className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No payments found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "No payments have been processed yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Property
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Method
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {payment.customerName}
                        </p>
                        {payment.email && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {payment.email}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {payment.property}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(payment.total || 0)}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(payment.date)}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {payment.paymentMethod || "N/A"}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleViewPayment(payment)}
                        className="p-2 text-[#00CFFF] hover:bg-[#00CFFF]/10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Payment Modal */}
      {isViewModalOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform animate-in slide-in-from-bottom-4 duration-300 shadow-2xl">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Payment Details
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Booking ID: {selectedPayment.id}
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
              {/* Status and Amount */}
              <div className="flex items-center justify-between">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(selectedPayment.status)}`}
                >
                  {selectedPayment.status}
                </div>
                <p className="text-2xl font-bold text-[#FF4FA1]">
                  {formatCurrency(selectedPayment.total || 0)}
                </p>
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
                      {selectedPayment.customerName}
                    </p>
                  </div>
                  {selectedPayment.email && (
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm text-gray-900 dark:text-white flex items-center gap-1">
                        <FiMail className="w-3 h-3" />
                        {selectedPayment.email}
                      </p>
                    </div>
                  )}
                  {selectedPayment.phone && (
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {selectedPayment.phone}
                      </p>
                    </div>
                  )}
                  {selectedPayment.guests && (
                    <div>
                      <p className="text-xs text-gray-500">Guests</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {selectedPayment.guests}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Property Information */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <FiHome className="w-4 h-4" />
                  Property Information
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Property Name
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedPayment.property}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Booking Type
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {selectedPayment.type}
                    </span>
                  </div>
                  {selectedPayment.startDate && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Start Date
                      </span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {formatDate(selectedPayment.startDate)}
                      </span>
                    </div>
                  )}
                  {selectedPayment.endDate && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        End Date
                      </span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {formatDate(selectedPayment.endDate)}
                      </span>
                    </div>
                  )}
                  {selectedPayment.durationInMonths && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Duration
                      </span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {selectedPayment.durationInMonths} month(s)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <FiDollarSign className="w-4 h-4" />
                  Payment Details
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Payment Date
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatDate(selectedPayment.date)}
                    </span>
                  </div>
                  {selectedPayment.paymentMethod && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Payment Method
                      </span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {selectedPayment.paymentMethod}
                      </span>
                    </div>
                  )}
                  {selectedPayment.paymentReference && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Reference
                      </span>
                      <span className="text-sm font-mono text-gray-900 dark:text-white">
                        {selectedPayment.paymentReference}
                      </span>
                    </div>
                  )}
                  {selectedPayment.bookingTime && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Booking Time
                      </span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {selectedPayment.bookingTime}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Special Requests */}
              {selectedPayment.specialRequests && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Special Requests
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedPayment.specialRequests}
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

export default Payments;
