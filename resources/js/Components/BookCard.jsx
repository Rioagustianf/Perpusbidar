export default function BookCard({ book, onBorrow }) {
    const getStarRating = (rating = 5) => {
        return [...Array(5)].map((_, i) => (
            <span
                key={i}
                className={`text-lg ${
                    i < rating ? "text-yellow-400" : "text-gray-300"
                }`}
            >
                ★
            </span>
        ));
    };

    return (
        <div
            className="bg-transparent rounded-lg shadow-lg overflow-visible h-full flex flex-col cursor-pointer transition-all duration-300 ease-out transform hover:-translate-y-4 hover:shadow-2xl hover:shadow-blue-500/20 hover:z-10"
            onClick={() => onBorrow && onBorrow(book)}
        >
            <div className="relative">
                <img
                    src={
                        book.cover ||
                        `https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop`
                    }
                    alt={book.title}
                    className="w-full h-64 object-cover"
                />
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <h3
                    className="font-semibold text-white mb-1 text-base sm:text-lg leading-snug line-clamp-2 max-h-[2.8em] overflow-hidden break-words cursor-pointer px-0.5"
                    title={book.title}
                >
                    {book.title || "The Girl in Snow"}
                </h3>

                <p
                    className="text-black text-sm mb-3 truncate max-w-full cursor-pointer"
                    title={book.author}
                >
                    By : {book.author || "Sandra Lunata"}
                </p>

                <div className="flex items-center mb-4">
                    {getStarRating(book.rating)}
                </div>

                {/* Hapus tombol Pinjam */}
            </div>
        </div>
    );
}
