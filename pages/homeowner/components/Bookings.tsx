"use client";
import { useEffect, useState } from "react";
import { FiPlus, FiCheck, FiX, FiEye, FiLoader } from "react-icons/fi";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import BookingStats from "./common/BookingStats";
import BookingList from "./common/BookingList";

interface Booking {
  id: string;
  type: "Tour Booking" | "Rental Booking";
  property: string;
  propertyId: string;
  date: string;
  time?: string;
  status: "Confirmed" | "Pending" | "Cancelled";
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  durationInMonths?: number;
  total?: number;
  bookingPin?: string;
  startDate?: string;
  createdAt?: any;
}

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [stats, setStats] = useState({
    tourBookings: 0,
    rentalBookings: 0,
    pendingApproval: 0,
  });

  useEffect(() => {
    if (user?.uid) {
      fetchHostBookings();
    }
  }, [user?.uid]);

  const fetchHostBookings = async () => {
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

      const propertyIds = propertiesSnapshot.docs.map((doc) => doc.id);

      if (propertyIds.length === 0) {
        setBookings([]);
        setStats({ tourBookings: 0, rentalBookings: 0, pendingApproval: 0 });
        setLoading(false);
        return;
      }

      // Then, get all bookings for these properties
      const bookingsRef = collection(db, "bookings");
      const bookingsQuery = query(
        bookingsRef,
        where("propertyId", "in", propertyIds),
        orderBy("createdAt", "desc"),
      );

      const bookingsSnapshot = await getDocs(bookingsQuery);

      const fetchedBookings: Booking[] = [];
      let tourCount = 0;
      let rentalCount = 0;
      let pendingCount = 0;

      for (const doc of bookingsSnapshot.docs) {
        const data = doc.data();

        // Determine booking type (you can add a field in your bookings collection)
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
            new Date(data.createdAt?.toDate()).toLocaleDateString(),
          time: data.bookingTime || "12:00 PM",
          status: data.bookingStatus || "Pending",
          customerName:
            `${data.firstName || ""} ${data.lastName || ""}`.trim() ||
            "Unknown",
          customerEmail: data.email || "",
          customerPhone: data.phone || "",
          durationInMonths: data.durationInMonths,
          total: data.total,
          bookingPin: data.bookingPin,
          startDate: data.startDate,
          createdAt: data.createdAt,
        };

        fetchedBookings.push(booking);

        // Update counts
        if (bookingType === "Tour Booking") tourCount++;
        if (bookingType === "Rental Booking") rentalCount++;
        if (booking.status === "Pending") pendingCount++;
      }

      setBookings(fetchedBookings);
      setStats({
        tourBookings: tourCount,
        rentalBookings: rentalCount,
        pendingApproval: pendingCount,
      });
    } catch (error) {
      console.error("Error fetching host bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (
    bookingId: string,
    newStatus: "Confirmed" | "Cancelled",
  ) => {
    if (!bookingId) return;

    setUpdatingStatus(bookingId);
    try {
      const db = getFirestore();
      const bookingRef = doc(db, "bookings", bookingId);

      await updateDoc(bookingRef, {
        bookingStatus: newStatus,
        updatedAt: new Date(),
      });

      // Update local state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: newStatus }
            : booking,
        ),
      );

      // Update stats
      setStats((prev) => {
        const updatedStats = { ...prev };
        const booking = bookings.find((b) => b.id === bookingId);

        if (booking?.status === "Pending" && newStatus === "Confirmed") {
          updatedStats.pendingApproval = Math.max(0, prev.pendingApproval - 1);
        }

        return updatedStats;
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Failed to update booking status. Please try again.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const bookingStats = [
    {
      label: "Tour Bookings",
      count: stats.tourBookings.toString(),
      color: "bg-[#00CFFF]",
    },
    {
      label: "Rental Bookings",
      count: stats.rentalBookings.toString(),
      color: "bg-[#FF4FA1]",
    },
    {
      label: "Pending Approval",
      count: stats.pendingApproval.toString(),
      color: "bg-yellow-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FiLoader className="animate-spin text-4xl text-[#FF4FA1] mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading your bookings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Bookings Management
          </h2>
        </div>

        <BookingStats stats={bookingStats} />

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiEye className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Bookings Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't received any bookings for your properties yet.
            </p>
          </div>
        ) : (
          <BookingList
            bookings={bookings}
            onUpdateStatus={updateBookingStatus}
            updatingStatus={updatingStatus}
          />
        )}
      </div>
    </div>
  );
};

export default Bookings;
