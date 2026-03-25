"use client";

import { FaHome, FaMoneyBill } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  FiHome,
  FiInfo,
  FiTag,
  FiLayers,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiInfo as FiInfoIcon,
} from "react-icons/fi";

// --- Toast Component ---
const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => (
  <div
    className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border animate-in slide-in-from-right duration-300 ${
      type === "success"
        ? "bg-green-50 border-green-200 text-green-800"
        : "bg-red-50 border-red-200 text-red-800"
    }`}
  >
    {type === "success" ? (
      <FiCheckCircle className="text-xl" />
    ) : (
      <FiAlertCircle className="text-xl" />
    )}
    <p className="font-bold text-sm">{message}</p>
    <button
      onClick={onClose}
      className="ml-4 text-gray-400 hover:text-gray-600"
    >
      <FiX />
    </button>
  </div>
);

const AddRoom: React.FC = () => {
  // Form States
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("Single Room");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [floor, setFloor] = useState("");
  const [capacity, setCapacity] = useState("1");
  const [gender, setGender] = useState("Mixed");
  const [status, setStatus] = useState("Available");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState<string[]>([]);

  // UI States
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  // Expanded Amenities
  const allFeatures = [
    "High-Speed WiFi",
    "Air Conditioning",
    "Private Balcony",
    "Attached Bath",
    "Study Desk",
    "Wardrobe",
    "Mini Fridge",
    "Smart TV",
    "Kitchenette",
    "Microwave",
    "Daily Cleaning",
    "Laundry Access",
    "Water Heater",
    "Emergency Alarm",
    "Keyless Entry",
    "CCTV Coverage",
    "Smoke Detector",
    "Window Curtains",
    "Bed Linen",
    "Power Backup",
  ];

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 5000);
  };

  const toggleFeature = (feature: string) => {
    setFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Feature Validation
    if (Number(monthlyRent) <= 0)
      return showToast("Rent must be greater than 0", "error");
    if (Number(capacity) <= 0)
      return showToast("Capacity must be at least 1", "error");

    setLoading(true);
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
        searchKeywords: [roomNumber, roomType, floor].map((s) =>
          s.toLowerCase(),
        ),
        createdAt: serverTimestamp(),
      });

      showToast(`Room ${roomNumber} has been successfully added!`, "success");

      // Reset form
      setRoomNumber("");
      setMonthlyRent("");
      setFloor("");
      setDescription("");
      setFeatures([]);
      setCapacity("1");
    } catch (error) {
      console.error(error);
      showToast("Database Error: Failed to save room data.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Notifications */}
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#00CFFF]/10 text-[#00CFFF] rounded-xl flex items-center justify-center text-2xl">
            <FiHome />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Room Registration
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Add new accommodation units to the inventory
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-10">
        {/* SECTION 1: CORE DETAILS */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-[#00CFFF] font-bold text-xs uppercase tracking-[0.2em]">
            <FiInfoIcon /> Core Specifications
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group">
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">
                Room Identity
              </label>
              <input
                required
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-900 focus:border-[#00CFFF] focus:bg-white dark:focus:bg-gray-800 outline-none transition-all"
                placeholder="e.g. 104-B"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">
                Room Category
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-900 focus:border-[#00CFFF] outline-none transition-all cursor-pointer"
              >
                <option>Single Room</option>
                <option>Double Room</option>
                <option>Triple Room</option>
                <option>Suite (Premium)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">
                Monthly Rate (GH₵)
              </label>
              <input
                required
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-900 focus:border-[#00CFFF] outline-none transition-all"
                placeholder="0.00"
              />
            </div>
          </div>
        </section>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Room Features
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              "AC",
              "Attached Bath",
              "Study Table",
              "Chair",
              "Wardrobe",
              "WiFi",
              "TV",
              "Fridge",
              "Balcony",
              "24/7 Security",
              "Parking",
              "Laundry Service",
              "24/7 Water Supply",
              "Power Backup",
              "Transport Access",
              "Trash bins",
              "Free Cleaning",
            ].map((feature) => (
              <label
                key={feature}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input type="checkbox" className="rounded cursor-pointer" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {feature}
                </span>
                {features.includes(feature) && (
                  <div className="absolute -top-2 -right-2 bg-[#00CFFF] text-white rounded-full p-1 text-[8px]">
                    <FiCheckCircle />
                  </div>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* SECTION 4: REMARKS */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-3 ml-1">
            Public Description & Special Notes
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-5 py-4 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl focus:border-[#00CFFF] outline-none transition-all resize-none"
            placeholder="Describe the room view, proximity to stairs, or any specific rules for occupants..."
          />
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-6 pt-10 border-t border-gray-100 dark:border-gray-700">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="text-sm font-black text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 uppercase tracking-widest transition-colors"
          >
            Discard Entry
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-12 py-5 bg-[#00CFFF] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#00CFFF]/30 hover:shadow-[#00CFFF]/40 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div>
                Syncing...
              </span>
            ) : (
              "Save & Publish Room"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRoom;
