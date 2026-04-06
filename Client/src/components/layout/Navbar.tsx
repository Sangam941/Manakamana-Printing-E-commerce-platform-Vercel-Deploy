"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { notify } from "@/utils/notifications";
import { AnimatePresence, easeInOut, motion } from 'motion/react'
import Image from "next/image";
import { useProfileStore } from "@/store/profileStore";
import { FaWallet, FaBell } from "react-icons/fa";
import { useWalletStore } from "@/store/useWalletStore";
import { useNotificationStore } from "@/store/notificationStore";

export default function Navbar() {
    const { fetchWallet, wallet } = useWalletStore()
    const { profile, fetchProfile } = useProfileStore()
    const { unreadCount } = useNotificationStore()
    const { isAuthenticated, isHydrated, logout } = useAuthStore();
    const pathname = usePathname();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isWalletOpen, setIsWalletOpen] = useState(false);

    const handleLogout = () => {
        logout();
        notify.success("Logged out successfully");
        router.push("/");
    };

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/services", label: "Our Services" },
        { href: "/templates", label: "Free Designs" },
        { href: "/contact", label: "Contact" },
    ];

    useEffect(() => {
      if (!isHydrated || !isAuthenticated) return;
      fetchWallet();
      fetchProfile();
    }, [isHydrated, isAuthenticated, fetchWallet, fetchProfile])
    

    return (
        <nav className="bg-white shadow-[0_1px_0_var(--border)] sticky top-0 z-[100]">
            <div className="w-full mx-auto px-4 sm:px-8 md:px-20 flex items-center justify-between h-16">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2.5 no-underline"
                >
                    <Image src={'/main-logo.png'} alt="this is logo" width={52} height={52}/>
                    <div className="max-sm:hidden">
                        <div className="text-base font-extrabold tracking-wider text-[color:var(--primary)] leading-[1]">
                            NEW MANAKAMANA
                        </div>
                        <div className="text-[0.55rem] font-medium tracking-widest uppercase text-[color:var(--text-muted)]">
                            Printers
                        </div>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`
                                font-medium
                                text-[0.875rem]
                                py-1
                                transition-colors
                                duration-200
                                hover:text-[var(--primary)]
                                hover:border-[var(--primary)]
                                ${pathname === link.href ? "text-[var(--primary)] border-b-2 border-[var(--primary)]" : ""}
                                `}

                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <div className="flex gap-2 items-center">

                            <Link 
                                href="/notifications"
                                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors group h-10 w-10 flex items-center justify-center border border-gray-200"
                            >
                                <FaBell className="text-xl group-hover:text-amber-500 transition-colors" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white animate-bounce-slow">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </Link>

                            <div 
                                onClick={() => { setIsWalletOpen(!isWalletOpen); setIsProfileOpen(false); }}
                                className="border border-green-500 cursor-pointer h-10 px-3 flex gap-2 items-center justify-center rounded-full text-sm font-bold text-green-600 hover:bg-green-50 transition-colors"
                            >
                                <FaWallet className="text-lg" />
                                <span>Rs. {wallet?.availableBalance ?? 0}</span>
                            </div>

                            <div
                                onClick={() => { setIsProfileOpen(!isProfileOpen); setIsWalletOpen(false); }}
                                className="border uppercase border-blue-500 cursor-pointer h-10 w-10 flex items-center justify-center border-2 rounded-full text-xl font-bold "
                            >
                                {(profile?.owner_name && profile?.owner_name[0]) || "C"}
                            </div>
                        </div>
                    ) : (
                        <Link href="/login" className="btn-primary">
                            Login
                        </Link>
                    )}
                    {/* Mobile menu */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden bg-transparent border-none cursor-pointer text-xl p-1"
                    >
                        {menuOpen ? "✕" : "☰"}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isProfileOpen && (
                    <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="absolute right-6 top-16 z-[150] mt-2 rounded-xl shadow-xl py-4 px-6 min-w-[200px] flex flex-col gap-3 border border-gray-200 bg-white">
                        <Link
                            href="/profile"
                            className="py-2 px-2 font-semibold text-[color:var(--primary)] rounded hover:bg-[var(--primary-light)] transition-colors cursor-pointer"
                            onClick={() => setIsProfileOpen(false)}
                        >
                            Profile
                        </Link>
                        <Link
                            href="/orders"
                            className="py-2 px-2 font-semibold text-blue-600 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                            onClick={() => setIsProfileOpen(false)}
                        >
                            Order History
                        </Link>
                        <button
                            onClick={() => {
                                setIsProfileOpen(false);
                                handleLogout();
                            }}
                            className="py-2 px-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition-colors cursor-pointer"
                        >
                            Logout
                        </button>
                    </motion.div>
                )}
                {isWalletOpen && (
                    <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="absolute md:right-20 right-16 top-16 z-[150] mt-2 rounded-xl shadow-xl py-4 px-6 min-w-[200px] flex flex-col gap-3 border border-gray-200 bg-white">
                        <Link
                            href="/wallet/top-up"
                            className="py-2 px-2 font-semibold text-green-600 rounded hover:bg-green-50 transition-colors cursor-pointer"
                            onClick={() => setIsWalletOpen(false)}
                        >
                            Top Up Wallet
                        </Link>
                        <Link
                            href="/wallet/history"
                            className="py-2 px-2 font-semibold text-gray-700 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => setIsWalletOpen(false)}
                        >
                            Transaction History
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="bg-white border-t border-gray-200 px-6 py-4 flex flex-col gap-3">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className={
                                `
                                    font-medium 
                                    text-[0.875rem] 
                                    py-1 
                                    text-[color:var(--text-dark)]
                                    transition-colors
                                    duration-200
                                    no-underline
                                    border-b-2
                                    border-transparent
                                    hover:text-[color:var(--primary)]
                                    hover:border-[color:var(--primary)]
                                    ${pathname === link.href
                                    ? "text-[color:var(--primary)] border-[color:var(--primary)]"
                                    : ""
                                }
                                `
                            }
                        >
                            {link.label}
                        </Link>
                    ))}
                    {!isAuthenticated && (
                        <Link
                            href="/register"
                            className="
                                font-medium 
                                text-[0.875rem] 
                                py-1 
                                text-[color:var(--text-dark)]
                                transition-colors
                                duration-200
                                no-underline
                                border-b-2
                                border-transparent
                                hover:text-[color:var(--primary)]
                                hover:border-[color:var(--primary)]
                            "
                            onClick={() => setMenuOpen(false)}
                        >
                            Join Us
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}
