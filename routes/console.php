<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule daily reminder at configurable time (default 07:00)
$reminderTime = env('DUE_REMINDER_TIME', '07:00');
Schedule::command('reminder:due-today')->dailyAt($reminderTime);

// Schedule daily overdue marking and fine calculation (default 08:00)
$overdueTime = env('OVERDUE_CHECK_TIME', '08:00');
Schedule::command('borrowings:mark-overdue')->dailyAt($overdueTime);

// Schedule daily overdue reminders (default 09:00)
$dailyOverdueTime = env('DAILY_OVERDUE_REMINDER_TIME', '09:00');
Schedule::command('reminder:daily-overdue')->dailyAt($dailyOverdueTime);
