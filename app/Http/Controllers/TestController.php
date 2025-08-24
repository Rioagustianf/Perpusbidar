<?php

namespace App\Http\Controllers;

use App\Jobs\SendWhatsAppReminderJob;
use App\Models\Book;
use App\Models\Borrowing;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TestController extends Controller
{
    public function sendReminder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'borrowing_id' => 'nullable|integer|exists:borrowings,id',
            'user_id' => 'nullable|integer|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['ok' => false, 'errors' => $validator->errors()], 422);
        }

        $borrowingId = $request->integer('borrowing_id');

        if (!$borrowingId) {
            $userId = $request->integer('user_id');
            if (!$userId) {
                return response()->json(['ok' => false, 'message' => 'Provide borrowing_id or user_id'], 400);
            }

            $user = User::find($userId);
            if (!$user || !$user->phone) {
                return response()->json(['ok' => false, 'message' => 'User not found or phone missing'], 400);
            }

            $book = Book::first();
            if (!$book) {
                $book = Book::create([
                    'title' => 'Buku Uji',
                    'author' => 'Anon',
                    'isbn' => 'TEST-ISBN',
                    'category' => 'TEST',
                    'year' => 2024,
                    'description' => '-',
                    'image' => null,
                    'stock' => 10,
                    'available_count' => 10,
                    'borrowed_count' => 0,
                    'is_recommended' => false,
                    'average_rating' => 0,
                    'total_ratings' => 0,
                    'status' => 'available',
                ]);
            }

            $borrowing = Borrowing::create([
                'user_id' => $user->id,
                'book_id' => $book->id,
                'borrow_date' => now()->subDays(1),
                'return_date' => now(),
                'status' => 'approved',
            ]);
            $borrowingId = $borrowing->id;
        }

        // Run job synchronously for immediate feedback
        dispatch_sync(new SendWhatsAppReminderJob($borrowingId));

        return response()->json(['ok' => true, 'borrowing_id' => $borrowingId]);
    }

    public function sendDailyOverdueReminder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'borrowing_id' => 'nullable|integer|exists:borrowings,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['ok' => false, 'errors' => $validator->errors()], 422);
        }

        $borrowingId = $request->integer('borrowing_id');

        if (!$borrowingId) {
            // Cari borrowing yang sudah overdue
            $overdueBorrowing = Borrowing::where('status', 'overdue')->first();
            if (!$overdueBorrowing) {
                return response()->json(['ok' => false, 'message' => 'No overdue borrowings found'], 400);
            }
            $borrowingId = $overdueBorrowing->id;
        }

        // Run job synchronously for immediate feedback
        dispatch_sync(new SendWhatsAppReminderJob($borrowingId, 'daily_overdue'));

        return response()->json(['ok' => true, 'borrowing_id' => $borrowingId]);
    }
}


