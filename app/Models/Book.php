<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    protected $fillable = [
        'title',
        'author',
        'isbn',
        'category',
        'description',
        'image',
        'stock',
        'available_count',
        'borrowed_count',
        'is_recommended',
        'average_rating',
        'total_ratings',
        'status',
    ];

    protected $casts = [
        'is_recommended' => 'boolean',
        'average_rating' => 'decimal:2',
        'stock' => 'integer',
        'available_count' => 'integer',
        'borrowed_count' => 'integer',
        'total_ratings' => 'integer',
    ];

    // Relationship with borrowings
    public function borrowings(): HasMany
    {
        return $this->hasMany(Borrowing::class);
    }

    // Relationship with ratings
    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class);
    }

    // Scope untuk buku yang tersedia
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available')
                    ->where('available_count', '>', 0);
    }

    // Scope untuk buku rekomendasi
    public function scopeRecommended($query)
    {
        return $query->where('is_recommended', true);
    }

    // Update available count saat buku dipinjam
    public function decrementStock()
    {
        if ($this->available_count > 0) {
            $this->decrement('available_count');
            $this->increment('borrowed_count');
            
            if ($this->available_count == 0) {
                $this->update(['status' => 'unavailable']);
            }
        }
    }

    // Update available count saat buku dikembalikan
    public function incrementStock()
    {
        $this->increment('available_count');
        $this->decrement('borrowed_count');
        
        if ($this->status == 'unavailable' && $this->available_count > 0) {
            $this->update(['status' => 'available']);
        }
    }

    // Update rating rata-rata
    public function updateAverageRating()
    {
        $avgRating = $this->ratings()->avg('rating');
        $totalRatings = $this->ratings()->count();
        
        $this->update([
            'average_rating' => $avgRating ?? 0,
            'total_ratings' => $totalRatings,
        ]);
    }
}
