export default function BookingSection({ price }: { price: number }) {
  return (
    <div className="sticky top-4 border rounded-2xl shadow-lg p-6 space-y-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-bold">Ghc{price}</h3>
        <span className="text-gray-600">/ month</span>
      </div>

      <button className="w-full bg-[#FF4FA1]  text-white py-2 rounded-lg hover:bg-[#00CFFF] transition">
        Book Now
      </button>
    </div>
  );
}
