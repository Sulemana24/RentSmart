export interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  currency?: string;
  reference?: string;
  metadata?: any;
  onSuccess: (response: any) => void;
  onClose: () => void;
}

export const loadPaystackScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.PaystackPop) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Paystack script"));
    document.body.appendChild(script);
  });
};

export const initializePaystackPayment = async (config: PaystackConfig) => {
  try {
    await loadPaystackScript();

    const paystack = window.PaystackPop;

    paystack.newTransaction({
      key: config.key,
      email: config.email,
      amount: config.amount,
      currency: config.currency || "GHS",
      reference: config.reference,
      metadata: config.metadata,
      onSuccess: config.onSuccess,
      onCancel: config.onClose,
    });
  } catch (error) {
    console.error("Error initializing Paystack:", error);
    throw error;
  }
};
