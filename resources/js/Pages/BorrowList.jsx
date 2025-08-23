import { Head, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function BorrowList({ borrowings, filters }) {
    const { flash } = usePage().props;
    const [statusFilter, setStatusFilter] = useState(filters.status || "all");

    const handleFilterChange = (status) => {
        setStatusFilter(status);

        const params = {};
        if (status !== "all") {
            params.status = status;
        }

        router.get(route("borrow.form"), params, {
            preserveState: true,
            replace: true,
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: {
                bg: "bg-yellow-100",
                text: "text-yellow-800",
                label: "Diajukan Peminjaman",
            },
            approved: {
                bg: "bg-green-100",
                text: "text-green-800",
                label: "Disetujui",
            },
            rejected: {
                bg: "bg-red-100",
                text: "text-red-800",
                label: "Ditolak",
            },
            returned: {
                bg: "bg-blue-100",
                text: "text-blue-800",
                label: "Dikembalikan",
            },
            overdue: {
                bg: "bg-orange-100",
                text: "text-orange-800",
                label: "Terlambat",
            },
        };

        const config = statusConfig[status] || statusConfig.pending;

        return (
            <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
            >
                {config.label}
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    // Calculate stats from borrowings data
    const stats = {
        pending:
            borrowings.data?.filter((b) => b.status === "pending").length || 0,
        approved:
            borrowings.data?.filter((b) => b.status === "approved").length || 0,
        rejected:
            borrowings.data?.filter((b) => b.status === "rejected").length || 0,
        returned:
            borrowings.data?.filter((b) => b.status === "returned").length || 0,
        overdue:
            borrowings.data?.filter((b) => b.status === "overdue").length || 0,
    };

    return (
        <>
            <Head title="Daftar Pengajuan Peminjaman - Perpustakaan Digital Bina Darma" />

            <div className="min-h-screen bg-gradient-to-b from-[#ffc987] to-[#6a1523]">
                <Navbar activeTab="Peminjaman" />

                <main className="pt-8 pb-16">
                    <div className="max-w-7xl bg-[#8a3837] rounded-2xl mx-auto px-6 pb-8">
                        {/* Flash Messages */}
                        {flash.success && (
                            <div className="mb-6 pt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                                <span className="block sm:inline">
                                    {flash.success}
                                </span>
                            </div>
                        )}

                        {flash.error && (
                            <div className="mb-6 pt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                <span className="block sm:inline">
                                    {flash.error}
                                </span>
                            </div>
                        )}

                        {/* Header */}
                        <div className="mb-8 pt-2">
                            <h1 className="text-3xl lg:text-4xl font-bold text-white text-center mb-4">
                                Daftar Pengajuan Peminjaman
                            </h1>
                            <p className="text-white/80 text-center text-lg">
                                Pantau status pengajuan peminjaman buku yang
                                sedang berjalan
                            </p>
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex flex-wrap gap-2 mb-6 justify-center">
                            <button
                                onClick={() => handleFilterChange("all")}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    statusFilter === "all"
                                        ? "bg-white text-[#6a1523]"
                                        : "bg-white/20 text-white hover:bg-white/30"
                                }`}
                            >
                                Semua
                            </button>
                            <button
                                onClick={() => handleFilterChange("pending")}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    statusFilter === "pending"
                                        ? "bg-white text-[#6a1523]"
                                        : "bg-white/20 text-white hover:bg-white/30"
                                }`}
                            >
                                Diajukan Peminjaman
                            </button>
                            <button
                                onClick={() => handleFilterChange("approved")}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    statusFilter === "approved"
                                        ? "bg-white text-[#6a1523]"
                                        : "bg-white/20 text-white hover:bg-white/30"
                                }`}
                            >
                                Disetujui
                            </button>
                            <button
                                onClick={() => handleFilterChange("rejected")}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    statusFilter === "rejected"
                                        ? "bg-white text-[#6a1523]"
                                        : "bg-white/20 text-white hover:bg-white/30"
                                }`}
                            >
                                Ditolak
                            </button>
                            <button
                                onClick={() => handleFilterChange("returned")}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    statusFilter === "returned"
                                        ? "bg-white text-[#6a1523]"
                                        : "bg-white/20 text-white hover:bg-white/30"
                                }`}
                            >
                                Dikembalikan
                            </button>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center">
                                <div className="text-2xl font-bold text-yellow-600">
                                    {stats.pending}
                                </div>
                                <div className="text-gray-600 font-medium text-sm">
                                    Diajukan Peminjaman
                                </div>
                            </div>
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {stats.approved}
                                </div>
                                <div className="text-gray-600 font-medium text-sm">
                                    Disetujui
                                </div>
                            </div>
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center">
                                <div className="text-2xl font-bold text-red-600">
                                    {stats.rejected}
                                </div>
                                <div className="text-gray-600 font-medium text-sm">
                                    Ditolak
                                </div>
                            </div>
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {stats.returned}
                                </div>
                                <div className="text-gray-600 font-medium text-sm">
                                    Selesai
                                </div>
                            </div>
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center">
                                <div className="text-2xl font-bold text-orange-600">
                                    {stats.overdue}
                                </div>
                                <div className="text-gray-600 font-medium text-sm">
                                    Terlambat
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="my-8">
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
                                {borrowings.data &&
                                borrowings.data.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                                        Buku
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                                        Tanggal Pengajuan
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                                        Tanggal Pinjam
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                                        Tanggal Kembali
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                                        Denda
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {borrowings.data.map(
                                                    (borrowing) => (
                                                        <>
                                                            <tr
                                                                key={
                                                                    borrowing.id
                                                                }
                                                                className="hover:bg-gray-50"
                                                            >
                                                                <td className="px-6 py-4">
                                                                    <div>
                                                                        <div className="text-sm font-medium text-gray-900">
                                                                            {borrowing
                                                                                .book
                                                                                ?.title ||
                                                                                "N/A"}
                                                                        </div>
                                                                        <div className="text-sm text-gray-500">
                                                                            by{" "}
                                                                            {borrowing
                                                                                .book
                                                                                ?.author ||
                                                                                "N/A"}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="text-sm text-gray-900">
                                                                        {formatDate(
                                                                            borrowing.created_at
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="text-sm text-gray-900">
                                                                        {formatDate(
                                                                            borrowing.borrow_date
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="text-sm text-gray-900">
                                                                        {formatDate(
                                                                            borrowing.return_date
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    {getStatusBadge(
                                                                        borrowing.status
                                                                    )}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="text-sm text-gray-900">
                                                                        {borrowing.calculated_fine >
                                                                        0
                                                                            ? `Rp ${Math.floor(
                                                                                  borrowing.calculated_fine
                                                                              ).toLocaleString(
                                                                                  "id-ID"
                                                                              )}`
                                                                            : borrowing.fine >
                                                                              0
                                                                            ? `Rp ${Math.floor(
                                                                                  borrowing.fine
                                                                              ).toLocaleString(
                                                                                  "id-ID"
                                                                              )}`
                                                                            : "-"}
                                                                    </div>
                                                                    {borrowing.overdue_days >
                                                                        0 && (
                                                                        <div className="text-xs text-red-600 mt-1">
                                                                            Terlambat{" "}
                                                                            {
                                                                                borrowing.overdue_days
                                                                            }{" "}
                                                                            hari
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                            {borrowing.status ===
                                                                "rejected" &&
                                                                borrowing.notes && (
                                                                    <tr>
                                                                        <td
                                                                            colSpan={
                                                                                6
                                                                            }
                                                                            className="px-6 pb-4 pt-0"
                                                                        >
                                                                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                                                                                <strong>
                                                                                    Alasan
                                                                                    Penolakan:
                                                                                </strong>{" "}
                                                                                {
                                                                                    borrowing.notes
                                                                                }
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                        </>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 text-lg">
                                            Belum ada pengajuan peminjaman
                                        </p>
                                        <p className="text-gray-400 mt-2">
                                            Silakan ajukan peminjaman buku
                                            terlebih dahulu
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pagination */}
                        {borrowings.links && borrowings.links.length > 3 && (
                            <div className="flex justify-center items-center space-x-2 mt-8">
                                {borrowings.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            link.url && router.visit(link.url)
                                        }
                                        disabled={!link.url}
                                        className={`px-4 py-2 rounded-full transition-colors duration-300 ${
                                            link.active
                                                ? "bg-white text-[#6a1523]"
                                                : link.url
                                                ? "bg-white/20 text-white hover:bg-white/30"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="text-center mt-8">
                            <button
                                onClick={() => router.visit("/borrow-book")}
                                className="bg-white text-[#6a1523] font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-lg hover:bg-gray-100"
                            >
                                Ajukan Peminjaman Baru
                            </button>
                        </div>
                    </div>
                </main>

                <Footer bgColor="bg-gradient-to-b from-[#6a1523]" />
            </div>
        </>
    );
}
