"use client";

import React, { useState } from "react";

const Payments: React.FC = () => {
  const [payments, setPayments] = useState([
    {
      id: 1,
      student: "John Mensah",
      room: "Room 101",
      amount: "₵300",
      date: "2024-03-01",
      status: "Paid",
    },
    {
      id: 2,
      student: "Ama Serwaa",
      room: "Room 104",
      amount: "₵700",
      date: "2024-03-05",
      status: "Paid",
    },
    {
      id: 3,
      student: "Kwame Asante",
      room: "Room 103",
      amount: "₵300",
      date: "2024-03-10",
      status: "Overdue",
    },
    {
      id: 4,
      student: "Kofi Ansah",
      room: "Room 201",
      amount: "₵500",
      date: "2024-03-12",
      status: "Paid",
    },
  ]);

  const [student, setStudent] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [success, setSuccess] = useState("");

  const handlePayment = () => {
    if (!student || !amount || !method) return;

    const newPayment = {
      id: payments.length + 1,
      student: student.split("(")[0].trim(),
      room: student.match(/\((.*?)\)/)?.[1] || "",
      amount: `₵${amount}`,
      date: new Date().toISOString().split("T")[0],
      status: "Paid",
    };

    setPayments([newPayment, ...payments]);
    setSuccess("Payment recorded successfully!");

    // Reset form
    setStudent("");
    setAmount("");
    setMethod("");

    setTimeout(() => setSuccess(""), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Payment Management
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Collect Payment */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Collect Payment
            </h3>

            {success && (
              <div className="p-3 rounded-lg bg-green-100 text-green-700 mb-4 text-sm">
                {success}
              </div>
            )}

            <div className="space-y-4">
              <select
                value={student}
                onChange={(e) => setStudent(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select Student</option>
                <option>Kwame Asante (Room 101)</option>
                <option>Ama Serwaa (Room 104)</option>
                <option>John Mensah (Room 105)</option>
                <option>Kofi Ansah (Room 201)</option>
              </select>

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />

              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Payment Method</option>
                <option>Cash</option>
                <option>Mobile Money</option>
                <option>Bank Transfer</option>
                <option>Card Payment</option>
              </select>

              <button
                onClick={handlePayment}
                disabled={!student || !amount || !method}
                className={`w-full px-4 py-3 rounded-lg text-white 
                  ${
                    !student || !amount || !method
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#00CFFF] hover:bg-[#00CFFF]/90"
                  }
                `}
              >
                Record Payment
              </button>
            </div>
          </div>

          {/* Payment History */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Payments
            </h3>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {payment.student}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {payment.room}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {payment.amount}
                    </div>
                    <div
                      className={`text-xs ${
                        payment.status === "Paid"
                          ? "text-green-500"
                          : payment.status === "Overdue"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {payment.date} • {payment.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              View All Payments
            </button>
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Revenue Summary
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Revenue", value: "₵45,200" },
              { label: "This Month", value: "₵12,500" },
              { label: "Overdue", value: "₵1,800" },
              { label: "Collected", value: "₵43,400" },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
              >
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {item.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
