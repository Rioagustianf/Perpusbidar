import { Head, usePage, router } from "@inertiajs/react";
import { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function ReturnBooks() {
    const { borrowings = { data: [] } } = usePage().props;
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [notification, setNotification] = useState(null);
    const [notificationType, setNotificationType] = useState("success");

    const getImageUrl = (img) => {
        if (!img) return "/assets/book-default.png";
        if (img.startsWith("http")) return img;
        return `/storage/${img}`;
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

    const borrowedBooks = borrowings.data.map((b) => ({
        id: b.id,
        title: b.book?.title || "-",
        author: b.book?.author || "-",
        nim: b.user?.nim || "-",
        borrower_name: b.user?.name || "-",
        borrow_date: formatTanggalID(b.borrow_date),
        due_date: formatTanggalID(b.return_date),
        status: b.status === "overdue" ? "terlambat" : "dipinjam",
        days_overdue: b.overdue_days || 0,
        image: getImageUrl(b.book?.image),
    }));

    const filteredBooks = borrowedBooks.filter((book) => {
        const matchesSearch =
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.borrower_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            book.nim.includes(searchTerm);

        const matchesFilter =
            selectedFilter === "all" || book.status === selectedFilter;

        return matchesSearch && matchesFilter;
    });

    const handleReturn = (bookId) => {
        console.log(`Returning book with ID: ${bookId}`);
        // Implementasi pengembalian buku akan ditambahkan nanti
        alert(`Buku dengan ID ${bookId} berhasil dikembalikan!`);
    };

    const handleRequestReturn = (bookId) => {
        setNotification(null);
        router.post(
            `/borrowings/${bookId}/request-return`,
            {},
            {
                onSuccess: () => {
                    setNotification(
                        "Permintaan pengembalian berhasil diajukan."
                    );
                    setNotificationType("success");
                    router.reload({ only: ["borrowings"] });
                },
                onError: () => {
                    setNotification("Gagal mengajukan pengembalian.");
                    setNotificationType("error");
                },
            }
        );
    };

    const getStatusBadge = (status, daysOverdue) => {
        if (status === "terlambat") {
            return (
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                    Terlambat {daysOverdue} hari
                </span>
            );
        }
        return (
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Dipinjam
            </span>
        );
    };

    return (
        <>
            <Head title="Pengembalian Buku - Perpustakaan Digital Bina Darma" />

            <div className="min-h-screen bg-gradient-to-b from-[#ffc987] to-[#6a1523]">
                <Navbar activeTab="Pengembalian" />

                <main className="pt-8 pb-16">
                    <div className="max-w-7xl mx-auto px-6">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                Pengembalian Buku
                            </h1>
                            <p className="text-white/90 text-lg">
                                Kelola pengembalian buku yang dipinjam mahasiswa
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
                                            placeholder="Cari berdasarkan judul, penulis, nama peminjam, atau NIM..."
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
                                        <option value="dipinjam">
                                            Dipinjam
                                        </option>
                                        <option value="terlambat">
                                            Terlambat
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                                <div className="text-3xl font-bold text-white mb-2">
                                    {borrowedBooks.length}
                                </div>
                                <div className="text-white/80">
                                    Total Dipinjam
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                                <div className="text-3xl font-bold text-green-300 mb-2">
                                    {
                                        borrowedBooks.filter(
                                            (book) => book.status === "dipinjam"
                                        ).length
                                    }
                                </div>
                                <div className="text-white/80">Tepat Waktu</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                                <div className="text-3xl font-bold text-red-300 mb-2">
                                    {
                                        borrowedBooks.filter(
                                            (book) =>
                                                book.status === "terlambat"
                                        ).length
                                    }
                                </div>
                                <div className="text-white/80">Terlambat</div>
                            </div>
                        </div>

                        {/* Books Grid */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                            {notification && (
                                <div
                                    className={`mb-4 px-4 py-3 rounded text-sm font-medium ${
                                        notificationType === "success"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                    }`}
                                >
                                    {notification}
                                </div>
                            )}
                            {filteredBooks.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📚</div>
                                    <h3 className="text-xl font-semibold text-white mb-2">
                                        Tidak ada buku ditemukan
                                    </h3>
                                    <p className="text-white/70">
                                        Coba ubah kata kunci pencarian atau
                                        filter
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {filteredBooks.map((book) => (
                                        <div
                                            key={book.id}
                                            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                                        >
                                            <div className="p-6">
                                                {/* Book Image */}
                                                <div className="w-full h-32 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                                                    <img
                                                        src={book.image}
                                                        alt={book.title}
                                                        className="w-full h-full object-cover rounded-lg"
                                                        onError={(e) => {
                                                            e.target.style.display =
                                                                "none";
                                                            e.target.nextSibling.style.display =
                                                                "flex";
                                                        }}
                                                    />
                                                    <div className="hidden w-full h-full bg-gray-300 rounded-lg items-center justify-center">
                                                        <span className="text-4xl">
                                                            📖
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Book Info */}
                                                <div className="mb-4">
                                                    <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-2">
                                                        {book.title}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm mb-2">
                                                        {book.author}
                                                    </p>

                                                    {/* Status Badge */}
                                                    <div className="mb-3">
                                                        {getStatusBadge(
                                                            book.status,
                                                            book.days_overdue
                                                        )}
                                                    </div>

                                                    {/* Borrower Info */}
                                                    <div className="space-y-1 text-sm text-gray-600">
                                                        <div className="flex justify-between">
                                                            <span>
                                                                Peminjam:
                                                            </span>
                                                            <span className="font-medium">
                                                                {
                                                                    book.borrower_name
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>NIM:</span>
                                                            <span className="font-medium">
                                                                {book.nim}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>
                                                                Tgl Pinjam:
                                                            </span>
                                                            <span className="font-medium">
                                                                {
                                                                    book.borrow_date
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>
                                                                Tgl Kembali:
                                                            </span>
                                                            <span className="font-medium">
                                                                {book.due_date}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Button */}
                                                {book.status === "dipinjam" && (
                                                    <button
                                                        onClick={() =>
                                                            handleRequestReturn(
                                                                book.id
                                                            )
                                                        }
                                                        className="w-full bg-gradient-to-r from-[#6a1523] to-[#8a3837] text-white py-3 px-4 rounded-xl font-semibold hover:from-[#5a1220] hover:to-[#7a2837] transition-all duration-200 transform hover:scale-[1.02]"
                                                    >
                                                        Ajukan Pengembalian
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
