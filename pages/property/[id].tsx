import { useRouter } from "next/router";
import axios from "axios";
import { useState, useEffect } from "react";
import PropertyDetail from "@/components/property/PropertyDetail";
import { PROPERTYLISTINGSAMPLE } from "@/constants";

export default function PropertyDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProperty = () => {
      const foundProperty = PROPERTYLISTINGSAMPLE.find(
        (p) => p.id === Number(id)
      );
      setProperty(foundProperty || null);
      setLoading(false);
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
