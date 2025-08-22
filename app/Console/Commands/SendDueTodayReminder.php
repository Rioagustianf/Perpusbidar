<?php

namespace App\Console\Commands;

use App\Jobs\SendWhatsAppReminderJob;
use App\Models\Borrowing;
use Illuminate\Console\Command;

class SendDueTodayReminder extends Command
{
    protected $signature = 'reminder:due-today {--dry-run}';
    protected $description = 'Dispatch WhatsApp reminders for borrowings due today';

    public function handle(): int
    {
        $count = 0;
        $dryRun = (bool) $this->option('dry-run');

        Borrowing::query()
            ->whereDate('return_date', now()->toDateString())
            ->whereIn('status', ['approved', 'overdue'])
            ->with(['user', 'book'])
            ->chunkById(200, function ($borrowings) use (&$count, $dryRun) {
                foreach ($borrowings as $borrowing) {
                    $count++;
                    if ($dryRun) {
                        $this->info("[DRY] would send to {$borrowing->user?->phone} - borrowing #{$borrowing->id}");
                        continue;
                    }
                    dispatch(new SendWhatsAppReminderJob($borrowing->id));
                }
            });

        $this->info("Processed {$count} borrowings.");
        return self::SUCCESS;
    }
}


