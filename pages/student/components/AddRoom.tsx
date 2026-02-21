"use client";
import { useState } from "react";

const AddRoom: React.FC = () => {
  const [addMode, setAddMode] = useState<"single" | "bulk">("single");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [startRoom, setStartRoom] = useState("");
  const [endRoom, setEndRoom] = useState("");
  const [previewRooms, setPreviewRooms] = useState<string[]>([]);
  const [skipExisting, setSkipExisting] = useState(true);

  const [rentPrice, setRentPrice] = useState<string>("");
  const [priceCurrency, setPriceCurrency] = useState<string>("₵");
  const [pricePer, setPricePer] = useState<string>("month");
  const [discountPercentage, setDiscountPercentage] = useState<string>("");
  const [securityDeposit, setSecurityDeposit] = useState<string>("");
  const [priceIncludesUtilities, setPriceIncludesUtilities] =
    useState<boolean>(false);

  const [roomPictures, setRoomPictures] = useState<File[]>([]);
  const [picturePreviews, setPicturePreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const blocks = [
    "Block A",
    "Block B",
    "Block C",
    "Block D",
    "Block E",
    "Block F",
    "Block G",
    "Block H",
    "Block I",
    "Block J",
    "Block K",
    "Block L",
    "Block M",
    "Block N",
    "Block O",
    "Block P",
    "Block Q",
    "Block R",
    "Block S",
    "Block T",
  ];
  const floors = [
    "Ground Floor",
    "1st Floor",
    "2nd Floor",
    "3rd Floor",
    "4th Floor",
    "5th Floor",
    "6th Floor",
    "7th Floor",
    "8th Floor",
  ];
  const currencies = ["₵", "$", "€", "£", "₦"];
  const pricePeriods = ["academic year", "semester", "month", "annum"];

  const generatePreview = () => {
    if (!selectedBlock || !startRoom || !endRoom) return;

    const blockPrefix = selectedBlock.replace("Block ", "");
    const startNum = parseInt(startRoom.replace(blockPrefix, ""));
    const endNum = parseInt(endRoom.replace(blockPrefix, ""));

    if (isNaN(startNum) || isNaN(endNum) || startNum > endNum) return;

    const rooms = [];
    for (let i = startNum; i <= endNum; i++) {
      rooms.push(`${blockPrefix}${i}`);
    }
    setPreviewRooms(rooms);
  };

  const calculateDiscountedPrice = (): number | null => {
    const basePrice = parseFloat(rentPrice);
    const discount = parseFloat(discountPercentage);

    if (isNaN(basePrice) || isNaN(discount) || discount <= 0) return null;

    return basePrice - basePrice * (discount / 100);
  };

  const formatPrice = (price: number): string => {
    return `${priceCurrency}${price.toFixed(2)}/${pricePer}`;
  };

  const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024;
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert("Some files were skipped. Please upload only images under 5MB.");
    }

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

    setRoomPictures((prev) => [...prev, ...validFiles]);
    setPicturePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removePicture = (index: number) => {
    setRoomPictures((prev) => prev.filter((_, i) => i !== index));

    URL.revokeObjectURL(picturePreviews[index]);
    setPicturePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const discountedPrice = calculateDiscountedPrice();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Add New Room
      </h2>

      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="addMode"
              checked={addMode === "single"}
              onChange={() => setAddMode("single")}
              className="w-4 h-4 text-[#00CFFF]"
            />
            <span className="text-gray-700 dark:text-gray-300">
              Add Single Room
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="addMode"
              checked={addMode === "bulk"}
              onChange={() => setAddMode("bulk")}
              className="w-4 h-4 text-[#00CFFF]"
            />
            <span className="text-gray-700 dark:text-gray-300">
              Bulk Add Rooms (Range)
            </span>
          </label>
        </div>
      </div>

      <form className="space-y-6">
        {addMode === "bulk" ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Block
                </label>
                <select
                  value={selectedBlock}
                  onChange={(e) => {
                    setSelectedBlock(e.target.value);
                    setPreviewRooms([]);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
                >
                  <option value="">-- Select Block --</option>
                  {blocks.map((block) => (
                    <option key={block} value={block}>
                      {block}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Floor
                </label>
                <select
                  value={selectedFloor}
                  onChange={(e) => setSelectedFloor(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
                >
                  <option value="">-- Select Floor --</option>
                  {floors.map((floor) => (
                    <option key={floor} value={floor}>
                      {floor}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Room Type
                </label>
                <select
                  value={selectedRoomType}
                  onChange={(e) => setSelectedRoomType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
                >
                  <option value="">-- Select Room Type --</option>
                  <option value="Single">Single Room</option>
                  <option value="Double">Double Room</option>
                  <option value="Triple">Triple Room</option>
                  <option value="Quad">Quad Room</option>
                  <option value="Suite">Suite</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lowest Room Number
                </label>
                <input
                  type="text"
                  value={startRoom}
                  onChange={(e) => {
                    setStartRoom(e.target.value);
                    generatePreview();
                  }}
                  placeholder={
                    selectedBlock
                      ? `${selectedBlock.replace("Block ", "")}1`
                      : "e.g., B1"
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Highest Room Number
                </label>
                <input
                  type="text"
                  value={endRoom}
                  onChange={(e) => {
                    setEndRoom(e.target.value);
                    generatePreview();
                  }}
                  placeholder={
                    selectedBlock
                      ? `${selectedBlock.replace("Block ", "")}20`
                      : "e.g., B20"
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
                />
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                Pricing Information (Applies to all rooms in this range)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Base Rent Price
                  </label>
                  <div className="flex">
                    <select
                      value={priceCurrency}
                      onChange={(e) => setPriceCurrency(e.target.value)}
                      className="w-20 px-3 py-3 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
                    >
                      {currencies.map((currency) => (
                        <option key={currency} value={currency}>
                          {currency}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={rentPrice}
                      onChange={(e) => setRentPrice(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-r-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price Per
                  </label>
                  <select
                    value={pricePer}
                    onChange={(e) => setPricePer(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
                  >
                    {pricePeriods.map((period) => (
                      <option key={period} value={period}>
                        Per {period}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Security Deposit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Security Deposit
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-3 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                      {priceCurrency}
                    </span>
                    <input
                      type="number"
                      value={securityDeposit}
                      onChange={(e) => setSecurityDeposit(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-r-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Discount Percentage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(e.target.value)}
                    placeholder="e.g., 10"
                    min="0"
                    max="100"
                    step="1"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
                  />
                </div>

                {/* Utilities Included */}
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={priceIncludesUtilities}
                      onChange={(e) =>
                        setPriceIncludesUtilities(e.target.checked)
                      }
                      className="rounded cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Utilities included in price
                    </span>
                  </label>
                </div>
              </div>

              {/* Price Summary */}
              {(rentPrice || discountedPrice) && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {rentPrice && (
                      <>Base Price: {formatPrice(parseFloat(rentPrice))}</>
                    )}
                    {discountedPrice && (
                      <>
                        <br />
                        Discounted Price: {priceCurrency}
                        {discountedPrice.toFixed(2)}/{pricePer} (
                        {discountPercentage}% off)
                      </>
                    )}
                    {securityDeposit && (
                      <>
                        <br />
                        Security Deposit: {priceCurrency}
                        {parseFloat(securityDeposit).toFixed(2)}
                      </>
                    )}
                    {priceIncludesUtilities && (
                      <>
                        <br />✓ Utilities included in rent
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Room Pictures Upload Section */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Room Pictures (These will be added to all rooms in this range)
              </label>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-[#00CFFF] transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePictureUpload}
                  className="hidden"
                  id="room-pictures"
                />
                <label
                  htmlFor="room-pictures"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    PNG, JPG, GIF up to 5MB each
                  </span>
                </label>
              </div>

              {/* Picture Previews */}
              {picturePreviews.length > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Selected Pictures ({picturePreviews.length})
                    </span>
                    {!isUploading && picturePreviews.length > 0 && (
                      <button
                        type="button"
                        onClick={simulateUpload}
                        className="text-xs bg-[#00CFFF] text-white px-3 py-1 rounded hover:bg-[#00CFFF]/90"
                      >
                        Upload All
                      </button>
                    )}
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#00CFFF] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {uploadProgress}% uploaded
                      </p>
                    </div>
                  )}

                  {/* Image Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {picturePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Room preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                        />
                        <button
                          type="button"
                          onClick={() => removePicture(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}

                    {/* Add More Button */}
                    <label className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:border-[#00CFFF] transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePictureUpload}
                        className="hidden"
                      />
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span className="text-xs text-gray-500">Add more</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={skipExisting}
                  onChange={(e) => setSkipExisting(e.target.checked)}
                  className="rounded cursor-pointer"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Skip existing room numbers
                </span>
              </label>
            </div>

            {previewRooms.length > 0 && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    📋 Preview: {previewRooms.length} room
                    {previewRooms.length !== 1 ? "s" : ""} to be added
                  </span>
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                    {selectedBlock} • Floor {selectedFloor || "TBD"}
                  </span>
                </div>

                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {previewRooms.slice(0, 10).map((room, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300 shadow-sm"
                      >
                        {room}
                      </span>
                    ))}
                    {previewRooms.length > 10 && (
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-500 dark:text-gray-400">
                        +{previewRooms.length - 10} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      First Room
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {previewRooms[0]}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Last Room
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {previewRooms[previewRooms.length - 1]}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Total Rooms
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {previewRooms.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Range
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {previewRooms[0]} →{" "}
                      {previewRooms[previewRooms.length - 1]}
                    </p>
                  </div>
                </div>

                {/* Additional info badges */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {rentPrice && (
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                      💰 {formatPrice(parseFloat(rentPrice))}
                    </span>
                  )}
                  {picturePreviews.length > 0 && (
                    <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                      🖼️ {picturePreviews.length} photo
                      {picturePreviews.length !== 1 ? "s" : ""}
                    </span>
                  )}
                  {selectedRoomType && (
                    <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full">
                      🏠 {selectedRoomType}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                ⓘ Rooms to be added: {previewRooms.length || 0}
                {selectedFloor && <> • Floor: {selectedFloor}</>}
                {selectedRoomType && <> • Type: {selectedRoomType}</>}
                {rentPrice && (
                  <> • Price: {formatPrice(parseFloat(rentPrice))}</>
                )}
                {discountedPrice && (
                  <>
                    {" "}
                    • After discount: {priceCurrency}
                    {discountedPrice.toFixed(2)}/{pricePer}
                  </>
                )}
                {securityDeposit && (
                  <>
                    {" "}
                    • Deposit: {priceCurrency}
                    {parseFloat(securityDeposit).toFixed(2)}
                  </>
                )}
                {picturePreviews.length > 0 && (
                  <> • {picturePreviews.length} picture(s) per room</>
                )}
              </p>
            </div>
          </>
        ) : (
          // Single room form with rent price
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Room Number
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
                  placeholder="e.g., 101, 201A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Floor
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent">
                  <option value="">-- Select Floor --</option>
                  {floors.map((floor) => (
                    <option key={floor} value={floor}>
                      {floor}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Room Type
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent">
                  <option>Single Room</option>
                  <option>Double Room</option>
                  <option>Triple Room</option>
                  <option>Quad Room</option>
                  <option>Suite</option>
                </select>
              </div>

              {/* Rent Price for Single Room */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Monthly Rent
                </label>
                <div className="flex">
                  <select
                    value={priceCurrency}
                    onChange={(e) => setPriceCurrency(e.target.value)}
                    className="w-20 px-3 py-3 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
                  >
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={rentPrice}
                    onChange={(e) => setRentPrice(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-r-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Additional Single Room Pricing Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Security Deposit
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-3 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                    {priceCurrency}
                  </span>
                  <input
                    type="number"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-r-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Discount (%)
                </label>
                <input
                  type="number"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  placeholder="e.g., 10"
                  min="0"
                  max="100"
                  step="1"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={priceIncludesUtilities}
                    onChange={(e) =>
                      setPriceIncludesUtilities(e.target.checked)
                    }
                    className="rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Utilities included
                  </span>
                </label>
              </div>
            </div>

            {/* Single Room Picture Upload */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Room Pictures
              </label>

              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-[#00CFFF] transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePictureUpload}
                  className="hidden"
                  id="single-room-pictures"
                />
                <label
                  htmlFor="single-room-pictures"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Click to upload room pictures
                  </span>
                </label>
              </div>

              {/* Picture Previews for Single Room */}
              {picturePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {picturePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Room preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      />
                      <button
                        type="button"
                        onClick={() => removePicture(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Room Features */}
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
              </label>
            ))}
          </div>
        </div>

        {/* Room Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Room Description
          </label>
          <textarea
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
            placeholder="Describe room features, conditions, and rules..."
          />
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            className="w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-[#00CFFF] text-white rounded-lg hover:bg-[#00CFFF]/90 transition-colors"
          >
            {addMode === "bulk"
              ? `Add ${previewRooms.length || 0} Room${previewRooms.length !== 1 ? "s" : ""} ${rentPrice ? `at ${formatPrice(parseFloat(rentPrice))}` : ""}`
              : "Add Room"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRoom;
