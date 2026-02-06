"use client";

import React, { useState, useRef } from "react";
import { db, storage } from "@/lib/firebase"; // Ensure storage is exported from your firebase config
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { 
  FiHome, FiInfo, FiTag, FiLayers, FiCheckCircle, 
  FiAlertCircle, FiX, FiInfo as FiInfoIcon, FiCamera, FiUploadCloud 
} from "react-icons/fi";

// --- Toast Component ---
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => (
  <div className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border animate-in slide-in-from-right duration-300 ${
    type === 'success' 
      ? 'bg-green-50 border-green-200 text-green-800' 
      : 'bg-red-50 border-red-200 text-red-800'
  }`}>
    {type === 'success' ? <FiCheckCircle className="text-xl" /> : <FiAlertCircle className="text-xl" />}
    <p className="font-bold text-sm">{message}</p>
    <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-600"><FiX /></button>
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
  
  // Image States
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // UI States
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const allFeatures = [
    "High-Speed WiFi", "Air Conditioning", "Private Balcony", "Attached Bath",
    "Study Desk", "Wardrobe", "Mini Fridge", "Smart TV", 
    "Kitchenette", "Microwave", "Daily Cleaning", "Laundry Access",
    "Water Heater", "Emergency Alarm", "Keyless Entry", "CCTV Coverage",
    "Smoke Detector", "Window Curtains", "Bed Linen", "Power Backup"
  ];

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) return showToast("Image too large (Max 5MB)", "error");
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const toggleFeature = (feature: string) => {
    setFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Number(monthlyRent) <= 0) return showToast("Rent must be greater than 0", "error");
    if (!imageFile) return showToast("Please upload a room image", "error");

    setLoading(true);
    try {
      // 1. Upload Image to Storage
      const storageRef = ref(storage, `rooms/${Date.now()}_${imageFile.name}`);
      const uploadResult = await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(uploadResult.ref);

      // 2. Save Data to Firestore
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
        imageUrl,
        searchKeywords: [roomNumber, roomType, floor].map(s => s.toLowerCase()),
        createdAt: serverTimestamp(),
      });

      showToast(`Room ${roomNumber} published successfully!`, "success");
      
      // Reset form
      setRoomNumber("");
      setMonthlyRent("");
      setFloor("");
      setDescription("");
      setFeatures([]);
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error(error);
      showToast("Critical Error: Failed to save room data.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#00CFFF]/10 text-[#00CFFF] rounded-xl flex items-center justify-center text-2xl">
            <FiHome />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Room Registration</h2>
            <p className="text-sm text-gray-500 font-medium">Add photos and details for the new listing</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-10">
        
        {/* MEDIA UPLOAD SECTION */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-[#00CFFF] font-bold text-xs uppercase tracking-[0.2em]">
            <FiCamera /> Media Gallery
          </div>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`group relative h-64 w-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
              imagePreview ? 'border-[#00CFFF]' : 'border-gray-200 dark:border-gray-700 hover:border-[#00CFFF] hover:bg-[#00CFFF]/5'
            }`}
          >
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-white font-bold text-sm bg-[#00CFFF] px-6 py-2 rounded-lg">Change Photo</span>
                </div>
              </>
            ) : (
              <div className="text-center">
                <FiUploadCloud className="mx-auto text-4xl text-gray-300 group-hover:text-[#00CFFF] mb-3" />
                <p className="text-gray-500 font-bold text-sm">Upload Room Photo</p>
                <p className="text-gray-400 text-[10px] uppercase mt-1 tracking-widest">PNG, JPG or WEBP (Max 5MB)</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
          </div>
        </section>

        {/* CORE DETAILS */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-[#00CFFF] font-bold text-xs uppercase tracking-[0.2em]">
            <FiInfoIcon /> Core Specifications
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Room Identity</label>
              <input required type="text" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-900 focus:border-[#00CFFF] outline-none transition-all"
                placeholder="e.g. 104-B" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Room Category</label>
              <select value={roomType} onChange={(e) => setRoomType(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-900 focus:border-[#00CFFF] outline-none transition-all cursor-pointer">
                <option>Single Room</option>
                <option>Double Room</option>
                <option>Triple Room</option>
                <option>Suite (Premium)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Monthly Rate (GH₵)</label>
              <input required type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-900 focus:border-[#00CFFF] outline-none transition-all"
                placeholder="0.00" />
            </div>
          </div>
        </section>

        {/* PREVIOUS MANAGEMENT SETTINGS & AMENITIES GRID SECTIONS GO HERE... */}
        {/* (Keep Sections 2, 3, and 4 from your previous version) */}

        {/* FOOTER ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-6 pt-10 border-t border-gray-100 dark:border-gray-700">
          <button type="submit" disabled={loading}
            className="w-full sm:w-auto px-12 py-5 bg-[#00CFFF] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#00CFFF]/30 hover:shadow-[#00CFFF]/40 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:transform-none">
            {loading ? "Publishing..." : "Save & Publish Room"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRoom;