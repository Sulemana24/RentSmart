"use client";

interface Payment {
  id: number;
  tenant: string;
  property: string;
  amount: string;
  date: string;
  status: string;
}

interface PaymentHistoryProps {
  payments: Payment[];
}

const PaymentHistory = ({ payments }: PaymentHistoryProps) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Payment History
      </h3>
      <div className="space-y-3">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {payment.tenant}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {payment.property}
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900 dark:text-white">
                {payment.amount}
              </div>
              <div className="text-xs text-gray-500">{payment.date}</div>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        View All Payments
      </button>
    </div>
  );
};

export default PaymentHistory;
