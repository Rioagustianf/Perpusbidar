import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

import { ArrowRight } from "lucide-react";

export default function Navbar({ activeTab = "Dashboard" }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { auth } = usePage().props;

    const navItems = [
        {
            name: "Dashboard",
            href: "/",
            active: activeTab === "Dashboard",
        },
        {
            name: "Daftar Buku",
            href: "/books",
            active: activeTab === "Daftar Buku",
        },
        {
            name: "Peminjaman",
            href: "/borrow-form",
            active: activeTab === "Peminjaman",
        },
        {
            name: "Pengembalian",
            href: "/borrowings",
            active: activeTab === "Pengembalian",
        },
        {
            name: "Riwayat",
            href: "/history",
            active: activeTab === "Riwayat",
        },
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-[#ffc987] px-4 py-3 sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center">
                        <img
                            src="/assets/Logo.png"
                            alt="Logo"
                            className="w-70 h-20 md:w-70 sm:h-20 object-contain"
                            onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "block";
                            }}
                        />
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex w-full items-center justify-between ml-8">
                        {/* Navigasi utama */}
                        <div className="flex items-center gap-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`text-sm font-medium transition-colors py-2 px-1 whitespace-nowrap ${
                                        item.active
                                            ? "text-white border-b-2 border-white font-bold"
                                            : "text-gray-700 hover:text-white hover:border-b-2 hover:border-white"
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                        {/* Area user kanan */}
                        <div className="flex items-center gap-6 ml-8 whitespace-nowrap">
                            {auth?.user?.role === "admin" && (
                                <Link
                                    href="/admin/dashboard"
                                    className="flex items-center gap-1 text-sm font-medium text-[#6a1523] underline hover:text-[#8a3837] transition-colors whitespace-nowrap"
                                    style={{ minWidth: "max-content" }}
                                >
                                    Kembali ke Admin
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            )}
                            {auth?.user && (
                                <span className="text-sm text-gray-700 whitespace-nowrap">
                                    Hi, {auth.user.name}
                                </span>
                            )}
                            {auth?.user && (
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors whitespace-nowrap"
                                >
                                    Logout
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Hamburger Button (Mobile/Tablet) */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="p-2 rounded-md text-gray-700 hover:text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors"
                        >
                            <span className="sr-only">Open main menu</span>
                            {/* Hamburger Icon */}
                            <svg
                                className={`${
                                    isMenuOpen ? "hidden" : "block"
                                } h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                            {/* Close Icon */}
                            <svg
                                className={`${
                                    isMenuOpen ? "block" : "hidden"
                                } h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay - Slide from Right */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50"
                        onClick={() => setIsMenuOpen(false)}
                    ></div>

                    {/* Slide-in Menu from Right */}
                    <div
                        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
                            isMenuOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                    >
                        {/* Menu Header */}
                        <div className="bg-[#ffc987] px-6 py-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-800">
                                Menu
                            </h2>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 rounded-md text-gray-700 hover:text-white hover:bg-orange-600 transition-colors"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Menu Items */}
                        <div className="py-4 flex flex-col gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`block px-6 py-4 text-base font-medium transition-colors border-b border-gray-100 ${
                                        item.active
                                            ? "text-orange-600 bg-orange-50 border-l-4 border-orange-600 font-bold"
                                            : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            {/* Tombol kembali ke admin jika user admin (mobile) */}
                            {auth?.user?.role === "admin" && (
                                <Link
                                    href="/admin/dashboard"
                                    className="flex items-center justify-center gap-1 mt-2 mx-6 text-base font-medium text-[#6a1523] underline hover:text-[#8a3837] text-center transition-colors whitespace-nowrap"
                                    onClick={() => setIsMenuOpen(false)}
                                    style={{ minWidth: "max-content" }}
                                >
                                    Kembali ke Admin
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            )}
                            <div className="border-t border-gray-200 my-2" />
                            {/* Auth Section Mobile - Only show if logged in */}
                            {auth?.user && (
                                <div className="px-6 py-4 flex flex-col gap-3">
                                    <div className="text-sm text-gray-700 text-center">
                                        Hi, {auth.user.name}
                                    </div>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="w-full bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Logout
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Menu Footer */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gray-50 border-t">
                            <p className="text-sm text-gray-500 text-center">
                                Perpustakaan Digital
                                <br />
                                Universitas Bina Darma
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
