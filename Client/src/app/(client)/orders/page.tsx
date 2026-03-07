"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_ORDERS } from "@/constants";
import { getStatusColor, getStatusLabel, formatDate } from "@/utils/helpers";
import { OrderStatus } from "@/types";

const STATUS_FILTERS: { label: string; value: string }[] = [
    { label: "All Orders", value: "ALL" },
    { label: "Placed", value: "ORDER_PLACED" },
    { label: "Accepted", value: "ORDER_ACCEPTED" },
    { label: "Processing", value: "ORDER_PROCESSING" },
    { label: "Dispatched", value: "ORDER_DISPATCHED" },
    { label: "Delivered", value: "ORDER_DELIVERED" },
    { label: "Cancelled", value: "ORDER_CANCELLED" },
];

export default function OrdersPage() {
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [search, setSearch] = useState("");

    const filtered = MOCK_ORDERS.filter((o) => {
        const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
        const matchSearch =
            search === "" ||
            o.orderName.toLowerCase().includes(search.toLowerCase()) ||
            o.service.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    return (
        <div className="p-3 sm:p-6 md:p-10 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-7 gap-3 sm:gap-4 flex-wrap">
                <div>
                    <h1 className="text-[1.3rem] sm:text-[1.5rem] font-extrabold text-[#0f172a]">Order History</h1>
                    <p className="text-[#64748b] text-[0.9rem] mt-1">
                        Track all your printing orders and their current status.
                    </p>
                </div>
                <Link
                    href="/orders/create"
                    className="btn-primary w-full sm:w-auto text-center"
                >
                    ➕ New Order
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 flex-wrap mb-5 items-stretch sm:items-center">
                {/* Search */}
                <div className="relative mb-2 sm:mb-0">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[0.9rem]">🔍</span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search orders…"
                        className="form-input w-full sm:w-[220px] pl-9 py-2 pr-3.5"
                    />
                </div>
                {/* Status filter chips */}
                <div className="flex gap-2 flex-wrap">
                    {STATUS_FILTERS.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setStatusFilter(f.value)}
                            className={`py-1.5 px-3.5 rounded-[50px] font-semibold text-[0.8rem] cursor-pointer whitespace-nowrap transition ${
                                statusFilter === f.value
                                    ? "border-none bg-gradient-to-r from-[#1a56db] to-[#2563eb] text-white"
                                    : "border-[1.5px] border-[#e2e8f0] bg-white text-[#475569] hover:bg-gray-50"
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table for md+ screens, cards for mobile */}
            <div className="hidden md:block">
                <div className="table-container bg-white rounded-2xl border border-[#e2e8f0] overflow-x-auto">
                    <table className="data-table w-full border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#64748b] text-left text-[0.78rem] uppercase tracking-[0.04em]">
                                <th className="p-4 font-bold">Order ID</th>
                                <th className="p-4 font-bold">Order Name</th>
                                <th className="p-4 font-bold">Service</th>
                                <th className="p-4 font-bold">Quantity</th>
                                <th className="p-4 font-bold">Paper / Finish</th>
                                <th className="p-4 font-bold">Status</th>
                                <th className="p-4 font-bold">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e2e8f0]">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center p-12 text-[#94a3b8]">
                                        No orders found
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((order) => (
                                    <tr key={order.id} className="hover:bg-[#f8fafc] transition-colors">
                                        <td className="p-4 text-[#1a56db] font-bold text-[0.8rem]">
                                            {order.id}
                                        </td>
                                        <td className="p-4 font-semibold text-[#0f172a]">
                                            {order.orderName}
                                        </td>
                                        <td className="p-4">
                                            <div className="text-[0.82rem] text-[#0f172a]">{order.service}</div>
                                            <div className="text-[0.68rem] text-[#94a3b8] mt-0.5">{order.orderType}</div>
                                        </td>
                                        <td className="p-4 text-[#475569]">
                                            {order.quantity.toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="text-[0.78rem] text-[#0f172a]">{order.paperType}</div>
                                            <div className="text-[0.68rem] text-[#94a3b8]">{order.finishingOption}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`badge ${getStatusColor(order.status as OrderStatus)}`}>
                                                {getStatusLabel(order.status as OrderStatus)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-[#64748b] text-[0.82rem]">
                                            {formatDate(order.date)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Cards for mobile: */}
            <div className="md:hidden flex flex-col gap-3">
                {filtered.length === 0 ? (
                    <div className="bg-white text-[#94a3b8] text-center p-8 rounded-2xl border border-[#e2e8f0]">
                        No orders found
                    </div>
                ) : (
                    filtered.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-2xl border border-[#e2e8f0] p-4 flex flex-col gap-2 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-[#1a56db] text-[0.88rem]">{order.id}</span>
                                <span
                                    className={`badge ${getStatusColor(order.status as OrderStatus)} text-xs`}
                                >
                                    {getStatusLabel(order.status as OrderStatus)}
                                </span>
                            </div>
                            <div className="font-extrabold text-[#0f172a] text-[1.02rem]">{order.orderName}</div>
                            <div className="flex flex-wrap gap-3 mt-1">
                                <span className="text-[0.81rem] text-[#0f172a] font-semibold">{order.service}</span>
                                <span className="badge text-xs bg-[#f8fafc] text-[#64748b] border-none">
                                    {order.orderType}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-[0.8rem] text-[#475569] mt-2">
                                <div>
                                    <span className="block font-medium text-[0.75rem] text-[#94a3b8]">Qty</span>
                                    <span>{order.quantity.toLocaleString()}</span>
                                </div>
                                <div>
                                    <span className="block font-medium text-[0.75rem] text-[#94a3b8]">Paper</span>
                                    <span>{order.paperType}</span>
                                </div>
                                <div>
                                    <span className="block font-medium text-[0.75rem] text-[#94a3b8]">Finish</span>
                                    <span>{order.finishingOption}</span>
                                </div>
                            </div>
                            <div className="mt-2 text-[0.80rem] text-[#64748b]">
                                <span className="font-medium">Ordered: </span>
                                {formatDate(order.date)}
                            </div>
                        </div>
                    ))
                )}
            </div>
            <p className="text-right mt-4 text-[0.78rem] text-[#94a3b8]">
                Showing {filtered.length} of {MOCK_ORDERS.length} orders
            </p>
        </div>
    );
}
