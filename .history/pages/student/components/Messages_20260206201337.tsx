"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { 
  FiSend, FiSearch, FiMoreVertical, FiUser, 
  FiClock, FiCheck, FiCheckCircle, FiInfo 
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

interface Message {
  sender: "user" | "admin";
  text: string;
  time: string;
}

interface Contact {
  id: string;
  name: string;
  room?: string;
  status: "online" | "offline";
  unread?: number;
  messages: Message[];
}

const Messages: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Kwame Asante",
      room: "Room 101",
      status: "online",
      unread: 2,
      messages: [
        { sender: "user", text: "Good morning, there's an issue with the AC in my room.", time: "9:30 AM" },
        { sender: "admin", text: "Thanks for reporting. Maintenance will check it.", time: "9:35 AM" },
        { sender: "user", text: "Also, any update on the WiFi?", time: "8:15 AM" },
      ],
    },
    {
      id: "2",
      name: "Ama Serwaa",
      room: "Room 104",
      status: "offline",
      unread: 0,
      messages: [{ sender: "user", text: "Please my light is blinking.", time: "10:15 AM" }],
    },
    { id: "3", name: "Maintenance Team", status: "online", messages: [] },
    { id: "4", name: "Security Staff", status: "offline", messages: [] },
  ]);

  const [activeId, setActiveId] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // --- Logic ---
  const activeContact = useMemo(() => 
    contacts.find(c => c.id === activeId) || contacts[0], 
    [activeId, contacts]
  );

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.room?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (textOverride?: string) => {
    const textToSend = textOverride || newMessage;
    if (!textToSend.trim()) return;

    setContacts(prev => prev.map(c => {
      if (c.id === activeId) {
        return {
          ...c,
          messages: [...c.messages, {
            sender: "admin",
            text: textToSend,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]
        };
      }
      return c;
    }));

    setNewMessage("");
    toast.success("Sent", { duration: 1000, position: 'bottom-center' });
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeContact.messages]);

  // --- Templates ---
  const quickReplies = [
    "Maintenance is on the way.",
    "The issue has been resolved.",
    "Please check your email for details.",
  ];

  return (
    <div className="max-w-7xl mx-auto h-[80vh] flex flex-col space-y-4">
      <Toaster />
      
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Communications</h2>
         <div className="flex gap-2">
            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">System Live</span>
         </div>
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-0 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-2xl overflow-hidden">
        
        {/* SIDEBAR: CONTACTS */}
        <div className="lg:col-span-1 border-r border-gray-100 dark:border-gray-700 flex flex-col bg-gray-50/50 dark:bg-gray-800/50">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                placeholder="Search threads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 rounded-2xl text-xs font-bold outline-none border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-[#00CFFF]"
              />
            </div>
          </div>

          <div className="flex-grow overflow-y-auto">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setActiveId(contact.id)}
                className={`w-full p-5 text-left flex items-center gap-4 transition-all relative ${
                  activeId === contact.id ? "bg-white dark:bg-gray-700 shadow-sm z-10" : "hover:bg-gray-100/50 dark:hover:bg-gray-700/30"
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-gray-200 to-gray-100 dark:from-gray-600 flex items-center justify-center font-black text-gray-500">
                    {contact.name.charAt(0)}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-white dark:border-gray-800 ${contact.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`} />
                </div>

                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <p className="font-black text-sm text-gray-900 dark:text-white leading-tight">{contact.name}</p>
                    {contact.unread ? (
                      <span className="bg-[#00CFFF] text-white text-[10px] font-black px-1.5 py-0.5 rounded-lg">
                        {contact.unread}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">{contact.room || "Staff"}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* MAIN: CHAT WINDOW */}
        <div className="lg:col-span-3 flex flex-col bg-white dark:bg-gray-800">
          
          {/* Header */}
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               <div>
                  <h3 className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-tight">
                    {activeContact.name} {activeContact.room && `• ${activeContact.room}`}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Active Session</p>
               </div>
            </div>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
              <FiMoreVertical />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-6 space-y-6 overflow-y-auto bg-gray-50/30 dark:bg-gray-900/10">
            {activeContact.messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <FiInfo size={48} />
                <p className="font-black mt-4 uppercase text-xs tracking-widest">No conversation history</p>
              </div>
            ) : (
              activeContact.messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
                  <div className={`group relative max-w-[75%] px-5 py-3 rounded-3xl text-sm font-medium ${
                    msg.sender === "admin"
                      ? "bg-[#00CFFF] text-white rounded-tr-none shadow-lg shadow-[#00CFFF]/20"
                      : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-100 dark:border-gray-600 rounded-tl-none shadow-sm"
                  }`}>
                    {msg.text}
                    <div className={`text-[9px] mt-1 flex items-center gap-1 font-bold ${msg.sender === 'admin' ? 'text-white/70' : 'text-gray-400'}`}>
                      {msg.time} {msg.sender === 'admin' && <FiCheckCircle />}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Footer: Input & Quick Actions */}
          <div className="p-5 border-t border-gray-100 dark:border-gray-700 space-y-4">
            
            {/* Quick Replies */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {quickReplies.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(reply)}
                  className="whitespace-nowrap px-4 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-[#00CFFF] hover:text-white transition-all rounded-full text-[10px] font-black text-gray-500 uppercase tracking-tight border border-transparent"
                >
                  {reply}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <div className="flex-grow relative">
                <input
                  type="text"
                  value={newMessage}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Draft your reply..."
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#00CFFF] transition-all"
                />
              </div>
              <button
                onClick={() => handleSendMessage()}
                className="px-8 py-4 bg-gray-900 dark:bg-[#00CFFF] text-white rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <FiSend /> <span className="hidden md:inline">SEND</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;