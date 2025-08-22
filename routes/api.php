<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;

// API test endpoint to trigger WhatsApp reminder (no CSRF in API middleware)
Route::post('/test/wa-reminder', [TestController::class, 'sendReminder']);


