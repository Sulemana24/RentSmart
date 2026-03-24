"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  collection, addDoc, deleteDoc, doc, updateDoc, 
  query, orderBy, serverTimestamp, onSnapshot, limit 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  FiDollarSign, FiSearch, FiFileText, FiFilter, 
  FiCreditCard, FiUser, FiActivity, FiTrash2, FiCheckCircle, FiAlertCircle 
} from "react-icons/fi";
import { format } from "date-fns";
import toast, { Toaster } from "react-hot-toast";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Real-time Data Fetching ---
  useEffect(() => {
    const q = query(collection(db, "payments"), orderBy("date", "desc"), limit(50));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() ? format(doc.data().date.toDate(), "MMM dd, yyyy") : "Pending..."
      })) as PaymentRecord[];
      
      setPayments(data);
      setLoading(false);
    }, (error) => {
      toast.error("Failed to sync with database");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- Calculations ---
  const revenueStats = useMemo(() => {
    const total = payments.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const overdue = payments.filter(p => p.status === "Overdue").reduce((acc, curr) => acc + Number(curr.amount), 0);
    const pendingCount = payments.filter(p => p.status === "Pending").length;
    return { total, overdue, pendingCount };
  }, [payments]);

  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const matchesSearch = p.student.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.room.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "All" || p.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [payments, searchTerm, filterStatus]);

  // --- Handlers ---
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentInput || !amountInput || !methodInput) {
      toast.error("Please fill all fields");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Recording payment...");

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

      toast.success(`GHS ${amountInput} recorded for ${studentName}`, { id: loadingToast });
      setStudentInput("");
      setAmountInput("");
      setMethodInput("");
    } catch (err) {
      toast.error("Transaction failed", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Paid" ? "Overdue" : "Paid";
    try {
      await updateDoc(doc(db, "payments", id), { status: nextStatus });
      toast.success(`Status updated to ${nextStatus}`);
    } catch {
      toast.error("Update failed");
    }
  };

  const deletePayment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      await deleteDoc(doc(db, "payments", id));
      toast.success("Record deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* 1. Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#00CFFF] to-[#007FFF] p-6 rounded-3xl text-white shadow-xl">
          <p className="text-xs font-black uppercase tracking-widest opacity-80">Total Revenue</p>
          <h2 className="text-3xl font-black mt-1">₵{revenueStats.total.toLocaleString()}</h2>
          <FiActivity className="mt-4 opacity-30" size={40} />
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <FiAlertCircle className="text-red-500"/> Outstanding Debt
          </p>
          <h2 className="text-3xl font-black mt-1 text-red-500">₵{revenueStats.overdue.toLocaleString()}</h2>
          <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tighter">Requires Immediate Attention</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Transactions</p>
          <h2 className="text-3xl font-black mt-1">{payments.length}</h2>
          <div className="flex gap-2 mt-3">
             <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px] font-black">{revenueStats.pendingCount} PENDING</span>
             <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded text-[10px] font-black">{payments.length - revenueStats.pendingCount} SETTLED</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. Collect Payment Form */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-2xl">
          <div className="flex items-center gap-2 mb-6 text-[#00CFFF]">
            <FiCreditCard size={20} />
            <h3 className="font-black uppercase tracking-tight">Record New Payment</h3>
          </div>

          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Student & Room</label>
              <select 
                value={studentInput} 
                onChange={e => setStudentInput(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-[#00CFFF] transition-all font-bold text-sm"
              >
                <option value="">Select Resident</option>
                <option>John Mensah (Room 101)</option>
                <option>Ama Serwaa (Room 104)</option>
                <option>Kwame Asante (Room 103)</option>
                <option>Kofi Ansah (Room 201)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Payment Amount (GHS)</label>
              <div className="relative mt-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">₵</span>
                <input 
                  type="number" 
                  placeholder="0.00"
                  value={amountInput}
                  onChange={e => setAmountInput(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-[#00CFFF] font-black"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Payment Channel</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {['Momo', 'Cash', 'Card', 'Bank'].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethodInput(m)}
                    className={`py-3 rounded-xl text-xs font-black border transition-all ${
                      methodInput === m 
                      ? "bg-[#00CFFF] border-[#00CFFF] text-white shadow-lg" 
                      : "bg-transparent border-gray-100 text-gray-400 hover:border-[#00CFFF]"
                    }`}
                  >
                    {m.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gray-900 dark:bg-[#00CFFF] text-white rounded-2xl font-black shadow-xl hover:scale-[1.01] active:scale-95 transition-all mt-4 disabled:opacity-50"
            >
              {isSubmitting ? "PROCESSING..." : "CONFIRM TRANSACTION"}
            </button>
          </form>
        </div>

        {/* 3. Transaction History */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="font-black uppercase tracking-widest text-xs flex items-center gap-2">
              <FiActivity className="text-[#00CFFF]" /> Financial Ledger
            </h3>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Student or Room..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl text-xs outline-none w-full font-bold"
                />
              </div>
              <select 
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="bg-gray-900 text-white rounded-xl px-3 py-2 text-[10px] font-black outline-none uppercase"
              >
                <option value="All">All Logs</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[500px] divide-y divide-gray-50 dark:divide-gray-700">
            {loading ? (
              <div className="p-20 text-center flex flex-col items-center gap-3">
                 <div className="w-8 h-8 border-4 border-[#00CFFF] border-t-transparent rounded-full animate-spin"></div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Syncing Ledger...</p>
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="p-20 text-center text-gray-400 text-xs font-bold uppercase">No records found</div>
            ) : filteredPayments.map(payment => (
              <div key={payment.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs ${
                    payment.status === "Paid" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}>
                    {payment.student.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-sm text-gray-900 dark:text-white leading-none">{payment.student}</p>
                    <p className="text-[10px] font-black uppercase text-gray-400 mt-1">{payment.room} <span className="mx-1">•</span> {payment.method} <span className="mx-1">•</span> {payment.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-black text-gray-900 dark:text-white leading-none">₵{payment.amount}</p>
                    <button 
                      onClick={() => toggleStatus(payment.id, payment.status)}
                      className={`text-[9px] font-black uppercase mt-1 px-2 py-0.5 rounded cursor-pointer transition-all hover:scale-105 ${
                        payment.status === "Paid" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      }`}
                    >
                      {payment.status}
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button title="View Receipt" className="p-2 text-gray-400 hover:text-[#00CFFF]"><FiFileText size={16}/></button>
                    <button onClick={() => deletePayment(payment.id)} title="Delete" className="p-2 text-gray-400 hover:text-red-500"><FiTrash2 size={16}/></button>
                  </div>
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