import { Head, usePage, router } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "../../Components/Admin/AdminLayout";

export default function BorrowingApproval() {
    const { requests = [] } = usePage().props;
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [notification, setNotification] = useState(null);
    const [notificationType, setNotificationType] = useState("success");
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const borrowingRequests = requests;

    const filteredRequests = borrowingRequests.filter((request) => {
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

    const handleApprove = (requestId) => {
        setNotification(null);
        router.post(
            `/admin/borrowings/${requestId}/approve`,
            {},
            {
                onSuccess: () => {
                    setNotification("Permintaan berhasil disetujui.");
                    setNotificationType("success");
                    router.reload({ only: ["requests"] });
                },
                onError: () => {
                    setNotification("Gagal menyetujui permintaan.");
                    setNotificationType("error");
                },
            }
        );
    };

    const handleReject = (requestId) => {
        setRejectingId(requestId);
        setRejectReason("");
    };

    const submitReject = () => {
        if (!rejectReason.trim()) {
            setNotification("Alasan penolakan harus diisi.");
            setNotificationType("error");
            return;
        }
        router.post(
            `/admin/borrowings/${rejectingId}/reject`,
            { rejection_reason: rejectReason },
            {
                onSuccess: () => {
                    setNotification("Permintaan berhasil ditolak.");
                    setNotificationType("success");
                    setRejectingId(null);
                    setRejectReason("");
                    router.reload({ only: ["requests"] });
                },
                onError: () => {
                    setNotification("Gagal menolak permintaan.");
                    setNotificationType("error");
                },
            }
        );
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "pending":
                return (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        Menunggu Approval
                    </span>
                );
            case "approved":
                return (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Disetujui
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <AdminLayout title="Approval Peminjaman">
            <Head title="Approval Peminjaman - Admin Dashboard" />

            {/* Notifikasi */}
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

            {/* Modal Penolakan */}
            {rejectingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4 text-gray-900">
                            Alasan Penolakan
                        </h3>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-[#6a1523]"
                            rows={3}
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Masukkan alasan penolakan..."
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                                onClick={() => setRejectingId(null)}
                            >
                                Batal
                            </button>
                            <button
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                                onClick={submitReject}
                            >
                                Tolak Permintaan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Approval Peminjaman
                    </h2>
                    <p className="text-gray-600">
                        Kelola permintaan peminjaman buku dari mahasiswa
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Menunggu Approval
                                </p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {
                                        borrowingRequests.filter(
                                            (req) => req.status === "pending"
                                        ).length
                                    }
                                </p>
                            </div>
                            <div className="text-3xl">⏳</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Disetujui Hari Ini
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {
                                        borrowingRequests.filter(
                                            (req) => req.status === "approved"
                                        ).length
                                    }
                                </p>
                            </div>
                            <div className="text-3xl">✅</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Ditolak
                                </p>
                                <p className="text-2xl font-bold text-red-600">
                                    {
                                        borrowingRequests.filter(
                                            (req) => req.status === "rejected"
                                        ).length
                                    }
                                </p>
                            </div>
                            <div className="text-3xl">❌</div>
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
                                    Menunggu Approval
                                </option>
                                <option value="approved">Disetujui</option>
                                <option value="rejected">Ditolak</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Requests List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    {filteredRequests.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📋</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Tidak ada permintaan ditemukan
                            </h3>
                            <p className="text-gray-600">
                                Coba ubah kata kunci pencarian atau filter
                                status
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {filteredRequests.map((request) => (
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
                                                    {getStatusBadge(
                                                        request.status
                                                    )}
                                                </div>

                                                <p className="text-sm text-gray-600 mb-3">
                                                    oleh {request.book_author}
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
                                                        <p className="text-gray-600">
                                                            <span className="font-medium">
                                                                Telepon:
                                                            </span>{" "}
                                                            {request.user_phone}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">
                                                            <span className="font-medium">
                                                                Tanggal
                                                                Pengajuan:
                                                            </span>{" "}
                                                            {formatDate(
                                                                request.request_date
                                                            )}
                                                        </p>
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
                                                                Tanggal Kembali:
                                                            </span>{" "}
                                                            {formatDate(
                                                                request.return_date
                                                            )}
                                                        </p>
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

                                                {request.status ===
                                                    "rejected" &&
                                                    request.rejection_reason && (
                                                        <div className="mt-3 p-3 bg-red-50 rounded-lg">
                                                            <p className="text-sm text-red-700">
                                                                <span className="font-medium">
                                                                    Alasan
                                                                    Penolakan:
                                                                </span>{" "}
                                                                {
                                                                    request.rejection_reason
                                                                }
                                                            </p>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        {request.status === "pending" && (
                                            <div className="flex space-x-2 ml-4">
                                                <button
                                                    onClick={() =>
                                                        handleApprove(
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
                                                    Setujui
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleReject(request.id)
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
