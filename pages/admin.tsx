// pages/admin.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Home,
  List,
  Users,
  BookOpen,
  User,
  MessageCircle,
  Eye,
  Trash2,
  Search,
} from "lucide-react";

import adminData, {
  PROPERTIES as MOCK_PROPERTIES,
  HOMEOWNERS as MOCK_HOMEOWNERS,
  BOOKINGS as MOCK_BOOKINGS,
  GUESTS as MOCK_GUESTS,
  MESSAGES as MOCK_MESSAGES,
} from "@/constants/adminData";

/**
 * Admin dashboard single-file page.
 * - imports mock data from src/data/adminData.ts
 * - responsive + collapsible sidebar
 * - tabs: Dashboard / Properties / Homeowners / Bookings / Guests / Communication
 * - search/filter at top of each table
 *
 * Note:
 * - This is client-only mock UI. Wire to your backend later.
 * - Tailwind classes are used (same theme as homeowner dashboard).
 */

/* -------------------------
  Helpers / Types (local)
   ------------------------- */

type Property = (typeof MOCK_PROPERTIES)[number];
type Homeowner = (typeof MOCK_HOMEOWNERS)[number];
type Booking = (typeof MOCK_BOOKINGS)[number];
type Guest = (typeof MOCK_GUESTS)[number];
type Message = (typeof MOCK_MESSAGES)[number];

/* -------------------------
  Component
   ------------------------- */

export default function AdminPage() {
  const router = useRouter();

  // client-side role protection (mock). Adjust to your real auth later.
  useEffect(() => {
    try {
      const role = localStorage.getItem("role");
      if (role !== "admin") {
        router.replace("/login");
      }
    } catch {
      router.replace("/login");
    }
  }, [router]);

  // sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((s) => !s);
  const closeSidebar = () => setSidebarOpen(false);

  // active tab
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "properties"
    | "homeowners"
    | "bookings"
    | "guests"
    | "communication"
  >("dashboard");

  // load data from adminData
  const [properties, setProperties] = useState<Property[]>(
    () => MOCK_PROPERTIES
  );
  const [homeowners, setHomeowners] = useState<Homeowner[]>(
    () => MOCK_HOMEOWNERS
  );
  const [bookings, setBookings] = useState<Booking[]>(() => MOCK_BOOKINGS);
  const [guests, setGuests] = useState<Guest[]>(() => MOCK_GUESTS);
  const [messages, setMessages] = useState<Message[]>(() => MOCK_MESSAGES);

  // selection / modal
  const [selected, setSelected] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  // search/filter states (one per tab)
  const [propQuery, setPropQuery] = useState("");
  const [homeownerQuery, setHomeownerQuery] = useState("");
  const [bookingQuery, setBookingQuery] = useState("");
  const [guestQuery, setGuestQuery] = useState("");
  const [messageQuery, setMessageQuery] = useState("");

  // derived summaries
  const totalProperties = properties.length;
  const totalHomeowners = homeowners.length;
  const totalBookings = bookings.length;
  const totalGuests = guests.length;
  const totalRevenue = bookings.reduce((s, b) => s + (b.total || 0), 0);

  // --- SEARCHED ARRAYS (memoized) ---
  const filteredProperties = useMemo(() => {
    const q = propQuery.toLowerCase().trim();
    if (!q) return properties;
    return properties.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.host?.toLowerCase().includes(q) ||
        p.address.city?.toLowerCase().includes(q) ||
        String(p.price).includes(q)
    );
  }, [propQuery, properties]);

  const filteredHomeowners = useMemo(() => {
    const q = homeownerQuery.toLowerCase().trim();
    if (!q) return homeowners;
    return homeowners.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.email.toLowerCase().includes(q) ||
        h.phone?.toLowerCase().includes(q)
    );
  }, [homeownerQuery, homeowners]);

  const filteredBookings = useMemo(() => {
    const q = bookingQuery.toLowerCase().trim();
    if (!q) return bookings;
    return bookings.filter(
      (b) =>
        b.id.toLowerCase().includes(q) ||
        b.propertyName?.toLowerCase().includes(q) ||
        b.guestName?.toLowerCase().includes(q) ||
        b.homeowner?.toLowerCase().includes(q)
    );
  }, [bookingQuery, bookings]);

  const filteredGuests = useMemo(() => {
    const q = guestQuery.toLowerCase().trim();
    if (!q) return guests;
    return guests.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.email.toLowerCase().includes(q) ||
        g.phone?.toLowerCase().includes(q)
    );
  }, [guestQuery, guests]);

  const filteredMessages = useMemo(() => {
    const q = messageQuery.toLowerCase().trim();
    if (!q) return messages;
    return messages.filter(
      (m) =>
        m.from.toLowerCase().includes(q) ||
        m.to.toLowerCase().includes(q) ||
        (m.property || "").toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
    );
  }, [messageQuery, messages]);

  // ACTIONS
  const confirmAndDelete = (
    type: "property" | "homeowner" | "booking" | "guest" | "message",
    id: number | string
  ) => {
    const ok = confirm("Are you sure? This action is irreversible.");
    if (!ok) return;
    switch (type) {
      case "property":
        setProperties((prev) => prev.filter((p) => p.id !== id));
        break;
      case "homeowner":
        setHomeowners((prev) => prev.filter((h) => h.id !== id));
        break;
      case "booking":
        setBookings((prev) => prev.filter((b) => b.id !== id));
        break;
      case "guest":
        setGuests((prev) => prev.filter((g) => g.id !== id));
        break;
      case "message":
        setMessages((prev) => prev.filter((m) => m.id !== id));
        break;
    }
  };

  const openView = (payload: any) => {
    setSelected(payload);
    setShowModal(true);
  };

  /* -------------------------
     RENDER
     ------------------------- */

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <button onClick={toggleSidebar} aria-label="toggle menu">
            {sidebarOpen ? <X /> : <Menu />}
          </button>
          <h1 className="text-lg font-bold text-[#00CFFF]">Admin Panel</h1>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed md:relative z-30 inset-y-0 left-0 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } transition-transform duration-200 w-64 bg-gray-800 border-r border-gray-700 p-6`}
        >
          <div className="hidden md:block mb-6">
            <h2 className="text-2xl font-bold text-[#00CFFF]">Admin Panel</h2>
          </div>

          <nav className="space-y-2">
            <SidebarBtn
              label="Dashboard"
              icon={<Home size={16} />}
              active={activeTab === "dashboard"}
              onClick={() => {
                setActiveTab("dashboard");
                closeSidebar();
              }}
            />
            <SidebarBtn
              label="Properties"
              icon={<List size={16} />}
              active={activeTab === "properties"}
              onClick={() => {
                setActiveTab("properties");
                closeSidebar();
              }}
            />
            <SidebarBtn
              label="Homeowners"
              icon={<Users size={16} />}
              active={activeTab === "homeowners"}
              onClick={() => {
                setActiveTab("homeowners");
                closeSidebar();
              }}
            />
            <SidebarBtn
              label="Bookings"
              icon={<BookOpen size={16} />}
              active={activeTab === "bookings"}
              onClick={() => {
                setActiveTab("bookings");
                closeSidebar();
              }}
            />
            <SidebarBtn
              label="Guests"
              icon={<User size={16} />}
              active={activeTab === "guests"}
              onClick={() => {
                setActiveTab("guests");
                closeSidebar();
              }}
            />
            <SidebarBtn
              label="Communication"
              icon={<MessageCircle size={16} />}
              active={activeTab === "communication"}
              onClick={() => {
                setActiveTab("communication");
                closeSidebar();
              }}
            />
          </nav>

          <div className="mt-8 text-sm text-gray-300">
            <div>Signed in as</div>
            <div className="mt-1 font-medium">Administrator</div>
            <button
              className="mt-4 bg-[#FF4FA1] px-3 py-2 rounded-lg font-semibold"
              onClick={() => {
                localStorage.removeItem("role");
                router.push("/login");
              }}
            >
              Logout
            </button>
          </div>
        </aside>

        {/* mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main
          className={`flex-1 transition-all duration-200 ${
            sidebarOpen ? "blur-sm md:blur-0" : ""
          } p-4 md:p-8`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {activeTab === "dashboard" && "Dashboard Overview"}
              {activeTab === "properties" && "All Properties"}
              {activeTab === "homeowners" && "Homeowners"}
              {activeTab === "bookings" && "Bookings"}
              {activeTab === "guests" && "Guests"}
              {activeTab === "communication" && "Communication"}
            </h2>
            <div className="hidden md:flex items-center gap-4 text-gray-300">
              <div>Admin</div>
            </div>
          </div>

          {/* ---------- DASHBOARD ---------- */}
          {activeTab === "dashboard" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard
                  label="Properties"
                  value={totalProperties}
                  color="pink"
                />
                <StatCard
                  label="Homeowners"
                  value={totalHomeowners}
                  color="teal"
                />
                <StatCard label="Bookings" value={totalBookings} color="pink" />
                <StatCard label="Guests" value={totalGuests} color="teal" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                  <h3 className="font-semibold mb-4">Recent Properties</h3>
                  <div className="space-y-3">
                    {properties.slice(0, 6).map((p) => (
                      <div key={p.id} className="flex items-center gap-3">
                        {p.image && (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-16 h-12 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <div className="font-semibold">{p.name}</div>
                          <div className="text-xs text-gray-400">
                            {p.address.city}, {p.address.state}
                          </div>
                        </div>
                        <div className="text-sm text-[#FF4FA1]">
                          Ghc {p.price}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                  <h3 className="font-semibold mb-4">Recent Messages</h3>
                  <div className="space-y-3">
                    {messages.slice(0, 6).map((m) => (
                      <div key={m.id} className="p-3 bg-gray-900 rounded">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-semibold">
                              {m.from} → {m.to}
                            </div>
                            <div className="text-xs text-gray-400">
                              {m.property} • {m.date}
                            </div>
                          </div>
                          <div className="text-sm text-gray-300">
                            {m.status}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-200">
                          {m.message.slice(0, 100)}
                          {m.message.length > 100 ? "..." : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ---------- PROPERTIES ---------- */}
          {activeTab === "properties" && (
            <>
              <TableToolbar
                placeholder="Search properties by name, host, city or price..."
                value={propQuery}
                onChange={(v) => setPropQuery(v)}
                onClear={() => setPropQuery("")}
              />
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-auto">
                <table className="min-w-full text-sm text-left text-gray-300">
                  <thead className="bg-gray-700 text-gray-200 sticky top-0">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Owner</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Beds</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProperties.map((p) => (
                      <tr
                        key={p.id}
                        className="border-t border-gray-700 hover:bg-gray-700/30"
                      >
                        <td className="px-4 py-3">{p.name}</td>
                        <td className="px-4 py-3">{p.host}</td>
                        <td className="px-4 py-3">
                          {p.address.city}, {p.address.state}
                        </td>
                        <td className="px-4 py-3">{p.beds}</td>
                        <td className="px-4 py-3">Ghc {p.price}</td>
                        <td className="px-4 py-3">
                          {p.isActive ? "Active" : "Inactive"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => openView(p)}
                              className="text-[#00CFFF]"
                              title="View"
                            >
                              <Eye />
                            </button>
                            <button
                              onClick={() => confirmAndDelete("property", p.id)}
                              className="text-red-500"
                              title="Delete"
                            >
                              <Trash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredProperties.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-6 text-center text-gray-400"
                        >
                          No properties
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ---------- HOMEOWNERS ---------- */}
          {activeTab === "homeowners" && (
            <>
              <TableToolbar
                placeholder="Search homeowners by name, email or phone..."
                value={homeownerQuery}
                onChange={(v) => setHomeownerQuery(v)}
                onClear={() => setHomeownerQuery("")}
              />
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-auto">
                <table className="min-w-full text-sm text-left text-gray-300">
                  <thead className="bg-gray-700 text-gray-200 sticky top-0">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3"># Properties</th>
                      <th className="px-4 py-3">Payment</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHomeowners.map((h) => {
                      const count = properties.filter(
                        (p) => p.host === h.name
                      ).length;
                      return (
                        <tr
                          key={h.id}
                          className="border-t border-gray-700 hover:bg-gray-700/30"
                        >
                          <td className="px-4 py-3">{h.name}</td>
                          <td className="px-4 py-3">{h.email}</td>
                          <td className="px-4 py-3">{h.phone}</td>
                          <td className="px-4 py-3">{count}</td>
                          <td className="px-4 py-3">{h.paymentInfo}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => openView(h)}
                                className="text-[#00CFFF]"
                                title="View"
                              >
                                <Eye />
                              </button>
                              <button
                                onClick={() =>
                                  confirmAndDelete("homeowner", h.id)
                                }
                                className="text-red-500"
                                title="Delete"
                              >
                                <Trash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredHomeowners.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-6 text-center text-gray-400"
                        >
                          No homeowners
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ---------- BOOKINGS ---------- */}
          {activeTab === "bookings" && (
            <>
              <TableToolbar
                placeholder="Search bookings by id, property, guest or homeowner..."
                value={bookingQuery}
                onChange={(v) => setBookingQuery(v)}
                onClear={() => setBookingQuery("")}
              />
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-auto">
                <table className="min-w-full text-sm text-left text-gray-300">
                  <thead className="bg-gray-700 text-gray-200 sticky top-0">
                    <tr>
                      <th className="px-4 py-3">Homeowner</th>
                      <th className="px-4 py-3">Guest</th>
                      <th className="px-4 py-3">Property</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Duration</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((b) => (
                      <tr
                        key={b.id}
                        className="border-t border-gray-700 hover:bg-gray-700/30"
                      >
                        <td className="px-4 py-3">{b.homeowner}</td>
                        <td className="px-4 py-3">{b.guestName}</td>
                        <td className="px-4 py-3">{b.propertyName}</td>
                        <td className="px-4 py-3">{b.location}</td>
                        <td className="px-4 py-3">{b.duration}</td>
                        <td className="px-4 py-3">{b.startDate}</td>
                        <td className="px-4 py-3">Ghc {b.total}</td>
                        <td className="px-4 py-3">{b.status}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => openView(b)}
                              className="text-[#00CFFF]"
                              title="View"
                            >
                              <Eye />
                            </button>
                            <button
                              onClick={() => confirmAndDelete("booking", b.id)}
                              className="text-red-500"
                              title="Delete"
                            >
                              <Trash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredBookings.length === 0 && (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-4 py-6 text-center text-gray-400"
                        >
                          No bookings
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ---------- GUESTS ---------- */}
          {activeTab === "guests" && (
            <>
              <TableToolbar
                placeholder="Search guests by name, email or phone..."
                value={guestQuery}
                onChange={(v) => setGuestQuery(v)}
                onClear={() => setGuestQuery("")}
              />
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-auto">
                <table className="min-w-full text-sm text-left text-gray-300">
                  <thead className="bg-gray-700 text-gray-200 sticky top-0">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Total Bookings</th>
                      <th className="px-4 py-3">Total Spent</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGuests.map((g) => {
                      const guestBookings = bookings.filter(
                        (b) => b.guestName === g.name
                      );
                      const totalSpent = guestBookings.reduce(
                        (s, bk) => s + (bk.total || 0),
                        0
                      );
                      return (
                        <tr
                          key={g.id}
                          className="border-t border-gray-700 hover:bg-gray-700/30"
                        >
                          <td className="px-4 py-3">{g.name}</td>
                          <td className="px-4 py-3">{g.email}</td>
                          <td className="px-4 py-3">{g.phone}</td>
                          <td className="px-4 py-3">{guestBookings.length}</td>
                          <td className="px-4 py-3">Ghc {totalSpent}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => openView(g)}
                                className="text-[#00CFFF]"
                                title="View"
                              >
                                <Eye />
                              </button>
                              <button
                                onClick={() => confirmAndDelete("guest", g.id)}
                                className="text-red-500"
                                title="Delete"
                              >
                                <Trash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredGuests.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-6 text-center text-gray-400"
                        >
                          No guests
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ---------- COMMUNICATION ---------- */}
          {activeTab === "communication" && (
            <>
              <TableToolbar
                placeholder="Search messages by guest, homeowner, property or text..."
                value={messageQuery}
                onChange={(v) => setMessageQuery(v)}
                onClear={() => setMessageQuery("")}
              />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-1 bg-gray-800 rounded-xl border border-gray-700 p-4 max-h-[60vh] overflow-auto">
                  <h3 className="font-semibold mb-3">Messages</h3>
                  <div className="space-y-3">
                    {filteredMessages.map((m) => (
                      <div key={m.id} className="p-3 bg-gray-900 rounded">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-semibold">
                              {m.from} → {m.to}
                            </div>
                            <div className="text-xs text-gray-400">
                              {m.property} • {m.date}
                            </div>
                          </div>
                          <div className="text-sm text-gray-300">
                            {m.status}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-200">
                          {m.message.slice(0, 140)}
                          {m.message.length > 140 ? "..." : ""}
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => openView(m)}
                            className="text-[#00CFFF] text-sm"
                          >
                            View
                          </button>
                          <button
                            onClick={() => confirmAndDelete("message", m.id)}
                            className="text-red-500 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                    {filteredMessages.length === 0 && (
                      <div className="text-gray-400">No messages</div>
                    )}
                  </div>
                </div>

                <div className="col-span-2 bg-gray-800 rounded-xl border border-gray-700 p-4">
                  <h3 className="font-semibold mb-4">
                    Conversation (latest messages)
                  </h3>
                  <div className="max-h-[56vh] overflow-auto space-y-3 mb-4">
                    {messages.slice(0, 20).map((m) => (
                      <div key={m.id} className="p-3 rounded bg-gray-900">
                        <div className="flex justify-between">
                          <div className="font-semibold">
                            {m.from} → {m.to}
                          </div>
                          <div className="text-xs text-gray-400">{m.date}</div>
                        </div>
                        <div className="mt-2 text-sm text-gray-200">
                          {m.message}
                        </div>
                      </div>
                    ))}
                  </div>

                  <ReplyBox
                    onSend={(text) => {
                      if (!text.trim()) return alert("Reply cannot be empty.");
                      const latest = messages[0];
                      if (!latest) return alert("No message to reply to.");
                      // mock reply: prepend to messages
                      const newMsg: Message = {
                        id: `r-${Date.now()}`,
                        from: latest.to,
                        to: latest.from,
                        property: latest.property,
                        date: new Date().toISOString(),
                        message: text.trim(),
                        status: "read",
                      };
                      setMessages((m) => [newMsg, ...m]);
                      alert("Reply sent (mock).");
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* ----- VIEW MODAL ----- */}
      {showModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-3xl w-full overflow-auto">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <h3 className="text-2xl font-bold text-[#00CFFF]">Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-300"
                >
                  Close
                </button>
              </div>

              <div className="mt-4">
                {/* Booking */}
                {selected && selected.propertyName && (
                  <div>
                    <div className="text-sm text-gray-400">Booking</div>
                    <div className="mt-2 bg-gray-900 p-4 rounded">
                      <div>
                        <strong>Booking ID:</strong> {selected.id}
                      </div>
                      <div>
                        <strong>Property:</strong> {selected.propertyName}
                      </div>
                      <div>
                        <strong>Homeowner:</strong> {selected.homeowner}
                      </div>
                      <div>
                        <strong>Guest:</strong> {selected.guestName} (
                        {selected.guestEmail})
                      </div>
                      <div>
                        <strong>Dates:</strong> {selected.startDate} •{" "}
                        {selected.duration}
                      </div>
                      <div>
                        <strong>Amount:</strong> Ghc {selected.total}
                      </div>
                      <div>
                        <strong>Status:</strong> {selected.status}
                      </div>
                    </div>
                  </div>
                )}

                {/* Property */}
                {selected && selected.address && (
                  <div className="mt-4">
                    <div className="text-sm text-gray-400">Property</div>
                    <div className="mt-2 bg-gray-900 p-4 rounded">
                      <div className="flex gap-4">
                        {selected.image && (
                          <img
                            src={selected.image}
                            className="w-32 h-24 object-cover rounded"
                            alt={selected.name}
                          />
                        )}
                        <div className="flex-1">
                          <div className="text-lg font-semibold">
                            {selected.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {selected.address.city}, {selected.address.state}
                          </div>
                          <div className="mt-2">Beds: {selected.beds}</div>
                          <div>Price: Ghc {selected.price}</div>
                          <div>
                            Status: {selected.isActive ? "Active" : "Inactive"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Homeowner / Guest / Message fallback */}
                {selected && selected.email && (
                  <div className="mt-4">
                    <div className="text-sm text-gray-400">User</div>
                    <div className="mt-2 bg-gray-900 p-4 rounded">
                      <div>
                        <strong>Name:</strong> {selected.name}
                      </div>
                      <div>
                        <strong>Email:</strong> {selected.email}
                      </div>
                      {selected.phone && (
                        <div>
                          <strong>Phone:</strong> {selected.phone}
                        </div>
                      )}
                      {selected.paymentInfo && (
                        <div>
                          <strong>Payment:</strong> {selected.paymentInfo}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selected && selected.message && !selected.propertyName && (
                  <div className="mt-4">
                    <div className="text-sm text-gray-400">Message</div>
                    <div className="mt-2 bg-gray-900 p-4 rounded">
                      <div>
                        <strong>From:</strong> {selected.from}
                      </div>
                      <div>
                        <strong>To:</strong> {selected.to}
                      </div>
                      <div className="mt-2">{selected.message}</div>
                      <div className="text-xs text-gray-400 mt-2">
                        {selected.date}
                      </div>
                    </div>
                  </div>
                )}

                {/* Fallback raw */}
                {!(
                  (selected && selected.propertyName) ||
                  (selected && selected.address) ||
                  (selected && selected.email) ||
                  (selected && selected.message)
                ) && (
                  <pre className="bg-gray-900 p-4 rounded text-sm text-gray-200">
                    {JSON.stringify(selected, null, 2)}
                  </pre>
                )}
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------
   Small UI helpers
   ------------------------- */

function SidebarBtn({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${
        active ? "bg-[#00CFFF] text-black" : "hover:bg-gray-700"
      }`}
    >
      <span className="opacity-90">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function StatCard({
  label,
  value,
  color = "pink",
}: {
  label: string;
  value: number | string;
  color?: "pink" | "teal";
}) {
  const accent = color === "teal" ? "text-[#00CFFF]" : "text-[#FF4FA1]";
  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
      <div className="text-sm text-gray-400">{label}</div>
      <div className={`mt-2 text-2xl font-bold ${accent}`}>{value}</div>
    </div>
  );
}

function TableToolbar({
  placeholder,
  value,
  onChange,
  onClear,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="flex items-center bg-gray-800 rounded-lg border border-gray-700 px-3 py-2 w-full max-w-lg">
        <Search className="text-gray-400 mr-2" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent outline-none text-sm text-gray-200 w-full"
        />
        {value && (
          <button onClick={onClear} className="text-sm text-gray-400 ml-2">
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

function ReplyBox({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState("");
  return (
    <div>
      <textarea
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white"
        placeholder="Type reply (mock)"
      />
      <div className="flex justify-end gap-3 mt-3">
        <button
          onClick={() => setText("")}
          className="px-4 py-2 rounded bg-gray-700"
        >
          Clear
        </button>
        <button
          onClick={() => {
            onSend(text);
            setText("");
          }}
          className="px-4 py-2 rounded bg-[#00CFFF] text-black font-semibold"
        >
          Send Reply (mock)
        </button>
      </div>
    </div>
  );
}
