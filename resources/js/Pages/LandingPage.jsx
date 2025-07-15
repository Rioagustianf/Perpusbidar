import { Head, Link, router, usePage } from "@inertiajs/react";
import Navbar from "../Components/Navbar";
import HeroSection from "../Components/HeroSection";
import RecommendationSection from "../Components/RecommendationSection";
import Footer from "../Components/Footer";

export default function LandingPage({ books = [], activeTab = "Dashboard" }) {
    const { auth } = usePage().props;

    const handleBorrow = (book) => {
        // Redirect ke halaman form peminjaman dengan data buku
        window.location.href = `/borrow-book/${book.id}`;
    };

    return (
        <>
            <Head title="Perpustakaan Digital Bina Darma" />

            <div className="min-h-screen bg-gray-50">
                {/* Navigation */}
                <Navbar activeTab={activeTab} />

                {/* Hero Section */}
                <HeroSection />

                {/* Book Recommendations Section - Only show if logged in */}
                {auth?.user ? (
                    <RecommendationSection
                        books={books}
                        onBorrow={handleBorrow}
                    />
                ) : (
                    /* Informational section for non-logged in users */
                    <section className="py-16 bg-gradient-to-b from-[#6a1523] to-[#ffc987]">
                        <div className="max-w-7xl mx-auto px-6 text-center">
                            <div className="bg-gradient-to-br from-[#ffc987]/20 to-[#6a1523]/20 rounded-3xl p-12">
                                <div className="text-6xl mb-6">📚</div>
                                <h2 className="text-3xl font-bold text-white mb-4">
                                    Rekomendasi Buku Personal
                                </h2>
                                <p className="text-lg text-white mb-6 max-w-2xl mx-auto">
                                    Temukan rekomendasi buku yang
                                    dipersonalisasi khusus untuk Anda
                                    menggunakan algoritma collaborative
                                    filtering. Masuk untuk melihat rekomendasi
                                    berdasarkan preferensi dan riwayat baca
                                    Anda.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href="/login"
                                        className="bg-gradient-to-r from-[#6a1523] to-[#8a3837] text-white px-8 py-3 rounded-xl font-semibold hover:from-[#5a1220] hover:to-[#7a2837] transition-all duration-200"
                                    >
                                        Masuk untuk Melihat Rekomendasi
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="bg-transparent border-2 border-[#6a1523] text-[#6a1523] px-8 py-3 rounded-xl font-semibold hover:bg-[#6a1523] hover:text-white transition-all duration-200"
                                    >
                                        Daftar Sekarang
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Footer */}
                <Footer bgColor="bg-gradient-to-b from-[#ffc987] to-[#6a1523]" />
            </div>
        </>
    );
}
