<?php

namespace App\Console\Commands;

use App\Models\Borrowing;
use Carbon\Carbon;
use Illuminate\Console\Command;

class MarkOverdueBorrowings extends Command
{
    protected $signature = 'borrowings:mark-overdue';
    protected $description = 'Mark borrowings as overdue and calculate fines';

    public function handle(): int
    {
        $count = 0;
        $updatedCount = 0;

        // Ambil semua peminjaman yang status approved dan sudah melewati tanggal jatuh tempo
        $overdueBorrowings = Borrowing::where('status', 'approved')
            ->where('return_date', '<', Carbon::now()->toDateString())
            ->get();

        foreach ($overdueBorrowings as $borrowing) {
            $count++;
            
            // Hitung hari keterlambatan (hari penuh)
            $overdueDays = floor(Carbon::parse($borrowing->return_date)->diffInDays(Carbon::now(), false));
            $calculatedFine = $overdueDays * 500; // Rp 500 per hari
            
            // Update status dan denda
            $borrowing->update([
                'status' => 'overdue',
                'fine' => $calculatedFine,
            ]);
            
            $updatedCount++;
            
            $this->info("Borrowing #{$borrowing->id} marked as overdue: {$overdueDays} days, fine: Rp {$calculatedFine}");
        }

        $this->info("Processed {$count} overdue borrowings, updated {$updatedCount} records.");
        return self::SUCCESS;
    }
}
