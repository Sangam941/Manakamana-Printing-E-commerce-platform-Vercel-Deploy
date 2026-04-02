"use client";

import { Suspense } from "react";
import Link from "next/link";
import { SERVICES } from "@/constants";

function OrderSelector() {
    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4">
            <div className="max-w-[800px] mx-auto text-center">
                <h1 className="text-3xl font-black text-gray-800 uppercase tracking-widest mb-4">
                    START A NEW ORDER
                </h1>
                <p className="text-gray-500 mb-10">Select a category to begin your order process.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {SERVICES.filter(s => s.isActive).map((service) => (
                        <Link 
                            key={service.id} 
                            href={service.route || `/orders/create?service=${encodeURIComponent(service.name)}`}
                            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-500 transition-all text-left flex items-center gap-4 group"
                        >
                            <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                📦
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">{service.name}</h3>
                                <p className="text-xs text-gray-400">Click to configure your order</p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200">
                    <Link href="/services" className="text-sm font-bold text-blue-600 hover:underline">
                         ← View All Services
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function CreateOrderPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-100"><p className="text-gray-500 font-medium animate-pulse">Loading...</p></div>}>
            <OrderSelector />
        </Suspense>
    );
}
