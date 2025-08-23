<?php

namespace App\Http\Controllers;

use App\Models\Borrowing;
use App\Models\Book;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Carbon\Carbon;

class BorrowingController extends Controller
{
    /**
     * Display borrowing form/list page.
     */
    public function index(Request $request)
    {
        $query = Borrowing::with(['user', 'book'])
                         ->where('user_id', Auth::id());

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $borrowings = $query->orderBy('created_at', 'desc')
                           ->paginate(10);

        // Hitung denda dan hari keterlambatan untuk setiap peminjaman
        $borrowings->getCollection()->transform(function ($borrowing) {
            // Jika status approved dan sudah melewati tanggal jatuh tempo, hitung denda
            if ($borrowing->status === 'approved' && $borrowing->return_date < Carbon::now()->toDateString()) {
                $overdueDays = floor(Carbon::parse($borrowing->return_date)->diffInDays(Carbon::now(), false));
                $calculatedFine = $overdueDays * 500; // Rp 500 per hari
                
                // Update denda di database jika belum ada
                if ($borrowing->fine == 0) {
                    $borrowing->update(['fine' => $calculatedFine]);
                }
                
                $borrowing->overdue_days = (int) $overdueDays;
                $borrowing->calculated_fine = (int) $calculatedFine;
            } elseif ($borrowing->status === 'overdue') {
                // Jika status sudah overdue, hitung ulang hari keterlambatan
                $overdueDays = floor(Carbon::parse($borrowing->return_date)->diffInDays(Carbon::now(), false));
                $borrowing->overdue_days = (int) $overdueDays;
                $borrowing->calculated_fine = (int) $borrowing->fine;
            } else {
                $borrowing->overdue_days = 0;
                $borrowing->calculated_fine = (int) $borrowing->fine;
            }
            
            return $borrowing;
        });

        return Inertia::render('BorrowList', [
            'borrowings' => $borrowings,
            'filters' => $request->only(['status']),
        ]);
    }

    /**
     * Store a newly created borrowing request.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'book_id' => 'required|exists:books,id',
            'borrow_date' => 'required|date|after_or_equal:today',
            'return_date' => 'required|date|after:borrow_date',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $book = Book::findOrFail($request->book_id);

        // Check if book is available
        if ($book->available_count <= 0) {
            return back()->with('error', 'Buku tidak tersedia untuk dipinjam');
        }

        // Check if user has pending/approved borrowing for this book
        $existingBorrowing = Borrowing::where('user_id', Auth::id())
                                    ->where('book_id', $request->book_id)
                                    ->whereIn('status', ['pending', 'approved'])
                                    ->exists();

        if ($existingBorrowing) {
            return back()->with('error', 'Anda sudah memiliki peminjaman aktif untuk buku ini');
        }

        // Check borrowing limit (max 3 active borrowings per user)
        $activeBorrowings = Borrowing::where('user_id', Auth::id())
                                   ->whereIn('status', ['pending', 'approved'])
                                   ->count();

        if ($activeBorrowings >= 3) {
            return back()->with('error', 'Anda sudah mencapai batas maksimal peminjaman (3 buku)');
        }

        Borrowing::create([
            'user_id' => Auth::id(),
            'book_id' => $request->book_id,
            'borrow_date' => $request->borrow_date,
            'return_date' => $request->return_date,
            'notes' => $request->notes,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Pengajuan peminjaman berhasil dibuat');
    }

    /**
     * Display user's borrowings (pengembalian page).
     */
    public function userBorrowings(Request $request)
    {
        $borrowings = Borrowing::with(['book', 'user'])
                              ->where('user_id', Auth::id())
                              ->whereIn('status', ['approved', 'overdue', 'return_requested'])
                              ->orderBy('created_at', 'desc')
                              ->paginate(10);

        // Hitung denda dan hari keterlambatan untuk setiap peminjaman
        $borrowings->getCollection()->transform(function ($borrowing) {
            // Jika status approved dan sudah melewati tanggal jatuh tempo, hitung denda
            if ($borrowing->status === 'approved' && $borrowing->return_date < Carbon::now()->toDateString()) {
                $overdueDays = floor(Carbon::parse($borrowing->return_date)->diffInDays(Carbon::now(), false));
                $calculatedFine = $overdueDays * 500; // Rp 500 per hari
                
                // Update denda di database jika belum ada
                if ($borrowing->fine == 0) {
                    $borrowing->update(['fine' => $calculatedFine]);
                }
                
                $borrowing->overdue_days = (int) $overdueDays;
                $borrowing->calculated_fine = (int) $calculatedFine;
            } elseif ($borrowing->status === 'overdue') {
                // Jika status sudah overdue, hitung ulang hari keterlambatan
                $overdueDays = floor(Carbon::parse($borrowing->return_date)->diffInDays(Carbon::now(), false));
                $borrowing->overdue_days = (int) $overdueDays;
                $borrowing->calculated_fine = (int) $borrowing->fine;
            } else {
                $borrowing->overdue_days = 0;
                $borrowing->calculated_fine = (int) $borrowing->fine;
            }
            
            return $borrowing;
        });

        return Inertia::render('ReturnBooks', [
            'borrowings' => $borrowings,
        ]);
    }

    /**
     * Display user's borrowing history.
     */
    public function history(Request $request)
    {
        $borrowings = Borrowing::with(['book'])
                              ->where('user_id', Auth::id())
                              ->orderBy('created_at', 'desc')
                              ->paginate(15);

        // Ambil semua book_id yang sudah dirating user
        $ratedBookIds = \App\Models\Rating::where('user_id', Auth::id())->pluck('book_id')->toArray();

        $borrowings->getCollection()->transform(function ($b) use ($ratedBookIds) {
            $b->has_rated = in_array($b->book_id, $ratedBookIds);
            
            // Hanya hitung hari keterlambatan tanpa mengubah denda yang sudah ada
            if ($b->status === 'returned' && $b->actual_return_date) {
                if ($b->actual_return_date > $b->return_date) {
                    // Buku dikembalikan terlambat - hitung hari keterlambatan
                    $b->overdue_days = (int) Carbon::parse($b->return_date)->diffInDays(Carbon::parse($b->actual_return_date));
                } else {
                    $b->overdue_days = 0;
                }
            } elseif ($b->status === 'overdue') {
                // Hitung hari keterlambatan untuk buku yang sedang terlambat
                $b->overdue_days = (int) floor(Carbon::parse($b->return_date)->diffInDays(Carbon::now(), false));
            } else {
                $b->overdue_days = 0;
            }
            
            return $b;
        });

        return Inertia::render('History', [
            'borrowings' => $borrowings,
        ]);
    }

    /**
     * Get pending borrowing requests (Admin only).
     */
    public function pendingRequests()
    {
        $requests = Borrowing::with(['user', 'book'])
            ->pending()
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($b) {
                return [
                    'id' => $b->id,
                    'book_title' => $b->book->title ?? '-',
                    'book_author' => $b->book->author ?? '-',
                    'image' => $b->book && $b->book->image ? asset('storage/' . $b->book->image) : null,
                    'user_name' => $b->user->name ?? '-',
                    'user_nim' => $b->user->nim ?? '-',
                    'user_phone' => $b->user->phone ?? '-',
                    'status' => $b->status,
                    'request_date' => $b->created_at,
                    'borrow_date' => $b->borrow_date,
                    'return_date' => $b->return_date,
                    'notes' => $b->notes,
                    'rejection_reason' => $b->status === 'rejected' ? $b->notes : null,
                ];
            });

        return Inertia::render('Admin/BorrowingApproval', [
            'requests' => $requests,
        ]);
    }

    /**
     * User ajukan pengembalian buku.
     */
    public function requestReturn(Borrowing $borrowing)
    {
        if ($borrowing->user_id !== Auth::id() || !in_array($borrowing->status, ['approved', 'overdue'])) {
            return back()->with('error', 'Tidak dapat mengajukan pengembalian untuk peminjaman ini');
        }
        $borrowing->ajukanPengembalian();
        return back()->with('success', 'Permintaan pengembalian berhasil diajukan');
    }

    /**
     * Get return requests (Admin only).
     */
    public function returnRequests()
    {
        $requests = Borrowing::with(['user', 'book'])
            ->returnRequested()
            ->orderBy('return_request_date', 'asc')
            ->paginate(15);

        // Hitung stats untuk cards
        $pendingVerification = Borrowing::where('status', 'return_requested')->count();
        $returnedToday = Borrowing::where('status', 'returned')
            ->whereDate('actual_return_date', Carbon::today())
            ->count();
        
        // Hitung buku terlambat: yang masih overdue + yang sudah dikembalikan tapi terlambat
        $overdueActive = Borrowing::where('status', 'overdue')->count();
        $overdueReturned = Borrowing::where('status', 'returned')
            ->where('fine', '>', 0)  // Ada denda = terlambat
            ->count();
        $overdueCount = $overdueActive + $overdueReturned;
        
        $totalFines = Borrowing::where('status', 'overdue')->sum('fine') + 
                     Borrowing::where('status', 'returned')->where('fine', '>', 0)->sum('fine');

        return Inertia::render('Admin/ReturnApproval', [
            'requests' => $requests,
            'stats' => [
                'pendingVerification' => $pendingVerification,
                'returnedToday' => $returnedToday,
                'overdueCount' => $overdueCount,
                'totalFines' => $totalFines,
            ],
        ]);
    }

    /**
     * Approve a borrowing request (Admin only).
     */
    public function approve(Request $request, Borrowing $borrowing)
    {
        if (!Auth::user()->isAdmin()) {
            return back()->with('error', 'Anda tidak memiliki akses untuk menyetujui peminjaman');
        }

        if ($borrowing->status !== 'pending') {
            return back()->with('error', 'Peminjaman ini sudah diproses');
        }

        // Check if book is still available
        if ($borrowing->book->available_count <= 0) {
            return back()->with('error', 'Buku tidak tersedia lagi');
        }

        $borrowing->approve();

        return back()->with('success', 'Peminjaman berhasil disetujui');
    }

    /**
     * Reject a borrowing request (Admin only).
     */
    public function reject(Request $request, Borrowing $borrowing)
    {
        if (!Auth::user()->isAdmin()) {
            return back()->with('error', 'Anda tidak memiliki akses untuk menolak peminjaman');
        }

        if ($borrowing->status !== 'pending') {
            return back()->with('error', 'Peminjaman ini sudah diproses');
        }

        $validator = Validator::make($request->all(), [
            'rejection_reason' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        $borrowing->reject();
        $borrowing->update(['notes' => $request->rejection_reason]);

        return back()->with('success', 'Peminjaman berhasil ditolak');
    }

    /**
     * Return a book (Admin only).
     */
    public function returnBook(Request $request, Borrowing $borrowing)
    {
        if (!Auth::user()->isAdmin()) {
            return back()->with('error', 'Anda tidak memiliki akses untuk mengonfirmasi pengembalian');
        }

        if ($borrowing->status !== 'return_requested') {
            return back()->with('error', 'Peminjaman ini tidak dapat dikembalikan');
        }

        $validator = Validator::make($request->all(), [
            'condition' => 'required|string|in:baik,rusak_ringan,rusak_berat',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        $borrowing->returnBook($request->condition);

        return back()->with('success', 'Pengembalian buku berhasil dikonfirmasi');
    }

    /**
     * Admin Dashboard Statistics & Activities
     */
    public function dashboardStats()
    {
        $totalBooks = Book::count();
        $totalUsers = User::where('role', 'user')->count();
        $activeBorrowings = Borrowing::where('status', 'approved')->count();
        $pendingRequests = Borrowing::where('status', 'pending')->count();
        $overdueBooks = Borrowing::where('status', 'overdue')->count();
        $returnedToday = Borrowing::where('status', 'returned')
            ->whereDate('actual_return_date', Carbon::today())
            ->count();
        
        // Hitung total denda dari semua peminjaman yang terlambat
        $totalFines = Borrowing::where('status', 'overdue')
            ->sum('fine');
        
        // Hitung total denda dari peminjaman yang sudah dikembalikan tapi terlambat
        $returnedOverdueFines = Borrowing::where('status', 'returned')
            ->where('fine', '>', 0)
            ->sum('fine');
        
        $totalFinesAmount = $totalFines + $returnedOverdueFines;

        $recentActivities = Borrowing::with(['user', 'book'])
            ->orderByDesc('updated_at')
            ->limit(10)
            ->get()
            ->map(function ($b) {
                return [
                    'id' => $b->id,
                    'type' => $b->status === 'pending' ? 'borrow_request' : ($b->status === 'returned' ? 'return' : ($b->status === 'overdue' ? 'overdue' : 'borrow_approved')),
                    'user' => $b->user->name,
                    'book' => $b->book->title,
                    'time' => $b->updated_at->diffForHumans(),
                    'status' => $b->status,
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalBooks' => $totalBooks,
                'totalUsers' => $totalUsers,
                'activeBorrowings' => $activeBorrowings,
                'pendingRequests' => $pendingRequests,
                'overdueBooks' => $overdueBooks,
                'returnedToday' => $returnedToday,
                'totalFines' => $totalFinesAmount,
            ],
            'recentActivities' => $recentActivities,
        ]);
    }
}
