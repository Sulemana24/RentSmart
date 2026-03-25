"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  collection, addDoc, getDocs, query, orderBy, serverTimestamp, 
  onSnapshot, limit, where 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  FiDollarSign, FiSearch, FiFileText, FiFilter, 
  FiCreditCard, FiSmartphone, FiUser, FiActivity 
} from "react-icons/fi";
import { format } from "date-fns";

interface PaymentRecord {
  id: string;
  student: string;
  room: string;
  amount: number;
  date: any;
  status: "Paid" | "Overdue" | "Pending";
  method: string;
}

const Payments: React.FC = () => {
  // --- States ---
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Form States
  const [studentInput, setStudentInput] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [methodInput, setMethodInput] = useState("");
  const [success, setSuccess] = useState("");

  // --- Real-time Data Fetching ---
  useEffect(() => {
    const q = query(collection(db, "payments"), orderBy("date", "desc"), limit(50));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamp to readable string if it exists
        date: doc.data().date?.toDate() ? format(doc.data().date.toDate(), "yyyy-MM-dd") : "Pending..."
      })) as PaymentRecord[];
      
      setPayments(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- Calculations ---
  const revenueStats = useMemo(() => {
    const total = payments.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const overdue = payments.filter(p => p.status === "Overdue").reduce((acc, curr) => acc + Number(curr.amount), 0);
    return { total, overdue };
  }, [payments]);

  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const matchesSearch = p.student.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "All" || p.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [payments, searchTerm, filterStatus]);

  // --- Handlers ---
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentInput || !amountInput || !methodInput) return;

    try {
      const studentName = studentInput.split("(")[0].trim();
      const roomNumber = studentInput.match(/\((.*?)\)/)?.[1] || "N/A";

      await addDoc(collection(db, "payments"), {
        student: studentName,
        room: roomNumber,
        amount: Number(amountInput),
        method: methodInput,
        status: "Paid",
        date: serverTimestamp(),
      });

      setSuccess("Payment successful!");
      setStudentInput("");
      setAmountInput("");
      setMethodInput("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Failed to record payment.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      
      {/* 1. Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#00CFFF] to-[#007FFF] p-6 rounded-3xl text-white shadow-lg">
          <p className="text-xs font-black uppercase tracking-widest opacity-80">Total Revenue</p>
          <h2 className="text-3xl font-black mt-1">₵{revenueStats.total.toLocaleString()}</h2>
          <FiActivity className="mt-4 opacity-30" size={40} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Outstanding</p>
          <h2 className="text-3xl font-black mt-1 text-red-500">₵{revenueStats.overdue.toLocaleString()}</h2>
          <div className="h-1 w-full bg-gray-100 mt-4 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 w-[15%]" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Transactions</p>
          <h2 className="text-3xl font-black mt-1">{payments.length}</h2>
          <p className="text-xs text-green-500 font-bold mt-4">↑ 12% from last month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. Collect Payment Form */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-xl">
          <div className="flex items-center gap-2 mb-6 text-[#00CFFF]">
            <FiCreditCard size={20} />
            <h3 className="font-black uppercase tracking-tight">New Transaction</h3>
          </div>

          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-xl text-xs font-bold flex items-center gap-2 animate-bounce">
              <FiDollarSign /> {success}
            </div>
          )}

          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Student</label>
              <select 
                value={studentInput} 
                onChange={e => setStudentInput(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-[#00CFFF] transition-all"
              >
                <option value="">Select Student</option>
                <option>John Mensah (Room 101)</option>
                <option>Ama Serwaa (Room 104)</option>
                <option>Kwame Asante (Room 103)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Amount (GHS)</label>
              <input 
                type="number" 
                placeholder="0.00"
                value={amountInput}
                onChange={e => setAmountInput(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-[#00CFFF]"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Method</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {['Momo', 'Cash', 'Card', 'Bank'].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethodInput(m)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      methodInput === m 
                      ? "bg-[#00CFFF] border-[#00CFFF] text-white" 
                      : "bg-transparent border-gray-100 text-gray-400 hover:border-[#00CFFF]"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-gray-900 dark:bg-[#00CFFF] text-white rounded-2xl font-black shadow-lg hover:scale-[1.02] active:scale-95 transition-all mt-4"
            >
              Record Payment
            </button>
          </form>
        </div>

        {/* 3. Transaction History */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="font-black uppercase tracking-tight flex items-center gap-2">
              <FiActivity className="text-[#00CFFF]" /> History
            </h3>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search student..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl text-xs outline-none w-full"
                />
              </div>
              <select 
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="bg-gray-50 dark:bg-gray-900 rounded-xl px-3 py-2 text-xs font-bold outline-none"
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[500px] divide-y divide-gray-50 dark:divide-gray-700">
            {loading ? (
              <div className="p-20 text-center text-gray-400 animate-pulse font-bold">Loading Ledger...</div>
            ) : filteredPayments.map(payment => (
              <div key={payment.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                    <FiUser />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900 dark:text-white">{payment.student}</p>
                    <p className="text-[10px] font-black uppercase text-gray-400">{payment.room} • {payment.method}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-black text-gray-900 dark:text-white">₵{payment.amount}</p>
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${
                    payment.status === "Paid" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}>
                    {payment.status}
                  </span>
                </div>
                
                <div className="hidden group-hover:flex items-center ml-4">
                  <button title="Download Receipt" className="p-2 text-gray-400 hover:text-[#00CFFF]">
                    <FiFileText size={18}/>
                  </button>
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