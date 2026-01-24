"use client";

const PaymentMethods = () => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Add Payment Method
      </h3>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Card Number"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="MM/YY"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
          />
          <input
            type="text"
            placeholder="CVV"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
          />
        </div>
        <button className="w-full px-4 py-3 bg-[#00CFFF] text-white rounded-lg hover:bg-[#00CFFF]/90">
          Add Payment Method
        </button>
      </div>
    </div>
  );
};

export default PaymentMethods;
