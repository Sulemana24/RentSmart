"use client";

const Messages: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Messages
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contacts */}
        <div className="lg:col-span-1 border border-gray-200 dark:border-gray-700 rounded-xl">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Contacts
            </h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {[
              "Kwame Asante (Room 101)",
              "Ama Serwaa (Room 104)",
              "John Mensah (Room 105)",
              "Kofi Ansah (Room 201)",
              "Maintenance Team",
              "Security Staff",
              "University Housing Office",
            ].map((contact, index) => (
              <button
                key={index}
                className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {contact}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {index % 2 === 0
                    ? "Last message today"
                    : "Last message yesterday"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="lg:col-span-2 flex flex-col border border-gray-200 dark:border-gray-700 rounded-xl">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="font-semibold text-gray-900 dark:text-white">
              Kwame Asante (Room 101)
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Student • Checked in: Jan 15, 2024 • Monthly Rent: ₵300
            </div>
          </div>

          <div className="flex-grow p-4 space-y-4 overflow-y-auto max-h-[400px]">
            <div className="flex justify-start">
              <div className="max-w-[70%] bg-gray-100 dark:bg-gray-700 rounded-xl p-3">
                <div className="text-gray-900 dark:text-white">
                  Good morning, there's an issue with the AC in my room. It's
                  not cooling properly.
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Yesterday, 9:30 AM
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="max-w-[70%] bg-[#00CFFF] text-white rounded-xl p-3">
                <div>
                  Thanks for reporting. I've notified the maintenance team. They
                  will check it this afternoon between 2-4 PM.
                </div>
                <div className="text-xs text-white/80 mt-1">
                  Yesterday, 9:35 AM
                </div>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-[70%] bg-gray-100 dark:bg-gray-700 rounded-xl p-3">
                <div className="text-gray-900 dark:text-white">
                  Also, could you let me know when the WiFi will be back? It's
                  been down since morning.
                </div>
                <div className="text-xs text-gray-500 mt-1">Today, 8:15 AM</div>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="max-w-[70%] bg-[#00CFFF] text-white rounded-xl p-3">
                <div>
                  The ISP is working on it. They estimate service restoration by
                  12 PM. I'll update you once it's back.
                </div>
                <div className="text-xs text-white/80 mt-1">Today, 8:20 AM</div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-grow px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button className="px-6 py-3 bg-[#00CFFF] text-white rounded-lg hover:bg-[#00CFFF]/90">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
