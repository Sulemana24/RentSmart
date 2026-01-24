"use client";

const Messages = () => {
  const contacts = [
    { name: "John Mensah (Tenant)", status: "Last message 2 hours ago" },
    { name: "Ama Serwaa (Tenant)", status: "Last message 1 day ago" },
    { name: "Admin Support", status: "Online" },
    { name: "Maintenance Team", status: "Last message 3 days ago" },
  ];

  const messages = [
    {
      id: 1,
      sender: "John Mensah",
      text: "Hi, there's an issue with the kitchen tap",
      time: "10:30 AM",
      isOwn: false,
    },
    {
      id: 2,
      sender: "You",
      text: "Thanks for letting me know. I'll send a plumber tomorrow morning.",
      time: "10:35 AM",
      isOwn: true,
    },
    {
      id: 3,
      sender: "John Mensah",
      text: "That would be great, thank you!",
      time: "10:36 AM",
      isOwn: false,
    },
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
                className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {contact.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {contact.status}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="lg:col-span-2 flex flex-col border border-gray-200 dark:border-gray-700 rounded-xl">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="font-semibold text-gray-900 dark:text-white">
              John Mensah (Tenant)
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Apartment #302
            </div>
          </div>

          <div className="flex-grow p-4 space-y-4 overflow-y-auto max-h-[400px]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-xl p-3 ${
                    message.isOwn
                      ? "bg-[#00CFFF] text-white"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  <div
                    className={
                      message.isOwn
                        ? "text-white"
                        : "text-gray-900 dark:text-white"
                    }
                  >
                    {message.text}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      message.isOwn ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {message.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-grow px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent"
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
