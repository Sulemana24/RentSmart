"use client";

import { useState } from "react";
import { FiHelpCircle, FiSettings, FiCheckCircle, FiShield, FiAlertTriangle, FiMail, FiPhone, FiLock } from "react-icons/fi";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import toast from "react-hot-toast";

interface SettingsProps {
  section: string;
}

const Settings: React.FC<SettingsProps> = ({ section }) => {
  // Modal States
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isGenericModalOpen, setIsGenericModalOpen] = useState(false);
  const [genericModalContent, setGenericModalContent] = useState({ title: "", desc: "" });
  
  const [isSaving, setIsSaving] = useState(false);

  // Form States
  const [ticketForm, setTicketForm] = useState({ subject: "", category: "General", description: "" });
  const [passForm, setPassForm] = useState({ current: "", new: "" });

  const handleTicketSubmit = () => {
    if (!ticketForm.subject.trim() || !ticketForm.description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Support ticket TKT-005 generated successfully!");
    setIsTicketModalOpen(false);
    setTicketForm({ subject: "", category: "General", description: "" });
  };

  const handlePasswordChange = () => {
    if (!passForm.current || !passForm.new) {
      toast.error("Please fill in password fields");
      return;
    }
    toast.success("Security credentials updated");
    setIsPasswordModalOpen(false);
    setPassForm({ current: "", new: "" });
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    setTimeout(() => {
      toast.success("Profile configurations updated");
      setIsSaving(false);
    }, 1000);
  };

  const openInfoModal = (title: string, desc: string) => {
    setGenericModalContent({ title, desc });
    setIsGenericModalOpen(true);
  };

  const isSupport = section === "support";

  // Shared Modal Wrapper to keep code clean
  const ModalWrapper = ({ isOpen, onClose, title, children }: any) => (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
            <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-lg w-full shadow-2xl border border-gray-100 dark:border-gray-700">
              <Dialog.Title className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">{title}</Dialog.Title>
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );

  if (isSupport) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Support Center</h2>
            <span className="flex items-center gap-1 text-[10px] font-bold bg-green-500/10 text-green-500 px-2 py-1 rounded-md uppercase">
              <FiCheckCircle /> System Online
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              { title: "Create Support Ticket", description: "Report issues or request assistance", action: "Create Ticket", onClick: () => setIsTicketModalOpen(true) },
              { title: "View Open Tickets", description: "Check status of existing tickets", action: "View Tickets", onClick: () => openInfoModal("Ticket History", "Accessing encrypted ticket logs for University Hostel Complex...") },
              { title: "FAQs", description: "Find answers to common questions", action: "Browse FAQs", onClick: () => openInfoModal("Knowledge Base", "The FAQ database is currently being indexed for the 2026 semester.") },
              { title: "Contact Support", description: "Get in touch with our team", action: "Contact Now", onClick: () => toast("Support line: +233 24 000 0000", { icon: '📞' }) },
            ].map((item, index) => (
              <div key={index} className="group border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-[#00CFFF]/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all cursor-default">
                <div className="text-3xl text-[#00CFFF] mb-4 transition-transform group-hover:scale-110"><FiHelpCircle /></div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">{item.description}</p>
                <button onClick={item.onClick} className="w-full md:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-[#00CFFF] hover:text-white hover:border-[#00CFFF] transition-all font-medium">
                  {item.action}
                </button>
              </div>
            ))}
          </div>

          {/* Ticket List - Clickable Items */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Support Tickets</h3>
            <div className="space-y-3">
              {[
                { id: "TKT-001", subject: "Plumbing Issue - Room 103", status: "In Progress", date: "2024-03-10" },
                { id: "TKT-002", subject: "Electrical Problem - Common Area", status: "Resolved", date: "2024-03-08" },
              ].map((ticket, index) => (
                <div key={index} onClick={() => openInfoModal(ticket.id, `Status update for ${ticket.subject}: Currently ${ticket.status}.`)} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl border border-transparent hover:border-gray-100 dark:hover:border-gray-600 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400"><FiSettings /></div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white tracking-tight">{ticket.subject}</div>
                      <div className="text-xs text-gray-500 font-medium">{ticket.id} • {ticket.date}</div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${ticket.status === "Resolved" ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"}`}>
                    {ticket.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ticket Modal */}
        <ModalWrapper isOpen={isTicketModalOpen} onClose={() => setIsTicketModalOpen(false)} title="New Ticket">
          <div className="space-y-4 mt-4">
            <input type="text" placeholder="Subject" value={ticketForm.subject} onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none" />
            <select value={ticketForm.category} onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none">
              <option>General</option><option>Maintenance</option><option>Financial</option>
            </select>
            <textarea placeholder="Description" rows={4} value={ticketForm.description} onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none" />
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setIsTicketModalOpen(false)} className="px-6 py-2 font-bold text-gray-400">Discard</button>
              <button onClick={handleTicketSubmit} className="px-8 py-3 bg-[#00CFFF] text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-[#00CFFF]/20">Submit Dispatch</button>
            </div>
          </div>
        </ModalWrapper>

        {/* Generic Info Modal */}
        <ModalWrapper isOpen={isGenericModalOpen} onClose={() => setIsGenericModalOpen(false)} title={genericModalContent.title}>
          <p className="text-gray-600 dark:text-gray-400 my-6 font-medium leading-relaxed">{genericModalContent.desc}</p>
          <div className="flex justify-end"><button onClick={() => setIsGenericModalOpen(false)} className="px-8 py-3 bg-gray-900 dark:bg-white dark:text-black text-white rounded-xl font-black uppercase text-xs tracking-widest">Close</button></div>
        </ModalWrapper>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h2>
        <div className="space-y-8">
          {/* Profile Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><FiShield className="text-[#00CFFF]" /> Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["Hostel Name", "Manager Name", "Email Address", "Phone Number"].map((label, i) => (
                <div key={i}>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">{label}</label>
                  <div className="relative">
                    {label.includes("Email") ? <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /> : label.includes("Phone") ? <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /> : null}
                    <input type="text" defaultValue={["University Hostel Complex", "Mr. Samuel Asante", "hostel@university.edu.gh", "+233 24 123 4567"][i]} className={`w-full ${i > 1 ? 'pl-11' : 'px-4'} py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none font-bold text-sm`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Deactivate */}
          <div className="pt-6 border-t dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security & Maintenance</h3>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => setIsPasswordModalOpen(true)} className="px-6 py-3 border border-gray-200 dark:border-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2"><FiLock /> Change Password</button>
              <button onClick={() => setIsDeactivateModalOpen(true)} className="px-6 py-3 border border-red-200 text-red-500 rounded-xl font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/10 transition-all flex items-center gap-2"><FiAlertTriangle /> Deactivate Account</button>
            </div>
          </div>

          {/* Save/Cancel Footer */}
          <div className="flex justify-end gap-3 pt-6 border-t dark:border-gray-700">
            <button onClick={() => toast("Changes discarded")} className="px-6 py-3 font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Cancel</button>
            <button onClick={handleSaveChanges} disabled={isSaving} className="px-8 py-3 bg-[#00CFFF] text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-xl shadow-[#00CFFF]/20 transition-all">{isSaving ? "Saving..." : "Push Changes"}</button>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      <ModalWrapper isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} title="Update Password">
        <div className="space-y-4 mt-4">
          <input type="password" placeholder="Current Password" value={passForm.current} onChange={(e) => setPassForm({ ...passForm, current: e.target.value })} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none" />
          <input type="password" placeholder="New Password" value={passForm.new} onChange={(e) => setPassForm({ ...passForm, new: e.target.value })} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none" />
          <button onClick={handlePasswordChange} className="w-full py-4 bg-gray-900 dark:bg-white dark:text-black text-white rounded-xl font-black uppercase text-xs tracking-widest mt-2">Update Credentials</button>
        </div>
      </ModalWrapper>

      {/* Deactivate Modal */}
      <ModalWrapper isOpen={isDeactivateModalOpen} onClose={() => setIsDeactivateModalOpen(false)} title="Danger Zone">
        <p className="text-gray-600 dark:text-gray-400 my-6 font-medium leading-relaxed italic">Are you sure you want to deactivate the University Hostel Complex management profile? This action is immediate.</p>
        <div className="flex flex-col gap-3">
          <button onClick={() => { toast.error("Account deactivation requested"); setIsDeactivateModalOpen(false); }} className="w-full py-4 bg-red-500 text-white rounded-xl font-black uppercase text-xs tracking-widest">Confirm Deactivation</button>
          <button onClick={() => setIsDeactivateModalOpen(false)} className="w-full py-4 border border-gray-200 dark:border-gray-600 text-gray-500 rounded-xl font-black uppercase text-xs tracking-widest">Nevermind</button>
        </div>
      </ModalWrapper>
    </div>
  );
};

export default Settings;