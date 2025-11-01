interface BookingSectionProps {
  price: number;
  onBookNow: () => void;
  onContact: () => void;
}

export default function BookingSection({
  price,
  onBookNow,
}: BookingSectionProps) {
  return (
    <div className="sticky top-4 border rounded-2xl shadow-lg p-6 space-y-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-bold">Ghc{price}</h3>
        <span className="text-gray-600">/ year</span>
      </div>
      <div>
        <button
          onClick={onBookNow}
          className="w-full bg-[#FF4FA1]  text-white py-2 rounded-lg hover:bg-[#00CFFF] transition"
        >
          Book Now
        </button>
        <button className="w-full mt-3 border border-gray-300 text-white py-2 rounded-lg hover:bg-gray-100 hover:text-black transition">
          Contact Host
        </button>
        <p>
          <span className="text-sm text-gray-500">
            *Please Contact Host to Book a Tour
          </span>
        </p>
      </div>
    </div>
  );
}
