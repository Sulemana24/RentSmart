"use client";

import React, { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { FiHome, FiInfo, FiTag, FiLayers, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const AddRoom: React.FC = () => {
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("Single Room");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [floor, setFloor] = useState("");
  const [capacity, setCapacity] = useState("1");
  const [gender, setGender] = useState("Mixed");
  const [status, setStatus] = useState("Available");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const allFeatures = [
    "AC", "Attached Bath", "Study Table", "Wardrobe",
    "WiFi", "TV", "Fridge", "Balcony", "Kitchenette", "Cleaning Service"
  ];

  const toggleFeature = (feature: string) => {
    setFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await addDoc(collection(db, "rooms"), {
        roomNumber,
        roomType,
        monthlyRent: Number(monthlyRent),
        floor,
        capacity: Number(capacity),
        currentOccupancy: 0,
        gender,
        status,
        description,
        features,
        searchKeywords: [roomNumber, roomType, floor].map(s => s.toLowerCase()),
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      // Reset form
      setRoomNumber("");
      setMonthlyRent("");
      setFloor("");
      setDescription("");
      setFeatures([]);
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Error adding room:", error);
      alert("Database Error: Failed to add room.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Room Registration</h2>
          <p className="text-sm text-gray-500">Register new inventory to the management system</p>
        </div>
        {success && (
          <div className="flex items-center gap-2 text-green-600 font-medium animate-bounce">
            <FiCheckCircle /> Room Registered Successfully
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* SECTION 1: BASIC INFO */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#00CFFF] font-semibold text-sm uppercase tracking-wider">
            <FiInfo size={16} /> Basic Specifications
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Room Number</label>
              <input required type="text" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#00CFFF] outline-none"
                placeholder="e.g., 101" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Room Type</label>
              <select value={roomType} onChange={(e) => setRoomType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 outline-none">
                <option>Single Room</option>
                <option>Double Room</option>
                <option>Triple Room</option>
                <option>Quad Room</option>
                <option>Suite</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Monthly Rent (₵)</label>
              <input required type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#00CFFF] outline-none"
                placeholder="0.00" />
            </div>
          </div>
        </div>

        {/* SECTION 2: PLACEMENT & CAPACITY */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#00CFFF] font-semibold text-sm uppercase tracking-wider">
            <FiLayers size={16} /> Logic & Placement
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Floor/Block</label>
              <input type="text" value={floor} onChange={(e) => setFloor(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 outline-none"
                placeholder="Floor 1" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Capacity</label>
              <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 outline-none">
                <option>Mixed</option>
                <option>Male Only</option>
                <option>Female Only</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Initial Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 outline-none font-bold text-[#00CFFF]">
                <option>Available</option>
                <option>Maintenance</option>
                <option>Reserved</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 3: AMENITIES */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#00CFFF] font-semibold text-sm uppercase tracking-wider">
            <FiTag size={16} /> Amenities & Features
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {allFeatures.map((feature) => (
              <label key={feature} className={`flex items-center justify-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-all ${features.includes(feature) ? 'bg-[#00CFFF]/10 border-[#00CFFF] text-[#00CFFF]' : 'border-gray-200 dark:border-gray-700 text-gray-500'}`}>
                <input type="checkbox" className="hidden" checked={features.includes(feature)} onChange={() => toggleFeature(feature)} />
                <span className="text-xs font-bold uppercase">{feature}</span>
              </label>
            ))}
          </div>
        </div>

        {/* SECTION 4: DESCRIPTION */}
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Detailed Description</label>
          <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-[#00CFFF] outline-none"
            placeholder="Enter any specific notes about the room condition or rules..."
          />
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
          <button type="button" className="px-8 py-3 font-bold text-gray-500 hover:text-gray-700 transition-colors">
            Discard
          </button>
          <button type="submit" disabled={loading}
            className="px-10 py-3 bg-[#00CFFF] text-white rounded-lg font-bold shadow-lg shadow-[#00CFFF]/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100">
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing...
              </span>
            ) : "Confirm & Add Room"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRoom;