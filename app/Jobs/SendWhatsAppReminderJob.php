<?php

namespace App\Jobs;

use App\Models\Borrowing;
use App\Services\WablasClient;
use App\Support\PhoneNumber;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SendWhatsAppReminderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60;

    public function __construct(
        private readonly int $borrowingId,
        private readonly string $reminderType = 'due_today' // 'due_today' atau 'daily_overdue'
    ) {
    }

    public function handle(WablasClient $wablas): void
    {
        $borrowing = Borrowing::with(['user', 'book'])->find($this->borrowingId);
        if (!$borrowing || !$borrowing->user) {
            return;
        }

        $user = $borrowing->user;
        $book = $borrowing->book;

        $phone = $user->phone ?? null;
        if ($phone) {
            $phone = PhoneNumber::normalizeToE164($phone);
        }
        if (!$phone || !$wablas->isConfigured()) {
            Log::warning('WA reminder skipped: phone or wablas not configured', [
                'borrowing_id' => $this->borrowingId,
                'reminder_type' => $this->reminderType,
            ]);
            return;
        }

        $dueDate = optional($borrowing->return_date)->format('d M Y');
        $message = $this->buildMessage($user, $book, $dueDate, $borrowing);

        $result = $wablas->sendMessage($phone, $message);

        if (!$result['ok']) {
            $this->release($this->backoff);
            Log::error('WA reminder failed', [
                'borrowing_id' => $this->borrowingId,
                'reminder_type' => $this->reminderType,
                'status' => $result['status'] ?? null,
                'body' => $result['body'] ?? null,
            ]);
        } else {
            Log::info('WA reminder sent', [
                'borrowing_id' => $this->borrowingId,
                'reminder_type' => $this->reminderType,
                'status' => $result['status'] ?? null,
            ]);
        }
    }

    private function buildMessage($user, $book, $dueDate, $borrowing): string
    {
        if ($this->reminderType === 'daily_overdue') {
            return $this->buildOverdueMessage($user, $book, $dueDate, $borrowing);
        }
        
        return $this->buildDueTodayMessage($user, $book, $dueDate, $borrowing);
    }

    private function buildDueTodayMessage($user, $book, $dueDate, $borrowing): string
    {
        return "📚 *E-PERPUSBIDAR*\n\n" .
               "Halo {$user->name} 👋\n\n" .
               "📖 *PENGINGAT PENGEMBALIAN BUKU*\n\n" .
               "Judul: *" . ($book?->title ?? '-') . "*\n" .
               "Penulis: " . ($book?->author ?? '-') . "\n" .
               "Jatuh Tempo: *{$dueDate}*\n" .
               "Status: ⏰ *HARI INI*\n\n" .
               "⚠️ *JANGAN SAMPAI TERLAMBAT!*\n" .
               "Denda akan dikenakan mulai besok.\n\n" .
               "💡 *Informasi:*\n" .
               "• Denda keterlambatan: Rp 500/hari\n" .
               "• Denda kerusakan: Rp 250.000\n\n" .
               "📍 Silakan kembalikan ke perpustakaan atau hubungi admin.\n\n" .
               "📞 Hubungi kami: 0812-3456-7890\n\n" .
               "Terima kasih atas perhatiannya 🙏\n\n" .
               "---\n" .
               "Pesan otomatis dari sistem Perpustakaan Digital";
    }

    private function buildOverdueMessage($user, $book, $dueDate, $borrowing): string
    {
        $overdueDays = $this->calculateOverdueDays($borrowing);
        $currentFine = $this->calculateCurrentFine($borrowing);
        $fineFormatted = number_format($currentFine, 0, ',', '.');
        
        return "🚨 *E-PERPUSBIDAR - PENGINGAT HARIAN*\n\n" .
               "Halo {$user->name} 👋\n\n" .
               "📖 *PENGINGAT PENGEMBALIAN BUKU - TERLAMBAT*\n\n" .
               "Judul: *" . ($book?->title ?? '-') . "*\n" .
               "Penulis: " . ($book?->author ?? '-') . "\n" .
               "Jatuh Tempo: *{$dueDate}*\n" .
               "Status: 🚨 *TERLAMBAT {$overdueDays} HARI*\n\n" .
               "💰 *Denda saat ini: Rp {$fineFormatted}*\n\n" .
               "⚠️ *Denda akan bertambah setiap hari!*\n" .
               "📍 Segera kembalikan buku untuk menghentikan denda.\n\n" .
               "💡 *Informasi:*\n" .
               "• Denda keterlambatan: Rp 500/hari\n" .
               "• Denda kerusakan: Rp 250.000\n\n" .
               "📞 Hubungi kami: 0812-3456-7890\n\n" .
               "Terima kasih atas perhatiannya 🙏\n\n" .
               "---\n" .
               "Pesan otomatis dari sistem Perpustakaan Digital";
    }

    private function calculateOverdueDays($borrowing): int
    {
        $returnDate = Carbon::parse($borrowing->return_date);
        $today = Carbon::today();
        
        // Jika return_date di masa depan, berarti belum terlambat
        if ($today->lte($returnDate)) {
            return 0;
        }
        
        // Hitung hari keterlambatan (selalu positif)
        $overdueDays = $returnDate->diffInDays($today);
        
        return $overdueDays;
    }

    private function calculateCurrentFine($borrowing): int
    {
        $overdueDays = $this->calculateOverdueDays($borrowing);
        return $overdueDays * 500; // Rp 500 per hari
    }
}


