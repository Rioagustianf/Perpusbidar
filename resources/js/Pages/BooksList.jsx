import { Head, router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import BookCard from "../Components/BookCard";

export default function BooksList({ books, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [selectedFilter, setSelectedFilter] = useState(filters.rating || "");
    const [categoryFilter, setCategoryFilter] = useState(
        filters.category || "all"
    );
    const [availableOnly, setAvailableOnly] = useState(
        filters.available || false
    );
    const { flash } = usePage().props;

    // Debounce search to avoid too many requests
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleSearch();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedFilter, categoryFilter, availableOnly]);

    const handleSearch = () => {
        const params = {};

        if (searchTerm) params.search = searchTerm;
        if (selectedFilter) params.rating = selectedFilter;
        if (categoryFilter !== "all") params.category = categoryFilter;
        if (availableOnly) params.available = "true";

        router.get("/books", params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleBorrow = (book) => {
        // Redirect ke halaman form peminjaman dengan data buku
        router.visit(`/borrow-book/${book.id}`);
    };

    return (
        <>
            <Head title="Daftar Buku - Perpustakaan Digital Bina Darma" />

            <div className="min-h-screen bg-gradient-to-b from-[#ffc987] to-[#6a1523]">
                <Navbar activeTab="Daftar Buku" />

                <main className="pt-8 pb-16">
                    {/* Flash Messages */}
                    {flash.success && (
                        <div className="max-w-7xl mx-auto px-6 mb-4">
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                                <span className="block sm:inline">
                                    {flash.success}
                                </span>
                            </div>
                        </div>
                    )}

                    {flash.error && (
                        <div className="max-w-7xl mx-auto px-6 mb-4">
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                <span className="block sm:inline">
                                    {flash.error}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Search and Filter Section */}
                    <div className="max-w-7xl mx-auto px-6 mb-8">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            {/* Search Bar */}
                            <div className="relative flex-1 max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
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
                                <input
                                    type="text"
                                    placeholder="Cari judul buku, penulis, atau ISBN..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full pl-10 pr-4 py-3 border border-black rounded-full bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#6a1523] focus:border-transparent"
                                />
                            </div>

                            {/* Filter Controls */}
                            <div className="flex gap-4">
                                {/* Rating Filter */}
                                <div className="relative">
                                    <select
                                        value={selectedFilter}
                                        onChange={(e) =>
                                            setSelectedFilter(e.target.value)
                                        }
                                        className="px-6 py-3 border border-black rounded-full bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#6a1523] focus:border-transparent appearance-none pr-12"
                                    >
                                        <option value="">Semua Rating</option>
                                        <option value="5">
                                            ★★★★★ (5 Bintang)
                                        </option>
                                        <option value="4">
                                            ★★★★☆ (4+ Bintang)
                                        </option>
                                        <option value="3">
                                            ★★★☆☆ (3+ Bintang)
                                        </option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                {/* Category Filter */}
                                <div className="relative">
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) =>
                                            setCategoryFilter(e.target.value)
                                        }
                                        className="px-6 py-3 border border-black rounded-full bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#6a1523] focus:border-transparent appearance-none pr-12"
                                    >
                                        <option value="all">
                                            Semua Kategori
                                        </option>
                                        <option value="Teknologi">
                                            Teknologi
                                        </option>
                                        <option value="Bisnis">Bisnis</option>
                                        <option value="Sastra">Sastra</option>
                                        <option value="Sains">Sains</option>
                                        <option value="Sejarah">Sejarah</option>
                                        <option value="Agama">Agama</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                {/* Available Only Filter */}
                                <label className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-3 border border-black rounded-full">
                                    <input
                                        type="checkbox"
                                        checked={availableOnly}
                                        onChange={(e) =>
                                            setAvailableOnly(e.target.checked)
                                        }
                                        className="form-checkbox h-5 w-5 text-[#6a1523] rounded focus:ring-[#6a1523] focus:ring-2"
                                    />
                                    <span className="text-gray-700">
                                        Hanya yang tersedia
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Books Listing Section */}
                    <div className="max-w-7xl mx-auto px-6 bg-[#d9d9d9] rounded-2xl">
                        {/* Title with decorative lines */}
                        <div className="relative flex items-center justify-center mb-12">
                            <h1 className="text-3xl lg:text-4xl border-b-4 mt-2 text-center px-8 relative z-10">
                                Daftar Buku
                            </h1>
                        </div>

                        {/* Books Grid */}
                        {books.data && books.data.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-12">
                                    {books.data.map((book) => (
                                        <BookCard
                                            key={book.id}
                                            book={{
                                                id: book.id,
                                                title: book.title,
                                                author: book.author,
                                                cover: book.image
                                                    ? `/storage/${book.image}`
                                                    : "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop",
                                                rating:
                                                    Math.round(
                                                        book.average_rating
                                                    ) || 0,
                                                category: book.category,
                                                available:
                                                    book.available_count > 0,
                                                available_count:
                                                    book.available_count,
                                                stock: book.stock,
                                                description: book.description,
                                                isbn: book.isbn,
                                                is_recommended:
                                                    book.is_recommended,
                                            }}
                                            onBorrow={handleBorrow}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {books.links && books.links.length > 3 && (
                                    <div className="flex justify-center items-center space-x-2 mb-8">
                                        {books.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() =>
                                                    link.url &&
                                                    router.visit(link.url)
                                                }
                                                disabled={!link.url}
                                                className={`px-4 py-2 rounded-full transition-colors duration-300 ${
                                                    link.active
                                                        ? "bg-[#6a1523] text-white"
                                                        : link.url
                                                        ? "bg-white text-[#6a1523] hover:bg-[#6a1523] hover:text-white"
                                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                }`}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-600 text-xl">
                                    Tidak ada buku yang ditemukan
                                </p>
                                <p className="text-gray-500 mt-2">
                                    Coba ubah kata kunci pencarian atau filter
                                </p>
                            </div>
                        )}
                    </div>
                </main>

                <Footer bgColor="bg-gradient-to-b from-[#6a1523]]" />
            </div>
        </>
    );
}
