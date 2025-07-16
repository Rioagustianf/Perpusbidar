import { Head, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function BorrowForm({ book_id = null }) {
    const { flash, auth } = usePage().props;
    const [selectedBook, setSelectedBook] = useState(null);

    // Form data using Inertia.js useForm
    const { data, setData, post, processing, errors, reset } = useForm({
        book_id: book_id || "",
        borrow_date: "",
        return_date: "",
        notes: "",
    });

    // Auto-fill dates (tomorrow for borrow, 7 days later for return)
    useEffect(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const weekLater = new Date();
        weekLater.setDate(weekLater.getDate() + 8);

        setData({
            ...data,
            borrow_date: tomorrow.toISOString().split("T")[0],
            return_date: weekLater.toISOString().split("T")[0],
        });
    }, []);

    // Fetch book details if book_id is provided
    useEffect(() => {
        if (book_id) {
            fetch(`/api/books/${book_id}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        setSelectedBook(data.book);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching book:", error);
                });
        }
    }, [book_id]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate dates
        const borrowDate = new Date(data.borrow_date);
        const returnDate = new Date(data.return_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (borrowDate < today) {
            alert("Tanggal peminjaman tidak boleh kurang dari hari ini");
            return;
        }

        if (returnDate <= borrowDate) {
            alert("Tanggal pengembalian harus setelah tanggal peminjaman");
            return;
        }

        // Submit form using Inertia.js
        post("/borrow", {
            onSuccess: () => {
                alert("Pengajuan peminjaman berhasil dikirim!");
                reset();
            },
            onError: (errors) => {
                console.error("Form errors:", errors);
            },
        });
    };

    return (
        <>
            <Head title="Form Peminjaman - Perpustakaan Digital Bina Darma" />

            <div className="min-h-screen bg-gradient-to-b from-[#ffc987] to-[#6a1523]">
                <Navbar activeTab="Peminjaman" />

                <main className="pt-8 pb-16">
                    <div className="max-w-6xl mx-auto px-6">
                        {/* Flash Messages */}
                        {flash.success && (
                            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                                <span className="block sm:inline">
                                    {flash.success}
                                </span>
                            </div>
                        )}

                        {flash.error && (
                            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                <span className="block sm:inline">
                                    {flash.error}
                                </span>
                            </div>
                        )}

                        {/* Form Container */}
                        <div className="bg-[#7eb3d3] rounded-3xl p-8 md:p-12 shadow-2xl">
                            {/* Title */}
                            <h1 className="text-3xl md:text-4xl font-bold text-center text-black mb-8">
                                Form Peminjaman Buku
                            </h1>

                            {/* User Info */}
                            {auth.user && (
                                <div className="bg-white/50 rounded-2xl p-4 mb-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <strong>Nama:</strong>{" "}
                                            {auth.user.name}
                                        </div>
                                        <div>
                                            <strong>NIM:</strong>{" "}
                                            {auth.user.nim}
                                        </div>
                                        <div>
                                            <strong>Email:</strong>{" "}
                                            {auth.user.email}
                                        </div>
                                        <div>
                                            <strong>No. Telepon:</strong>{" "}
                                            {auth.user.phone || "Belum diisi"}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Book Info */}
                            {selectedBook && (
                                <div className="bg-white/50 rounded-2xl p-4 mb-8">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="w-full md:w-1/4">
                                            <img
                                                src={
                                                    selectedBook.image
                                                        ? `/storage/${selectedBook.image}`
                                                        : "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop"
                                                }
                                                alt={selectedBook.title}
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                        </div>
                                        <div className="w-full md:w-3/4">
                                            <h3 className="text-xl font-bold text-black mb-2">
                                                {selectedBook.title}
                                            </h3>
                                            <p className="text-gray-700 mb-1">
                                                <strong>Penulis:</strong>{" "}
                                                {selectedBook.author}
                                            </p>
                                            <p className="text-gray-700 mb-1">
                                                <strong>Kategori:</strong>{" "}
                                                {selectedBook.category}
                                            </p>
                                            <p className="text-gray-700 mb-1">
                                                <strong>ISBN:</strong>{" "}
                                                {selectedBook.isbn}
                                            </p>
                                            <p className="text-gray-700 mb-1">
                                                <strong>Tahun Terbit:</strong>{" "}
                                                {selectedBook.year || "-"}
                                            </p>
                                            <p className="text-gray-700 mb-1">
                                                <strong>Stok Tersedia:</strong>{" "}
                                                {selectedBook.available_count}
                                            </p>
                                            {selectedBook.description && (
                                                <p className="text-gray-700 mt-2">
                                                    <strong>Deskripsi:</strong>{" "}
                                                    {selectedBook.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left Column */}
                                    <div className="space-y-6">
                                        {/* Book Selection */}
                                        {(!book_id || book_id === "") && (
                                            <div>
                                                <label className="block text-black text-lg font-semibold mb-3">
                                                    Pilih Buku
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="number"
                                                    value={data.book_id}
                                                    onChange={(e) =>
                                                        setData(
                                                            "book_id",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                    className="bg-white w-full px-4 py-4 rounded-2xl border-2 border-black focus:border-blue-500 focus:outline-none text-gray-800 text-lg"
                                                    placeholder="Masukkan ID buku"
                                                />
                                                {errors.book_id && (
                                                    <div className="text-red-500 text-sm mt-1">
                                                        {errors.book_id}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Tanggal Peminjaman */}
                                        <div>
                                            <label className="block text-black text-lg font-semibold mb-3">
                                                Tanggal Peminjaman
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="date"
                                                value={data.borrow_date}
                                                onChange={(e) =>
                                                    setData(
                                                        "borrow_date",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                min={
                                                    new Date()
                                                        .toISOString()
                                                        .split("T")[0]
                                                }
                                                className="bg-white w-full px-4 py-4 rounded-2xl border-2 border-black focus:border-blue-500 focus:outline-none text-gray-800 text-lg"
                                            />
                                            {errors.borrow_date && (
                                                <div className="text-red-500 text-sm mt-1">
                                                    {errors.borrow_date}
                                                </div>
                                            )}
                                        </div>

                                        {/* Tanggal Pengembalian */}
                                        <div>
                                            <label className="block text-black text-lg font-semibold mb-3">
                                                Tanggal Pengembalian
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="date"
                                                value={data.return_date}
                                                onChange={(e) =>
                                                    setData(
                                                        "return_date",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                min={data.borrow_date}
                                                className="bg-white w-full px-4 py-4 rounded-2xl border-2 border-black focus:border-blue-500 focus:outline-none text-gray-800 text-lg"
                                            />
                                            {errors.return_date && (
                                                <div className="text-red-500 text-sm mt-1">
                                                    {errors.return_date}
                                                </div>
                                            )}
                                            <p className="text-gray-600 text-sm mt-1">
                                                Maksimal 7 hari peminjaman
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-6">
                                        {/* Catatan */}
                                        <div>
                                            <label className="block text-black text-lg font-semibold mb-3">
                                                Catatan (Opsional)
                                            </label>
                                            <textarea
                                                value={data.notes}
                                                onChange={(e) =>
                                                    setData(
                                                        "notes",
                                                        e.target.value
                                                    )
                                                }
                                                rows={8}
                                                className="bg-white w-full px-4 py-4 rounded-2xl border-2 border-black focus:border-blue-500 focus:outline-none text-gray-800 text-lg resize-none"
                                                placeholder="Tambahkan catatan jika diperlukan..."
                                            />
                                            {errors.notes && (
                                                <div className="text-red-500 text-sm mt-1">
                                                    {errors.notes}
                                                </div>
                                            )}
                                        </div>

                                        {/* Informasi Penting */}
                                        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
                                            <h4 className="font-semibold mb-2">
                                                Informasi Penting:
                                            </h4>
                                            <ul className="text-sm space-y-1">
                                                <li>
                                                    • Maksimal 3 buku yang dapat
                                                    dipinjam secara bersamaan
                                                </li>
                                                <li>
                                                    • Keterlambatan pengembalian
                                                    akan dikenakan denda
                                                </li>
                                                <li>
                                                    • Pastikan buku dikembalikan
                                                    dalam kondisi baik
                                                </li>
                                                <li>
                                                    • Pengajuan akan diproses
                                                    oleh admin dalam 1x24 jam
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="text-center">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-[#6a1523] hover:bg-[#5a1220] disabled:bg-gray-400 text-white font-bold py-4 px-12 rounded-full text-xl transition-colors duration-300 shadow-lg"
                                    >
                                        {processing
                                            ? "Mengirim..."
                                            : "Kirim Pengajuan"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>

                <Footer bgColor="bg-gradient-to-b from-[#6a1523]" />
            </div>
        </>
    );
}
