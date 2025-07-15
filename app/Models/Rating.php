<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Rating extends Model
{
    protected $fillable = [
        'user_id',
        'book_id',
        'rating',
        'review',
    ];

    protected $casts = [
        'rating' => 'integer',
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

    // Scope untuk rating berdasarkan buku
    public function scopeForBook($query, $bookId)
    {
        return $query->where('book_id', $bookId);
    }

    // Scope untuk rating berdasarkan user
    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}
