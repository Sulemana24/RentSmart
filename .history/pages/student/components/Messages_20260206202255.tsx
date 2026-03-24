"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { 
  FiSend, FiSearch, FiMoreVertical, FiPaperclip, 
  FiChevronLeft, FiTrash2, FiImage, FiCheckCircle, FiInfo, FiPlus
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
    { id: "4", name: "Security Desk", status: "offline", messages: [] },
    { id: "5", name: "John Mensah", room: "Room 205", status: "online", messages: [] },
  ]);

  const [activeId, setActiveId] = useState("1");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const activeContact = useMemo(() => 
    contacts.find(c => c.id === activeId) || contacts[0], 
    [activeId, contacts]
  );

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.room?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Handlers ---
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
    // Smooth scroll to bottom after state update
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const deleteMessage = (msgId: string) => {
    setContacts(prev => prev.map(c => ({
      ...c,
      messages: c.messages.filter(m => m.id !== msgId)
    })));
    toast.error("Message deleted permanently");
  };

  const handleAction = (action: string) => {
    toast(`Feature "${action}" coming soon!`, { icon: '🚀' });
  };

  const handleSelectContact = (id: string) => {
    setActiveId(id);
    setShowMobileChat(true);
    setContacts(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [activeId]);

  const quickReplies = ["Maintenance is on the way.", "Issue Resolved.", "Contacting ISP..."];

  return (
    <div className="flex flex-col h-screen max-h-[900px] max-w-7xl mx-auto p-2 md:p-6 bg-gray-50 dark:bg-black/20 font-sans">
      <Toaster position="top-right" />
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-4 px-2">
         <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">MESSAGES</h2>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500"></div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admin Dashboard Active</p>
            </div>
         </div>
         <button 
           onClick={() => handleAction("Add Contact")}
           className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:scale-105 transition-transform"
         >
            <FiPlus className="text-[#00CFFF]" size={20} />
         </button>
      </div>

      {/* Main Container */}
      <div className="flex-grow flex overflow-hidden bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-black/10">
        
        {/* SIDEBAR: Scrollable Contacts */}
        <aside className={`lg:w-80 w-full flex flex-col border-r border-gray-100 dark:border-gray-800 transition-all ${showMobileChat ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-6">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl text-xs font-bold outline-none border-none focus:ring-2 focus:ring-[#00CFFF] transition-all"
              />
            </div>
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar px-3 pb-6">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => handleSelectContact(contact.id)}
                className={`w-full p-4 mb-1 rounded-[1.5rem] text-left flex items-center gap-4 transition-all ${
                  activeId === contact.id ? "bg-[#00CFFF]/10 dark:bg-[#00CFFF]/5 ring-1 ring-[#00CFFF]/20 shadow-sm" : "hover:bg-gray-50 dark:hover:bg-gray-800/40"
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center font-black text-gray-500 dark:text-gray-300">
                    {contact.name.charAt(0)}
                  </div>
                  {contact.status === 'online' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-[3px] border-white dark:border-gray-900 bg-green-500" />
                  )}
                </div>
                <div className="flex-grow overflow-hidden">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-gray-900 dark:text-white truncate">{contact.name}</span>
                    {contact.unread! > 0 && (
                      <span className="bg-[#00CFFF] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">{contact.room || "Staff"}</p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* CHAT AREA: Scrollable Messages */}
        <main className={`flex-grow flex flex-col min-w-0 ${!showMobileChat ? 'hidden lg:flex' : 'flex'}`}>
          {/* Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
            <div className="flex items-center gap-4">
              <button onClick={() => setShowMobileChat(false)} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <FiChevronLeft size={20}/>
              </button>
              <div>
                <h3 className="font-black text-base text-gray-900 dark:text-white leading-tight">{activeContact.name}</h3>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${activeContact.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{activeContact.status}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-1">
               <button onClick={() => handleAction("View Media")} className="p-2.5 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"><FiImage size={20}/></button>
               <button onClick={() => handleAction("Settings")} className="p-2.5 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"><FiMoreVertical size={20}/></button>
            </div>
          </div>

          {/* Messages: THIS SECTION SCROLLS */}
          <div 
            ref={scrollContainerRef}
            className="flex-grow overflow-y-auto p-4 md:p-8 space-y-6 bg-gray-50/30 dark:bg-gray-950/20 custom-scrollbar"
          >
            {activeContact.messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-300 dark:text-gray-600">
                <FiInfo size={40} className="mb-2" />
                <p className="font-black text-xs uppercase tracking-[0.2em]">Start a new conversation</p>
              </div>
            ) : (
              activeContact.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
                  <div className="group flex flex-col max-w-[85%] md:max-w-[65%]">
                    <div className={`relative px-5 py-3 rounded-[1.8rem] text-sm font-medium ${
                      msg.sender === "admin"
                        ? "bg-[#00CFFF] text-white rounded-tr-none shadow-lg shadow-[#00CFFF]/20"
                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none shadow-sm"
                    }`}>
                      {msg.text}
                      <button 
                        onClick={() => deleteMessage(msg.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-xl"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                    <span className={`text-[9px] mt-2 font-black text-gray-400 uppercase tracking-widest flex items-center gap-1 ${msg.sender === 'admin' ? 'self-end' : 'self-start'}`}>
                      {msg.time} {msg.sender === 'admin' && <FiCheckCircle className="text-[#00CFFF]" />}
                    </span>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Footer: THIS SECTION IS FIXED */}
          <div className="p-4 md:p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
              {quickReplies.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(reply)}
                  className="whitespace-nowrap px-4 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-[#00CFFF] hover:text-white transition-all rounded-xl text-[10px] font-black uppercase border border-gray-100 dark:border-gray-700"
                >
                  {reply}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleAction("File Upload")}
                className="p-4 bg-gray-50 dark:bg-gray-800 text-gray-400 rounded-2xl hover:text-[#00CFFF] transition-all active:scale-90"
              >
                <FiPaperclip size={20} />
              </button>
              <div className="flex-grow relative">
                <input
                  type="text"
                  value={newMessage}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#00CFFF] transition-all outline-none"
                />
              </div>
              <button
                onClick={() => handleSendMessage()}
                className="p-4 bg-black dark:bg-[#00CFFF] text-white rounded-2xl shadow-xl hover:shadow-[#00CFFF]/20 active:scale-95 transition-all"
              >
                <FiSend size={20} />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Custom CSS for hiding scrollbars but keeping functionality */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Messages;