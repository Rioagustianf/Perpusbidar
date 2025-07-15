import { Head, usePage } from "@inertiajs/react";
import AdminLayout from "../../Components/Admin/AdminLayout";

export default function AdminDashboard() {
    const { stats = {}, recentActivities = [] } = usePage().props;

    const getActivityIcon = (type) => {
        switch (type) {
            case "borrow_request":
                return "📋";
            case "return":
                return "📤";
            case "overdue":
                return "⚠️";
            case "borrow_approved":
                return "✅";
            default:
                return "📚";
        }
    };

    const getActivityColor = (status) => {
        switch (status) {
            case "pending":
                return "text-yellow-600 bg-yellow-50";
            case "returned":
                return "text-green-600 bg-green-50";
            case "overdue":
                return "text-red-600 bg-red-50";
            case "approved":
                return "text-blue-600 bg-blue-50";
            default:
                return "text-gray-600 bg-gray-50";
        }
    };

    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard - Perpustakaan Digital Bina Darma" />

            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-[#6a1523] to-[#8a3837] rounded-2xl p-6 text-white">
                    <h2 className="text-2xl font-bold mb-2">
                        Selamat Datang, Admin!
                    </h2>
                    <p className="text-white/90">
                        Kelola sistem perpustakaan digital Universitas Bina
                        Darma dengan mudah dan efisien.
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-600 mb-1">
                                    Total
                                </p>
                                <p className="text-xs font-medium text-gray-600 mb-2">
                                    Buku
                                </p>
                                <p className="text-xl font-bold text-gray-900">
                                    {stats.totalBooks?.toLocaleString() || "0"}
                                </p>
                            </div>
                            <div className="text-2xl">📚</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-600 mb-1">
                                    Total
                                </p>
                                <p className="text-xs font-medium text-gray-600 mb-2">
                                    User
                                </p>
                                <p className="text-xl font-bold text-gray-900">
                                    {stats.totalUsers?.toLocaleString() || "0"}
                                </p>
                            </div>
                            <div className="text-2xl">👥</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-600 mb-1">
                                    Sedang
                                </p>
                                <p className="text-xs font-medium text-gray-600 mb-2">
                                    Dipinjam
                                </p>
                                <p className="text-xl font-bold text-blue-600">
                                    {stats.activeBorrowings || 0}
                                </p>
                            </div>
                            <div className="text-2xl">📖</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-600 mb-1">
                                    Permintaan
                                </p>
                                <p className="text-xs font-medium text-gray-600 mb-2">
                                    Pending
                                </p>
                                <p className="text-xl font-bold text-yellow-600">
                                    {stats.pendingRequests || 0}
                                </p>
                            </div>
                            <div className="text-2xl">⏳</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-600 mb-1">
                                    Terlambat
                                </p>
                                <p className="text-xs font-medium text-gray-600 mb-2"></p>
                                <p className="text-xl font-bold text-red-600">
                                    {stats.overdueBooks || 0}
                                </p>
                            </div>
                            <div className="text-2xl">⚠️</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-600 mb-1">
                                    Dikembalikan
                                </p>
                                <p className="text-xs font-medium text-gray-600 mb-2">
                                    Hari Ini
                                </p>
                                <p className="text-xl font-bold text-green-600">
                                    {stats.returnedToday || 0}
                                </p>
                            </div>
                            <div className="text-2xl">✅</div>
                        </div>
                    </div>
                </div>

                {/* Recent Activities & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Activities */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="p-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Aktivitas Terbaru
                            </h3>
                        </div>
                        <div className="p-4">
                            <div className="space-y-4">
                                {recentActivities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-start space-x-3"
                                    >
                                        <div className="text-xl">
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {activity.user}
                                                </p>
                                                <span
                                                    className={`px-2 py-1 text-xs font-medium rounded-full ${getActivityColor(
                                                        activity.status
                                                    )}`}
                                                >
                                                    {activity.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {activity.book}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="p-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Aksi Cepat
                            </h3>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-2 gap-4">
                                <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-center transition-colors group">
                                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                                        📚
                                    </div>
                                    <p className="text-sm font-medium text-blue-700">
                                        Tambah Buku
                                    </p>
                                </button>

                                <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl text-center transition-colors group">
                                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                                        ✅
                                    </div>
                                    <p className="text-sm font-medium text-green-700">
                                        Approve Peminjaman
                                    </p>
                                </button>

                                <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-xl text-center transition-colors group">
                                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                                        📤
                                    </div>
                                    <p className="text-sm font-medium text-yellow-700">
                                        Proses Pengembalian
                                    </p>
                                </button>

                                <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-center transition-colors group">
                                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                                        📈
                                    </div>
                                    <p className="text-sm font-medium text-purple-700">
                                        Lihat Laporan
                                    </p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Status */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Status Sistem
                        </h3>
                    </div>
                    <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Database
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Online
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Server
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Berjalan Normal
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Backup
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Terakhir: 2 jam lalu
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
