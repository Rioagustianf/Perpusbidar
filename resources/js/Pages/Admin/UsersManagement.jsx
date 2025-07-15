import { Head, usePage, router } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "../../Components/Admin/AdminLayout";

export default function UsersManagement() {
    const { users = { data: [] }, roles = [] } = usePage().props;
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editData, setEditData] = useState({
        name: "",
        email: "",
        role: "user",
    });
    const [notification, setNotification] = useState(null);
    const [notificationType, setNotificationType] = useState("success");

    const filteredUsers = users.data.filter((u) => {
        const matchesSearch =
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.nim?.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === "all" || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleEdit = (user) => {
        setSelectedUser(user);
        setEditData({ name: user.name, email: user.email, role: user.role });
        setEditModal(true);
    };

    const handleUpdate = () => {
        router.patch(`/admin/users/${selectedUser.id}`, editData, {
            onSuccess: () => {
                setNotification("User berhasil diupdate.");
                setNotificationType("success");
                setEditModal(false);
                router.reload({ only: ["users"] });
            },
            onError: () => {
                setNotification("Gagal update user.");
                setNotificationType("error");
            },
        });
    };

    const handleDelete = (user) => {
        setSelectedUser(user);
        setDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        router.delete(`/admin/users/${selectedUser.id}`, {
            onSuccess: () => {
                setNotification("User berhasil dihapus.");
                setNotificationType("success");
                setDeleteModal(false);
                router.reload({ only: ["users"] });
            },
            onError: () => {
                setNotification("Gagal hapus user.");
                setNotificationType("error");
            },
        });
    };

    return (
        <AdminLayout title="Manajemen User">
            <Head title="Manajemen User - Admin" />
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
            <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <input
                    type="text"
                    placeholder="Cari nama, NIM, email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-4 py-2 rounded border border-gray-300 w-full md:w-72"
                />
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-2 rounded border border-gray-300"
                >
                    <option value="all">Semua Role</option>
                    {roles.map((r) => (
                        <option key={r} value={r}>
                            {r}
                        </option>
                    ))}
                </select>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left">Nama</th>
                            <th className="px-4 py-2 text-left">NIM</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Role</th>
                            <th className="px-4 py-2 text-left">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="text-center py-8 text-gray-500"
                                >
                                    Tidak ada user ditemukan
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((u) => (
                                <tr key={u.id} className="border-b">
                                    <td className="px-4 py-2">{u.name}</td>
                                    <td className="px-4 py-2">
                                        {u.nim || "-"}
                                    </td>
                                    <td className="px-4 py-2">{u.email}</td>
                                    <td className="px-4 py-2 capitalize">
                                        {u.role}
                                    </td>
                                    <td className="px-4 py-2 flex gap-2">
                                        <button
                                            title="Edit"
                                            onClick={() => handleEdit(u)}
                                            className="p-2 rounded hover:bg-blue-100 text-blue-600"
                                        >
                                            <span role="img" aria-label="edit">
                                                ✏️
                                            </span>
                                        </button>
                                        <button
                                            title="Hapus"
                                            onClick={() => handleDelete(u)}
                                            className="p-2 rounded hover:bg-red-100 text-red-600"
                                        >
                                            <span role="img" aria-label="hapus">
                                                🗑️
                                            </span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination jika ada */}
            {users.links && (
                <div className="mt-4 flex justify-center space-x-1">
                    {users.links.map((link, idx) => (
                        <a
                            key={idx}
                            href={link.url || "#"}
                            className={`px-3 py-1 rounded ${
                                link.active
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-700"
                            } ${
                                !link.url
                                    ? "pointer-events-none opacity-50"
                                    : ""
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}

            {/* Modal Edit User */}
            {editModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 bg-opacity-40">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm">
                        <h3 className="text-lg font-semibold mb-4">
                            Edit User
                        </h3>
                        <div className="mb-3">
                            <label className="block mb-1 font-medium">
                                Nama
                            </label>
                            <input
                                type="text"
                                value={editData.name}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        name: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 rounded border border-gray-300"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block mb-1 font-medium">
                                Email
                            </label>
                            <input
                                type="email"
                                value={editData.email}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        email: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 rounded border border-gray-300"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 font-medium">
                                Role
                            </label>
                            <select
                                value={editData.role}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        role: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 rounded border border-gray-300"
                            >
                                {roles.map((r) => (
                                    <option key={r} value={r}>
                                        {r}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditModal(false)}
                                className="px-4 py-2 rounded bg-gray-200"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="px-4 py-2 rounded bg-blue-600 text-white"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus */}
            {deleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm">
                        <h3 className="text-lg font-semibold mb-4">
                            Konfirmasi Hapus User
                        </h3>
                        <p className="mb-6">
                            Yakin ingin menghapus user{" "}
                            <span className="font-bold">
                                {selectedUser?.name}
                            </span>
                            ?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setDeleteModal(false)}
                                className="px-4 py-2 rounded bg-gray-200"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 rounded bg-red-600 text-white"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
