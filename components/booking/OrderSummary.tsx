const OrderSummary: React.FC<{ bookingDetails: any }> = ({
  bookingDetails,
}) => (
  <div className="">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">
      Review Order Details
    </h2>

    {/* Property Info */}
    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl mb-6">
      <img
        src={bookingDetails.propertyImage}
        alt="Property"
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">
          {bookingDetails.propertyName}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Starting {bookingDetails.startDate} • {bookingDetails.duration} Year
          {bookingDetails.duration > 1 ? "s" : ""}
        </p>
      </div>
    </div>

    {/* Price Breakdown */}
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Price Breakdown
      </h3>

      {/* Property Price with Duration Calculation */}
      <div className="flex justify-between items-center py-2">
        <div>
          <span className="text-gray-600">Property Price</span>
          <p className="text-xs text-gray-500">
            Ghc {bookingDetails.price} × {bookingDetails.duration} Year
            {bookingDetails.duration > 1 ? "s" : ""}
          </p>
        </div>
        <span className="font-semibold text-gray-600">
          Ghc {bookingDetails.totalPropertyPrice}
        </span>
      </div>

      {/* Agent Fee */}
      <div className="flex justify-between items-center py-2 border-t border-gray-100">
        <div>
          <span className="text-gray-600">Agent Fee</span>
          <p className="text-xs text-gray-500">
            ({bookingDetails.agentFeePercentage}% service charge)
          </p>
        </div>
        <span className="font-semibold text-gray-600">
          Ghc {bookingDetails.agentFee}
        </span>
      </div>

      {/* Walking Fee */}
      <div className="flex justify-between items-center py-2 border-t border-gray-100">
        <div>
          <span className="text-gray-600">Walking Fee</span>
          <p className="text-xs text-gray-500">(Property viewing assistance)</p>
        </div>
        <span className="font-semibold text-gray-600">
          Ghc {bookingDetails.walkingFee}
        </span>
      </div>

      {/* Subtotal */}
      <div className="flex justify-between items-center py-2 border-t border-gray-100">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-semibold text-gray-600">
          Ghc {bookingDetails.subtotal}
        </span>
      </div>

      {/* Grand Total */}
      <div className="flex justify-between items-center py-3 border-t-2 border-gray-200 mt-2">
        <span className="text-lg font-bold text-gray-900">Grand Total</span>
        <span className="text-lg font-bold text-[#FF4FA1]">
          Ghc {bookingDetails.total}
        </span>
      </div>

      {/* Duration Summary */}
      <div className="bg-blue-50 p-3 rounded-lg mt-4">
        <p className="text-sm text-blue-800 text-center">
          <strong>
            {bookingDetails.duration} Year
            {bookingDetails.duration > 1 ? "s" : ""} Rental
          </strong>{" "}
          • Ghc {bookingDetails.price}/year × {bookingDetails.duration} year
          {bookingDetails.duration > 1 ? "s" : ""}
        </p>
      </div>
    </div>
  </div>
);

export default OrderSummary;
