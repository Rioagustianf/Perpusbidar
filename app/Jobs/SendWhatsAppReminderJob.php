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

class SendWhatsAppReminderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60;

    public function __construct(private readonly int $borrowingId)
    {
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
                'status' => $result['status'] ?? null,
                'body' => $result['body'] ?? null,
            ]);
        } else {
            Log::info('WA reminder sent', [
                'borrowing_id' => $this->borrowingId,
                'status' => $result['status'] ?? null,
            ]);
        }
    }

    private function buildMessage($user, $book, $dueDate, $borrowing): string
    {
        return "📚 *E-PERPUSBIDAR*\n\n" .
               "Halo {$user->name} 👋\n\n" .
               "📖 *Pengingat Pengembalian Buku*\n\n" .
               "Judul: *" . ($book?->title ?? '-') . "*\n" .
               "Penulis: " . ($book?->author ?? '-') . "\n" .
               "Jatuh Tempo: *{$dueDate}*\n" .
               "Status: ⏰ *HARI INI*\n\n" .
               "Mohon segera kembalikan buku tersebut ke perpustakaan untuk menghindari denda keterlambatan.\n\n" .
               "💡 *Informasi:*\n" .
               "• Denda keterlambatan: Rp 500/hari\n" .
               "• Denda kerusakan: Rp 250.000\n\n" .
               "📞 Hubungi kami: 0812-3456-7890\n\n" .
               "Terima kasih atas perhatiannya 🙏\n\n" .
               "---\n" .
               "Pesan otomatis dari sistem Perpustakaan Digital";
    }
}


