"use client";

import React, { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

const AddRoom: React.FC = () => {
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("Single Room");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [floor, setFloor] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const allFeatures = [
    "AC",
    "Attached Bath",
    "Study Table",
    "Wardrobe",
    "WiFi",
    "TV",
    "Fridge",
    "Balcony",
  ];

  const toggleFeature = (feature: string) => {
    setFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "rooms"), {
        roomNumber,
        roomType,
        monthlyRent: Number(monthlyRent),
        floor,
        description,
        features,
        createdAt: new Date(),
      });

      alert("Room added successfully!");

      // Reset form
      setRoomNumber("");
      setRoomType("Single Room");
      setMonthlyRent("");
      setFloor("");
      setDescription("");
      setFeatures([]);
    } catch (error) {
      console.error("Error adding room:", error);
      alert("Failed to add room.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Add New Room
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* GRID INPUTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Room Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room Number
            </label>
            <input
              type="text"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700"
              placeholder="e.g., 101, 201A"
            />
          </div>

          {/* Room Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room Type
            </label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700"
            >
              <option>Single Room</option>
              <option>Double Room</option>
              <option>Triple Room</option>
              <option>Quad Room</option>
              <option>Suite</option>
            </select>
          </div>

          {/* Rent */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monthly Rent
            </label>
            <input
              type="number"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700"
              placeholder="₵0.00"
            />
          </div>

          {/* Floor or Block */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Floor/Block
            </label>
            <input
              type="text"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700"
              placeholder="e.g., Ground Floor, Block A"
            />
          </div>
        </div>

        {/* FEATURES */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Room Features
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {allFeatures.map((feature) => (
              <label key={feature} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={features.includes(feature)}
                  onChange={() => toggleFeature(feature)}
                />
                <span>{feature}</span>
              </label>
            ))}
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Room Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700"
            placeholder="Describe room features, conditions, and rules..."
          />
        </div>

        {/* BUTTONS */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            className="px-6 py-3 border rounded-lg text-gray-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-3 bg-[#00CFFF] text-white rounded-lg hover:bg-[#00CFFF]/90"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Room"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRoom;