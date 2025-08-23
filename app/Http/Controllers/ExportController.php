<?php

namespace App\Http\Controllers;

use App\Exports\BorrowingsExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;

class ExportController extends Controller
{
    /**
     * Export borrowings to Excel (Admin only).
     */
    public function exportBorrowings(Request $request)
    {
        // Only admin can export
        if (!Auth::user()->isAdmin()) {
            return redirect()->back()->with('error', 'Anda tidak memiliki akses untuk mengekspor data');
        }

        // Get filters from request
        $filters = [];
        
        if ($request->has('status') && $request->status !== 'all') {
            $filters['status'] = $request->status;
        }
        
        if ($request->has('start_date')) {
            $filters['start_date'] = $request->start_date;
        }
        
        if ($request->has('end_date')) {
            $filters['end_date'] = $request->end_date;
        }
        
        if ($request->has('user_id')) {
            $filters['user_id'] = $request->user_id;
        }

        // Generate filename with timestamp
        $timestamp = Carbon::now()->format('Y-m-d_H-i-s');
        $filename = "laporan_peminjaman_{$timestamp}.xlsx";

        try {
            return Excel::download(new BorrowingsExport($filters), $filename);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat mengekspor data: ' . $e->getMessage());
        }
    }


}
