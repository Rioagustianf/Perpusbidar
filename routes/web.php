<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BorrowingController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\ExportController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TestController;
use App\Http\Middleware\VerifyCsrfToken;

// Dashboard - Landing Page
Route::get('/', function () {
    $books = [];
    if (Auth::check()) {
        $books = (new BookController)->getRecommendationsForUser(Auth::id());
    }
    return Inertia::render('LandingPage', [
        'activeTab' => 'Dashboard',
        'books' => $books,
    ]);
})->name('dashboard');

// Routes yang memerlukan login
Route::middleware(['auth.custom'])->group(function () {
    // Daftar Buku
    Route::get('/books', [BookController::class, 'index'])->name('books');
    Route::get('/books/{book}', [BookController::class, 'show'])->name('books.show');
    
    // API endpoint untuk fetch book detail (JSON response)
    Route::get('/api/books/{book}', [BookController::class, 'getBook'])->name('api.books.get');

    // Peminjaman (Daftar Pengajuan)
    Route::get('/borrow-form', [BorrowingController::class, 'index'])->name('borrow.form');
    Route::post('/borrow-form', [BorrowingController::class, 'store'])->name('borrow.store');
    Route::post('/borrow', [BorrowingController::class, 'store'])->name('borrow.submit');

    // Form Peminjaman Buku (dari klik tombol Pinjam)
    Route::get('/borrow-book/{id?}', function ($id = null) {
        return Inertia::render('BorrowForm', ['book_id' => $id]);
    })->name('borrow.book');

    // Pengembalian
    Route::get('/borrowings', [BorrowingController::class, 'userBorrowings'])->name('borrowings');
    Route::post('/borrowings/{borrowing}/request-return', [BorrowingController::class, 'requestReturn'])->name('borrowings.request-return');

    // Riwayat
    Route::get('/history', [BorrowingController::class, 'history'])->name('history');

    // Rating routes
    Route::post('/ratings', [RatingController::class, 'store'])->name('ratings.store');
    Route::put('/ratings/{rating}', [RatingController::class, 'update'])->name('ratings.update');
    Route::delete('/ratings/{rating}', [RatingController::class, 'destroy'])->name('ratings.destroy');
    Route::get('/books/{book}/can-rate', [RatingController::class, 'canRate'])->name('books.can-rate');
});

// Authentication Routes
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Admin Routes - Protected by admin middleware
Route::middleware(['auth.custom', 'admin'])->prefix('admin')->group(function () {
    // Admin Dashboard
    Route::get('/dashboard', [BorrowingController::class, 'dashboardStats'])->name('admin.dashboard');

    // Books Management
    Route::get('/books', [BookController::class, 'adminIndex'])->name('admin.books');
    Route::post('/books', [BookController::class, 'store'])->name('admin.books.store');
    Route::put('/books/{book}', [BookController::class, 'update'])->name('admin.books.update');
    Route::delete('/books/{book}', [BookController::class, 'destroy'])->name('admin.books.destroy');
    Route::post('/books/{book}/recommend', [BookController::class, 'setRecommended'])->name('admin.books.recommend');
    Route::post('/books/{book}/update-stock', [BookController::class, 'updateStock'])->name('admin.books.update-stock');

    // Borrowing Approval
    Route::get('/borrowing-requests', [BorrowingController::class, 'pendingRequests'])->name('admin.borrowing-requests');
    Route::post('/borrowings/{borrowing}/approve', [BorrowingController::class, 'approve'])->name('admin.borrowings.approve');
    Route::post('/borrowings/{borrowing}/reject', [BorrowingController::class, 'reject'])->name('admin.borrowings.reject');

    // Return Approval
    Route::get('/return-requests', [BorrowingController::class, 'returnRequests'])->name('admin.return-requests');
    Route::post('/borrowings/{borrowing}/return', [BorrowingController::class, 'returnBook'])->name('admin.borrowings.return');

    // Users Management
    Route::get('/users', function () {
        $users = \App\Models\User::select('id', 'name', 'nim', 'email', 'role')
            ->orderBy('name')
            ->paginate(20);
        $roles = ['admin', 'user'];
        return Inertia::render('Admin/UsersManagement', [
            'users' => $users,
            'roles' => $roles,
        ]);
    })->name('admin.users');

    // Reports & Export
    Route::get('/reports', function () {
        $borrowings = \App\Models\Borrowing::with(['user', 'book'])
            ->orderByDesc('created_at')
            ->limit(100)
            ->get()
            ->map(function($b) {
                return [
                    'id' => $b->id,
                    'user_name' => $b->user->name ?? '-',
                    'book_title' => $b->book->title ?? '-',
                    'borrow_date' => $b->borrow_date,
                    'return_date' => $b->actual_return_date,
                    'status' => $b->status,
                    'fine' => $b->fine,
                ];
            });
        return Inertia::render('Admin/Reports', [
            'borrowings' => [ 'data' => $borrowings ],
        ]);
    })->name('admin.reports');
    Route::get('/export/borrowings', [ExportController::class, 'exportBorrowings'])->name('admin.export.borrowings');
    Route::get('/categories-management', function () {
        return Inertia::render('Admin/CategoriesManagement');
    })->name('admin.categories-management');
});

// Route kategori (hanya untuk admin)
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::resource('categories', CategoryController::class)->except(['create', 'edit', 'show']);
});

// Test endpoint to trigger WhatsApp reminder (CSRF disabled for API testing)
Route::post('/test/wa-reminder', [TestController::class, 'sendReminder'])
    ->withoutMiddleware([VerifyCsrfToken::class]);
