<?php

namespace App\Http\Controllers;

use App\Models\Rating;
use App\Models\Book;
use App\Models\Borrowing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class RatingController extends Controller
{
    /**
     * Store a newly created rating.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'book_id' => 'required|exists:books,id',
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $book = Book::findOrFail($request->book_id);

        // Check if user has returned this book (can only rate books they have borrowed and returned)
        $hasReturnedBook = Borrowing::where('user_id', Auth::id())
                                  ->where('book_id', $request->book_id)
                                  ->where('status', 'returned')
                                  ->exists();

        if (!$hasReturnedBook) {
            return back()->with('error', 'Anda hanya dapat memberikan rating pada buku yang pernah Anda pinjam dan kembalikan');
        }

        // Check if user has already rated this book
        $existingRating = Rating::where('user_id', Auth::id())
                               ->where('book_id', $request->book_id)
                               ->first();

        if ($existingRating) {
            return back()->with('error', 'Anda sudah memberikan rating untuk buku ini');
        }

        Rating::create([
            'user_id' => Auth::id(),
            'book_id' => $request->book_id,
            'rating' => $request->rating,
            'review' => $request->review,
        ]);

        // Update book's average rating
        $book->updateAverageRating();

        return back()->with('success', 'Rating berhasil diberikan');
    }

    /**
     * Update the specified rating.
     */
    public function update(Request $request, Rating $rating)
    {
        // Only the rating owner can update their rating
        if ($rating->user_id !== Auth::id()) {
            return back()->with('error', 'Anda tidak dapat mengubah rating orang lain');
        }

        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        $rating->update($request->only(['rating', 'review']));

        // Update book's average rating
        $rating->book->updateAverageRating();

        return back()->with('success', 'Rating berhasil diupdate');
    }

    /**
     * Remove the specified rating.
     */
    public function destroy(Rating $rating)
    {
        // Only the rating owner or admin can delete the rating
        if ($rating->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            return back()->with('error', 'Anda tidak dapat menghapus rating ini');
        }

        $book = $rating->book;
        $rating->delete();

        // Update book's average rating
        $book->updateAverageRating();

        return back()->with('success', 'Rating berhasil dihapus');
    }

    /**
     * Check if user can rate a book (AJAX endpoint).
     */
    public function canRate(Book $book)
    {
        // Check if user has returned this book
        $hasReturnedBook = Borrowing::where('user_id', Auth::id())
                                  ->where('book_id', $book->id)
                                  ->where('status', 'returned')
                                  ->exists();

        // Check if user has already rated this book
        $hasRated = Rating::where('user_id', Auth::id())
                         ->where('book_id', $book->id)
                         ->exists();

        $existingRating = $hasRated ? Rating::where('user_id', Auth::id())
                                           ->where('book_id', $book->id)
                                           ->first() : null;

        return response()->json([
            'can_rate' => $hasReturnedBook && !$hasRated,
            'has_returned_book' => $hasReturnedBook,
            'has_rated' => $hasRated,
            'existing_rating' => $existingRating,
        ]);
        }
}
