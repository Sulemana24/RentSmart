"use client";
import React, { useState, useRef, useEffect } from "react";

interface Message {
  sender: "user" | "admin";
  text: string;
  time: string;
}

interface Contact {
  name: string;
  room?: string;
  messages: Message[];
}

const Messages: React.FC = () => {
  const initialContacts: Contact[] = [
    {
      name: "Kwame Asante",
      room: "Room 101",
      messages: [
        {
          sender: "user",
          text: "Good morning, there's an issue with the AC in my room. It's not cooling properly.",
          time: "Yesterday, 9:30 AM",
        },
        {
          sender: "admin",
          text: "Thanks for reporting. Maintenance team will check it this afternoon 2–4 PM.",
          time: "Yesterday, 9:35 AM",
        },
        {
          sender: "user",
          text: "Also, any update on the WiFi? It's been down since morning.",
          time: "Today, 8:15 AM",
        },
        {
          sender: "admin",
          text: "ISP is working on it. Service should return by 12 PM.",
          time: "Today, 8:20 AM",
        },
      ],
    },
    {
      name: "Ama Serwaa",
      room: "Room 104",
      messages: [
        {
          sender: "user",
          text: "Please my light is blinking on and off.",
          time: "Today, 10:15 AM",
        },
      ],
    },
    {
      name: "John Mensah",
      room: "Room 105",
      messages: [],
    },
    {
      name: "Kofi Ansah",
      room: "Room 201",
      messages: [],
    },
    { name: "Maintenance Team", messages: [] },
    { name: "Security Staff", messages: [] },
    { name: "University Housing Office", messages: [] },
  ];

  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [activeContactIndex, setActiveContactIndex] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const activeContact = contacts[activeContactIndex];

  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    const updatedContacts = [...contacts];

    updatedContacts[activeContactIndex].messages.push({
      sender: "admin",
      text: newMessage,
      time: "Just now",
    });

    setContacts(updatedContacts);
    setNewMessage("");

    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeContactIndex]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Messages
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contacts List */}
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
                onClick={() => setActiveContactIndex(index)}
                className={`w-full p-4 text-left transition-colors ${
                  activeContactIndex === index
                    ? "bg-gray-100 dark:bg-gray-700"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {contact.name}
                  {contact.room && ` (${contact.room})`}
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {contact.messages.length > 0
                    ? "Last: " +
                      contact.messages[contact.messages.length - 1].time
                    : "No messages yet"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2 flex flex-col border border-gray-200 dark:border-gray-700 rounded-xl">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="font-semibold text-gray-900 dark:text-white">
              {activeContact.name}
              {activeContact.room && ` (${activeContact.room})`}
            </div>

            {activeContact.room && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Student • Checked in: Jan 15, 2024 • Monthly Rent: ₵300
              </div>
            )}
          </div>

          {/* Chat Messages */}
          <div className="flex-grow p-4 space-y-4 overflow-y-auto max-h-[400px]">
            {activeContact.messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "admin" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-xl p-3 ${
                    msg.sender === "admin"
                      ? "bg-[#00CFFF] text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                  }`}
                >
                  <div>{msg.text}</div>
                  <div className="text-xs opacity-70 mt-1">{msg.time}</div>
                </div>
              </div>
            ))}

            <div ref={chatEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />

              <button
                onClick={sendMessage}
                className="px-6 py-3 bg-[#00CFFF] text-white rounded-lg hover:bg-[#00CFFF]/90"
              >
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
