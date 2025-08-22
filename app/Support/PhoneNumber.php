<?php

namespace App\Support;

class PhoneNumber
{
    /**
     * Normalize Indonesian numbers to E.164 with +62
     * Examples:
     *  - 085712345678 -> +6285712345678
     *  - 85712345678  -> +6285712345678
     *  - 6285712345678 -> +6285712345678
     *  - +6285712345678 -> +6285712345678
     */
    public static function normalizeToE164(string $raw): string
    {
        $digits = preg_replace('/[^0-9+]/', '', trim($raw));

        if ($digits === null || $digits === '') {
            return '';
        }

        if (str_starts_with($digits, '+')) {
            return $digits; // assume already E.164
        }

        if (str_starts_with($digits, '0')) {
            return '+62' . substr($digits, 1);
        }

        if (str_starts_with($digits, '62')) {
            return '+' . $digits;
        }

        // If starts with 8/81... assume local mobile without leading zero
        if (preg_match('/^8\d{6,}$/', $digits)) {
            return '+62' . $digits;
        }

        // Fallback: return as-is with + prefix if numeric
        if (preg_match('/^\d+$/', $digits)) {
            return '+' . $digits;
        }

        return '';
    }
}


