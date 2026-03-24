import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import PropertyDetail from "@/components/property/PropertyDetail";
import { db } from "@/lib/firebase";
import { doc, getDoc, Timestamp } from "firebase/firestore";

export default function PropertyDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      try {
        const docRef = doc(db, "properties", id as string);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setProperty(null);
          return;
        }

        const data = docSnap.data();
        const normalizedProperty = {
          id: docSnap.id,
          name: data?.name || "",
          address: {
            ...data?.address,
            city: data?.address?.city || "",
            state: data?.address?.state || "",
          },
          price: Number(data?.price) || 0,
          rating: Number(data?.rating) || 0,
          discount: Number(data?.discount) || 0,
          featured: !!data?.featured,
          description: data?.description || "",
          amenities: data?.amenities || [],
          beds: data?.beds || 0,
          agentFeePercentage: data?.agentFeePercentage || 0,
          walkingFee: data?.walkingFee || 0,
          acceptableDurations: data?.acceptableDurations || [],
          image: data?.image || "",
          images: data?.images || [],
          createdAt:
            data?.createdAt instanceof Timestamp
              ? data.createdAt.toDate()
              : data?.createdAt || new Date(),
          category: data?.category || [],
        };

        setProperty(normalizedProperty);
      } catch (error) {
        console.error("Error fetching property:", error);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <p className="text-center py-10 text-gray-500 dark:text-gray-400">
        Loading property details...
      </p>
    );
  }

  if (!property) {
    return (
      <p className="text-center py-10 text-red-500 font-semibold">
        Property not found 😕
      </p>
    );
  }

  return <PropertyDetail property={property} />;
}
