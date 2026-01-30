import React from "react";

interface Contact {
  name: string;
  unread: number;
}

const Messages: React.FC = () => {
  const contacts: Contact[] = [
    { name: "John Doe (Homeowner)", unread: 2 },
    { name: "Sarah Smith (Agent)", unread: 0 },
    { name: "Support Team", unread: 1 },
    { name: "System Notifications", unread: 0 },
    { name: "Kwame Asante (Renter)", unread: 3 },
  ];

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
            {contacts.map((contact, index) => (
              <button
                key={index}
                className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative"
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {contact.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Last message 2 hours ago
                </div>
                {contact.unread > 0 && (
                  <div className="absolute right-4 top-4 bg-[#FF4FA1] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {contact.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="lg:col-span-2 flex flex-col border border-gray-200 dark:border-gray-700 rounded-xl">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="font-semibold text-gray-900 dark:text-white">
              John Doe (Homeowner)
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Property: Luxury Villa East Legon
            </div>
          </div>

          <div className="flex-grow p-4 space-y-4 overflow-y-auto max-h-[400px]">
            <div className="flex justify-start">
              <div className="max-w-[70%] bg-gray-100 dark:bg-gray-700 rounded-xl p-3">
                <div className="text-gray-900 dark:text-white">
                  Hi Admin, I'm having issues with my property listing
                </div>
                <div className="text-xs text-gray-500 mt-1">10:30 AM</div>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="max-w-[70%] bg-[#00CFFF] text-white rounded-xl p-3">
                <div>
                  Hi John, what seems to be the problem? I can help you with
                  that.
                </div>
                <div className="text-xs text-white/80 mt-1">10:35 AM</div>
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
