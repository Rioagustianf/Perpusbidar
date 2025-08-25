import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "../../Components/Admin/AdminLayout";
import { router } from "@inertiajs/react";

export default function ReturnApproval() {
    const { requests = { data: [] }, stats = {} } = usePage().props;
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const returnRequests = requests.data;
    const [notification, setNotification] = useState(null);
    const [notificationType, setNotificationType] = useState("success");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedCondition, setSelectedCondition] = useState("baik");

    const filteredRequests = returnRequests.filter((request) => {
        const matchesSearch =
            (request.user_name || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            (request.user_nim || "").includes(searchTerm) ||
            (request.book_title || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
        const matchesStatus =
            selectedStatus === "all" || request.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const getImageUrl = (img) => {
        if (!img) return "/assets/book-default.png";
        if (img.startsWith("http")) return img;
        return `/storage/${img}`;
    };

    const mappedRequests = filteredRequests.map((req) => ({
        id: req.id,
        book_title: req.book?.title || "-",
        book_author: req.book?.author || "-",
        image: getImageUrl(req.book?.image),
        user_name: req.user?.name || "-",
        user_nim: req.user?.nim || "-",
        borrow_date: req.borrow_date,
        due_date: req.return_date,
        return_request_date: req.updated_at,
        status: req.status,
        is_overdue: req.is_overdue,
        overdue_days: req.overdue_days || 0,
        fine_amount: req.fine_amount || 0,
        condition: req.condition || "-",
        notes: req.notes || "",
    }));

    const handleApproveReturn = (requestId) => {
        setSelectedId(requestId);
        setModalOpen(true);
    };

    const submitApprove = () => {
        setModalOpen(false);
        router.post(
            `/admin/borrowings/${selectedId}/return`,
            { condition: selectedCondition },
            {
                onSuccess: () => {
                    setNotification("Pengembalian berhasil dikonfirmasi.");
                    setNotificationType("success");
                    router.reload({ only: ["requests"] });
                },
                onError: () => {
                    setNotification("Gagal mengonfirmasi pengembalian.");
                    setNotificationType("error");
                },
            }
        );
    };

    const handleRejectReturn = (requestId) => {
        const reason = prompt("Masukkan alasan penolakan:");
        if (reason) {
            router.post(
                `/admin/borrowings/${requestId}/reject`,
                { rejection_reason: reason },
                {
                    onSuccess: () => {
                        setNotification("Pengembalian ditolak.");
                        setNotificationType("success");
                        router.reload({ only: ["requests"] });
                    },
                    onError: () => {
                        setNotification("Gagal menolak pengembalian.");
                        setNotificationType("error");
                    },
                }
            );
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "pending":
                return (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        Menunggu Verifikasi
                    </span>
                );
            case "approved":
                return (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Dikembalikan
                    </span>
                );
            case "rejected":
                return (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                        Ditolak
                    </span>
                );
            default:
                return null;
        }
    };

    const getConditionBadge = (condition) => {
        switch (condition) {
            case "baik":
                return (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                        Baik
                    </span>
                );
            case "rusak":
                return (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                        Rusak
                    </span>
                );
            default:
                return null;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AdminLayout title="Approval Pengembalian">
            <Head title="Approval Pengembalian - Admin Dashboard" />

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

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm">
                        <h3 className="text-lg font-semibold mb-4">
                            Konfirmasi Pengembalian
                        </h3>
                        <label className="block mb-2 font-medium">
                            Kondisi Buku:
                        </label>
                        <select
                            value={selectedCondition}
                            onChange={(e) =>
                                setSelectedCondition(e.target.value)
                            }
                            className="w-full px-4 py-2 rounded border border-gray-300 mb-4"
                        >
                            <option value="baik">Baik</option>
                            <option value="rusak">Rusak</option>
                        </select>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 rounded bg-gray-200"
                            >
                                Batal
                            </button>
                            <button
                                onClick={submitApprove}
                                className="px-4 py-2 rounded bg-green-600 text-white"
                            >
                                Konfirmasi
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Approval Pengembalian
                    </h2>
                    <p className="text-gray-600">
                        Verifikasi dan kelola pengembalian buku dari mahasiswa
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Menunggu Verifikasi
                                </p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {stats.pendingVerification || 0}
                                </p>
                            </div>
                            <div className="text-3xl">⏳</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Dikembalikan Hari Ini
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {stats.returnedToday || 0}
                                </p>
                            </div>
                            <div className="text-3xl">✅</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Terlambat
                                </p>
                                <p className="text-2xl font-bold text-red-600">
                                    {stats.overdueCount || 0}
                                </p>
                            </div>
                            <div className="text-3xl">⚠️</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total Denda
                                </p>
                                <p className="text-lg font-bold text-orange-600">
                                    {formatCurrency(stats.totalFines || 0)}
                                </p>
                            </div>
                            <div className="text-3xl">💰</div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Cari berdasarkan nama, NIM, atau judul buku..."
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
                                value={selectedStatus}
                                onChange={(e) =>
                                    setSelectedStatus(e.target.value)
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#6a1523] focus:border-transparent"
                            >
                                <option value="all">Semua Status</option>
                                <option value="pending">
                                    Menunggu Verifikasi
                                </option>
                                <option value="approved">Dikembalikan</option>
                                <option value="rejected">Ditolak</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Return Requests List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    {mappedRequests.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📤</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Tidak ada permintaan pengembalian ditemukan
                            </h3>
                            <p className="text-gray-600">
                                Coba ubah kata kunci pencarian atau filter
                                status
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {mappedRequests.map((request) => (
                                <div
                                    key={request.id}
                                    className="p-6 hover:bg-gray-50"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4 flex-1">
                                            {/* Book Image */}
                                            <div className="w-16 h-20 flex-shrink-0">
                                                <img
                                                    src={request.image}
                                                    alt={request.book_title}
                                                    className="w-16 h-20 object-cover rounded-lg"
                                                    onError={(e) => {
                                                        e.target.style.display =
                                                            "none";
                                                        e.target.nextSibling.style.display =
                                                            "flex";
                                                    }}
                                                />
                                                <div className="hidden w-16 h-20 bg-gray-300 rounded-lg items-center justify-center">
                                                    <span className="text-2xl">
                                                        📖
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Request Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {request.book_title}
                                                    </h3>
                                                    <div className="flex space-x-2">
                                                        {getStatusBadge(
                                                            request.status
                                                        )}
                                                        {request.is_overdue && (
                                                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                                                                Terlambat{" "}
                                                                {
                                                                    request.overdue_days
                                                                }{" "}
                                                                hari
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <p className="text-sm text-gray-600 mb-3">
                                                    by: {request.book_author}
                                                </p>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-600">
                                                            <span className="font-medium">
                                                                Peminjam:
                                                            </span>{" "}
                                                            {request.user_name}
                                                        </p>
                                                        <p className="text-gray-600">
                                                            <span className="font-medium">
                                                                NIM:
                                                            </span>{" "}
                                                            {request.user_nim}
                                                        </p>
                                                        <p className="text-gray-600 flex items-center">
                                                            <span className="font-medium">
                                                                Kondisi Buku:
                                                            </span>
                                                            <span className="ml-2">
                                                                {getConditionBadge(
                                                                    request.condition
                                                                )}
                                                            </span>
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">
                                                            <span className="font-medium">
                                                                Tanggal Pinjam:
                                                            </span>{" "}
                                                            {formatDate(
                                                                request.borrow_date
                                                            )}
                                                        </p>
                                                        <p className="text-gray-600">
                                                            <span className="font-medium">
                                                                Jatuh Tempo:
                                                            </span>{" "}
                                                            {formatDate(
                                                                request.due_date
                                                            )}
                                                        </p>
                                                        <p className="text-gray-600">
                                                            <span className="font-medium">
                                                                Permintaan
                                                                Kembali:
                                                            </span>{" "}
                                                            {formatDate(
                                                                request.return_request_date
                                                            )}
                                                        </p>
                                                        {request.fine_amount >
                                                            0 && (
                                                            <p className="text-red-600 font-medium">
                                                                <span className="font-medium">
                                                                    Denda:
                                                                </span>{" "}
                                                                {formatCurrency(
                                                                    request.fine_amount
                                                                )}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {request.notes && (
                                                    <div className="mt-3">
                                                        <p className="text-sm text-gray-600">
                                                            <span className="font-medium">
                                                                Catatan:
                                                            </span>{" "}
                                                            {request.notes}
                                                        </p>
                                                    </div>
                                                )}

                                                {request.condition ===
                                                    "rusak" && (
                                                    <div className="mt-3 p-3 bg-red-50 rounded-lg">
                                                        <p className="text-sm text-red-700">
                                                            <span className="font-medium">
                                                                ⚠️ Perhatian:
                                                            </span>{" "}
                                                            Buku dikembalikan
                                                            dalam kondisi rusak.
                                                            Pertimbangkan denda
                                                            tambahan.
                                                        </p>
                                                    </div>
                                                )}

                                                {request.is_overdue && (
                                                    <div className="mt-3 p-3 bg-orange-50 rounded-lg">
                                                        <p className="text-sm text-orange-700">
                                                            <span className="font-medium">
                                                                ⏰ Terlambat:
                                                            </span>{" "}
                                                            Pengembalian
                                                            melebihi batas waktu{" "}
                                                            {
                                                                request.overdue_days
                                                            }{" "}
                                                            hari.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        {request.status ===
                                            "return_requested" && (
                                            <div className="flex space-x-2 ml-4">
                                                <button
                                                    onClick={() =>
                                                        handleApproveReturn(
                                                            request.id
                                                        )
                                                    }
                                                    className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center"
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
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                    Terima
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleRejectReturn(
                                                            request.id
                                                        )
                                                    }
                                                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center"
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
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                    Tolak
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
