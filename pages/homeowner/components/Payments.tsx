"use client";
import PaymentMethods from "./common/PaymentMethods";
import PaymentHistory from "./common/PaymentHistory";
import RevenueSummary from "./common/RevenueSummary";

const Payments = () => {
  const payments = [
    {
      id: 1,
      tenant: "John Mensah",
      property: "Luxury Apartment",
      amount: "₵2,500",
      date: "2024-03-01",
      status: "Paid",
    },
    {
      id: 2,
      tenant: "Ama Serwaa",
      property: "Commercial Space",
      amount: "₵5,000",
      date: "2024-03-05",
      status: "Paid",
    },
    {
      id: 3,
      tenant: "Kwame Asante",
      property: "Studio Apartments",
      amount: "₵1,200",
      date: "2024-03-10",
      status: "Pending",
    },
  ];

  const revenueStats = [
    { label: "Total Revenue", value: "₵25,200" },
    { label: "This Month", value: "₵8,500" },
    { label: "Pending", value: "₵1,200" },
    { label: "Collected", value: "₵24,000" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Payment Management
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <PaymentMethods />
          <PaymentHistory payments={payments} />
        </div>

        <RevenueSummary stats={revenueStats} />
      </div>
    </div>
  );
};

export default Payments;
