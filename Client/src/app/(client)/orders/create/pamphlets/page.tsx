'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useWalletStore } from "@/store/useWalletStore";
import { notify } from "@/utils/notifications";
import { sendWhatsApp, buildOrderMessage } from "@/utils/whatsapp";
import { ProductImageCarousel } from "@/components/orders/ProductImageCarousel";

// ── Mock Data ──────────────────────────────────────────────────────────────
const PAMPHLET_VARIANTS = [
    {
        id: "pamphlet-a5",
        name: "A5 Glossy Pamphlets",
        product_code: "PAM-A5-GLS",
        description: "Standard A5 size, 130 GSM glossy paper.",
        image_url: "/images/printing-services/pamplets.jpg",
        base_price: 2.5,
        discount_type: "percentage",
        discount_value: 10,
    },
    {
        id: "pamphlet-a4",
        name: "A4 Professional Brochures",
        product_code: "PAM-A4-PRO",
        description: "Standard A4 size, 170 GSM matte paper.",
        image_url: "/images/printing-services/pamplets.jpg",
        base_price: 5.0,
        discount_type: "fixed",
        discount_value: 0.5,
    }
];

export default function CreatePamphletOrder() {
    const { user } = useAuthStore();
    const { wallet, fetchWallet } = useWalletStore();

    useEffect(() => {
        fetchWallet()
    }, [fetchWallet])

    // ── State ──────────────────────────────────────────────────────────────────
    const [orderName, setOrderName] = useState("");
    const [selectedVariantId, setSelectedVariantId] = useState("");
    const [quantity, setQuantity] = useState(500);
    const [paperType, setPaperType] = useState("130 GSM Glossy");
    const [finishing, setFinishing] = useState("Standard");
    const [submitted, setSubmitted] = useState(false);
    
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [carouselIndex, setCarouselIndex] = useState(0);

    // Derive variant
    const variant = PAMPHLET_VARIANTS.find(v => v.id === selectedVariantId);

    // ── Pricing Logic ──────────────────────────────────────────────────────────
    const calculatePrice = () => {
        if (!variant) return { total: 0, discount: 0 };
        const subtotal = quantity * variant.base_price;
        
        let calculatedDiscount = 0;
        // @ts-ignore
        if (variant.discount_type === "percentage") {
            // @ts-ignore
            calculatedDiscount = (subtotal * variant.discount_value) / 100;
            // @ts-ignore
        } else if (variant.discount_type === "fixed") {
            // @ts-ignore
            calculatedDiscount = variant.discount_value * quantity;
        }

        return { total: subtotal, discount: calculatedDiscount };
    };

    const { total, discount } = calculatePrice();
    const amountPayable = total - discount;
    const isBalanceInsufficient = wallet ? wallet.availableBalance < amountPayable : true;
    const currentBalance = wallet?.availableBalance || 0;

    const handleVariantChange = (id: string) => {
        setSelectedVariantId(id);
        if (errors.selectedVariantId) setErrors((p) => ({ ...p, selectedVariantId: "" }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isBalanceInsufficient) {
            notify.error("Insufficient wallet balance. Please top up your wallet.");
            return;
        }

        if (!orderName.trim()) {
            setErrors(p => ({ ...p, orderName: "Order name is required" }));
            return;
        }
        if (!selectedVariantId) {
            setErrors(p => ({ ...p, selectedVariantId: "Please select a product" }));
            return;
        }

        const message = buildOrderMessage({
            clientId: user?.clientId || "N/A",
            orderName,
            service: `Pamphlet (${variant?.name})`,
            quantity,
            paperType: paperType,
            finishingOption: finishing,
        });

        setSubmitted(true);
        notify.whatsapp("Order placed! Admin will confirm via WhatsApp.");
        setTimeout(() => sendWhatsApp(message), 800);
    };

    const handleReset = () => {
        setSubmitted(false);
        setOrderName("");
        setSelectedVariantId("");
    };

    if (submitted) {
        return (
            <div className="max-w-[1200px] mx-auto px-4 py-12 text-center bg-white rounded-2xl border shadow p-12">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-xl font-extrabold text-slate-900 mb-2">Success!</h2>
                <p className="text-slate-500 text-sm mb-6">WhatsApp will open shortly for confirmation...</p>
                <button onClick={handleReset} className="px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-lg">New Order</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-[1200px] mx-auto">
                <h1 className="text-center text-lg font-extrabold text-gray-800 tracking-widest uppercase border-b border-green-500 pb-2 mb-6">
                    ADD PAMPHLET ORDER
                </h1>

                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    
                    {/* LEFT COLUMN */}
                    <div className="flex-1 min-w-0">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-0">
                            
                            {/* Order Name */}
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">ORDER NAME</label>
                                <input
                                    value={orderName}
                                    onChange={(e) => {
                                        setOrderName(e.target.value);
                                        if (errors.orderName) setErrors((p) => ({ ...p, orderName: "" }));
                                    }}
                                    placeholder="Customer name..."
                                    className={`w-full px-3 py-2.5 rounded border text-sm text-gray-800 bg-white outline-none transition ${
                                        errors.orderName ? "border-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    }`}
                                />
                                {errors.orderName && <p className="text-red-500 text-xs mt-1">{errors.orderName}</p>}
                            </div>

                            {/* Select Variant */}
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">SELECT PAMPHLET TYPE</label>
                                <select
                                    value={selectedVariantId}
                                    onChange={(e) => handleVariantChange(e.target.value)}
                                    className={`w-full px-3 py-2.5 rounded border text-sm text-gray-800 bg-white outline-none focus:border-blue-500 font-medium ${
                                        errors.selectedVariantId ? "border-red-500" : "border-gray-300"
                                    }`}
                                >
                                    <option value="">-- Choose variant --</option>
                                    {PAMPHLET_VARIANTS.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                </select>
                                {errors.selectedVariantId && <p className="text-red-500 text-xs mt-1">{errors.selectedVariantId}</p>}
                            </div>

                            {variant && (
                                <>
                                    {/* SELECT DETAIL */}
                                    <div className="border border-gray-300 rounded mb-4 overflow-hidden">
                                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
                                            <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">SELECT DETAIL</span>
                                        </div>
                                        <div className="px-4 py-4 flex flex-col gap-4 bg-white">
                                            {/* Quantity */}
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 w-48 min-w-[140px]">
                                                    <span className="text-blue-500 text-base">📦</span>
                                                    <label className="text-sm font-semibold text-blue-600">Quantity</label>
                                                </div>
                                                <div className="flex-1">
                                                    <input type="number" min={100} value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-full max-w-[100px] px-2 py-1.5 border border-gray-300 rounded text-sm text-center bg-gray-50 outline-none" />
                                                </div>
                                            </div>

                                            <hr className="border-gray-100 mt-2" />

                                            {/* Paper Type */}
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 w-48 min-w-[140px]">
                                                    <span className="text-blue-500 text-base">📄</span>
                                                    <label className="text-sm font-semibold text-blue-600">Paper Type</label>
                                                </div>
                                                <div className="flex-1">
                                                    <select value={paperType} onChange={e => setPaperType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50 outline-none">
                                                        <option value="130 GSM Glossy">130 GSM Glossy</option>
                                                        <option value="170 GSM Matte">170 GSM Matte</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <hr className="border-gray-100 mt-2" />

                                            {/* Finishing */}
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 w-48 min-w-[140px]">
                                                    <span className="text-blue-500 text-base">✨</span>
                                                    <label className="text-sm font-semibold text-blue-600">Extra Finishing</label>
                                                </div>
                                                <div className="flex-1">
                                                    <select value={finishing} onChange={e => setFinishing(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50 outline-none">
                                                        <option value="Standard">Standard (Fast Delivery)</option>
                                                        <option value="UV Coating">UV Coating (Bright Look)</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cost Breakdown */}
                                    <div className="border border-gray-300 rounded mb-4 bg-white shadow-sm overflow-hidden">
                                        <table className="w-full text-sm">
                                            <tbody>
                                                <tr className="border-b border-gray-100">
                                                    <td className="px-4 py-3 text-gray-500 font-medium italic">Applicable Cost</td>
                                                    <td className="px-4 py-3 text-right font-bold text-gray-700">Rs. {total.toLocaleString("en-IN")}/-</td>
                                                </tr>
                                                <tr className="border-b border-gray-100">
                                                    <td className={`px-4 py-3 font-medium italic ${discount > 0 ? "text-green-600" : "text-gray-400"}`}>Discount</td>
                                                    <td className={`px-4 py-3 text-right font-bold ${discount > 0 ? "text-green-600" : "text-gray-400"}`}>- Rs. {discount.toLocaleString("en-IN")}/-</td>
                                                </tr>
                                                <tr className="bg-green-50/20">
                                                    <td className="px-4 py-3 text-green-800 font-bold">Total Payable</td>
                                                    <td className="px-4 py-3 text-right font-black text-green-600 text-lg">Rs. {amountPayable.toLocaleString("en-IN")}/-</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Submit */}
                                    {isBalanceInsufficient && (
                                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between animate-pulse">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 text-red-700 text-[10px] font-black uppercase">
                                                    <span className="text-base">⚠️</span>
                                                    Insufficient Balance
                                                </div>
                                                <div className="text-[10px] text-red-600 font-medium ml-6">
                                                    Required: Rs. {amountPayable.toLocaleString()} | Available: Rs. {currentBalance.toLocaleString()}
                                                </div>
                                            </div>
                                            <Link 
                                                href="/wallet" 
                                                className="text-[10px] font-black bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors uppercase tracking-widest shadow-sm"
                                            >
                                                Topup
                                            </Link>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isBalanceInsufficient}
                                        className={`w-full py-4 text-white text-xs font-black tracking-widest uppercase rounded-xl border-b-4 transition-all ${
                                            isBalanceInsufficient 
                                            ? "bg-gray-400 border-gray-500 cursor-not-allowed opacity-80" 
                                            : "bg-green-600 border-green-800 hover:bg-green-700 active:scale-95"
                                        }`}
                                    >
                                        {isBalanceInsufficient ? "Insufficient Balance" : "PLACE PAMPHLET ORDER"}
                                    </button>
                                </>
                            )}
                        </form>
                    </div>

                    {/* RIGHT COLUMN */}
                    {variant && (
                        <div className="w-full lg:w-[450px] flex flex-col gap-6 flex-shrink-0">
                            <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-md">
                                <ProductImageCarousel images={[variant.image_url]} productCode={variant.product_code} activeIndex={carouselIndex} onDotClick={setCarouselIndex} />
                            </div>
                            <div className="w-full">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 shadow-sm text-left">
                                    <h3 className="text-black font-semibold text-lg mb-3">Service Details</h3>
                                    <ul className="space-y-1.5 text-sm text-gray-700 font-medium">
                                        <li><span className="text-gray-500 font-normal">● Code : </span><span className="font-bold text-gray-800">{variant.product_code}</span></li>
                                        <li><span className="text-gray-500 font-normal">● Name : </span><span className="font-bold text-gray-800">{variant.name}</span></li>
                                        <li><span className="text-gray-500 font-normal">● Material : </span><span className="font-bold text-gray-800">130/170 GSM Premium</span></li>
                                        <li><span className="text-gray-500 font-normal">● Production : </span><span className="font-bold text-gray-800">3-5 Working Days</span></li>
                                        <li><span className="text-gray-500 font-normal">● Base Price : </span><span className="font-bold text-blue-600">Rs. {variant.base_price}/-</span></li>
                                        {/* @ts-ignore */}
                                        {variant.discount_type && (
                                            <li>
                                                <span className="text-gray-500 font-normal">● Discount : </span>
                                                <span className="font-black text-green-600 animate-pulse">
                                                    {/* @ts-ignore */}
                                                    {variant.discount_type === "percentage" ? `${variant.discount_value}% OFF` : `Rs. ${variant.discount_value}/- OFF`}
                                                </span>
                                            </li>
                                        )}
                                    </ul>
                                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-[11px] text-green-800 leading-relaxed">
                                        <strong>Info:</strong> {variant.description}
                                        <br />
                                        ● High-speed offset printing for bulk orders.
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
