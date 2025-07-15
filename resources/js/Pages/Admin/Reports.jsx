import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "../../Components/Admin/AdminLayout";

export default function Reports() {
    const { borrowings = { data: [] } } = usePage().props;
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filtered = borrowings.data.filter((b) => {
        const matchesSearch =
            b.user_name?.toLowerCase().includes(search.toLowerCase()) ||
            b.book_title?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus =
            statusFilter === "all" || b.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleExport = () => {
        window.location.href = "/admin/export/borrowings";
    };

    return (
        <AdminLayout title="Laporan Peminjaman">
            <Head title="Laporan Peminjaman - Admin" />
            <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <input
                    type="text"
                    placeholder="Cari nama user atau judul buku..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-4 py-2 rounded border border-gray-300 w-full md:w-72"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 rounded border border-gray-300"
                >
                    <option value="all">Semua Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Disetujui</option>
                    <option value="return_requested">
                        Menunggu Pengembalian
                    </option>
                    <option value="returned">Dikembalikan</option>
                    <option value="rejected">Ditolak</option>
                    <option value="overdue">Terlambat</option>
                </select>
                <button
                    onClick={handleExport}
                    className="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700"
                >
                    Export Excel
                </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left">User</th>
                            <th className="px-4 py-2 text-left">Buku</th>
                            <th className="px-4 py-2 text-left">Tgl Pinjam</th>
                            <th className="px-4 py-2 text-left">Tgl Kembali</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Denda</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="text-center py-8 text-gray-500"
                                >
                                    Tidak ada data ditemukan
                                </td>
                            </tr>
                        ) : (
                            filtered.map((b) => (
                                <tr key={b.id} className="border-b">
                                    <td className="px-4 py-2">{b.user_name}</td>
                                    <td className="px-4 py-2">
                                        {b.book_title}
                                    </td>
                                    <td className="px-4 py-2">
                                        {b.borrow_date}
                                    </td>
                                    <td className="px-4 py-2">
                                        {b.return_date || "-"}
                                    </td>
                                    <td className="px-4 py-2 capitalize">
                                        {b.status}
                                    </td>
                                    <td className="px-4 py-2">
                                        {b.fine ? `Rp${b.fine}` : "-"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
