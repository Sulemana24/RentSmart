"use client";
import { useState } from "react";

interface HostelBookingFormProps {
  onSubmit: (data: any) => void;
  hostel: any;
  selectedRoom?: any;
}

export default function HostelBookingForm({ 
  onSubmit, 
  hostel, 
  selectedRoom 
}: HostelBookingFormProps) {
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "1",
    roomType: selectedRoom ? selectedRoom.id.toString() : "",
    specialRequests: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    paymentMethod: "card"
  });

  const today = new Date().toISOString().split("T")[0];
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate dates
    if (!formData.checkIn || !formData.checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }
    
    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      alert("Check-out date must be after check-in date");
      return;
    }
    
    if (!formData.roomType) {
      alert("Please select a room type");
      return;
    }
    
    onSubmit(formData);
  };

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getRoomPrice = () => {
    if (formData.roomType) {
      const room = hostel.roomTypes.find((r: any) => r.id === parseInt(formData.roomType));
      return room ? room.pricePerNight : 0;
    }
    return selectedRoom ? selectedRoom.pricePerNight : 0;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const roomPrice = getRoomPrice();
    const basePrice = roomPrice * nights;
    const serviceFee = basePrice * 0.15; // 15% service fee
    const cleaningFee = 10; // Fixed cleaning fee
    const taxes = basePrice * 0.08; // 8% tax
    
    return {
      nights,
      roomPrice,
      basePrice: basePrice.toFixed(2),
      serviceFee: serviceFee.toFixed(2),
      cleaningFee: cleaningFee.toFixed(2),
      taxes: taxes.toFixed(2),
      total: (basePrice + serviceFee + cleaningFee + taxes).toFixed(2)
    };
  };

  const totals = calculateTotal();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Check-in Date *
          </label>
          <input
            type="date"
            name="checkIn"
            value={formData.checkIn}
            onChange={handleChange}
            min={today}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-hostel-primary focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Check-out Date *
          </label>
          <input
            type="date"
            name="checkOut"
            value={formData.checkOut}
            onChange={handleChange}
            min={formData.checkIn || today}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-hostel-primary focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Guests & Room Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Number of Guests *
          </label>
          <select
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-hostel-primary focus:border-transparent transition"
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num.toString()}>
                {num} {num === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Room Type *
          </label>
          <select
            name="roomType"
            value={formData.roomType}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-hostel-primary focus:border-transparent transition"
          >
            <option value="">Select a room type</option>
            {hostel.roomTypes?.map((room: any) => (
              <option key={room.id} value={room.id.toString()}>
                {room.name} - ${room.pricePerNight}/night
                {room.availability < 3 && ` (${room.availability} left)`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Guest Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="John"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-hostel-primary focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder="Doe"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-hostel-primary focus:border-transparent transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="john@example.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-hostel-primary focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="+1234567890"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-hostel-primary focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Special Requests */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Special Requests (Optional)
        </label>
        <textarea
          name="specialRequests"
          value={formData.specialRequests}
          onChange={handleChange}
          rows={3}
          placeholder="Any special requirements, dietary restrictions, or requests..."
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-hostel-primary focus:border-transparent transition"
        />
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Payment Method *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {["card", "paypal", "cash"].map((method) => (
            <label
              key={method}
              className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition ${
                formData.paymentMethod === method
                  ? "border-hostel-primary bg-hostel-primary/10"
                  : "border-gray-300 dark:border-gray-600 hover:border-hostel-primary/50"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method}
                checked={formData.paymentMethod === method}
                onChange={handleChange}
                className="sr-only"
              />
              <div className="text-center">
                <div className="text-lg mb-1">
                  {method === "card" && "💳"}
                  {method === "paypal" && "🅿️"}
                  {method === "cash" && "💰"}
                </div>
                <div className="font-medium capitalize">
                  {method === "card" && "Credit Card"}
                  {method === "paypal" && "PayPal"}
                  {method === "cash" && "Cash at Hostel"}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Price Breakdown */}
      {totals.nights > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
            Booking Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>${getRoomPrice()} × {totals.nights} nights</span>
              <span>${totals.basePrice}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Service fee (15%)</span>
              <span>${totals.serviceFee}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Cleaning fee</span>
              <span>${totals.cleaningFee}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Taxes (8%)</span>
              <span>${totals.taxes}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-4 border-t border-gray-300 dark:border-gray-600">
              <span>Total Amount</span>
              <span className="text-hostel-primary">${totals.total}</span>
            </div>
          </div>
        </div>
      )}

      {/* Terms and Conditions */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="text-yellow-500 mt-0.5">ℹ️</div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <p className="font-medium mb-1">Important Information:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Free cancellation up to 48 hours before check-in</li>
              <li>Check-in: {hostel.policies?.checkIn || "2:00 PM"}</li>
              <li>Check-out: {hostel.policies?.checkOut || "11:00 AM"}</li>
              <li>Age restriction: {hostel.policies?.ageRestriction || "18+"}</li>
              {selectedRoom && (
                <li>
                  <span className="font-medium">{selectedRoom.availability}</span>{" "}
                  {selectedRoom.availability === 1 ? "bed" : "beds"} available in this room
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-hostel-primary hover:bg-hostel-primary-dark text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
      >
        Confirm Booking - ${totals.total || "0.00"}
      </button>

      {/* Security Note */}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        🔒 Secure booking • Your payment is protected
      </p>
    </form>
  );
}