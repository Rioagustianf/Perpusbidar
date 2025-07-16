import { Head, router, useForm, usePage } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import AdminLayout from "../../Components/Admin/AdminLayout";
import { Dialog } from "@headlessui/react";

export default function BooksManagement({ books, categories }) {
    const { flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [openDrawerId, setOpenDrawerId] = useState(null);
    const [actionModal, setActionModal] = useState(false);
    const [actionBook, setActionBook] = useState(null);
    const [modalStock, setModalStock] = useState(0);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Form for adding books
    const {
        data: addData,
        setData: setAddData,
        post,
        processing: addProcessing,
        errors: addErrors,
        reset: resetAdd,
    } = useForm({
        title: "",
        author: "",
        isbn: "",
        category: "",
        description: "",
        stock: "",
        image: null,
    });

    // Form for editing books
    const {
        data: editData,
        setData: setEditData,
        post: putPost,
        processing: editProcessing,
        errors: editErrors,
        reset: resetEdit,
    } = useForm({
        title: "",
        author: "",
        isbn: "",
        category: "",
        description: "",
        stock: "",
        image: null,
        _method: "PUT",
    });

    const filteredBooks =
        books.data?.filter((book) => {
            const matchesSearch =
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.isbn.includes(searchTerm);
            const matchesCategory =
                selectedCategory === "all" ||
                book.category === selectedCategory;
            return matchesSearch && matchesCategory;
        }) || [];

    const handleAddBook = () => {
        resetAdd();
        setShowAddModal(true);
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();
        post("/admin/books", {
            onSuccess: () => {
                setShowAddModal(false);
                resetAdd();
                router.visit("/admin/books", { replace: true });
            },
        });
    };

    const handleEditBook = (book) => {
        setSelectedBook(book);
        setEditData({
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            category: book.category,
            description: book.description || "",
            stock: book.stock.toString(),
            image: null,
            _method: "PUT",
        });
        setShowEditModal(true);
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();
        putPost(`/admin/books/${selectedBook.id}`, {
            onSuccess: () => {
                setShowEditModal(false);
                resetEdit();
                setSelectedBook(null);
            },
        });
    };

    const handleDeleteBook = (book) => {
        router.delete(`/admin/books/${book.id}`);
    };

    const handleToggleRecommendation = (book) => {
        router.post(`/admin/books/${book.id}/recommend`, {
            is_recommended: !book.is_recommended,
        });
    };

    const handleUpdateStock = (book, newStock) => {
        if (newStock !== null && newStock >= 0) {
            router.post(`/admin/books/${book.id}/update-stock`, {
                stock: parseInt(newStock),
            });
        }
    };

    const openActionModal = (book) => {
        setActionBook(book);
        setModalStock(book.stock);
        setActionModal(true);
    };
    const closeActionModal = () => {
        setActionModal(false);
        setActionBook(null);
    };

    const getStatusBadge = (book) => {
        if (book.available_count === 0) {
            return (
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                    Tidak Tersedia
                </span>
            );
        }
        return (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Tersedia ({book.available_count})
            </span>
        );
    };

    return (
        <AdminLayout title="Kelola Buku">
            <Head title="Kelola Buku - Admin Dashboard" />

            <div className="space-y-6">
                {/* Flash Messages */}
                {flash.success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                        <span className="block sm:inline">{flash.success}</span>
                    </div>
                )}

                {flash.error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <span className="block sm:inline">{flash.error}</span>
                    </div>
                )}

                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Manajemen Buku
                        </h2>
                        <p className="text-gray-600">
                            Kelola koleksi buku perpustakaan ({books.total || 0}{" "}
                            buku)
                        </p>
                    </div>
                    <button
                        onClick={handleAddBook}
                        className="bg-gradient-to-r from-[#6a1523] to-[#8a3837] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#5a1220] hover:to-[#7a2837] transition-all duration-200 flex items-center"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Tambah Buku
                    </button>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Cari berdasarkan judul, penulis, atau ISBN..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#6a1523] focus:border-transparent"
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
                        <div className="md:w-64">
                            <select
                                value={selectedCategory}
                                onChange={(e) =>
                                    setSelectedCategory(e.target.value)
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#6a1523] focus:border-transparent"
                            >
                                <option value="all">Semua Kategori</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Books Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                    <table className="min-w-full text-sm align-middle">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left font-semibold">
                                    Cover
                                </th>
                                <th className="px-6 py-4 text-left font-semibold">
                                    Judul
                                </th>
                                <th className="px-6 py-4 text-left font-semibold">
                                    Penulis
                                </th>
                                <th className="px-6 py-4 text-left font-semibold">
                                    Kategori
                                </th>
                                <th className="px-6 py-4 text-left font-semibold">
                                    Stok
                                </th>
                                <th className="px-6 py-4 text-left font-semibold">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-center font-semibold">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredBooks.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="text-center py-8 text-gray-500"
                                    >
                                        Tidak ada buku ditemukan
                                    </td>
                                </tr>
                            ) : (
                                filteredBooks.map((book) => (
                                    <tr
                                        key={book.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-3">
                                            <img
                                                src={
                                                    book.image
                                                        ? book.image.startsWith(
                                                              "http"
                                                          )
                                                            ? book.image
                                                            : `/storage/${book.image}`
                                                        : "/assets/book-default.png"
                                                }
                                                alt={book.title}
                                                className="w-12 h-16 object-cover rounded shadow"
                                                onError={(e) => {
                                                    e.target.style.display =
                                                        "none";
                                                }}
                                            />
                                        </td>
                                        <td className="px-6 py-3 font-bold text-gray-900 max-w-xs truncate flex items-center gap-1">
                                            {book.title}
                                            {book.is_recommended && (
                                                <span
                                                    title="Buku Rekomendasi"
                                                    className="ml-1 text-yellow-500 text-lg"
                                                >
                                                    ⭐
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-gray-700 max-w-xs truncate">
                                            {book.author}
                                        </td>
                                        <td className="px-6 py-3 text-gray-700">
                                            {book.category}
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            {book.stock}
                                        </td>
                                        <td className="px-6 py-3">
                                            {getStatusBadge(book)}
                                        </td>
                                        <td className="px-6 py-3 text-center relative">
                                            {/* Tombol titik tiga untuk membuka drawer */}
                                            <button
                                                className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
                                                title="Aksi"
                                                onClick={() =>
                                                    setOpenDrawerId(book.id)
                                                }
                                            >
                                                <svg
                                                    className="w-6 h-6 text-gray-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        cx="5"
                                                        cy="12"
                                                        r="2"
                                                    />
                                                    <circle
                                                        cx="12"
                                                        cy="12"
                                                        r="2"
                                                    />
                                                    <circle
                                                        cx="19"
                                                        cy="12"
                                                        r="2"
                                                    />
                                                </svg>
                                            </button>
                                            {/* Drawer (Dialog) */}
                                            <Dialog
                                                open={openDrawerId === book.id}
                                                onClose={() =>
                                                    setOpenDrawerId(null)
                                                }
                                                className="relative z-50"
                                            >
                                                <div
                                                    className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                                                    aria-hidden="true"
                                                    onClick={() =>
                                                        setOpenDrawerId(null)
                                                    }
                                                />
                                                <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
                                                    <Dialog.Panel className="w-[320px] sm:w-[380px] bg-white h-full shadow-xl flex flex-col p-6 animate-slide-in-right">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h3 className="text-lg font-semibold">
                                                                Aksi Buku
                                                            </h3>
                                                            <button
                                                                onClick={() =>
                                                                    setOpenDrawerId(
                                                                        null
                                                                    )
                                                                }
                                                                className="p-2 rounded hover:bg-gray-100"
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
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M6 18L18 6M6 6l12 12"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        <div className="flex items-center gap-4 mb-4">
                                                            <img
                                                                src={
                                                                    book.image
                                                                        ? book.image.startsWith(
                                                                              "http"
                                                                          )
                                                                            ? book.image
                                                                            : `/storage/${book.image}`
                                                                        : "/assets/book-default.png"
                                                                }
                                                                alt={book.title}
                                                                className="w-16 h-20 object-cover rounded shadow"
                                                            />
                                                            <div>
                                                                <div className="font-bold text-gray-900 text-base">
                                                                    {book.title}
                                                                </div>
                                                                <div className="text-gray-600 text-sm">
                                                                    {
                                                                        book.author
                                                                    }
                                                                </div>
                                                                <div className="text-gray-600 text-sm">
                                                                    Kategori:{" "}
                                                                    {
                                                                        book.category
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-2 mb-4">
                                                            <button
                                                                onClick={() => {
                                                                    setShowEditModal(
                                                                        true
                                                                    );
                                                                    setSelectedBook(
                                                                        book
                                                                    );
                                                                    setOpenDrawerId(
                                                                        null
                                                                    );
                                                                    setEditData(
                                                                        {
                                                                            title: book.title,
                                                                            author: book.author,
                                                                            isbn: book.isbn,
                                                                            category:
                                                                                book.category,
                                                                            description:
                                                                                book.description ||
                                                                                "",
                                                                            stock: book.stock.toString(),
                                                                            image: null,
                                                                            _method:
                                                                                "PUT",
                                                                        }
                                                                    );
                                                                }}
                                                                className="w-full text-left px-4 py-3 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200"
                                                            >
                                                                ✏️ Edit Buku
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setActionBook(
                                                                        book
                                                                    );
                                                                    setShowDeleteConfirm(
                                                                        true
                                                                    );
                                                                    setOpenDrawerId(
                                                                        null
                                                                    );
                                                                }}
                                                                className="w-full text-left px-4 py-3 rounded-lg bg-red-100 text-red-800 hover:bg-red-200"
                                                            >
                                                                🗑️ Hapus Buku
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    handleToggleRecommendation(
                                                                        book
                                                                    );
                                                                    setOpenDrawerId(
                                                                        null
                                                                    );
                                                                }}
                                                                className="w-full text-left px-4 py-3 rounded-lg bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                                            >
                                                                {book.is_recommended
                                                                    ? "⭐ Hapus Rekomendasi"
                                                                    : "⭐ Jadikan Rekomendasi"}
                                                            </button>
                                                        </div>
                                                        <div className="border-t border-gray-100 my-2" />
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <span>Stok:</span>
                                                            <input
                                                                type="number"
                                                                min={0}
                                                                defaultValue={
                                                                    book.stock
                                                                }
                                                                onBlur={(e) =>
                                                                    handleUpdateStock(
                                                                        book,
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    )
                                                                }
                                                                className="w-16 px-2 py-1 border rounded"
                                                            />
                                                        </div>
                                                        <div className="flex justify-end mt-auto">
                                                            <button
                                                                onClick={() =>
                                                                    setOpenDrawerId(
                                                                        null
                                                                    )
                                                                }
                                                                className="px-4 py-2 rounded bg-gray-200"
                                                            >
                                                                Tutup
                                                            </button>
                                                        </div>
                                                    </Dialog.Panel>
                                                </div>
                                            </Dialog>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {books.links && books.links.length > 3 && (
                    <div className="flex justify-center items-center space-x-2">
                        {books.links.map((link, index) => (
                            <button
                                key={index}
                                onClick={() =>
                                    link.url && router.visit(link.url)
                                }
                                disabled={!link.url}
                                className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                                    link.active
                                        ? "bg-[#6a1523] text-white"
                                        : link.url
                                        ? "bg-white text-[#6a1523] border border-gray-300 hover:bg-gray-50"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}

                {/* Add Book Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/35 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                            <h3 className="text-lg font-semibold mb-4">
                                Tambah Buku Baru
                            </h3>
                            <form
                                onSubmit={handleSubmitAdd}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Judul Buku *
                                    </label>
                                    <input
                                        type="text"
                                        value={addData.title}
                                        onChange={(e) =>
                                            setAddData("title", e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6a1523] focus:border-transparent"
                                        required
                                    />
                                    {addErrors.title && (
                                        <div className="text-red-500 text-xs mt-1">
                                            {addErrors.title}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Penulis *
                                    </label>
                                    <input
                                        type="text"
                                        value={addData.author}
                                        onChange={(e) =>
                                            setAddData("author", e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6a1523] focus:border-transparent"
                                        required
                                    />
                                    {addErrors.author && (
                                        <div className="text-red-500 text-xs mt-1">
                                            {addErrors.author}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        ISBN *
                                    </label>
                                    <input
                                        type="text"
                                        value={addData.isbn}
                                        onChange={(e) =>
                                            setAddData("isbn", e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6a1523] focus:border-transparent"
                                        required
                                    />
                                    {addErrors.isbn && (
                                        <div className="text-red-500 text-xs mt-1">
                                            {addErrors.isbn}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Kategori *
                                    </label>
                                    <select
                                        value={addData.category}
                                        onChange={(e) =>
                                            setAddData(
                                                "category",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6a1523] focus:border-transparent"
                                        required
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {categories.map((cat) => (
                                            <option
                                                key={cat.id}
                                                value={cat.name}
                                            >
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    {addErrors.category && (
                                        <div className="text-red-500 text-xs mt-1">
                                            {addErrors.category}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Stok *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={addData.stock}
                                        onChange={(e) =>
                                            setAddData("stock", e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6a1523] focus:border-transparent"
                                        required
                                    />
                                    {addErrors.stock && (
                                        <div className="text-red-500 text-xs mt-1">
                                            {addErrors.stock}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Deskripsi
                                    </label>
                                    <textarea
                                        value={addData.description}
                                        onChange={(e) =>
                                            setAddData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6a1523] focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Gambar Cover
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setAddData(
                                                "image",
                                                e.target.files[0]
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6a1523] focus:border-transparent"
                                    />
                                    {addErrors.image && (
                                        <div className="text-red-500 text-xs mt-1">
                                            {addErrors.image}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={addProcessing}
                                        className="px-4 py-2 bg-[#6a1523] text-white rounded-lg hover:bg-[#5a1220] disabled:bg-gray-400"
                                    >
                                        {addProcessing
                                            ? "Menyimpan..."
                                            : "Simpan"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Book Modal */}
                {showEditModal && selectedBook && (
                    <div className="fixed inset-0 bg-black/30 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                            <h3 className="text-lg font-semibold mb-4">
                                Edit Buku
                            </h3>
                            <form
                                onSubmit={handleSubmitEdit}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Judul Buku *
                                    </label>
                                    <input
                                        type="text"
                                        value={editData.title}
                                        onChange={(e) =>
                                            setEditData("title", e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6a1523] focus:border-transparent"
                                        required
                                    />
                                    {editErrors.title && (
                                        <div className="text-red-500 text-xs mt-1">
                                            {editErrors.title}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Penulis *
                                    </label>
                                    <input
                                        type="text"
                                        value={editData.author}
                                        onChange={(e) =>
                                            setEditData(
                                                "author",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6a1523] focus:border-transparent"
                                        required
                                    />
                                    {editErrors.author && (
                                        <div className="text-red-500 text-xs mt-1">
                                            {editErrors.author}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        ISBN *
                                    </label>
                                    <input
                                        type="text"
                                        value={editData.isbn}
                                        onChange={(e) =>
                                            setEditData("isbn", e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6a1523] focus:border-transparent"
                                        required
                                    />
                                    {editErrors.isbn && (
                                        <div className="text-red-500 text-xs mt-1">
                                            {editErrors.isbn}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Kategori *
                                    </label>
                                    <select
                                        value={editData.category}
                                        onChange={(e) =>
                                            setEditData(
                                                "category",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6a1523] focus:border-transparent"
                                        required
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {categories.map((cat) => (
                                            <option
                                                key={cat.id}
                                                value={cat.name}
                                            >
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    {editErrors.category && (
                                        <div className="text-red-500 text-xs mt-1">
                                            {editErrors.category}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Stok *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={editData.stock}
                                        onChange={(e) =>
                                            setEditData("stock", e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6a1523] focus:border-transparent"
                                        required
                                    />
                                    {editErrors.stock && (
                                        <div className="text-red-500 text-xs mt-1">
                                            {editErrors.stock}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Deskripsi
                                    </label>
                                    <textarea
                                        value={editData.description}
                                        onChange={(e) =>
                                            setEditData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6a1523] focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Gambar Cover Baru
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setEditData(
                                                "image",
                                                e.target.files[0]
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6a1523] focus:border-transparent"
                                    />
                                    {editErrors.image && (
                                        <div className="text-red-500 text-xs mt-1">
                                            {editErrors.image}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowEditModal(false);
                                            setSelectedBook(null);
                                        }}
                                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={editProcessing}
                                        className="px-4 py-2 bg-[#6a1523] text-white rounded-lg hover:bg-[#5a1220] disabled:bg-gray-400"
                                    >
                                        {editProcessing
                                            ? "Menyimpan..."
                                            : "Update"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {actionModal && actionBook && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                            <h3 className="text-lg font-semibold mb-4">
                                Aksi Buku
                            </h3>
                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={
                                        actionBook.image
                                            ? actionBook.image.startsWith(
                                                  "http"
                                              )
                                                ? actionBook.image
                                                : `/storage/${actionBook.image}`
                                            : "/assets/book-default.png"
                                    }
                                    alt={actionBook.title}
                                    className="w-20 h-24 object-cover rounded shadow"
                                />
                                <div>
                                    <div className="font-bold text-gray-900 text-lg">
                                        {actionBook.title}
                                    </div>
                                    <div className="text-gray-600 text-sm">
                                        {actionBook.author}
                                    </div>
                                    <div className="text-gray-600 text-sm">
                                        Kategori: {actionBook.category}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 mb-4">
                                <button
                                    onClick={() => {
                                        closeActionModal();
                                        handleEditBook(actionBook);
                                    }}
                                    className="w-full text-left px-4 py-3 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200"
                                >
                                    ✏️ Edit Buku
                                </button>
                                <button
                                    onClick={() => {
                                        closeActionModal();
                                        handleDeleteBook(actionBook);
                                    }}
                                    className="w-full text-left px-4 py-3 rounded-lg bg-red-100 text-red-800 hover:bg-red-200"
                                >
                                    🗑️ Hapus Buku
                                </button>
                                <button
                                    onClick={() => {
                                        closeActionModal();
                                        handleToggleRecommendation(actionBook);
                                    }}
                                    className="w-full text-left px-4 py-3 rounded-lg bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                >
                                    {actionBook.is_recommended
                                        ? "⭐ Hapus Rekomendasi"
                                        : "⭐ Jadikan Rekomendasi"}
                                </button>
                            </div>
                            <div className="border-t border-gray-100 my-2" />
                            <div className="flex items-center gap-2 mb-4">
                                <span>Stok:</span>
                                <input
                                    type="number"
                                    min={0}
                                    value={modalStock}
                                    onChange={(e) =>
                                        setModalStock(e.target.value)
                                    }
                                    className="w-16 px-2 py-1 border rounded"
                                />
                                <button
                                    onClick={() => {
                                        closeActionModal();
                                        handleUpdateStock(
                                            actionBook,
                                            parseInt(modalStock)
                                        );
                                    }}
                                    className="px-3 py-1 rounded bg-blue-600 text-white text-xs"
                                >
                                    Update
                                </button>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={closeActionModal}
                                    className="px-4 py-2 rounded bg-gray-200"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showDeleteConfirm && actionBook && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
                        <div className="bg-white rounded-xl p-6 w-full max-w-xs">
                            <h3 className="text-lg font-semibold mb-4">
                                Konfirmasi Hapus
                            </h3>
                            <p className="text-gray-800 mb-4">
                                Apakah Anda yakin ingin menghapus buku
                                <span className="font-bold">
                                    {" "}
                                    "{actionBook.title}"
                                </span>
                                ? Aksi ini tidak dapat dibatalkan.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setActionBook(null);
                                    }}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() => {
                                        handleDeleteBook(actionBook);
                                        setShowDeleteConfirm(false);
                                        setActionBook(null);
                                    }}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
