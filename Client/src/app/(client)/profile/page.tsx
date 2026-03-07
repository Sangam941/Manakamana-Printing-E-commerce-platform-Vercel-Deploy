"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { notify } from "@/utils/notifications";

export default function ProfilePage() {
    const { user } = useAuthStore();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        companyName: user?.companyName || "",
        contactPerson: user?.contactPerson || "",
        email: user?.email || "",
        phone: "9800000000",
        address: "Kathmandu, Nepal",
    });

    const handleSave = () => {
        setEditing(false);
        notify.success("Profile updated successfully!");
    };

    return (
        <div className="max-w-5xl mx-auto px-3 sm:px-6 py-8 sm:py-12">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-xl max-sm:text-center sm:text-2xl font-extrabold text-[#0f172a]">My Profile</h1>
                <p className="text-[#64748b] max-sm:text-center text-sm sm:text-base mt-1">View and manage your company account details.</p>
            </div>

            {/* Grid for profile card and form */}
            <div className="flex flex-col gap-7 max-sm:items-center md:grid md:grid-cols-[320px_1fr] md:gap-7 items-start">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-5 md:mb-0">
                    <div className="gradient-card p-8 sm:p-10 text-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 text-2xl sm:text-3xl text-white font-extrabold border-[3px] border-white/40">
                            {user?.contactPerson?.[0] || "C"}
                        </div>
                        <h2 className="text-white font-extrabold text-base sm:text-lg tracking-wide">{user?.companyName}</h2>
                        <p className="text-white/75 text-xs sm:text-sm mt-1">{user?.email}</p>
                    </div>
                    <div className="p-5 sm:p-6">
                        <div className="flex flex-col gap-3">
                            <div className="p-3 bg-[#f0f4ff] rounded-[10px] border border-[#c7d9fd]">
                                <div className="text-[0.65rem] font-bold text-[#4361ee] tracking-wider uppercase mb-1">Client ID</div>
                                <div className="text-lg font-extrabold text-[#0f172a] tracking-wide">{user?.clientId}</div>
                            </div>
                            <div>
                                <div className="text-xs text-[#94a3b8] mb-1">Account Status</div>
                                <span className="badge bg-[#dcfce7] text-[#16a34a]">● Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Form */}
                <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 sm:p-7 w-full">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                        <h2 className="font-bold text-base sm:text-lg text-[#0f172a]">Company Details</h2>
                        <button
                            onClick={() => editing ? handleSave() : setEditing(true)}
                            className={`
                                ${editing ? "btn-primary" : "btn-outline-dark"}
                                py-2 px-5 text-sm transition
                            `}
                        >
                            {editing ? "💾 Save Changes" : "✏️ Edit"}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {[
                            { label: "Company Name", name: "companyName" },
                            { label: "Contact Person", name: "contactPerson" },
                            { label: "Email Address", name: "email" },
                            { label: "Phone Number", name: "phone" },
                        ].map(({ label, name }) => (
                            <div key={name} className="form-group flex flex-col">
                                <label className="form-label mb-1">{label}</label>
                                <input
                                    className={`
                                        form-input
                                        focus:ring-2 focus:ring-[#1a56db] focus:border-[#1a56db] outline-none
                                        ${editing ? "bg-[#f8fafc] cursor-text" : "bg-[#f1f5f9] cursor-not-allowed"}
                                        text-sm
                                    `}
                                    value={form[name as keyof typeof form]}
                                    onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))}
                                    disabled={!editing}
                                />
                            </div>
                        ))}
                        <div className="form-group col-span-1 sm:col-span-2 flex flex-col">
                            <label className="form-label mb-1">Business Address</label>
                            <input
                                className={`
                                    form-input
                                    focus:ring-2 focus:ring-[#1a56db] focus:border-[#1a56db] outline-none
                                    ${editing ? "bg-[#f8fafc] cursor-text" : "bg-[#f1f5f9] cursor-not-allowed"}
                                    text-sm
                                `}
                                value={form.address}
                                onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                                disabled={!editing}
                            />
                        </div>
                    </div>

                    {/* Contact Admin */}
                    <div className="mt-7 p-4 sm:p-5 bg-[#f8fafc] rounded-[10px] border border-[#e2e8f0]">
                        <h3 className="font-bold text-sm sm:text-base text-[#0f172a] mb-2">Need to change your password?</h3>
                        <p className="text-[#64748b] text-xs sm:text-sm leading-relaxed">
                            Passwords are managed by admin. Please contact us via WhatsApp to reset your Client ID or password.
                        </p>
                        <button
                            onClick={() =>
                                window.open(
                                    `https://wa.me/97798XXXXXXXX?text=Hello%20Admin%2C%20I%20need%20help%20with%20my%20account%20%28Client%20ID%3A%20${user?.clientId}%29`,
                                    "_blank"
                                )
                            }
                            className="mt-4 py-2 px-5 bg-[#25D366] text-white border-none rounded-lg font-bold text-sm cursor-pointer hover:bg-[#20bd5a] transition-colors"
                        >
                            💬 Contact Admin on WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
