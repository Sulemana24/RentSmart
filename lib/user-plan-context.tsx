"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./auth-context";
import { PLANS } from "@/utils/plans";

export interface UserPlan {
  planId: string;
  planName: string;
  maxProperties: number;
  expiresAt?: Date;
  isActive: boolean;
}

interface UserPlanContextType {
  userPlan: UserPlan | null;
  loading: boolean;
  refreshUserPlan: () => Promise<void>;
  upgradePlan: (planId: string, paymentReference: string) => Promise<void>;
}

const UserPlanContext = createContext<UserPlanContextType | undefined>(
  undefined,
);

export const UserPlanProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserPlan = async () => {
    if (!user?.uid) {
      setUserPlan(null);
      setLoading(false);
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        const planId = data.planId || "basic";
        const plan = PLANS.find((p) => p.id === planId);

        setUserPlan({
          planId,
          planName: plan?.name || "Basic",
          maxProperties: plan?.maxProperties || 5,
          expiresAt: data.planExpiresAt?.toDate(),
          isActive: true,
        });
      } else {
        // Create default user document
        await setDoc(userDocRef, {
          planId: "basic",
          createdAt: new Date(),
          email: user.email,
          displayName: user.displayName || "",
        });
        setUserPlan({
          planId: "basic",
          planName: "Basic",
          maxProperties: 5,
          isActive: true,
        });
      }
    } catch (error) {
      console.error("Error fetching user plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserPlan = async () => {
    await fetchUserPlan();
  };

  const upgradePlan = async (planId: string, paymentReference: string) => {
    if (!user?.uid) throw new Error("User not authenticated");

    const plan = PLANS.find((p) => p.id === planId);
    if (!plan) throw new Error("Plan not found");

    const userDocRef = doc(db, "users", user.uid);
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1); // 1 month subscription

    await updateDoc(userDocRef, {
      planId,
      planUpgradedAt: new Date(),
      planPaymentReference: paymentReference,
      planExpiresAt: expiryDate,
    });

    await refreshUserPlan();
  };

  useEffect(() => {
    fetchUserPlan();
  }, [user]);

  return (
    <UserPlanContext.Provider
      value={{ userPlan, loading, refreshUserPlan, upgradePlan }}
    >
      {children}
    </UserPlanContext.Provider>
  );
};

export const useUserPlan = () => {
  const context = useContext(UserPlanContext);
  if (context === undefined) {
    throw new Error("useUserPlan must be used within a UserPlanProvider");
  }
  return context;
};
