// File: components/HomeownerDashboard.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Home,
  List,
  BookOpen,
  User,
  CreditCard,
  MessageCircle,
  Settings,
  Eye,
  Trash2,
  Search,
  Edit3,
  Check,
  XCircle,
  Plus,
} from "lucide-react";

// Import mock data from separate file
import homeownerData, {
  PROPERTIES as MOCK_PROPERTIES,
  BOOKINGS as MOCK_BOOKINGS,
  PAYMENTS as MOCK_PAYMENTS,
  USER as MOCK_USER,
  HELP_RESOURCES as MOCK_HELP,
} from "@/constants/homeownerData";

type Property = (typeof MOCK_PROPERTIES)[number];
type Booking = (typeof MOCK_BOOKINGS)[number];
type PaymentMethod = (typeof MOCK_PAYMENTS)[number];

export default function HomeownerDashboard() {
  const router = useRouter();

  // role protection: mock
  useEffect(() => {
    try {
      const role = localStorage.getItem("role");
      if (role !== "homeowner") {
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

  // tabs
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "properties"
    | "bookings"
    | "payment"
    | "profile"
    | "support"
    | "settings"
  >("dashboard");

  // data (load from mock)
  const [properties, setProperties] = useState<Property[]>(
    () => MOCK_PROPERTIES
  );
  const [bookings, setBookings] = useState<Booking[]>(() => MOCK_BOOKINGS);
  const [payments, setPayments] = useState<PaymentMethod[]>(
    () => MOCK_PAYMENTS
  );
  const [user, setUser] = useState(() => MOCK_USER);
  const [helpResources] = useState(() => MOCK_HELP);

  // UI states
  const [selected, setSelected] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditingProperty, setIsEditingProperty] = useState(false);

  // search
  const [propQuery, setPropQuery] = useState("");
  const [bookingQuery, setBookingQuery] = useState("");
  const [paymentQuery, setPaymentQuery] = useState("");

  // derived
  const totalProperties = properties.length;
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((s, b) => s + (b.amount || 0), 0);

  // filtered lists
  const filteredProperties = useMemo(() => {
    const q = propQuery.toLowerCase().trim();
    if (!q) return properties;
    return properties.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.address.city.toLowerCase().includes(q) ||
        String(p.price).includes(q)
    );
  }, [propQuery, properties]);

  const filteredBookings = useMemo(() => {
    const q = bookingQuery.toLowerCase().trim();
    if (!q) return bookings;
    return bookings.filter(
      (b) =>
        b.propertyName.toLowerCase().includes(q) ||
        b.guestName.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        (b.status || "").toLowerCase().includes(q)
    );
  }, [bookingQuery, bookings]);

  const filteredPayments = useMemo(() => {
    const q = paymentQuery.toLowerCase().trim();
    if (!q) return payments;
    return payments.filter(
      (p) => p.brand.toLowerCase().includes(q) || p.last4.includes(q)
    );
  }, [paymentQuery, payments]);

  /* -------------------------
     Actions
  ------------------------- */

  const openView = (payload: any) => {
    setSelected(payload);
    setShowModal(true);
  };

  const confirmAndDeleteProperty = (id: string | number) => {
    if (!confirm("Delete property? This action cannot be undone.")) return;
    setProperties((prev) => prev.filter((p) => p.id !== id));
    // also remove bookings tied to it
    setBookings((prev) => prev.filter((b) => b.propertyId !== id));
  };

  const handleAddProperty = (payload: Partial<Property>) => {
    const newProp: Property = {
      id: `p-${Date.now()}`,
      name: payload.name || "New Property",
      address: payload.address || { city: "", state: "" },
      beds: payload.beds || 1,
      price: payload.price || 0,
      isActive: true,
      image: payload.image || "",
      host: user.name,
    } as Property;
    setProperties((p) => [newProp, ...p]);
  };

  const handleEditProperty = (
    id: string | number,
    updates: Partial<Property>
  ) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const handleBookingAction = (
    id: string | number,
    action: "confirm" | "cancel"
  ) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        return {
          ...b,
          status: action === "confirm" ? "confirmed" : "cancelled",
        };
      })
    );
  };

  const addPaymentMethod = (method: Partial<PaymentMethod>) => {
    const newMethod: PaymentMethod = {
      id: `pm-${Date.now()}`,
      brand: method.brand || "Card",
      last4: method.last4 || "0000",
      exp: method.exp || "01/30",
    } as PaymentMethod;
    setPayments((p) => [newMethod, ...p]);
  };

  const addPaymentHistory = (record: {
    id?: string;
    amount: number;
    date?: string;
    methodId?: string;
    note?: string;
  }) => {
    // add a booking-like payment record to bookings for mock history (or maintain separate history array)
    // For simplicity, push to bookings as a pseudo-record
    const newRec: Booking = {
      id: `pay-${Date.now()}`,
      propertyId: "",
      propertyName: "Manual Payment",
      guestName: user.name,
      duration: "—",
      amount: record.amount,
      status: "paid",
      startDate: record.date || new Date().toISOString().split("T")[0],
    } as unknown as Booking;
    setBookings((b) => [newRec, ...b]);
  };

  const updateProfile = (updates: Partial<typeof user>) => {
    setUser((u) => ({ ...u, ...updates }));
  };

  /* -------------------------
     Render
  ------------------------- */
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <button onClick={toggleSidebar} aria-label="toggle menu">
            {sidebarOpen ? <X /> : <Menu />}
          </button>
          <h1 className="text-lg font-bold text-[#00CFFF]">Homeowner Panel</h1>
        </div>
      </div>

      <div className="flex">
        <aside
          className={`fixed md:relative z-30 inset-y-0 left-0 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } transition-transform duration-200 w-64 bg-gray-800 border-r border-gray-700 p-6`}
        >
          <div className="hidden md:block mb-6">
            <h2 className="text-2xl font-bold text-[#00CFFF]">Homeowner</h2>
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
              label="Bookings"
              icon={<BookOpen size={16} />}
              active={activeTab === "bookings"}
              onClick={() => {
                setActiveTab("bookings");
                closeSidebar();
              }}
            />
            <SidebarBtn
              label="Payment"
              icon={<CreditCard size={16} />}
              active={activeTab === "payment"}
              onClick={() => {
                setActiveTab("payment");
                closeSidebar();
              }}
            />
            <SidebarBtn
              label="Profile"
              icon={<User size={16} />}
              active={activeTab === "profile"}
              onClick={() => {
                setActiveTab("profile");
                closeSidebar();
              }}
            />
            <SidebarBtn
              label="Support"
              icon={<MessageCircle size={16} />}
              active={activeTab === "support"}
              onClick={() => {
                setActiveTab("support");
                closeSidebar();
              }}
            />
            <SidebarBtn
              label="Settings"
              icon={<Settings size={16} />}
              active={activeTab === "settings"}
              onClick={() => {
                setActiveTab("settings");
                closeSidebar();
              }}
            />
          </nav>

          <div className="mt-8 text-sm text-gray-300">
            <div>Signed in as</div>
            <div className="mt-1 font-medium">{user.name}</div>
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

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className={`flex-1 transition-all duration-200 p-4 md:p-8`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {activeTab === "dashboard" && "Dashboard Overview"}
              {activeTab === "properties" && "Your Properties"}
              {activeTab === "bookings" && "Bookings"}
              {activeTab === "payment" && "Payments"}
              {activeTab === "profile" && "Personal Information"}
              {activeTab === "support" && "Support"}
              {activeTab === "settings" && "Settings"}
            </h2>
            <div className="hidden md:flex items-center gap-4 text-gray-300">
              <div>{user.email}</div>
            </div>
          </div>

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard
                  label="Properties"
                  value={totalProperties}
                  color="pink"
                />
                <StatCard label="Bookings" value={totalBookings} color="teal" />
                <StatCard
                  label="Revenue (Ghc)"
                  value={totalRevenue}
                  color="pink"
                />
                <StatCard
                  label="Payment Methods"
                  value={payments.length}
                  color="teal"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                  <h3 className="font-semibold mb-4">Your Properties</h3>
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
                  <h3 className="font-semibold mb-4">Recent Bookings</h3>
                  <div className="space-y-3">
                    {bookings.slice(0, 6).map((b) => (
                      <div key={b.id} className="p-3 bg-gray-900 rounded">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-semibold">
                              {b.propertyName}
                            </div>
                            <div className="text-xs text-gray-400">
                              {b.guestName} • {b.startDate}
                            </div>
                          </div>
                          <div className="text-sm text-gray-300">
                            {b.status}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-200">
                          Ghc {b.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* PROPERTIES */}
          {activeTab === "properties" && (
            <>
              <div className="mb-4 flex items-center justify-between">
                <TableToolbar
                  placeholder="Search properties by name, city or price..."
                  value={propQuery}
                  onChange={(v) => setPropQuery(v)}
                  onClear={() => setPropQuery("")}
                />
                <div className="ml-4">
                  <button
                    onClick={() => {
                      setIsEditingProperty(false);
                      setSelected(null);
                      setShowModal(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#00CFFF] text-black font-semibold"
                  >
                    <Plus size={16} /> Add Property
                  </button>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-auto">
                <table className="min-w-full text-sm text-left text-gray-300">
                  <thead className="bg-gray-700 text-gray-200 sticky top-0">
                    <tr>
                      <th className="px-4 py-3">Name</th>
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
                              onClick={() => {
                                setSelected(p);
                                setIsEditingProperty(true);
                                setShowModal(true);
                              }}
                              className="text-[#00CFFF]"
                              title="Edit"
                            >
                              <Edit3 />
                            </button>
                            <button
                              onClick={() => openView(p)}
                              className="text-gray-200"
                              title="View"
                            >
                              <Eye />
                            </button>
                            <button
                              onClick={() => confirmAndDeleteProperty(p.id)}
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
                          colSpan={6}
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

          {/* BOOKINGS */}
          {activeTab === "bookings" && (
            <>
              <TableToolbar
                placeholder="Search bookings by property, guest or id..."
                value={bookingQuery}
                onChange={(v) => setBookingQuery(v)}
                onClear={() => setBookingQuery("")}
              />

              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-auto">
                <table className="min-w-full text-sm text-left text-gray-300">
                  <thead className="bg-gray-700 text-gray-200 sticky top-0">
                    <tr>
                      <th className="px-4 py-3">Property</th>
                      <th className="px-4 py-3">Guest</th>
                      <th className="px-4 py-3">Duration</th>
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
                        <td className="px-4 py-3">{b.propertyName}</td>
                        <td className="px-4 py-3">{b.guestName}</td>
                        <td className="px-4 py-3">{b.duration}</td>
                        <td className="px-4 py-3">Ghc {b.amount}</td>
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
                              onClick={() =>
                                handleBookingAction(b.id, "cancel")
                              }
                              className="text-red-500"
                              title="Cancel"
                            >
                              <XCircle />
                            </button>
                            <button
                              onClick={() =>
                                handleBookingAction(b.id, "confirm")
                              }
                              className="text-green-400"
                              title="Confirm"
                            >
                              <Check />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredBookings.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
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

          {/* PAYMENT */}
          {activeTab === "payment" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-1 bg-gray-800 rounded-xl border border-gray-700 p-4">
                <h3 className="font-semibold mb-3">Payment Methods</h3>
                <TableToolbar
                  placeholder="Filter methods..."
                  value={paymentQuery}
                  onChange={(v) => setPaymentQuery(v)}
                  onClear={() => setPaymentQuery("")}
                />
                <div className="space-y-3 mt-3">
                  {filteredPayments.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 bg-gray-900 rounded flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold">
                          {p.brand} • ****{p.last4}
                        </div>
                        <div className="text-xs text-gray-400">
                          Exp: {p.exp}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {}}
                          className="text-[#00CFFF] text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            setPayments((prev) =>
                              prev.filter((m) => m.id !== p.id)
                            )
                          }
                          className="text-red-500 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredPayments.length === 0 && (
                    <div className="text-gray-400">No payment methods</div>
                  )}
                </div>
                <div className="mt-4">
                  <AddPaymentForm onAdd={(m) => addPaymentMethod(m)} />
                </div>
              </div>

              <div className="col-span-2 bg-gray-800 rounded-xl border border-gray-700 p-4">
                <h3 className="font-semibold mb-3">Payment History</h3>
                <div className="max-h-[56vh] overflow-auto space-y-3">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 rounded bg-gray-900 flex justify-between"
                    >
                      <div>
                        <div className="font-semibold">{b.propertyName}</div>
                        <div className="text-xs text-gray-400">
                          {b.guestName} • {b.startDate}
                        </div>
                      </div>
                      <div className="text-sm">Ghc {b.amount}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <AddPaymentHistory onAdd={(r) => addPaymentHistory(r)} />
                </div>
              </div>
            </div>
          )}

          {/* PROFILE */}
          {activeTab === "profile" && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 max-w-2xl">
              <h3 className="font-semibold mb-4">Personal Information</h3>
              <ProfileForm user={user} onSave={(u) => updateProfile(u)} />
            </div>
          )}

          {/* SUPPORT */}
          {activeTab === "support" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-2 bg-gray-800 rounded-xl border border-gray-700 p-4">
                <h3 className="font-semibold mb-3">Send a Message</h3>
                <SupportForm
                  onSend={(msg) => {
                    // mock: add to bookings as message or prompt an alert
                    alert("Message sent (mock): " + msg.substring(0, 80));
                  }}
                />

                <div className="mt-6">
                  <h4 className="font-semibold mb-2">
                    Recent Support Tickets (mock)
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-900 rounded">
                      No recent tickets (mock)
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-1 bg-gray-800 rounded-xl border border-gray-700 p-4">
                <h3 className="font-semibold mb-3">Help Resources</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  {helpResources.map((r: any) => (
                    <a
                      key={r.id}
                      href={r.link}
                      className="block hover:underline"
                    >
                      {r.title}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "settings" && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 max-w-2xl">
              <h3 className="font-semibold mb-4">Change Password</h3>
              <ChangePasswordForm
                onChange={(payload) => {
                  alert("Password changed (mock)");
                }}
              />
            </div>
          )}
        </main>
      </div>

      {/* VIEW / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-3xl w-full overflow-auto">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <h3 className="text-2xl font-bold text-[#00CFFF]">
                  {isEditingProperty
                    ? "Edit Property"
                    : selected
                    ? "Details"
                    : "Add Property"}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelected(null);
                  }}
                  className="text-gray-300"
                >
                  Close
                </button>
              </div>

              <div className="mt-4">
                {/* If adding / editing property show form */}
                {(isEditingProperty || !selected) && (
                  <PropertyForm
                    initial={isEditingProperty ? selected : undefined}
                    onSave={(vals) => {
                      if (isEditingProperty && selected) {
                        handleEditProperty(selected.id, vals);
                      } else {
                        handleAddProperty(vals as any);
                      }
                      setShowModal(false);
                      setSelected(null);
                    }}
                    onCancel={() => {
                      setShowModal(false);
                      setSelected(null);
                    }}
                  />
                )}

                {/* If viewing an entity */}
                {selected && !isEditingProperty && (
                  <div>
                    {selected.address && (
                      <div>
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
                                {selected.address.city},{" "}
                                {selected.address.state}
                              </div>
                              <div className="mt-2">Beds: {selected.beds}</div>
                              <div>Price: Ghc {selected.price}</div>
                              <div>
                                Status:{" "}
                                {selected.isActive ? "Active" : "Inactive"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selected && selected.message && (
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
                        </div>
                      </div>
                    )}

                    {/* fallback raw */}
                    {!selected.address && !selected.message && (
                      <pre className="bg-gray-900 p-4 rounded text-sm text-gray-200">
                        {JSON.stringify(selected, null, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelected(null);
                  }}
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
   Small UI helpers & subcomponents
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
    <div className="mb-4 flex items-center gap-3 w-full">
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

function AddPaymentForm({
  onAdd,
}: {
  onAdd: (m: Partial<PaymentMethod>) => void;
}) {
  const [brand, setBrand] = useState("");
  const [last4, setLast4] = useState("");
  const [exp, setExp] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!brand || !last4) return alert("Provide brand and last4");
        onAdd({ brand, last4, exp });
        setBrand("");
        setLast4("");
        setExp("");
      }}
    >
      <div className="space-y-2">
        <input
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="Brand (e.g., Visa)"
          className="w-full rounded bg-gray-900 p-2 text-sm outline-none"
        />
        <div className="flex gap-2">
          <input
            value={last4}
            onChange={(e) => setLast4(e.target.value)}
            placeholder="Last 4"
            className="w-1/2 rounded bg-gray-900 p-2 text-sm outline-none"
          />
          <input
            value={exp}
            onChange={(e) => setExp(e.target.value)}
            placeholder="MM/YY"
            className="w-1/2 rounded bg-gray-900 p-2 text-sm outline-none"
          />
        </div>
        <div className="flex justify-end">
          <button className="px-3 py-2 rounded bg-[#00CFFF] text-black text-sm">
            Add Method
          </button>
        </div>
      </div>
    </form>
  );
}

function AddPaymentHistory({
  onAdd,
}: {
  onAdd: (r: { amount: number; date?: string; methodId?: string }) => void;
}) {
  const [amount, setAmount] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const amt = Number(amount);
        if (!amt) return alert("Enter amount");
        onAdd({ amount: amt });
        setAmount("");
      }}
      className="mt-4"
    >
      <div className="flex gap-2">
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="flex-1 rounded bg-gray-900 p-2 text-sm outline-none"
        />
        <button className="px-3 py-2 rounded bg-[#FF4FA1]">Add</button>
      </div>
    </form>
  );
}

function PropertyForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: any;
  onSave: (vals: any) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [city, setCity] = useState(initial?.address?.city || "");
  const [state, setState] = useState(initial?.address?.state || "");
  const [beds, setBeds] = useState(initial?.beds || 1);
  const [price, setPrice] = useState(initial?.price || 0);
  const [image, setImage] = useState(initial?.image || "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ name, address: { city, state }, beds, price, image });
      }}
    >
      <div className="grid grid-cols-1 gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Property name"
          className="rounded bg-gray-900 p-2 text-sm outline-none"
        />
        <div className="flex gap-2">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            className="flex-1 rounded bg-gray-900 p-2 text-sm outline-none"
          />
          <input
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="State"
            className="w-1/3 rounded bg-gray-900 p-2 text-sm outline-none"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            value={beds}
            onChange={(e) => setBeds(Number(e.target.value))}
            placeholder="Beds"
            className="w-1/2 rounded bg-gray-900 p-2 text-sm outline-none"
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Price"
            className="flex-1 rounded bg-gray-900 p-2 text-sm outline-none"
          />
        </div>
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Image URL (optional)"
          className="rounded bg-gray-900 p-2 text-sm outline-none"
        />
        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 rounded bg-gray-700"
          >
            Cancel
          </button>
          <button className="px-3 py-2 rounded bg-[#00CFFF] text-black">
            Save
          </button>
        </div>
      </div>
    </form>
  );
}

function ProfileForm({
  user,
  onSave,
}: {
  user: any;
  onSave: (u: any) => void;
}) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || "");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ name, email, phone });
      }}
    >
      <div className="grid grid-cols-1 gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="rounded bg-gray-900 p-2 text-sm outline-none"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="rounded bg-gray-900 p-2 text-sm outline-none"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
          className="rounded bg-gray-900 p-2 text-sm outline-none"
        />
        <div className="flex justify-end gap-2 mt-2">
          <button
            type="submit"
            className="px-3 py-2 rounded bg-[#00CFFF] text-black"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}

function SupportForm({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState("");
  return (
    <div>
      <textarea
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe your issue..."
        className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white"
      />
      <div className="flex justify-end gap-3 mt-3">
        <button
          onClick={() => {
            setText("");
          }}
          className="px-4 py-2 rounded bg-gray-700"
        >
          Clear
        </button>
        <button
          onClick={() => {
            if (!text.trim()) return alert("Message cannot be empty");
            onSend(text.trim());
            setText("");
          }}
          className="px-4 py-2 rounded bg-[#00CFFF] text-black font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  );
}

function ChangePasswordForm({
  onChange,
}: {
  onChange: (payload: any) => void;
}) {
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (password !== confirm) return alert("Passwords do not match");
        onChange({ current, password });
        setCurrent("");
        setPassword("");
        setConfirm("");
      }}
    >
      <div className="grid grid-cols-1 gap-3 max-w-md">
        <input
          type="password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          placeholder="Current password"
          className="rounded bg-gray-900 p-2 text-sm outline-none"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          className="rounded bg-gray-900 p-2 text-sm outline-none"
        />
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm new password"
          className="rounded bg-gray-900 p-2 text-sm outline-none"
        />
        <div className="flex justify-end">
          <button className="px-3 py-2 rounded bg-[#00CFFF] text-black">
            Change password
          </button>
        </div>
      </div>
    </form>
  );
}

/* -------------------------
   End of component file
   ------------------------- */

// --------------------------------------------------------------------
// Below: mock data file contents. Save as: /data/homeownerData.ts
// --------------------------------------------------------------------

/*
  Place the code below in: /data/homeownerData.ts
  Import path used in the component: "@/data/homeownerData"
*/
