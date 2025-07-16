import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function AdminLayout({ children, title = "Admin Dashboard" }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { auth, url } = usePage().props;
    const currentUrl = url || window.location.pathname;

    const navigationItems = [
        {
            name: "Dashboard",
            href: "/admin/dashboard",
            icon: "📊",
            active: currentUrl === "/admin/dashboard",
        },
        {
            name: "Kelola Buku",
            href: "/admin/books",
            icon: "📚",
            active: currentUrl.startsWith("/admin/books"),
        },
        {
            name: "Manajemen Kategori",
            href: "/admin/categories-management",
            icon: "🏷️",
            active: currentUrl.startsWith("/admin/categories-management"),
        },
        {
            name: "Approval Peminjaman",
            href: "/admin/borrowing-requests",
            icon: "📋",
            active: currentUrl.startsWith("/admin/borrowing-requests"),
        },
        {
            name: "Approval Pengembalian",
            href: "/admin/return-requests",
            icon: "📤",
            active: currentUrl.startsWith("/admin/return-requests"),
        },
        {
            name: "Manajemen User",
            href: "/admin/users",
            icon: "👥",
            active: currentUrl.startsWith("/admin/users"),
        },
        {
            name: "Laporan",
            href: "/admin/reports",
            icon: "📈",
            active: currentUrl.startsWith("/admin/reports"),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div
                        className="fixed inset-0 bg-gray-600 bg-opacity-75"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                </div>
            )}

            {/* Sidebar - Fixed/Sticky */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col ${
                    sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                }`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-[#6a1523] to-[#8a3837] flex-shrink-0">
                    <div className="flex items-center">
                        <span className="text-2xl">🔧</span>
                        <span className="ml-2 text-lg font-bold text-white">
                            Admin Panel
                        </span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-white hover:text-gray-200"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
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

                {/* Navigation - Scrollable */}
                <nav className="flex-1 overflow-y-auto px-3 py-6">
                    <div className="space-y-2">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 relative overflow-hidden group
                                    ${
                                        item.active
                                            ? "bg-gradient-to-r from-[#6a1523] to-[#8a3837] text-white shadow-lg scale-105"
                                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    }
                                `}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <span className="text-lg mr-3 group-hover:scale-125 transition-transform duration-200">
                                    {item.icon}
                                </span>
                                {item.name}
                                {item.active && (
                                    <span className="absolute left-0 bottom-0 w-full h-1 bg-pink-400 rounded-t-lg animate-pulse"></span>
                                )}
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* User Info - Fixed at bottom */}
                <div className="p-4 border-t border-gray-200 flex-shrink-0">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#6a1523] to-[#8a3837] rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                                {auth?.user?.name?.charAt(0)?.toUpperCase()}
                            </span>
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-700">
                                {auth?.user?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                Administrator
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="mt-3 w-full bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                        Logout
                    </Link>
                </div>
            </div>

            {/* Main content - With left padding to account for fixed sidebar */}
            <div className="lg:pl-64">
                {/* Top header */}
                <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
                    <div className="flex items-center justify-between h-16 px-6">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden text-gray-500 hover:text-gray-700"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                            <h1 className="ml-4 lg:ml-0 text-2xl font-bold text-gray-900">
                                {title}
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Notifications */}
                            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                    />
                                </svg>
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* Back to main site */}
                            <Link
                                href="/"
                                className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                            >
                                <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                                Kembali ke Situs
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6 min-h-screen">{children}</main>
            </div>
        </div>
    );
}
