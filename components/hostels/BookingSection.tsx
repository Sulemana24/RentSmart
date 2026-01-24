interface HostelBookingSectionProps {
  hostel: any;
  onBookNow: () => void;
  onContact: () => void;
  selectedRoom?: any;
}

export default function HostelBookingSection({
  hostel,
  onBookNow,
  onContact,
  selectedRoom,
}: HostelBookingSectionProps) {
  const getStartingPrice = () => {
    if (!hostel.roomTypes || hostel.roomTypes.length === 0) return 0;
    return Math.min(...hostel.roomTypes.map((room: any) => room.pricePerNight));
  };

  const getSelectedRoomPrice = () => {
    if (selectedRoom) {
      return selectedRoom.pricePerNight;
    }
    return getStartingPrice();
  };

  return (
    <div className="sticky top-4 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-6 space-y-6 bg-white dark:bg-gray-800">
      {/* Price Display */}
      <div>
        {selectedRoom ? (
          <>
            <div className="mb-2">
              <span className="text-sm font-medium text-hostel-primary bg-hostel-primary/10 px-2 py-1 rounded">
                SELECTED
              </span>
            </div>
            <div className="flex items-baseline justify-between mb-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                ${selectedRoom.pricePerNight}
              </h3>
              <span className="text-gray-600 dark:text-gray-400">/ night</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedRoom.name}
            </p>
          </>
        ) : (
          <>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Starting from
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                ${getStartingPrice()}
              </h3>
              <span className="text-gray-600 dark:text-gray-400">/ night</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Select a room type below
            </p>
          </>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 py-4 border-y border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {hostel.rating}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Rating</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {hostel.roomTypes?.length || 0}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Room Types
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            24/7
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Reception
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onBookNow}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
            selectedRoom
              ? "bg-hostel-primary hover:bg-hostel-primary-dark text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          {selectedRoom
            ? `Book Now - $${selectedRoom.pricePerNight}/night`
            : "Select a Room First"}
        </button>

        <button
          onClick={onContact}
          className="w-full py-3 rounded-xl font-semibold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
        >
          Contact Hostel
        </button>
      </div>

      {/* Estimated Cost */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Estimated for 3 nights
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>${getSelectedRoomPrice()} × 3 nights</span>
            <span>${(getSelectedRoomPrice() * 3).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Service fee (15%)</span>
            <span>${(getSelectedRoomPrice() * 3 * 0.15).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-300 dark:border-gray-600">
            <span>Total</span>
            <span>${(getSelectedRoomPrice() * 3 * 1.15).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span className="text-green-500">✓</span>
          <span>Free cancellation 48h before</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-500">✓</span>
          <span>No prepayment needed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-500">✓</span>
          <span>Best price guarantee</span>
        </div>
        <div className="pt-3 text-xs italic">
          Contact for group discounts & long stays
        </div>
      </div>
    </div>
  );
}
