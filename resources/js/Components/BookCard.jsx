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
        <div className="bg-transparent rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
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
                <h3 className="font-bold text-white mb-2 text-lg leading-tight line-clamp-2 min-h-[3.5rem]">
                    {book.title || "The Girl in Snow"}
                </h3>

                <p className="text-black text-sm mb-3">
                    By : {book.author || "Sandra Lunata"}
                </p>

                <div className="flex items-center mb-4">
                    {getStarRating(book.rating)}
                </div>

                <button
                    onClick={() => onBorrow && onBorrow(book)}
                    className="w-full bg-[#8a3837] hover:bg-[#bd8757] text-white py-2 px-4 rounded font-semibold transition-colors flex items-center justify-center space-x-2 mt-auto"
                >
                    <span>Pinjam</span>
                    <span>📚</span>
                </button>
            </div>
        </div>
    );
}
