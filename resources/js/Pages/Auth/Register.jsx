import { Head, useForm, Link } from "@inertiajs/react";
import { useState } from "react";

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        nim: "",
        phone: "",
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);

    const submit = (e) => {
        e.preventDefault();
        post("/register");
    };

    return (
        <>
            <Head title="Daftar - Perpustakaan Digital Bina Darma" />

            <div className="min-h-screen bg-gradient-to-br from-[#ffc987] to-[#6a1523] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <img
                            src="/assets/Logo.png"
                            alt="Logo Universitas Bina Darma"
                            className="mx-auto h-20 w-auto"
                            onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "block";
                            }}
                        />
                        <div className="hidden">
                            <div className="mx-auto h-20 w-20 bg-white rounded-full flex items-center justify-center">
                                <span className="text-2xl font-bold text-[#6a1523]">
                                    📚
                                </span>
                            </div>
                        </div>
                        <h2 className="mt-6 text-3xl font-bold text-white">
                            Daftar Akun Baru
                        </h2>
                        <p className="mt-2 text-sm text-white/80">
                            Bergabunglah dengan Perpustakaan Digital Universitas
                            Bina Darma
                        </p>
                    </div>

                    {/* Form */}
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
                        <form className="space-y-6" onSubmit={submit}>
                            {/* Name */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Nama Lengkap
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#6a1523] focus:border-transparent outline-none transition-all duration-200"
                                    placeholder="Masukkan nama lengkap Anda"
                                />
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#6a1523] focus:border-transparent outline-none transition-all duration-200"
                                    placeholder="contoh@student.binadarma.ac.id"
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* NIM */}
                            <div>
                                <label
                                    htmlFor="nim"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    NIM (Nomor Induk Mahasiswa)
                                </label>
                                <input
                                    id="nim"
                                    name="nim"
                                    type="text"
                                    required
                                    value={data.nim}
                                    onChange={(e) =>
                                        setData("nim", e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#6a1523] focus:border-transparent outline-none transition-all duration-200"
                                    placeholder="Contoh: 2021001001"
                                />
                                {errors.nim && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.nim}
                                    </p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Nomor Telepon
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData("phone", e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#6a1523] focus:border-transparent outline-none transition-all duration-200"
                                    placeholder="Contoh: 081234567890"
                                />
                                {errors.phone && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        required
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#6a1523] focus:border-transparent outline-none transition-all duration-200"
                                        placeholder="Minimal 6 karakter"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Password Confirmation */}
                            <div>
                                <label
                                    htmlFor="password_confirmation"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Konfirmasi Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type={
                                            showPasswordConfirmation
                                                ? "text"
                                                : "password"
                                        }
                                        required
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#6a1523] focus:border-transparent outline-none transition-all duration-200"
                                        placeholder="Ulangi password Anda"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPasswordConfirmation(
                                                !showPasswordConfirmation
                                            )
                                        }
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswordConfirmation ? (
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-gradient-to-r from-[#6a1523] to-[#8a3837] text-white py-3 px-4 rounded-xl font-semibold text-lg hover:from-[#5a1220] hover:to-[#7a2837] focus:outline-none focus:ring-2 focus:ring-[#6a1523] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                            >
                                {processing ? "Memproses..." : "Daftar"}
                            </button>

                            {/* Login Link */}
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Sudah punya akun?{" "}
                                    <Link
                                        href="/login"
                                        className="font-semibold text-[#6a1523] hover:text-[#8a3837] transition-colors duration-200"
                                    >
                                        Masuk sekarang
                                    </Link>
                                </p>
                            </div>

                            {/* Back to Home */}
                            <div className="text-center pt-4 border-t border-gray-200">
                                <Link
                                    href="/"
                                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                >
                                    ← Kembali ke Beranda
                                </Link>
                            </div>
                        </form>
                    </div>

                    {/* Info */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white text-sm">
                        <h3 className="font-semibold mb-2">
                            Informasi Pendaftaran:
                        </h3>
                        <ul className="space-y-1 text-xs">
                            <li>
                                • Gunakan email dengan domain
                                @student.binadarma.ac.id
                            </li>
                            <li>• Masukkan NIM yang valid dan aktif</li>
                            <li>• Password minimal 6 karakter</li>
                            <li>• Akun akan aktif setelah verifikasi email</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
