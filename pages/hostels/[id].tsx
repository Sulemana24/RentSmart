import { useRouter } from "next/router";
import axios from "axios";
import { useState, useEffect } from "react";
import HostelDetail from "@/components/hostels/HostelDetail";
import { HOSTELLISTINGSAMPLE } from "@/constants/hostelListings";

export default function HostelDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [hostel, setHostel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchHostel = () => {
      const foundHostel = HOSTELLISTINGSAMPLE.find((h) => h.id === Number(id));
      setHostel(foundHostel || null);
      setLoading(false);
    };

    fetchHostel();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hostel-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading hostel details...
          </p>
        </div>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🏨</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Hostel Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The hostel you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/hostels")}
            className="bg-hostel-primary text-white px-6 py-3 rounded-lg hover:bg-hostel-primary-dark transition"
          >
            Browse All Hostels
          </button>
        </div>
      </div>
    );
  }

  return <HostelDetail hostel={hostel} />;
}
