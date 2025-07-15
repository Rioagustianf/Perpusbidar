<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Borrowing extends Model
{
    protected $fillable = [
        'user_id',
        'book_id',
        'borrow_date',
        'return_date',
        'actual_return_date',
        'status',
        'notes',
        'condition',
        'fine',
    ];

    protected $casts = [
        'borrow_date' => 'date',
        'return_date' => 'date',
        'actual_return_date' => 'date',
        'fine' => 'decimal:2',
    ];

    // Relationship with User
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Relationship with Book
    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    // Scope untuk status tertentu
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeReturned($query)
    {
        return $query->where('status', 'returned');
    }

    public function scopeOverdue($query)
    {
        return $query->where('status', 'overdue');
    }

    public function scopeReturnRequested($query)
    {
        return $query->where('status', 'return_requested');
    }

    // Ajukan pengembalian oleh user
    public function ajukanPengembalian()
    {
        $this->update([
            'status' => 'return_requested',
            'return_request_date' => now(),
        ]);
    }

    // Scope untuk peminjaman berdasarkan user
    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    // Check if borrowing is overdue
    public function isOverdue()
    {
        return $this->status === 'approved' && 
               $this->return_date < Carbon::now()->toDateString();
    }

    // Calculate fine for overdue books
    public function calculateFine($dailyFine = 1000)
    {
        if ($this->isOverdue()) {
            $overdueDays = Carbon::parse($this->return_date)->diffInDays(Carbon::now());
            return $overdueDays * $dailyFine;
        }
        return 0;
    }

    // Approve borrowing
    public function approve()
    {
        $this->update(['status' => 'approved']);
        $this->book->decrementStock();
    }

    // Reject borrowing
    public function reject()
    {
        $this->update(['status' => 'rejected']);
    }

    // Return book
    public function returnBook($condition = 'baik')
    {
        $this->update([
            'status' => 'returned',
            'actual_return_date' => Carbon::now()->toDateString(),
            'condition' => $condition,
            'fine' => $this->calculateFine(),
        ]);
        $this->book->incrementStock();
    }

    // Mark as overdue
    public function markAsOverdue()
    {
        if ($this->isOverdue()) {
            $this->update([
                'status' => 'overdue',
                'fine' => $this->calculateFine(),
            ]);
        }
    }
}
