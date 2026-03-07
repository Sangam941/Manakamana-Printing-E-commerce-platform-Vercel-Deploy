"use client";

import { useState, Suspense } from "react";
import { useAuthStore } from "@/store/authStore";
import { notify } from "@/utils/notifications";
import { sendWhatsApp, buildOrderMessage } from "@/utils/whatsapp";

const PRODUCTS = [
    "Metal Visiting Card (Premium)",
    "Standard Visiting Card",
    "Die-Cut Visiting Card",
];

const COLORS = [
    "1 Color (Silver/Gold)",
    "2 Colors",
    "Full Color UV",
];

const FINISHES = [
    "Matte Black Titanium",
    "Brushed Steel",
    "Mirror Gold",
];

const BASE_COST = 4500;
const GST_RATE = 0.18;

function CreateOrderForm() {
    const { user } = useAuthStore();
    const [form, setForm] = useState({
        orderName: "",
        product: PRODUCTS[0],
        quantity: "50",
        colorCount: COLORS[0],
        metalFinish: FINISHES[0],
        designSource: "Upload Online",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);

    const gstAmount = BASE_COST * GST_RATE;
    const payableAmount = BASE_COST + gstAmount;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.orderName.trim()) e.orderName = "Order name is required";
        const qty = Number(form.quantity);
        if (!form.quantity || isNaN(qty) || qty < 50) e.quantity = "Minimum quantity is 50";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        const message = buildOrderMessage({
            clientId: user?.clientId || "N/A",
            orderName: form.orderName,
            service: form.product,
            quantity: Number(form.quantity),
            paperType: form.metalFinish,
            finishingOption: form.colorCount,
        });
        setSubmitted(true);
        notify.whatsapp("Order details prepared. Please confirm with admin via WhatsApp.");
        setTimeout(() => sendWhatsApp(message), 800);
    };

    if (submitted) {
        return (
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-white rounded-2xl border border-slate-200 shadow-sm p-12">
                    <div className="text-5xl mb-4">✅</div>
                    <h2 className="text-xl font-extrabold text-slate-900 mb-2">Order Prepared!</h2>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-md mb-6">
                        Your order &quot;{form.orderName}&quot; has been prepared. WhatsApp will open to send your order to admin for confirmation.
                    </p>
                    <button
                        onClick={() => setSubmitted(false)}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1a56db] text-white text-sm font-semibold rounded-md hover:bg-[#1245b8] transition-colors"
                    >
                        Create Another Order
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
                {/* Page title */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-[1.75rem] font-extrabold text-slate-900 uppercase tracking-tight">
                        ADD ORDER
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Configure your premium metal visiting card order
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8 items-start">
                    {/* Left: Form */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    ORDER NAME
                                </label>
                                <input
                                    name="orderName"
                                    value={form.orderName}
                                    onChange={handleChange}
                                    placeholder="Enter a reference name for your order..."
                                    className={`w-full px-4 py-3 rounded-lg border text-sm text-slate-900 bg-slate-50 outline-none transition-colors ${errors.orderName ? "border-red-500" : "border-slate-200 focus:border-[#1a56db] focus:bg-white focus:ring-2 focus:ring-[#1a56db]/20"
                                        }`}
                                />
                                {errors.orderName && (
                                    <span className="text-red-500 text-xs mt-1 block">{errors.orderName}</span>
                                )}
                            </div>

                            <div>
                                <label className="block text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    SELECT PRODUCT
                                </label>
                                <select
                                    name="product"
                                    value={form.product}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 bg-slate-50 outline-none focus:border-[#1a56db] focus:bg-white focus:ring-2 focus:ring-[#1a56db]/20 appearance-none"
                                >
                                    {PRODUCTS.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                        QUANTITY <span className="normal-case font-normal text-slate-400">(min: 50)</span>
                                    </label>
                                    <input
                                        name="quantity"
                                        type="number"
                                        min={50}
                                        value={form.quantity}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-lg border text-sm text-slate-900 bg-slate-50 outline-none transition-colors ${errors.quantity ? "border-red-500" : "border-slate-200 focus:border-[#1a56db] focus:bg-white focus:ring-2 focus:ring-[#1a56db]/20"
                                            }`}
                                    />
                                    {errors.quantity && (
                                        <span className="text-red-500 text-xs mt-1 block">{errors.quantity}</span>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                        COLOR COUNT
                                    </label>
                                    <select
                                        name="colorCount"
                                        value={form.colorCount}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 bg-slate-50 outline-none focus:border-[#1a56db] focus:bg-white focus:ring-2 focus:ring-[#1a56db]/20 appearance-none"
                                    >
                                        {COLORS.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    METAL FINISH
                                </label>
                                <select
                                    name="metalFinish"
                                    value={form.metalFinish}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 bg-slate-50 outline-none focus:border-[#1a56db] focus:bg-white focus:ring-2 focus:ring-[#1a56db]/20 appearance-none"
                                >
                                    {FINISHES.map((f) => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider mb-3">
                                    DESIGN FILE SOURCE
                                </label>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-900">
                                        <input
                                            type="radio"
                                            name="designSource"
                                            checked={form.designSource === "Upload Online"}
                                            onChange={() => setForm((p) => ({ ...p, designSource: "Upload Online" }))}
                                            className="w-4 h-4 accent-[#1a56db]"
                                        />
                                        Upload Online
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-900">
                                        <input
                                            type="radio"
                                            name="designSource"
                                            checked={form.designSource === "Send via Email"}
                                            onChange={() => setForm((p) => ({ ...p, designSource: "Send via Email" }))}
                                            className="w-4 h-4 accent-[#1a56db]"
                                        />
                                        Send via Email
                                    </label>
                                </div>
                            </div>

                            <hr className="border-0 border-t border-slate-200 my-2" />

                            {/* Cost breakdown */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-slate-500">
                                    <span>Base Cost</span>
                                    <span className="font-semibold text-slate-900">Rs. {BASE_COST.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-500">
                                    <span>GST (18.00%)</span>
                                    <span className="font-semibold text-slate-900">Rs. {gstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                                    <span className="text-base font-extrabold text-slate-900">Payable Amount</span>
                                    <span className="text-lg font-extrabold text-[#1a56db]">Rs. {payableAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                                </div>
                                <p className="text-xs font-semibold text-emerald-600 text-center pt-1">
                                    Congratulations! Order is eligible for FREE premium delivery.
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 px-4 bg-[#1a56db] text-white text-base font-bold rounded-lg border-0 cursor-pointer flex items-center justify-center gap-2 hover:bg-[#1245b8] transition-colors mt-1"
                            >
                                💳 ADD ORDER (Pay from Wallet)
                            </button>
                        </form>
                    </div>

                    {/* Right: Product display + details */}
                    <div className="flex flex-col gap-6">
                        {/* Product visual - Pegasus style card */}
                        <div className="bg-slate-900 rounded-2xl overflow-hidden min-h-[320px] flex flex-col items-center justify-center relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950" />
                            <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center">
                                <div className="w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-4xl mb-4">
                                    ✨
                                </div>
                                <h2 className="text-white text-2xl font-extrabold tracking-[0.2em]">PEGASUS</h2>
                                <p className="text-white/50 text-xs tracking-[0.2em] uppercase mt-1">EXCLUSIVE PLATINUM EDITION</p>
                            </div>
                            <div className="absolute bottom-5 right-6 flex gap-1.5 z-10">
                                <span className="w-2 h-2 rounded-full bg-white" />
                                <span className="w-2 h-2 rounded-full bg-white/30" />
                                <span className="w-2 h-2 rounded-full bg-white/30" />
                            </div>
                        </div>

                        {/* Product Description + Specialization */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <h3 className="text-[0.7rem] font-extrabold text-[#1a56db] uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span>ℹ️</span> PRODUCT DESCRIPTION
                                </h3>
                                <div className="space-y-3 text-sm">
                                    {[
                                        ["Product Ref", "MC-V11th Edition"],
                                        ["Product Class", "Ultra Premium"],
                                        ["Material", "Stainless Steel Metal"],
                                        ["Thickness", "0.4 mm - 0.8 mm"],
                                        ["Production", "12-14 Business Days"],
                                    ].map(([k, v]) => (
                                        <div key={k} className="flex justify-between">
                                            <span className="text-slate-500">{k}:</span>
                                            <span className="font-semibold text-slate-900">{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <h3 className="text-[0.7rem] font-extrabold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span>☑️</span> OUR SPECIALIZATION
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex gap-3 items-start">
                                        <span className="text-[#1a56db] text-lg">🌍</span>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900">Pan-India Reach</div>
                                            <div className="text-xs text-slate-500 leading-snug">Fast & Reliable service across all major metro cities.</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-start">
                                        <span className="text-[#1a56db] text-lg">🎯</span>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900">Precision Engraving</div>
                                            <div className="text-xs text-slate-500 leading-snug">High-fidelity fiber laser technology for sharp details.</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-start">
                                        <span className="text-[#1a56db] text-lg">⭐</span>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900">B2B Exclusive</div>
                                            <div className="text-xs text-slate-500 leading-snug">Specialized for high-end corporate management.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Important Notes */}
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
                            <h3 className="text-sm font-extrabold text-amber-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span>⚠️</span> IMPORTANT NOTES
                            </h3>
                            <ul className="list-disc list-inside space-y-1.5 text-sm text-amber-900/90 leading-relaxed">
                                <li>Use high-resolution vector files (.PDF / .CDR / .AI)</li>
                                <li>Maintain font size above 10 pt for optimal legibility after laser etching.</li>
                                <li>Avoid full-background gradients; spot colors are manually applied.</li>
                                <li>This premium product is reserved for ROC-registered companies only.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CreateOrderPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[400px] flex items-center justify-center bg-slate-100">
                <p className="text-slate-500 font-medium">Loading…</p>
            </div>
        }>
            <CreateOrderForm />
        </Suspense>
    );
}
