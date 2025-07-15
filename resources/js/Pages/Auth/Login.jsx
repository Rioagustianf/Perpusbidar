import { Head, useForm, Link, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const { flash } = usePage().props;

    const submit = (e) => {
        e.preventDefault();
        post("/login");
    };

    return (
        <>
            <Head title="Login - Perpustakaan Digital Bina Darma" />

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
                            Masuk ke Akun Anda
                        </h2>
                        <p className="mt-2 text-sm text-white/80">
                            Perpustakaan Digital Universitas Bina Darma
                        </p>
                    </div>

                    {/* Flash Message */}
                    {flash?.message && (
                        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-xl mb-4">
                            <div className="flex items-center">
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="text-sm font-medium">
                                    {flash.message}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
                        <form className="space-y-6" onSubmit={submit}>
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
                                    placeholder="Masukkan email Anda"
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.email}
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
                                        placeholder="Masukkan password Anda"
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

                            {/* Remember Me */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember"
                                        name="remember"
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                "remember",
                                                e.target.checked
                                            )
                                        }
                                        className="h-4 w-4 text-[#6a1523] focus:ring-[#6a1523] border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor="remember"
                                        className="ml-2 block text-sm text-gray-700"
                                    >
                                        Ingat saya
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-gradient-to-r from-[#6a1523] to-[#8a3837] text-white py-3 px-4 rounded-xl font-semibold text-lg hover:from-[#5a1220] hover:to-[#7a2837] focus:outline-none focus:ring-2 focus:ring-[#6a1523] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                            >
                                {processing ? "Memproses..." : "Masuk"}
                            </button>

                            {/* Register Link */}
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Belum punya akun?{" "}
                                    <Link
                                        href="/register"
                                        className="font-semibold text-[#6a1523] hover:text-[#8a3837] transition-colors duration-200"
                                    >
                                        Daftar sekarang
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

                    {/* Demo Credentials */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white text-sm">
                        <h3 className="font-semibold mb-2">
                            Demo Credentials:
                        </h3>
                        <div className="space-y-1">
                            <p>
                                <strong>Admin:</strong> admin@binadarma.ac.id /
                                admin123
                            </p>
                            <p>
                                <strong>User:</strong>{" "}
                                john.doe@student.binadarma.ac.id / user123
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
