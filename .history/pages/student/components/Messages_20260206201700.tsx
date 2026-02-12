"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { 
  FiSend, FiSearch, FiMoreVertical, FiPaperclip, 
  FiChevronLeft, FiTrash2, FiImage, FiCheckCircle, FiInfo 
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

interface Message {
  id: string;
  sender: "user" | "admin";
  text: string;
  time: string;
}

interface Contact {
  id: string;
  name: string;
  room?: string;
  status: "online" | "offline" | "typing";
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
        { id: "m1", sender: "user", text: "Good morning, there's an issue with the AC in my room.", time: "9:30 AM" },
        { id: "m2", sender: "admin", text: "Thanks for reporting. Maintenance will check it.", time: "9:35 AM" },
        { id: "m3", sender: "user", text: "Also, any update on the WiFi?", time: "8:15 AM" },
      ],
    },
    {
      id: "2",
      name: "Ama Serwaa",
      room: "Room 104",
      status: "offline",
      unread: 0,
      messages: [{ id: "m4", sender: "user", text: "Please my light is blinking.", time: "10:15 AM" }],
    },
    { id: "3", name: "Maintenance Team", status: "online", messages: [] },
  ]);

  const [activeId, setActiveId] = useState("1");
  const [showMobileChat, setShowMobileChat] = useState(false);
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

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "admin",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setContacts(prev => prev.map(c => {
      if (c.id === activeId) {
        return { ...c, messages: [...c.messages, newMsg], unread: 0 };
      }
      return c;
    }));

    setNewMessage("");
    toast.success("Message Sent");
  };

  const deleteMessage = (msgId: string) => {
    setContacts(prev => prev.map(c => ({
      ...c,
      messages: c.messages.filter(m => m.id !== msgId)
    })));
    toast.error("Message deleted");
  };

  const handleSelectContact = (id: string) => {
    setActiveId(id);
    setShowMobileChat(true);
    // Clear unread on select
    setContacts(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeContact.messages, showMobileChat]);

  const quickReplies = ["Maintenance is on the way.", "Resolved.", "Please check email."];

  return (
    <div className="max-w-7xl mx-auto h-[85vh] md:h-[80vh] flex flex-col space-y-4 p-2 md:p-0">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="flex items-center justify-between px-2">
         <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Messages</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Central Hub v2.4</p>
         </div>
         <div className="hidden md:flex gap-2">
            <div className="flex -space-x-2">
               {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 dark:bg-gray-700" />)}
            </div>
            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-black self-center">4 ONLINE</span>
         </div>
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-2xl overflow-hidden relative">
        
        {/* SIDEBAR */}
        <div className={`lg:col-span-1 border-r border-gray-100 dark:border-gray-700 flex flex-col bg-gray-50/50 dark:bg-gray-900/20 ${showMobileChat ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-6">
            <div className="relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00CFFF] transition-colors" />
              <input 
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-900 rounded-2xl text-xs font-bold outline-none border-none shadow-sm focus:ring-2 focus:ring-[#00CFFF]"
              />
            </div>
          </div>

          <div className="flex-grow overflow-y-auto px-3 space-y-1">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => handleSelectContact(contact.id)}
                className={`w-full p-4 rounded-[1.5rem] text-left flex items-center gap-4 transition-all ${
                  activeId === contact.id ? "bg-white dark:bg-gray-700 shadow-md ring-1 ring-black/5" : "hover:bg-white/50 dark:hover:bg-gray-700/50"
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00CFFF] to-[#007FFF] flex items-center justify-center font-black text-white text-lg shadow-inner">
                    {contact.name.charAt(0)}
                  </div>
                  {contact.status === 'online' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 bg-green-500" />
                  )}
                </div>

                <div className="flex-grow overflow-hidden">
                  <div className="flex justify-between items-center">
                    <p className="font-black text-sm text-gray-900 dark:text-white truncate">{contact.name}</p>
                    {contact.unread! > 0 && (
                      <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full animate-pulse">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter truncate">{contact.room || "Management"}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* CHAT WINDOW */}
        <div className={`lg:col-span-3 flex flex-col bg-white dark:bg-gray-800 ${!showMobileChat ? 'hidden lg:flex' : 'flex'}`}>
          {/* Chat Header */}
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <button onClick={() => setShowMobileChat(false)} className="lg:hidden p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                <FiChevronLeft />
              </button>
              <div>
                <h3 className="font-black text-base text-gray-900 dark:text-white leading-none">
                  {activeContact.name}
                </h3>
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">{activeContact.status}</span>
              </div>
            </div>
            <div className="flex gap-2">
               <button className="hidden md:flex p-2 text-gray-400 hover:text-gray-600"><FiImage size={20}/></button>
               <button className="p-2 text-gray-400 hover:text-gray-600"><FiMoreVertical size={20}/></button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 md:p-8 space-y-6 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/20">
            {activeContact.messages.map((msg, idx) => (
              <div key={msg.id} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
                <div className="group flex flex-col max-w-[85%] md:max-w-[70%]">
                  <div className={`relative px-5 py-3 rounded-3xl text-sm font-semibold transition-all ${
                    msg.sender === "admin"
                      ? "bg-[#00CFFF] text-white rounded-tr-none shadow-xl shadow-[#00CFFF]/20"
                      : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-100 dark:border-gray-600 rounded-tl-none shadow-sm"
                  }`}>
                    {msg.text}
                    <button 
                      onClick={() => deleteMessage(msg.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <FiTrash2 size={10} />
                    </button>
                  </div>
                  <div className={`text-[9px] mt-2 font-black uppercase tracking-widest flex items-center gap-1 ${msg.sender === 'admin' ? 'self-end text-[#00CFFF]' : 'text-gray-400'}`}>
                    {msg.time} {msg.sender === 'admin' && <FiCheckCircle />}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Footer */}
          <div className="p-4 md:p-6 border-t border-gray-100 dark:border-gray-700 space-y-4 bg-white dark:bg-gray-800">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {quickReplies.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(reply)}
                  className="whitespace-nowrap px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-black dark:hover:bg-[#00CFFF] hover:text-white transition-all rounded-xl text-[10px] font-black uppercase border border-transparent"
                >
                  {reply}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button className="p-3 bg-gray-50 dark:bg-gray-900 text-gray-400 rounded-2xl hover:text-[#00CFFF] transition-colors">
                <FiPaperclip size={20} />
              </button>
              <input
                type="text"
                value={newMessage}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write your message..."
                className="flex-grow px-5 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#00CFFF] transition-all outline-none"
              />
              <button
                onClick={() => handleSendMessage()}
                className="p-4 bg-black dark:bg-[#00CFFF] text-white rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                <FiSend size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;