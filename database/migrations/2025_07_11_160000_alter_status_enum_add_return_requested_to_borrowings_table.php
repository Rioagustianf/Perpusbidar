<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        \DB::statement("ALTER TABLE borrowings MODIFY status ENUM('pending','approved','return_requested','returned','rejected','overdue') NOT NULL DEFAULT 'pending'");
    }

    public function down(): void
    {
        \DB::statement("ALTER TABLE borrowings MODIFY status ENUM('pending','approved','returned','rejected','overdue') NOT NULL DEFAULT 'pending'");
    }
}; 