<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;

// API test endpoint to trigger WhatsApp reminder (no CSRF in API middleware)
Route::post('/test/wa-reminder', [TestController::class, 'sendReminder']);

// API test endpoint to trigger daily overdue reminder
Route::post('/test/daily-overdue-reminder', [TestController::class, 'sendDailyOverdueReminder']);


