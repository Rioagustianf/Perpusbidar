import BookCard from "./BookCard";

export default function RecommendationSection({ books = [], onBorrow }) {
    const displayBooks = books;

    return (
        <section className="bg-gradient-to-b from-[#6a1523] to-[#ffc987] py-16 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                {/* Title with decorative lines */}
                <div className="relative flex items-center justify-center mb-12">
                    <div
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 space-y-2"
                        style={{ left: "-200px", width: "calc(50vw + 200px)" }}
                    >
                        <div className="h-2 bg-[#bd8757] rounded-r-full w-1/2"></div>

                        <div
                            className="h-2 bg-white rounded-r-full"
                            style={{ width: "60%" }}
                        ></div>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl lg:text-4xl font-bold text-white text-center px-8 relative z-10">
                        Rekomendasi Buku
                    </h2>

                    <div
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 space-y-2"
                        style={{ right: "-200px", width: "calc(50vw + 200px)" }}
                    >
                        <div className="h-2 bg-[#bd8757] rounded-l-full w-1/2 ml-auto"></div>
                        <div
                            className="h-2 bg-white rounded-l-full ml-auto"
                            style={{ width: "60%" }}
                        ></div>
                    </div>
                </div>

                {/* Books Grid */}
                {displayBooks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {displayBooks.map((book) => (
                            <BookCard
                                key={book.id}
                                book={{
                                    ...book,
                                    cover: book.image
                                        ? book.image.startsWith("http")
                                            ? book.image
                                            : `/storage/${book.image}`
                                        : "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop",
                                    rating: book.average_rating
                                        ? Math.round(book.average_rating)
                                        : 0,
                                }}
                                onBorrow={onBorrow}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-white text-lg py-12">
                        Belum ada rekomendasi untuk Anda
                    </div>
                )}
            </div>
        </section>
    );
}
