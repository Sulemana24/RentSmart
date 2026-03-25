"use client";
import { useState, useRef, useEffect } from "react";
import { FiX, FiCheck, FiZap, FiLoader, FiTrendingUp } from "react-icons/fi";
import { useAuth } from "@/lib/auth-context";
import { useUserPlan } from "@/lib/user-plan-context";
import { PLANS } from "@/utils/plans";
import { useToast } from "./ToastProvider";

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPropertyCount?: number;
  onUpgradeComplete?: () => void;
}

const UpgradePlanModal = ({
  isOpen,
  onClose,
  currentPropertyCount = 0,
  onUpgradeComplete,
}: UpgradePlanModalProps) => {
  const { user } = useAuth();
  const { refreshUserPlan, upgradePlan } = useUserPlan();
  const { showToast } = useToast();
  const [selectedPlanId, setSelectedPlanId] = useState<string>("agent-pro");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPaystackReady, setIsPaystackReady] = useState(false);
  const paystackLoadAttempted = useRef(false);

  const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen, showToast]);

  const handleUpgrade = () => {
    const selectedPlan = PLANS.find((p) => p.id === selectedPlanId);
    if (!selectedPlan) return;

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

    const amount = selectedPlan.price;
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
      const reference = `UPG-${user?.uid}-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;

      // Create payment data object
      const paymentData = {
        userId: user?.uid || "",
        email: user?.email || "",
        planId: selectedPlanId,
        planName: selectedPlan.name,
        amount: amount,
        duration: "monthly",
        currentPropertyCount: currentPropertyCount,
      };

      // Use the same pattern as booking form
      const handler = (window as any).PaystackPop.setup({
        key: paystackPublicKey,
        email: paymentData.email,
        amount: amountInPesewas,
        currency: "GHS",
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: "User ID",
              variable_name: "user_id",
              value: paymentData.userId,
            },
            {
              display_name: "Plan Type",
              variable_name: "plan_type",
              value: paymentData.planId,
            },
            {
              display_name: "Plan Name",
              variable_name: "plan_name",
              value: paymentData.planName,
            },
            {
              display_name: "Payment Type",
              variable_name: "payment_type",
              value: "plan_upgrade",
            },
          ],
        },
        callback: (response: any) => {
          console.log("Payment successful:", response);

          // Update user plan in database
          upgradePlan(selectedPlanId, response.reference)
            .then(async () => {
              showToast({
                title: "Success!",
                message: `Successfully upgraded to ${selectedPlan.name} plan!`,
                type: "success",
              });

              await refreshUserPlan();

              if (onUpgradeComplete) {
                onUpgradeComplete();
              }

              onClose();
            })
            .catch((error) => {
              console.error("Error upgrading plan:", error);
              showToast({
                title: "Error",
                message:
                  "Payment successful but failed to upgrade plan. Please contact support.",
                type: "error",
              });
            })
            .finally(() => {
              setIsProcessingPayment(false);
            });
        },
        onClose: () => {
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
        message: "Unable to initialize payment. Please try again.",
        type: "error",
      });
    }
  };

  if (!isOpen) return null;

  const selectedPlan = PLANS.find((p) => p.id === selectedPlanId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform animate-in slide-in-from-bottom-4 duration-300 shadow-2xl">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Upgrade Your Plan
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {currentPropertyCount >= 5
                ? "You've reached the maximum properties for your current plan. Upgrade to add more properties."
                : `You currently have ${currentPropertyCount}/5 properties. Upgrade to add more.`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {PLANS.filter((p) => p.id !== "basic").map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedPlanId === plan.id
                    ? "border-yellow-500 bg-yellow-500/5 shadow-lg"
                    : "border-gray-200 dark:border-gray-700 hover:border-yellow-500/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      ₵{plan.price}
                    </span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  {plan.priceYearly && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      or ₵{plan.priceYearly}/year (save ₵
                      {plan.priceYearly - plan.price * 12})
                    </p>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <FiZap className="w-4 h-4 text-yellow-500" />
                    <span>
                      {plan.maxProperties === -1
                        ? "Unlimited properties"
                        : `Up to ${plan.maxProperties} properties`}
                    </span>
                  </div>
                  {plan.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <FiCheck className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                <FiTrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Why upgrade?
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Premium plans get more visibility, priority support, and
                  advanced features to grow your business.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleUpgrade}
              disabled={!isPaystackReady || isProcessingPayment}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
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
                <>Upgrade Now</>
              ) : (
                "Loading Payment..."
              )}
            </button>
            <button
              onClick={onClose}
              className="flex-1 border-2 border-gray-300 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-medium hover:border-gray-400 transition-all"
            >
              Maybe Later
            </button>
          </div>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
            Secure payment powered by Paystack. Upgrade now to unlock more
            features and grow your business.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradePlanModal;
