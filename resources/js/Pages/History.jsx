import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function History() {
    const { borrowings = { data: [] } } = usePage().props;
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");

    const getImageUrl = (img) => {
        if (!img) return "/assets/book-default.png";
        if (img.startsWith("http")) return img;
        return `/storage/${img}`;
    };

    const [ratingModal, setRatingModal] = useState(false);
    const [selectedBorrowing, setSelectedBorrowing] = useState(null);
    const [ratingValue, setRatingValue] = useState(5);
    const [notif, setNotif] = useState(null);
    const [notifType, setNotifType] = useState("success");

    // Helper function untuk format currency Rupiah
    const formatCurrency = (amount) => {
        if (!amount || amount === 0) return "-";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const historyData = borrowings.data.map((b) => {
        // Gunakan data langsung dari database tanpa perhitungan ulang
        const overdueDays = b.overdue_days || 0;
        const backendFine = b.fine || 0;

        // Breakdown denda berdasarkan kondisi yang sebenarnya
        let overdueFine = 0;
        let damageFine = 0;

        // Jika ada keterlambatan, denda terlambat = hari × 500
        if (overdueDays > 0) {
            overdueFine = overdueDays * 500;
        }

        // Jika kondisi rusak, denda kerusakan = total - denda terlambat
        if (b.condition && b.condition !== "baik" && backendFine > 0) {
            damageFine = backendFine - overdueFine;
        }

        return {
            id: b.id,
            title: b.book?.title || "-",
            author: b.book?.author || "-",
            borrow_date: b.borrow_date,
            return_date: b.actual_return_date,
            due_date: b.return_date,
            status:
                b.status === "overdue"
                    ? "terlambat"
                    : b.status === "returned"
                    ? "dikembalikan"
                    : "dipinjam",
            days_late: overdueDays,
            fine: backendFine, // Total denda dari database
            condition: b.condition || "-",
            image: getImageUrl(b.book?.image),
            has_rated: b.has_rated,
            book_id: b.book_id,
            // Breakdown denda yang akurat
            overdue_fine: overdueFine,
            damage_fine: damageFine,
        };
    });

    const filteredHistory = historyData.filter((item) => {
        const matchesSearch =
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.author.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            selectedFilter === "all" || item.status === selectedFilter;

        return matchesSearch && matchesFilter;
    });

    const getStatusBadge = (status, daysLate) => {
        switch (status) {
            case "dikembalikan":
                return (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Dikembalikan
                    </span>
                );
            case "terlambat":
                return (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                        Terlambat {daysLate} hari
                    </span>
                );
            case "dipinjam":
                return (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        Sedang Dipinjam
                    </span>
                );
            default:
                return null;
        }
    };

    const formatTanggalID = (date) => {
        if (!date) return "-";
        const d = new Date(date);
        if (isNaN(d)) return "-";
        return d.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const handleRate = (borrowing) => {
        setSelectedBorrowing(borrowing);
        setRatingValue(5);
        setRatingModal(true);
    };

    const submitRating = () => {
        window.axios
            .post("/ratings", {
                book_id: selectedBorrowing.book_id,
                rating: ratingValue,
            })
            .then(() => {
                setNotif("Rating berhasil disimpan.");
                setNotifType("success");
                setRatingModal(false);
                window.location.reload();
            })
            .catch(() => {
                setNotif("Gagal menyimpan rating.");
                setNotifType("error");
            });
    };

    return (
        <>
            <Head title="Riwayat Peminjaman - Perpustakaan Digital Bina Darma" />

            <div className="min-h-screen bg-gradient-to-b from-[#ffc987] to-[#6a1523]">
                <Navbar activeTab="Riwayat" />

                <main className="pt-8 pb-16">
                    <div className="max-w-7xl mx-auto px-6">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                Riwayat Peminjaman
                            </h1>
                            <p className="text-white/90 text-lg">
                                Lihat semua riwayat peminjaman buku Anda
                            </p>
                        </div>

                        {/* Search and Filter */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Search Input */}
                                <div className="flex-1">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Cari berdasarkan judul atau penulis..."
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            className="w-full px-4 py-3 pl-12 rounded-xl bg-white/90 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-800"
                                        />
                                        <svg
                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                {/* Filter */}
                                <div className="md:w-64">
                                    <select
                                        value={selectedFilter}
                                        onChange={(e) =>
                                            setSelectedFilter(e.target.value)
                                        }
                                        className="w-full px-4 py-3 rounded-xl bg-white/90 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-800"
                                    >
                                        <option value="all">
                                            Semua Status
                                        </option>
                                        <option value="dikembalikan">
                                            Dikembalikan
                                        </option>
                                        <option value="dipinjam">
                                            Sedang Dipinjam
                                        </option>
                                        <option value="terlambat">
                                            Terlambat
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                                <div className="text-3xl font-bold text-white mb-2">
                                    {historyData.length}
                                </div>
                                <div className="text-white/80">
                                    Total Peminjaman
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                                <div className="text-3xl font-bold text-green-300 mb-2">
                                    {
                                        historyData.filter(
                                            (item) =>
                                                item.status === "dikembalikan"
                                        ).length
                                    }
                                </div>
                                <div className="text-white/80">
                                    Dikembalikan
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                                <div className="text-3xl font-bold text-blue-300 mb-2">
                                    {
                                        historyData.filter(
                                            (item) => item.status === "dipinjam"
                                        ).length
                                    }
                                </div>
                                <div className="text-white/80">
                                    Sedang Dipinjam
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                                <div className="text-3xl font-bold text-red-300 mb-2">
                                    {
                                        historyData.filter(
                                            (item) =>
                                                item.status === "terlambat"
                                        ).length
                                    }
                                </div>
                                <div className="text-white/80">Terlambat</div>
                            </div>
                        </div>

                        {/* History Table */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                            {filteredHistory.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📚</div>
                                    <h3 className="text-xl font-semibold text-white mb-2">
                                        Tidak ada riwayat ditemukan
                                    </h3>
                                    <p className="text-white/70">
                                        Coba ubah kata kunci pencarian atau
                                        filter
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full bg-white rounded-xl shadow-lg">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Buku
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tanggal Pinjam
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tanggal Kembali
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Jatuh Tempo
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Denda Terlambat
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Denda Kerusakan
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Total Denda
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Kondisi Buku
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {filteredHistory.map((item) => (
                                                <tr
                                                    key={item.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="h-12 w-12 flex-shrink-0">
                                                                <img
                                                                    src={
                                                                        item.image
                                                                    }
                                                                    alt={
                                                                        item.title
                                                                    }
                                                                    className="h-12 w-12 rounded-lg object-cover"
                                                                    onError={(
                                                                        e
                                                                    ) => {
                                                                        e.target.style.display =
                                                                            "none";
                                                                        e.target.nextSibling.style.display =
                                                                            "flex";
                                                                    }}
                                                                />
                                                                <div className="hidden h-12 w-12 bg-gray-300 rounded-lg items-center justify-center">
                                                                    <span className="text-2xl">
                                                                        📖
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="font-bold text-gray-800">
                                                                    {item.title}
                                                                </div>
                                                                <div className="text-gray-600 text-xs">
                                                                    {
                                                                        item.author
                                                                    }
                                                                </div>
                                                                {item.status ===
                                                                    "dikembalikan" &&
                                                                    !item.has_rated && (
                                                                        <button
                                                                            onClick={() =>
                                                                                handleRate(
                                                                                    item
                                                                                )
                                                                            }
                                                                            className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600"
                                                                        >
                                                                            Beri
                                                                            Rating
                                                                        </button>
                                                                    )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatTanggalID(
                                                            item.borrow_date
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {item.return_date
                                                            ? formatTanggalID(
                                                                  item.return_date
                                                              )
                                                            : "-"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatTanggalID(
                                                            item.due_date
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getStatusBadge(
                                                            item.status,
                                                            item.days_late
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {item.overdue_fine >
                                                        0 ? (
                                                            <span className="text-red-600 font-medium">
                                                                {formatCurrency(
                                                                    item.overdue_fine
                                                                )}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400">
                                                                -
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {item.damage_fine >
                                                        0 ? (
                                                            <span className="text-orange-600 font-medium">
                                                                {formatCurrency(
                                                                    item.damage_fine
                                                                )}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400">
                                                                -
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {item.fine > 0 ? (
                                                            <span className="text-red-700 font-bold">
                                                                {formatCurrency(
                                                                    item.fine
                                                                )}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400">
                                                                -
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {item.status ===
                                                        "dikembalikan" ? (
                                                            <span
                                                                className={`px-2 py-1 rounded text-xs font-medium ${
                                                                    item.condition ===
                                                                    "baik"
                                                                        ? "bg-green-100 text-green-800"
                                                                        : item.condition ===
                                                                          "rusak_ringan"
                                                                        ? "bg-yellow-100 text-yellow-800"
                                                                        : item.condition ===
                                                                          "rusak_berat"
                                                                        ? "bg-red-100 text-red-800"
                                                                        : "bg-gray-100 text-gray-800"
                                                                }`}
                                                            >
                                                                {item.condition ===
                                                                "baik"
                                                                    ? "Baik"
                                                                    : item.condition ===
                                                                      "rusak_ringan"
                                                                    ? "Rusak Ringan"
                                                                    : item.condition ===
                                                                      "rusak_berat"
                                                                    ? "Rusak Berat"
                                                                    : item.condition}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400">
                                                                -
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
            {ratingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-xl p-6 w-full max-w-xs">
                        <h3 className="text-lg font-semibold mb-4">
                            Beri Rating Buku
                        </h3>
                        <div className="flex items-center justify-center mb-4">
                            {[1, 2, 3, 4, 5].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => setRatingValue(val)}
                                    className={`text-3xl mx-1 ${
                                        ratingValue >= val
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                    }`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setRatingModal(false)}
                                className="px-4 py-2 rounded bg-gray-200"
                            >
                                Batal
                            </button>
                            <button
                                onClick={submitRating}
                                className="px-4 py-2 rounded bg-yellow-500 text-white"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {notif && (
                <div
                    className={`fixed top-6 right-6 px-4 py-2 rounded shadow-lg z-50 ${
                        notifType === "success"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                    }`}
                >
                    {notif}
                </div>
            )}
        </>
    );
}
