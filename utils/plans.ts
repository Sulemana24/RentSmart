export interface Plan {
  id: string;
  name: string;
  maxProperties: number;
  price: number;
  priceYearly?: number;
  features: string[];
  popular?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    maxProperties: 5,
    price: 0,
    features: [
      "Up to 5 properties",
      "Basic listing",
      "Email support",
      "Standard visibility",
    ],
  },
  {
    id: "agent-pro",
    name: "Agent Pro",
    maxProperties: 100,
    price: 50,
    priceYearly: 500,
    features: [
      "Unlimited properties (up to 100)",
      "Premium listing",
      "Priority support",
      "Featured listing available",
      "Analytics dashboard",
      "Advanced marketing tools",
    ],
    popular: true,
  },
  {
    id: "agency",
    name: "Agency",
    maxProperties: -1, // Unlimited
    price: 150,
    priceYearly: 1500,
    features: [
      "Unlimited properties",
      "Agency branding",
      "Dedicated account manager",
      "API access",
      "Advanced analytics",
      "Team management",
      "White-label solutions",
    ],
  },
];

export const getMaxProperties = (planId: string): number => {
  const plan = PLANS.find((p) => p.id === planId);
  return plan?.maxProperties || 5;
};

export const canAddProperty = (
  currentCount: number,
  planId: string,
): boolean => {
  const maxProperties = getMaxProperties(planId);
  return maxProperties === -1 ? true : currentCount < maxProperties;
};

export const getRemainingProperties = (
  currentCount: number,
  planId: string,
): number => {
  const maxProperties = getMaxProperties(planId);
  if (maxProperties === -1) return Infinity;
  return Math.max(0, maxProperties - currentCount);
};
