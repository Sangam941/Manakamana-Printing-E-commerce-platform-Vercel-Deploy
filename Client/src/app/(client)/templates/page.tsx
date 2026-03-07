"use client";

import { useState } from "react";
import { TEMPLATES, TEMPLATE_CATEGORIES } from "@/constants";
import { useAuthStore } from "@/store/authStore";
import { notify } from "@/utils/notifications";
import { sendWhatsApp, buildTemplateMessage, buildCustomDesignMessage } from "@/utils/whatsapp";
import { SERVICES } from "@/constants";

const categoryIcons: Record<string, string> = {
    "Visiting Cards": "🪪",
    "Letterheads": "📋",
    "Envelopes": "✉️",
    "ID Cards": "🎫",
    "Garment Tags": "🏷️",
};

export default function TemplatesPage() {
    const { user } = useAuthStore();
    const [activeCategory, setActiveCategory] = useState("All");
    const [customDesignType, setCustomDesignType] = useState("");

    const categories = ["All", ...TEMPLATE_CATEGORIES];
    const filtered = activeCategory === "All" ? TEMPLATES : TEMPLATES.filter((t) => t.category === activeCategory);

    const handleSendToAdmin = (template: typeof TEMPLATES[0]) => {
        const message = buildTemplateMessage({
            clientId: user?.clientId || "N/A",
            templateName: template.name,
            category: template.category,
        });
        notify.whatsapp("Design information prepared for WhatsApp confirmation.");
        setTimeout(() => sendWhatsApp(message), 800);
    };

    const handleCustomDesign = () => {
        if (!customDesignType) {
            notify.error("Please select a design type first.");
            return;
        }
        const message = buildCustomDesignMessage({
            clientId: user?.clientId || "N/A",
            designType: customDesignType,
        });
        notify.whatsapp("Custom design submission prepared for WhatsApp.");
        setTimeout(() => sendWhatsApp(message), 800);
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 lg:p-10">
            {/* Header */}
            <div className="text-center pb-2 mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Free Design Templates</h2>
                <div className="divider h-[4px] mt-3 rounded-full w-20 sm:w-28 md:w-32 bg-blue-500 my-4 mx-auto" />
                <p className="max-w-full md:max-w-1/2 text-center mx-auto text-[#64748b] text-[0.93rem] md:text-[0.875rem] mt-1.5">
                    We are happy to help with our curated collection of professional templates. Download and customize for your brand.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-[0.7rem] font-semibold tracking-[0.08em] text-[#94a3b8] uppercase">
                    <span>Home</span>
                    <span>/</span>
                    <span className="text-[#1a56db]">Free Design Templates</span>
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap mb-8 justify-center">
                {categories.map((cat) => {
                    const isActive = activeCategory === cat;
                    return (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-3 py-1 md:px-[1.125rem] md:py-[0.4rem] rounded-[50px] font-semibold text-[0.78rem] cursor-pointer transition-all duration-200 border-[1.5px] ${isActive ? 'border-transparent bg-gradient-to-r from-[#1a56db] to-[#2563eb] text-white' : 'border-[#e2e8f0] bg-white text-[#475569] hover:bg-gray-50'}`}
                        >
                            {cat}
                        </button>
                    )
                })}
            </div>

            {/* Template Grid — responsive */}
            <div
                className="
                    grid 
                    grid-cols-1
                    sm:grid-cols-2
                    md:grid-cols-3
                    lg:grid-cols-4
                    cursor-pointer
                    gap-4
                    sm:gap-5
                    mb-12
                    justify-center
                "
            >
                {filtered.map((template) => {
                    const getCategoryTheme = (category: string) => {
                        switch (category) {
                            case "Visiting Cards": return "bg-[#fde8e8]";
                            case "Letterheads": return "bg-[#e8f0fe]";
                            case "Envelopes": return "bg-[#fef3e8]";
                            case "ID Cards": return "bg-[#e8fdf0]";
                            case "Garment Tags": return "bg-[#fde8ff]";
                            default: return "bg-[#f1f5f9]";
                        }
                    };

                    return (
                        <div key={template.id} className="card overflow-hidden">
                            {/* Template preview */}
                            <div className={`h-[110px] sm:h-[130px] md:h-[140px] ${getCategoryTheme(template.category)} flex flex-col items-center justify-center gap-2 relative`}>
                                <span className="text-[2rem] sm:text-[2.2rem] md:text-[2.5rem]">{categoryIcons[template.category] || "📄"}</span>
                                <span className="text-[0.6rem] bg-black/[0.06] px-2 py-0.5 rounded font-semibold text-[#475569]">TEMPLATE</span>
                            </div>

                            <div className="p-2.5 sm:p-3.5">
                                <h3 className="font-bold text-[0.83rem] md:text-[0.8rem] text-[#0f172a] mb-1">{template.name}</h3>
                                <p className="text-[0.68rem] text-[#e91e8c] font-semibold mb-3">
                                    Free Design Available
                                </p>

                                <div className="flex gap-1.5 flex-col sm:flex-row">
                                    <button
                                        className="btn-primary flex-1 py-1.5 px-2 text-[0.7rem] md:text-[0.65rem] font-bold"
                                        onClick={() => notify.info("Template download started!")}
                                    >
                                        ⬇ Download
                                    </button>
                                    <button
                                        onClick={() => handleSendToAdmin(template)}
                                        className="flex-1 py-1.5 px-2 text-[0.7rem] md:text-[0.65rem] font-bold border-[1.5px] border-[#e91e8c] rounded-[6px] bg-white text-[#e91e8c] cursor-pointer hover:bg-[#fdf2f8] transition-colors"
                                    >
                                        💬 Admin
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Custom Design Submission */}
            <div className="bg-gradient-to-br from-[#f0f4ff] to-[#fde8ff] rounded-2xl p-4 sm:p-6 md:p-8 border border-[#c7d9fd] mb-4">
                <h2 className="font-extrabold text-[1.05rem] sm:text-[1.125rem] text-[#0f172a] mb-1.5">🎨 Submit Custom Design</h2>
                <p className="text-[#64748b] text-[0.82rem] mb-6 leading-[1.6] max-w-full md:max-w-[540px]">
                    Have your own design? Download a template, edit it in your design software, then send it to admin via WhatsApp for review.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-6">
                    {["⬇️ Download template", "✏️ Edit in design software", "💬 Send to admin"].map((step, i) => (
                        <div key={i} className="bg-white rounded-[10px] p-4 text-center border border-[#e2e8f0] mb-2 sm:mb-0">
                            <div className="font-bold text-[0.7rem] text-[#1a56db] tracking-[0.08em] mb-1.5 uppercase">STEP {i + 1}</div>
                            <div className="text-[0.82rem] font-semibold text-[#0f172a]">{step}</div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end flex-wrap">
                    <div className="form-group flex-1 min-w-[160px] sm:min-w-[200px]">
                        <label className="form-label">Design Type</label>
                        <select
                            value={customDesignType}
                            onChange={(e) => setCustomDesignType(e.target.value)}
                            className="form-input appearance-none"
                        >
                            <option value="">Select design type…</option>
                            {SERVICES.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                    </div>
                    <button
                        onClick={handleCustomDesign}
                        className="btn-primary py-3 px-4 sm:px-6 whitespace-nowrap w-full sm:w-auto"
                    >
                        💬 Send Design via WhatsApp
                    </button>
                </div>
            </div>
        </div>
    );
}
