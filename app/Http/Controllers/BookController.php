<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class BookController extends Controller
{
    /**
     * Display a listing of the books.
     */
    public function index(Request $request)
    {
        $query = Book::query();

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                  ->orWhere('author', 'like', '%' . $search . '%')
                  ->orWhere('isbn', 'like', '%' . $search . '%');
            });
        }

        // Filter by category
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Filter by availability
        if ($request->has('available') && $request->available == 'true') {
            $query->available();
        }

        // Filter by rating
        if ($request->has('rating')) {
            $query->where('average_rating', '>=', $request->rating);
        }

        // Sort options
        $sortBy = $request->get('sort_by', 'title');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        $books = $query->paginate($request->get('per_page', 15));

        return Inertia::render('BooksList', [
            'books' => $books,
            'filters' => $request->only(['search', 'category', 'available', 'rating']),
        ]);
    }

    /**
     * Display books listing for admin.
     */
    public function adminIndex(Request $request)
    {
        $query = Book::query();

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                  ->orWhere('author', 'like', '%' . $search . '%')
                  ->orWhere('isbn', 'like', '%' . $search . '%');
            });
        }

        // Filter by category
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Sort options
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $books = $query->paginate($request->get('per_page', 15));

        return Inertia::render('Admin/BooksManagement', [
            'books' => $books,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created book in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'isbn' => 'required|string|unique:books,isbn',
            'category' => 'required|string|max:100',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'stock' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $bookData = $request->only([
            'title', 'author', 'isbn', 'category', 'description', 'stock'
        ]);

        $bookData['available_count'] = $bookData['stock'];
        $bookData['borrowed_count'] = 0;
        $bookData['status'] = $bookData['stock'] > 0 ? 'available' : 'unavailable';

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $imagePath = $image->storeAs('books', $imageName, 'public');
            $bookData['image'] = $imagePath;
        }

        Book::create($bookData);

        return redirect()->route('admin.books')->with('success', 'Buku berhasil ditambahkan');
    }

    /**
     * Display the specified book.
     */
    public function show(Book $book)
    {
        $book->load(['ratings.user', 'borrowings.user']);

        return Inertia::render('BookDetail', [
            'book' => $book,
        ]);
    }

    /**
     * Get book details for API (JSON response).
     */
    public function getBook(Book $book)
    {
        return response()->json([
            'success' => true,
            'book' => $book,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified book in storage.
     */
    public function update(Request $request, Book $book)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'isbn' => 'required|string|unique:books,isbn,' . $book->id,
            'category' => 'required|string|max:100',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'stock' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $bookData = $request->only([
            'title', 'author', 'isbn', 'category', 'description', 'stock'
        ]);

        // Update available count based on new stock
        $stockDifference = $bookData['stock'] - $book->stock;
        $bookData['available_count'] = max(0, $book->available_count + $stockDifference);
        $bookData['status'] = $bookData['available_count'] > 0 ? 'available' : 'unavailable';

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($book->image) {
                Storage::disk('public')->delete($book->image);
            }

            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $imagePath = $image->storeAs('books', $imageName, 'public');
            $bookData['image'] = $imagePath;
        }

        $book->update($bookData);

        return redirect()->route('admin.books')->with('success', 'Buku berhasil diupdate');
    }

    /**
     * Remove the specified book from storage.
     */
    public function destroy(Book $book)
    {
        // Check if book has active borrowings
        if ($book->borrowings()->whereIn('status', ['pending', 'approved'])->exists()) {
            return back()->with('error', 'Tidak dapat menghapus buku yang sedang dipinjam');
        }

        // Delete image if exists
        if ($book->image) {
            Storage::disk('public')->delete($book->image);
        }

        $book->delete();

        return redirect()->route('admin.books')->with('success', 'Buku berhasil dihapus');
    }

    /**
     * Get recommended books.
     */
    public function recommended()
    {
        $books = Book::recommended()
                     ->available()
                     ->orderBy('average_rating', 'desc')
                     ->limit(10)
                     ->get();

        return Inertia::render('RecommendedBooks', [
            'books' => $books,
        ]);
    }

    /**
     * Set book as recommended.
     */
    public function setRecommended(Request $request, Book $book)
    {
        $book->update(['is_recommended' => $request->boolean('is_recommended')]);

        $message = $book->is_recommended ? 'Buku ditandai sebagai rekomendasi' : 'Buku dihapus dari rekomendasi';
        return back()->with('success', $message);
    }

    /**
     * Get book categories.
     */
    public function categories()
    {
        $categories = Book::select('category')
                          ->distinct()
                          ->orderBy('category')
                          ->pluck('category');

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * Get book statistics.
     */
    public function statistics()
    {
        $stats = [
            'total_books' => Book::count(),
            'available_books' => Book::available()->count(),
            'borrowed_books' => Book::sum('borrowed_count'),
            'total_categories' => Book::distinct('category')->count(),
            'top_rated_books' => Book::orderBy('average_rating', 'desc')
                                   ->limit(5)
                                   ->get(['id', 'title', 'average_rating', 'total_ratings']),
            'most_borrowed_books' => Book::orderBy('borrowed_count', 'desc')
                                        ->limit(5)
                                        ->get(['id', 'title', 'borrowed_count']),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * Update book stock.
     */
    public function updateStock(Request $request, Book $book)
    {
        $validator = Validator::make($request->all(), [
            'stock' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        $newStock = $request->stock;
        $stockDifference = $newStock - $book->stock;

        $book->update([
            'stock' => $newStock,
            'available_count' => max(0, $book->available_count + $stockDifference),
            'status' => ($book->available_count + $stockDifference) > 0 ? 'available' : 'unavailable',
        ]);

        return back()->with('success', 'Stok buku berhasil diupdate');
    }

    /**
     * Collaborative Filtering Recommendation for current user
     * --- ALGORITMA COLLABORATIVE FILTERING ---
     *
     * Lokasi: BookController@getRecommendationsForUser
     * Digunakan oleh route landing page untuk rekomendasi user
     */
    public function getRecommendationsForUser($userId)
    {
        // Ambil buku yang sudah dipinjam/rating user
        $userBorrowedBookIds = \App\Models\Borrowing::where('user_id', $userId)
            ->pluck('book_id')->toArray();
        $userRatedBookIds = \App\Models\Rating::where('user_id', $userId)
            ->pluck('book_id')->toArray();
        $userBookIds = array_unique(array_merge($userBorrowedBookIds, $userRatedBookIds));

        // Cari user lain yang punya overlap buku dengan user ini
        $similarUserIds = \App\Models\Borrowing::whereIn('book_id', $userBookIds)
            ->where('user_id', '!=', $userId)
            ->pluck('user_id')->unique()->toArray();

        // Ambil buku yang dipinjam/rating oleh user-user mirip, exclude buku yang sudah pernah dipinjam/rating user
        $recommendedBookIds = \App\Models\Borrowing::whereIn('user_id', $similarUserIds)
            ->whereNotIn('book_id', $userBookIds)
            ->pluck('book_id')->toArray();
        $recommendedBookIds = array_unique($recommendedBookIds);

        // Skor buku berdasarkan seberapa sering dipinjam user mirip + rating rata-rata
        $books = \App\Models\Book::whereIn('id', $recommendedBookIds)
            ->withCount(['borrowings'])
            ->orderByDesc('borrowings_count')
            ->orderByDesc('average_rating')
            ->limit(10)
            ->get();

        // Fallback: jika user belum pernah pinjam/rating, atau tidak ada rekomendasi, ambil buku rating tertinggi
        if ($books->isEmpty()) {
            $books = \App\Models\Book::available()
                ->orderByDesc('average_rating')
                ->limit(10)
                ->get();
        }

        return $books;
    }
}
