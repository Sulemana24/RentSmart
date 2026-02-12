"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  collection, addDoc, deleteDoc, doc, updateDoc, 
  query, orderBy, serverTimestamp, onSnapshot, limit 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  FiDollarSign, FiSearch, FiFileText, FiFilter, 
  FiCreditCard, FiUser, FiActivity, FiTrash2, FiCheckCircle, 
  FiAlertCircle, FiChevronDown, FiTrendingUp 
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

  // Searchable Dropdown States
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [studentSearchText, setStudentSearchText] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Form States
  const [amountInput, setAmountInput] = useState("");
  const [methodInput, setMethodInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock Resident Data (In a real app, fetch this from a 'residents' collection)
  const residents = [
    { name: "John Mensah", room: "101" },
    { name: "Ama Serwaa", room: "104" },
    { name: "Kwame Asante", room: "103" },
    { name: "Kofi Ansah", room: "201" },
    { name: "Ebenezer Tetteh", room: "302" },
    { name: "Sarah Owusu", room: "105" },
  ];

  const filteredResidents = residents.filter(r => 
    r.name.toLowerCase().includes(studentSearchText.toLowerCase()) ||
    r.room.includes(studentSearchText)
  );

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
    }, () => {
      toast.error("Failed to sync with database");
      setLoading(false);
    });

    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      unsubscribe();
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
    if (!selectedStudent || !amountInput || !methodInput) {
      toast.error("Complete all fields first");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Finalizing transaction...");

    try {
      const [name, room] = selectedStudent.split(" - ");
      await addDoc(collection(db, "payments"), {
        student: name,
        room: room,
        amount: Number(amountInput),
        method: methodInput,
        status: "Paid",
        date: serverTimestamp(),
      });

      toast.success(`₵${amountInput} received from ${name}`, { id: loadingToast });
      setSelectedStudent(null);
      setStudentSearchText("");
      setAmountInput("");
      setMethodInput("");
    } catch (err) {
      toast.error("Transaction failed", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateReceipt = (payment: PaymentRecord) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Compiling receipt data...',
        success: `Receipt for ${payment.student} ready for print!`,
        error: 'Error generating PDF',
      }
    );
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Paid" ? "Overdue" : "Paid";
    try {
      await updateDoc(doc(db, "payments", id), { status: nextStatus });
      toast.success(`Status: ${nextStatus}`);
    } catch {
      toast.error("Update failed");
    }
  };

  const deletePayment = async (id: string) => {
    if (!confirm("Delete this permanent record?")) return;
    try {
      await deleteDoc(doc(db, "payments", id));
      toast.success("Record purged");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 bg-gray-50/50 dark:bg-transparent min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* 1. Header & Pro Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-blue-500 p-6 rounded-[2rem] text-white shadow-2xl">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Gross Revenue</p>
            <h2 className="text-4xl font-black mt-2 tracking-tighter">₵{revenueStats.total.toLocaleString()}</h2>
            <div className="flex items-center gap-2 mt-4 bg-white/20 w-fit px-3 py-1 rounded-full">
              <FiTrendingUp size={12}/>
              <span className="text-[10px] font-black">+12.5% this month</span>
            </div>
          </div>
          <FiActivity className="absolute -right-4 -bottom-4 opacity-10 rotate-12" size={140} />
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <FiAlertCircle className="text-orange-500"/> Unpaid Arrears
          </p>
          <div>
            <h2 className="text-4xl font-black mt-2 text-orange-500 tracking-tighter">₵{revenueStats.overdue.toLocaleString()}</h2>
            <p className="text-[9px] text-gray-400 mt-2 font-bold uppercase tracking-tight">Requires follow-up calls</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Payment Health</p>
          <div className="space-y-3">
             <div className="flex justify-between items-center">
               <span className="text-xs font-bold text-gray-500">Settled Logs</span>
               <span className="text-xs font-black text-green-500">{payments.length - revenueStats.pendingCount}</span>
             </div>
             <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-green-500 h-full transition-all duration-1000" 
                  style={{ width: `${( (payments.length - revenueStats.pendingCount) / (payments.length || 1) ) * 100}%` }}
                ></div>
             </div>
             <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{payments.length} TOTAL TRANSACTIONS</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. Collect Payment Form with Searchable Dropdown */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-700 shadow-xl relative">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl text-indigo-600">
              <FiCreditCard size={24} />
            </div>
            <h3 className="font-black text-lg tracking-tight">Payment Portal</h3>
          </div>

          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            {/* SEARCHABLE DROPDOWN */}
            <div className="relative" ref={dropdownRef}>
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Resident Selection</label>
              <div 
                className="mt-2 relative cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className={`w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 transition-all flex justify-between items-center ${isDropdownOpen ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-transparent'}`}>
                  <span className={`text-sm font-bold ${selectedStudent ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                    {selectedStudent || "Search Resident..."}
                  </span>
                  <FiChevronDown className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {isDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="p-3 border-b border-gray-50 dark:border-gray-700">
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        autoFocus
                        type="text"
                        placeholder="Type name or room..."
                        value={studentSearchText}
                        onChange={(e) => setStudentSearchText(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-xs font-bold focus:ring-0"
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredResidents.length > 0 ? filteredResidents.map((res, i) => (
                      <div 
                        key={i}
                        onClick={() => {
                          setSelectedStudent(`${res.name} - ${res.room}`);
                          setIsDropdownOpen(false);
                          setStudentSearchText("");
                        }}
                        className="px-5 py-3 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 cursor-pointer flex flex-col"
                      >
                        <span className="text-xs font-black text-gray-800 dark:text-gray-200">{res.name}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Room {res.room}</span>
                      </div>
                    )) : (
                      <div className="p-4 text-center text-[10px] font-black text-gray-400 uppercase">No resident found</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Transaction Amount</label>
              <div className="relative mt-2 group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-indigo-500 group-focus-within:text-indigo-600">₵</span>
                <input 
                  type="number" 
                  placeholder="0.00"
                  value={amountInput}
                  onChange={e => setAmountInput(e.target.value)}
                  className="w-full pl-10 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-indigo-500 font-black text-lg transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Payment Channel</label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {['Momo', 'Cash', 'Card', 'Bank'].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethodInput(m)}
                    className={`py-4 rounded-2xl text-[10px] font-black border-2 transition-all ${
                      methodInput === m 
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]" 
                      : "bg-transparent border-gray-100 dark:border-gray-700 text-gray-400 hover:border-indigo-300"
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
              className="w-full py-5 bg-gray-900 dark:bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 active:scale-95 transition-all mt-4 disabled:opacity-50 tracking-widest text-xs"
            >
              {isSubmitting ? "SYNCING..." : "COMMIT TRANSACTION"}
            </button>
          </form>
        </div>

        {/* 3. Transaction History */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden flex flex-col">
          <div className="p-8 border-b border-gray-50 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="font-black text-lg tracking-tight">Financial Ledger</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Live Audit Trail</p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Filter logs..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-2xl text-xs outline-none w-full font-bold border-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <select 
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="bg-gray-900 text-white rounded-2xl px-4 py-3 text-[10px] font-black outline-none uppercase border-none ring-offset-2 focus:ring-2 ring-gray-900 transition-all"
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[600px] divide-y divide-gray-50 dark:divide-gray-700">
            {loading ? (
              <div className="p-32 text-center flex flex-col items-center gap-4">
                 <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                 <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Connecting to Ledger...</p>
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="p-32 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">No financial data detected</div>
            ) : filteredPayments.map(payment => (
              <div key={payment.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-all group">
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center font-black text-sm shadow-inner ${
                    payment.status === "Paid" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}>
                    {payment.student.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-sm text-gray-900 dark:text-white leading-none">{payment.student}</p>
                    <p className="text-[10px] font-black uppercase text-gray-400 mt-2 flex items-center gap-2">
                      <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">RM {payment.room}</span> 
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span> 
                      {payment.method} 
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span> 
                      {payment.date}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="font-black text-lg text-gray-900 dark:text-white tracking-tighter leading-none">₵{payment.amount}</p>
                    <button 
                      onClick={() => toggleStatus(payment.id, payment.status)}
                      className={`text-[9px] font-black uppercase mt-2 px-3 py-1 rounded-full cursor-pointer transition-all border-2 ${
                        payment.status === "Paid" 
                        ? "bg-green-500/10 border-green-500/20 text-green-600" 
                        : "bg-red-500/10 border-red-500/20 text-red-600 animate-pulse"
                      }`}
                    >
                      {payment.status}
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    <button 
                      onClick={() => generateReceipt(payment)}
                      className="p-3 bg-gray-50 dark:bg-gray-700 text-gray-400 hover:text-indigo-600 rounded-xl transition-colors shadow-sm"
                    >
                      <FiFileText size={18}/>
                    </button>
                    <button 
                      onClick={() => deletePayment(payment.id)} 
                      className="p-3 bg-gray-50 dark:bg-gray-700 text-gray-400 hover:text-red-500 rounded-xl transition-colors shadow-sm"
                    >
                      <FiTrash2 size={18}/>
                    </button>
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