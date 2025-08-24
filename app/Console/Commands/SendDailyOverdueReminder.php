<?php

namespace App\Console\Commands;

use App\Jobs\SendWhatsAppReminderJob;
use App\Models\Borrowing;
use Illuminate\Console\Command;

class SendDailyOverdueReminder extends Command
{
    protected $signature = 'reminder:daily-overdue {--dry-run}';
    protected $description = 'Send daily WhatsApp reminders for overdue borrowings';

    public function handle(): int
    {
        $count = 0;
        $dryRun = (bool) $this->option('dry-run');

        // Ambil semua peminjaman yang status overdue (sudah terlambat)
        $overdueBorrowings = Borrowing::query()
            ->where('status', 'overdue')
            ->with(['user', 'book'])
            ->get();

        foreach ($overdueBorrowings as $borrowing) {
            $count++;
            
            if ($dryRun) {
                $this->info("[DRY] would send daily overdue reminder to {$borrowing->user?->phone} - borrowing #{$borrowing->id}");
                continue;
            }
            
            // Kirim notifikasi harian untuk buku terlambat
            dispatch(new SendWhatsAppReminderJob($borrowing->id, 'daily_overdue'));
        }

        $this->info("Processed {$count} overdue borrowings for daily reminders.");
        return self::SUCCESS;
    }
}
