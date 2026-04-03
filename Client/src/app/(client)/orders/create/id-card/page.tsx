"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { notify } from "@/utils/notifications";
import { sendWhatsApp, buildOrderMessage } from "@/utils/whatsapp";
import { ProductImageCarousel } from "@/components/orders/ProductImageCarousel";
import { verifyDesign } from "@/api/design";
import { useDesignStore } from "@/store/designStore";
import { useIDCardStore } from "@/store/useIDCardStore";
import { useWalletStore } from "@/store/useWalletStore";
import toast from "react-hot-toast";

// ── Mock Data ──────────────────────────────────────────────────────────────
// const ID_CARD_VARIANTS = [...];

export default function CreateIdCardOrder() {
    const { fetchAllDesigns } = useDesignStore();
    const { fetchProducts, products, createOrder } = useIDCardStore()
    const { wallet, fetchWallet, confirmWalletPayment } = useWalletStore();

    // ── State ──────────────────────────────────────────────────────────────────
    const [orderName, setOrderName] = useState("");
    const [selectedVariantId, setSelectedVariantId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [printingSide, setPrintingSide] = useState<"single" | "double">("single");
    const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
    const [photosLink, setPhotosLink] = useState("");
    const [strapColor, setStrapColor] = useState(""); // New: Strap Color
    const [strapText, setStrapText] = useState("");   // New: Strap Text
    const [specialRemark, setSpecialRemark] = useState("");
    const [submitted, setSubmitted] = useState(false);
    
    // Design code
    const [designCode, setDesignCode] = useState("");
    const [designVerifying, setDesignVerifying] = useState(false);
    const [designVerified, setDesignVerified] = useState(false);
    const [designImageUrl, setDesignImageUrl] = useState<string | null>(null);
    
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [carouselIndex, setCarouselIndex] = useState(0);

    // Derive variant
    const variant = products.find(v => v.id === selectedVariantId);

    useEffect(() => {
        fetchAllDesigns();
    }, [fetchAllDesigns]);

    useEffect(() => {
        fetchProducts()
        fetchWallet()
    }, [fetchProducts, fetchWallet])
    

    // ── Pricing Logic ──────────────────────────────────────────────────────────
    const calculatePrice = () => {
        if (!variant) return { total: 0, discount: 0 };
        const base = variant.base_price;
        const multiplier = printingSide === "double" ? 1.5 : 1.0;
        const subtotal = quantity * (base * multiplier);
        
        let calculatedDiscount = 0;
        if (variant.discount_type === "percentage") {
            calculatedDiscount = (subtotal * variant.discount_value) / 100;
        } else if (variant.discount_type === "fixed") {
            calculatedDiscount = variant.discount_value * quantity;
        }
        
        return { total: subtotal, discount: calculatedDiscount };
    };

    const { total, discount } = calculatePrice();
    const amountPayable = total - discount;
    const freeDelivery = amountPayable >= 1000;
    const isBalanceInsufficient = wallet ? wallet.availableBalance < amountPayable : true;
    const currentBalance = wallet?.availableBalance || 0;

    const handleVariantChange = (id: string) => {
        setSelectedVariantId(id);
        if (errors.selectedVariantId) setErrors((p) => ({ ...p, selectedVariantId: "" }));
    };

    const handleVerifyDesign = async () => {
        if (!designCode.trim()) return;
        setDesignVerifying(true);
        try {
            await verifyDesign(designCode);
            setDesignVerified(true);
            notify.success("Design verified!");
        } catch {
            notify.error("Invalid design code.");
        } finally {
            setDesignVerifying(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isBalanceInsufficient) {
            notify.error("Insufficient wallet balance. Please top up your wallet.");
            return;
        }

        if (!orderName.trim()) {
            setErrors(p => ({ ...p, orderName: "Order name is required" }));
            toast.error("Order name is required")
            return;
        }
        if (!selectedVariantId) {
            setErrors(p => ({ ...p, selectedVariantId: "Please select a product" }));
            toast.error("Please select a product")
            return;
        }
        // Validation for strap color/text if required
        if (!strapColor.trim()) {
            setErrors(p => ({ ...p, strapColor: "Strap color is required" }));
            toast.error("Strap color is required");
            return;
        }
        if (!strapText.trim()) {
            setErrors(p => ({ ...p, strapText: "Strap text is required" }));
            toast.error("Strap text is required");
            return;
        }

        // const message = buildOrderMessage({
        //     clientId: user?.clientId || "N/A",
        //     orderName,
        //     service: `ID Card (${variant?.name})`,
        //     quantity,
        //     paperType: `${printingSide.toUpperCase()} Side, ${orientation.toUpperCase()}`,
        //     finishingOption: designVerified ? `Design: ${designCode}` : "No design code",
        //     strapColor,
        //     strapText,
        // });
        const orderPayload = {
            idcardProductId: selectedVariantId,
            quantity: quantity,
            printing_side: printingSide,
            orientation: orientation,
            strap_color: strapColor,
            strap_text: strapText,
            notes: orderName, // or use another field if orderName is not appropriate for notes
        };
        try {
            const order = await createOrder(orderPayload);
            if (!order?.id) {
                notify.error("Order created but missing order ID. Please contact support.");
                return;
            }
            console.log(order.id);
            await confirmWalletPayment(order.id)
            setSubmitted(true);
            notify.whatsapp("Order placed! Admin will confirm via Dashboard.");
            // setTimeout(() => sendWhatsApp(message), 800);
        } catch (error) {
            // notify.error("Failed to place order. Please try again.");
        }
    };

    const handleReset = () => {
        setSubmitted(false);
        setQuantity(1)
        setOrderName("");
        setSelectedVariantId("");
        setDesignCode("");
        setDesignVerified(false);
        setStrapColor("");
        setStrapText("");
    };

    if (submitted) {
        return (
            <div className="max-w-[1200px] mx-auto px-4 py-12">
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-white rounded-2xl border shadow p-12">
                    <div className="text-5xl mb-4">✅</div>
                    <h2 className="text-xl font-extrabold text-slate-900 mb-2">Order Placed!</h2>
                    <p className="text-slate-500 text-sm max-w-md mb-6">
                        Your order &quot;{orderName}&quot; has been submitted. WhatsApp will open to confirm with the admin.
                    </p>
                    <button onClick={handleReset} className="px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                        Create Another Order
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-[1200px] mx-auto px-4 py-8">

                <h1 className="text-center text-lg font-extrabold text-gray-800 tracking-widest uppercase border-b border-red-500 pb-2 mb-6">
                    ADD ID CARD ORDER
                </h1>

                <div className="flex flex-col lg:flex-row gap-6 items-start">

                    {/* LEFT COLUMN: Form */}
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
                                    placeholder="Customer name for easy tracking..."
                                    className={`w-full px-3 py-2.5 rounded border text-sm text-gray-800 bg-white outline-none transition ${
                                        errors.orderName ? "border-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    }`}
                                />
                                {errors.orderName && <p className="text-red-500 text-xs mt-1">{errors.orderName}</p>}
                            </div>

                            {/* Select Variant */}
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">SELECT ID CARD TYPE</label>
                                <select
                                    value={selectedVariantId}
                                    onChange={(e) => handleVariantChange(e.target.value)}
                                    className={`w-full px-3 py-2.5 rounded border text-sm text-gray-800 bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium ${
                                        errors.selectedVariantId ? "border-red-500" : "border-gray-300"
                                    }`}
                                >
                                    <option value="">-- Choose a Product --</option>
                                    {products.map((p) => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
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
                                                    <span className="text-blue-500 text-base">🔢</span>
                                                    <label className="text-sm font-semibold text-blue-600">Quantity</label>
                                                </div>
                                                <div className="flex-1">
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        value={quantity}
                                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                                        className="w-full max-w-[100px] px-2 py-1.5 border border-gray-300 rounded text-sm text-center bg-gray-50 focus:bg-white focus:border-blue-500 outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <hr className="border-gray-100 mt-2" />

                                            {/* Printing Side */}
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 w-48 min-w-[140px]">
                                                    <span className="text-blue-500 text-base">🖨️</span>
                                                    <label className="text-sm font-semibold text-blue-600">Printing Side</label>
                                                </div>
                                                <div className="flex-1">
                                                    <select
                                                        value={printingSide}
                                                        onChange={(e) =>
                                                            setPrintingSide(e.target.value as "single" | "double")
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-800 bg-gray-50 outline-none"
                                                    >
                                                        <option value={'single'}>Single Side</option>
                                                        <option value={'double'}>Double Side (+50%)</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <hr className="border-gray-100 mt-2" />

                                            {/* Orientation */}
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 w-48 min-w-[140px]">
                                                    <span className="text-blue-500 text-base">📐</span>
                                                    <label className="text-sm font-semibold text-blue-600">Orientation</label>
                                                </div>
                                                <div className="flex-1">
                                                    <select
                                                        value={orientation}
                                                        onChange={(e) =>
                                                            setOrientation(
                                                                e.target.value as "portrait" | "landscape"
                                                            )
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-800 bg-gray-50 outline-none"
                                                    >
                                                        <option value="portrait">Portrait</option>
                                                        <option value="landscape">Landscape</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <hr className="border-gray-100 mt-2" />

                                            {/* Photos Link */}
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 w-48 min-w-[140px]">
                                                    <span className="text-blue-500 text-base">🔗</span>
                                                    <label className="text-sm font-semibold text-blue-600">Photos Link</label>
                                                </div>
                                                <div className="flex-1">
                                                    <input
                                                        type="text"
                                                        value={photosLink}
                                                        onChange={(e) => setPhotosLink(e.target.value)}
                                                        placeholder="Google Drive/Dropbox link..."
                                                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50 outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <hr className="border-gray-100 mt-2" />

                                            {/* Strap Color */}
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 w-48 min-w-[140px]">
                                                    <span className="text-blue-500 text-base">🎨</span>
                                                    <label className="text-sm font-semibold text-blue-600">Strap Color</label>
                                                </div>
                                                <div className="flex-1">
                                                    <select
                                                        value={strapColor}
                                                        onChange={(e) => setStrapColor(e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-800 bg-gray-50 outline-none"
                                                    >
                                                        <option value="">Select Color</option>
                                                        <option value="blue">Blue</option>
                                                        <option value="black">Black</option>
                                                        <option value="red">Red</option>
                                                        <option value="yellow">Yellow</option>
                                                        <option  value="white">White</option>
                                                        <option value="green">Green</option>
                                                        <option value="custom">Custom</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Strap Text */}
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 w-48 min-w-[140px]">
                                                    <span className="text-blue-500 text-base">🔤</span>
                                                    <label className="text-sm font-semibold text-blue-600">Strap Text</label>
                                                </div>
                                                <div className="flex-1">
                                                    <input
                                                        type="text"
                                                        value={strapText}
                                                        onChange={(e) => setStrapText(e.target.value)}
                                                        placeholder="E.g. COMPANY NAME / SCHOOL NAME"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Free Delivery Banner */}
                                    {freeDelivery && (
                                        <div className="bg-white border border-gray-300 rounded px-4 py-3 mb-4 shadow-sm">
                                            <p className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                                                🎉 CONGRATULATIONS! ORDER&apos;S ELIGIBLE FOR FREE DELIVERY
                                            </p>
                                        </div>
                                    )}

                                    {/* USE APPROVED DESIGN CODE */}
                                    <div className="border border-gray-300 rounded mb-4 overflow-hidden shadow-sm">
                                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-300 flex items-center justify-between">
                                            <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Use Approved Design Code</span>
                                            <span className="text-[10px] text-gray-400 font-medium italic">Optional</span>
                                        </div>
                                        <div className="px-4 py-4 bg-white">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={designCode}
                                                    onChange={(e) => {
                                                        setDesignCode(e.target.value);
                                                        setDesignVerified(false);
                                                    }}
                                                    placeholder="e.g. DES-2024..."
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50 outline-none font-mono tracking-wide"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleVerifyDesign}
                                                    disabled={designVerifying || !designCode.trim()}
                                                    className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700"
                                                >
                                                    {designVerifying ? "Verifying..." : "Verify Code"}
                                                </button>
                                            </div>
                                            {designVerified && (
                                                <div className="mt-4 border border-green-200 rounded-lg bg-green-50 p-3 flex flex-col gap-2">
                                                    <p className="text-[10px] font-bold text-green-700">✅ Design Approved: <span className="font-mono">{designCode}</span></p>
                                                    {designImageUrl && <img src={designImageUrl} alt="Preview" className="w-full max-h-48 object-contain rounded border" />}
                                                </div>
                                            )}
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
                                                <tr className="bg-blue-50/30">
                                                    <td className="px-4 py-3 text-blue-800 font-bold">Amount Payable</td>
                                                    <td className="px-4 py-3 text-right font-black text-blue-600 text-lg">Rs. {amountPayable.toLocaleString("en-IN")}/-</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Special Remark */}
                                    <div className="mb-4">
                                        <div className="flex items-start border border-gray-300 rounded overflow-hidden">
                                            <div className="bg-gray-50 px-3 py-3 border-r border-gray-300 min-w-[130px] text-xs font-semibold uppercase text-gray-600">Special Remark</div>
                                            <textarea
                                                value={specialRemark}
                                                onChange={(e) => setSpecialRemark(e.target.value)}
                                                placeholder="Any extra instructions..."
                                                rows={2}
                                                className="flex-1 px-4 py-3 text-sm text-gray-800 outline-none bg-white"
                                            />
                                        </div>
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
                                                href="/wallet/top-up" 
                                                className="text-[10px] font-black bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors uppercase tracking-widest shadow-sm"
                                            >
                                                Topup
                                            </Link>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isBalanceInsufficient}
                                        className={`w-full py-4 px-4 text-white text-xs font-black tracking-widest uppercase rounded-xl border-b-4 transition-all ${
                                            isBalanceInsufficient 
                                            ? "bg-gray-400 border-gray-500 cursor-not-allowed opacity-80" 
                                            : "bg-blue-600 border-blue-900 hover:bg-blue-700 active:scale-95"
                                        }`}
                                    >
                                        {isBalanceInsufficient ? "Balance Too Low" : "Place Order & Pay from Wallet"}
                                    </button>
                                </>
                            )}
                        </form>
                    </div>

                    {/* RIGHT COLUMN: Info */}
                    {variant && (
                        <div className="w-full lg:w-[450px] flex flex-col gap-6 flex-shrink-0">
                            <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-md">
                                <ProductImageCarousel
                                    images={[variant.image_url]}
                                    productCode={variant.product_code}
                                    activeIndex={carouselIndex}
                                    onDotClick={setCarouselIndex}
                                />
                            </div>
                            <div className="w-full">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 shadow-sm">
                                    <h3 className="text-black font-semibold text-lg mb-3">Product Description</h3>
                                    <ul className="space-y-1.5 text-sm text-gray-700 font-medium">
                                        <li><span className="text-gray-500 font-normal">● Product Code : </span><span className="font-bold text-gray-800">{variant.product_code}</span></li>
                                        <li><span className="text-gray-500 font-normal">● Name : </span><span className="font-bold text-gray-800">{variant.name}</span></li>
                                        <li><span className="text-gray-500 font-normal">● Material : </span><span className="font-bold text-gray-800">Best Binding Quality</span></li>
                                        <li><span className="text-gray-500 font-normal">● Production : </span><span className="font-bold text-gray-800">5-7 Working Days</span></li>
                                        <li><span className="text-gray-500 font-normal">● Base Price : </span><span className="font-bold text-blue-600">Rs. {variant.base_price}/-</span></li>
                                        {variant.discount_type ? (
                                            <li>
                                                <span className="text-gray-500 font-normal">● Discount : </span>
                                                <span className="font-black text-green-600 animate-pulse">
                                                    {variant.discount_type === "percentage"
                                                        ? `${variant.discount_value}% OFF`
                                                        : `Rs. ${variant.discount_value}/- OFF`}
                                                </span>
                                            </li>
                                        ) : (
                                            <li>
                                                <span className="text-gray-500 font-normal">● Discount : </span>
                                                <span className="font-black text-slate-400">
                                                    None
                                                </span>
                                            </li>
                                        )}
                                    </ul>
                                    <div className="mt-4 border-t border-blue-100 pt-3">
                                        <h4 className="text-xs font-bold text-blue-800 uppercase mb-1">Important Note</h4>
                                        <p className="text-[11px] text-blue-600 italic leading-relaxed">
                                            ● Both Side Printing Available Only 100 GSM Deo Paper. Please mention serial number in file.
                                            <br />
                                            ● &quot;{variant.description}&quot;
                                        </p>
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
