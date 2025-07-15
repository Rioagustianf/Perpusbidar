<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin User
        User::create([
            'name' => 'Admin Perpustakaan',
            'email' => 'admin@binadarma.ac.id',
            'nim' => null, // Admin tidak memiliki NIM
            'phone' => '081234567890',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create Regular User (Student)
        User::create([
            'name' => 'John Doe',
            'email' => 'john.doe@student.binadarma.ac.id',
            'nim' => '2021001001',
            'phone' => '081987654321',
            'password' => Hash::make('user123'),
            'role' => 'user',
            'email_verified_at' => now(),
        ]);

        // Create another Regular User (Student)
        User::create([
            'name' => 'Jane Smith',
            'email' => 'jane.smith@student.binadarma.ac.id',
            'nim' => '2021001002',
            'phone' => '081555666777',
            'password' => Hash::make('user123'),
            'role' => 'user',
            'email_verified_at' => now(),
        ]);
    }
}
