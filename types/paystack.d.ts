interface PaystackTransactionConfig {
  key: string;
  email: string;
  amount: number;
  currency?: string;
  reference?: string;
  metadata?: {
    custom_fields?: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
  };
  onSuccess: (response: any) => void;
  onCancel: () => void;
  callback?: (response: any) => void;
}

interface PaystackPop {
  newTransaction: (config: PaystackTransactionConfig) => void;
}

interface Window {
  PaystackPop: {
    newTransaction: (config: PaystackTransactionConfig) => void;
  };
}

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export {};
