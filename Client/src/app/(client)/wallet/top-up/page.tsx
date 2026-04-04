"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { notify } from "@/utils/notifications";
import { FaBuilding, FaRegCreditCard, FaUser, FaBuilding as FaBranch, FaUpload, FaMoneyBillWave } from "react-icons/fa";
import { useWalletStore } from "@/store/useWalletStore";

// const DUMMY_BANK_DETAILS = {
//     companyName: "Manakamana Printing",
//     bankName: "NIC ASIA",
//     accountName: "Manakamana Printing",
//     accountNumber: "1234567890",
//     branch: "Main Branch",
//     paymentId: null,
//     qrImageUrl: null,
//     note: "Please transfer the exact amount and include the Transfer Reference.",
//     isActive: true,
// };

const PAYMENT_METHODS = [
    { value: "BANK_TRANSFER", label: "Bank Transfer" },
    // Future payment methods can easily be added here
    // Example: { value: "esewa", label: "eSewa" }
];

export default function TopUpPage() {
    const { submitTopup, fetchPaymentDetails, paymentDetails } = useWalletStore()
    const [amount, setAmount] = useState("");
    const [reference, setReference] = useState("");
    const [note, setNote] = useState("");
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].value);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!paymentMethod) {
            notify.error("Please select a payment method");
            return;
        }
        if (!amount || Number(amount) <= 0) {
            notify.error("Please enter a valid amount");
            return;
        }
        if (!reference) {
            notify.error("Please enter the transfer reference number");
            return;
        }
        if (!proofFile) {
            notify.error("Please upload the payment proof screenshot");
            return;
        }


        // Create a FormData object and append relevant fields for the top-up submission
        const formData = new FormData();
        formData.append("paymentMethod", paymentMethod);
        formData.append("amount", amount);
        formData.append("transferReference", reference);
        formData.append("note", note);
        if (proofFile) {
            formData.append("proofFile", proofFile);
        }

        setIsSubmitting(true);
        try {
            await submitTopup(formData);

            notify.success("Top-up request submitted successfully! Pending admin approval.");
            setAmount("");
            setReference("");
            setNote("");
            setProofFile(null);
            setIsSubmitting(false);
            setPaymentMethod(PAYMENT_METHODS[0].value);

            setIsSubmitting(false)

        } catch (error) {
            notify.error("Failed to submit top-up request. Please try again.");
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
      fetchPaymentDetails()
    }, [])
    

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Wallet Top-Up</h1>
            <p className="text-gray-500 mb-8">Add funds to your wallet using bank transfer</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side: Bank Details */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                        <FaBuilding className="text-blue-600" /> Payment Details
                    </h2>

                    <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 mb-6 flex-grow">
                        <p className="text-sm font-medium text-blue-800 mb-4 bg-blue-100 py-2 px-3 rounded-lg inline-block">
                            Preferred Method: Bank Transfer
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 bg-white p-2 rounded-lg shadow-sm text-gray-500">
                                    <FaBuilding />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Bank Name</p>
                                    <p className="font-bold text-gray-900 text-lg">{paymentDetails?.bankName}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="mt-1 bg-white p-2 rounded-lg shadow-sm text-gray-500">
                                    <FaRegCreditCard />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Account Number</p>
                                    <p className="font-bold text-gray-900 text-lg tracking-wider font-mono bg-white px-2 py-0.5 rounded border mt-1">
                                        {paymentDetails && paymentDetails.accountNumber
                                            ? paymentDetails.accountNumber
                                            : <span className="text-gray-400 italic">N/A</span>
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="mt-1 bg-white p-2 rounded-lg shadow-sm text-gray-500">
                                    <FaUser />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Account Name</p>
                                    <p className="font-bold text-gray-900">{paymentDetails?.accountName}</p>
                                </div>
                            </div>

                        {paymentDetails?.qrImageUrl ? (
                            <div className="flex flex-col items-center mt-4">
                                <Image
                                    src={paymentDetails.qrImageUrl}
                                    alt="Payment QR Code"
                                    width={300}
                                    height={300}
                                    style={{ width: 300, height: 300, maxWidth: "100%", maxHeight: "100%" }}
                                    className="object-contain rounded shadow border"
                                />
                                <p className="text-xs text-gray-600 mt-2">Scan QR to pay</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center mt-4">
                                <Image
                                    src="/images/qr.svg"
                                    alt="Default QR Code"
                                    width={300}
                                    height={300}
                                    style={{ width: 300, height: 300, maxWidth: "100%", maxHeight: "100%" }}
                                    className="object-contain rounded shadow border"
                                />
                                <p className="text-xs text-gray-400 mt-2">QR not available</p>
                            </div>
                        )}
                        </div>
                    </div>

                    {paymentDetails?.note && (
                        <div className="text-sm text-amber-700 bg-amber-50 p-4 rounded-xl border border-amber-200">
                            <strong>Note:</strong> {paymentDetails?.note}
                        </div>
                    )}
                </div>

                {/* Right Side: Upload Form */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                        <FaMoneyBillWave className="text-green-600" /> Submit Request
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Payment method selection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Payment Method <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            >
                                {PAYMENT_METHODS.map((method) => (
                                    <option key={method.value} value={method.value}>
                                        {method.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Amount (Rs.) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                placeholder="e.g. 5000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Transfer Reference ID <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={reference}
                                onChange={(e) => setReference(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                placeholder="Enter transaction/reference number"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Payment Proof (Screenshot) <span className="text-red-500">*</span>
                            </label>
                            <div
                                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${proofFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-green-400 hover:bg-green-50/50'}`}
                                onClick={() => document.getElementById('proof-upload')?.click()}
                            >
                                <input
                                    id="proof-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                                />
                                {proofFile ? (
                                    <div className="flex items-center justify-center gap-2 text-green-700 font-medium">
                                        <FaUpload />
                                        <span className="truncate max-w-[200px]">{proofFile.name}</span>
                                    </div>
                                ) : (
                                    <div className="text-gray-500 flex flex-col items-center gap-2 py-4">
                                        <FaUpload className="text-2xl text-gray-400" />
                                        <span>Click to browse screenshot</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Notes (Optional)
                            </label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                placeholder="Any additional information..."
                                rows={3}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-4 text-white font-bold rounded-xl transition-all ${isSubmitting ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg"
                                }`}
                        >
                            {isSubmitting ? "Submitting Request..." : "Submit Top-Up Request"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
