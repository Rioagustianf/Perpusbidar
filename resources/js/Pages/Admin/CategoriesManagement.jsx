import { useEffect, useState } from "react";
import AdminLayout from "../../Components/Admin/AdminLayout";
import { Head } from "@inertiajs/react";
import { PencilIcon, TrashIcon } from "lucide-react";

// Ambil CSRF token secara aman di dalam fungsi
const getCsrfToken = () => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute("content") : "";
};

export default function CategoriesManagement() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState("");
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");
    const [notif, setNotif] = useState(null);
    const [notifType, setNotifType] = useState("success");
    // State untuk dialog hapus
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        id: null,
        name: "",
    });

    const fetchCategories = async () => {
        setLoading(true);
        const res = await fetch("/admin/categories");
        const data = await res.json();
        setCategories(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;
        const res = await fetch("/admin/categories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": getCsrfToken(),
            },
            credentials: "same-origin",
            body: JSON.stringify({ name: newCategory }),
        });
        if (res.ok) {
            setNotif("Kategori berhasil ditambahkan");
            setNotifType("success");
            setNewCategory("");
            fetchCategories();
        } else {
            setNotif("Gagal menambah kategori (mungkin sudah ada)");
            setNotifType("error");
        }
    };

    const handleEdit = (cat) => {
        setEditId(cat.id);
        setEditName(cat.name);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editName.trim()) return;
        const res = await fetch(`/admin/categories/${editId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": getCsrfToken(),
            },
            credentials: "same-origin",
            body: JSON.stringify({ name: editName }),
        });
        if (res.ok) {
            setNotif("Kategori berhasil diupdate");
            setNotifType("success");
            setEditId(null);
            setEditName("");
            fetchCategories();
        } else {
            setNotif("Gagal update kategori (mungkin sudah ada)");
            setNotifType("error");
        }
    };

    const handleDelete = (id, name) => {
        setDeleteDialog({ open: true, id, name });
    };

    const confirmDelete = async () => {
        const { id } = deleteDialog;
        const res = await fetch(`/admin/categories/${id}`, {
            method: "DELETE",
            headers: { "X-CSRF-TOKEN": getCsrfToken() },
            credentials: "same-origin",
        });
        if (res.ok) {
            setNotif("Kategori berhasil dihapus");
            setNotifType("success");
            fetchCategories();
        } else {
            setNotif("Gagal menghapus kategori");
            setNotifType("error");
        }
        setDeleteDialog({ open: false, id: null, name: "" });
    };

    return (
        <AdminLayout title="Manajemen Kategori">
            <Head title="Manajemen Kategori - Admin" />
            <div className="max-w-2xl mx-auto py-8">
                <h2 className="text-2xl font-bold mb-6">
                    Manajemen Kategori Buku
                </h2>
                {notif && (
                    <div
                        className={`mb-4 px-4 py-3 rounded text-sm font-medium ${
                            notifType === "success"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}
                    >
                        {notif}
                    </div>
                )}
                <form
                    onSubmit={editId ? handleUpdate : handleAdd}
                    className="flex gap-2 mb-6"
                >
                    <input
                        type="text"
                        className="flex-1 px-4 py-2 border rounded-lg"
                        placeholder="Nama kategori"
                        value={editId ? editName : newCategory}
                        onChange={(e) =>
                            editId
                                ? setEditName(e.target.value)
                                : setNewCategory(e.target.value)
                        }
                        required
                    />
                    <button
                        type="submit"
                        className="bg-[#6a1523] text-white px-4 py-2 rounded-lg font-semibold"
                    >
                        {editId ? "Update" : "Tambah"}
                    </button>
                    {editId && (
                        <button
                            type="button"
                            className="px-4 py-2 rounded-lg bg-gray-300 font-semibold"
                            onClick={() => {
                                setEditId(null);
                                setEditName("");
                            }}
                        >
                            Batal
                        </button>
                    )}
                </form>
                <div className="bg-white rounded-xl shadow p-4">
                    {loading ? (
                        <div>Loading...</div>
                    ) : categories.length === 0 ? (
                        <div className="text-gray-500">Belum ada kategori.</div>
                    ) : (
                        <ul className="divide-y">
                            {categories.map((cat) => (
                                <li
                                    key={cat.id}
                                    className="flex items-center justify-between py-3"
                                >
                                    {editId === cat.id ? (
                                        <span className="font-semibold text-[#6a1523]">
                                            {cat.name}
                                        </span>
                                    ) : (
                                        <span>{cat.name}</span>
                                    )}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(cat)}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(cat.id, cat.name)
                                            }
                                            className="text-red-600 hover:underline text-sm"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            {/* Dialog konfirmasi hapus */}
            {deleteDialog.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm mx-4 animate-fadein">
                        <h3 className="text-lg font-bold mb-4 text-center">
                            Konfirmasi Hapus
                        </h3>
                        <p className="mb-6 text-center">
                            Yakin ingin menghapus kategori{" "}
                            <span className="font-semibold text-[#6a1523]">
                                {deleteDialog.name}
                            </span>
                            ?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold"
                                onClick={() =>
                                    setDeleteDialog({
                                        open: false,
                                        id: null,
                                        name: "",
                                    })
                                }
                            >
                                Batal
                            </button>
                            <button
                                className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
                                onClick={confirmDelete}
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
