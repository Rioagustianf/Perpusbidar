import { Link, usePage } from "@inertiajs/react";

export default function HeroSection() {
    const { auth } = usePage().props;
    return (
        <section className="bg-gradient-to-b from-[#ffc987] to-[#6a1523] min-h-screen flex items-center">
            <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="text-white space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl lg:text-6xl">
                                Peminjaman Buku
                            </h1>
                            <h2 className="text-3xl lg:text-5xl leading-tight">
                                Digital Perpustakaan
                            </h2>
                            <h3 className="text-2xl lg:text-5xl leading-tight">
                                Bina Darma
                            </h3>
                        </div>

                        {/* Show login button only if not logged in */}
                        {!auth?.user && (
                            <div className="pt-4">
                                <Link
                                    href="/login"
                                    className="w-1/2 max-w-md bg-white text-orange-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-colors shadow-lg block text-center"
                                    style={{ minWidth: "300px" }}
                                >
                                    LOGIN
                                </Link>
                            </div>
                        )}

                        {/* Show welcome message if logged in */}
                        {auth?.user && (
                            <div className="pt-4">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                    <h4 className="text-xl font-bold mb-2">
                                        Selamat Datang, {auth.user.name}!
                                    </h4>
                                    <p className="text-white/90 mb-4">
                                        Jelajahi koleksi buku digital kami dan
                                        nikmati pengalaman membaca yang
                                        menyenangkan.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Link
                                            href="/books"
                                            className="bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors text-center"
                                        >
                                            Jelajahi Buku
                                        </Link>
                                        <Link
                                            href="/history"
                                            className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-orange-600 transition-colors text-center"
                                        >
                                            Riwayat Saya
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Illustration */}
                    <div className="relative">
                        {/* Main illustration using image */}
                        <div className="relative flex justify-center items-center">
                            <img
                                src="/assets/Section.png"
                                alt="Library Illustration"
                                className="w-full max-w-lg h-auto object-contain drop-shadow-2xl"
                                onError={(e) => {
                                    // Fallback to original illustration if image fails to load
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display =
                                        "block";
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
