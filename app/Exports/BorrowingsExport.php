<?php

namespace App\Exports;

use App\Models\Borrowing;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class BorrowingsExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $filters;

    public function __construct($filters = [])
    {
        $this->filters = $filters;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        $query = Borrowing::with(['user', 'book']);

        // Apply filters
        if (isset($this->filters['status']) && $this->filters['status'] !== 'all') {
            $query->where('status', $this->filters['status']);
        }

        if (isset($this->filters['start_date']) && isset($this->filters['end_date'])) {
            $query->whereBetween('borrow_date', [$this->filters['start_date'], $this->filters['end_date']]);
        }

        if (isset($this->filters['user_id'])) {
            $query->where('user_id', $this->filters['user_id']);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Nama Peminjam',
            'NIM',
            'Judul Buku',
            'Penulis',
            'ISBN',
            'Tanggal Pinjam',
            'Tanggal Kembali',
            'Tanggal Dikembalikan',
            'Status',
            'Kondisi Buku',
            'Denda (Rp)',
            'Catatan',
            'Tanggal Pengajuan',
        ];
    }

    public function map($borrowing): array
    {
        return [
            $borrowing->id,
            $borrowing->user->name,
            $borrowing->user->nim,
            $borrowing->book->title,
            $borrowing->book->author,
            $borrowing->book->isbn,
            $borrowing->borrow_date->format('d/m/Y'),
            $borrowing->return_date->format('d/m/Y'),
            $borrowing->actual_return_date ? $borrowing->actual_return_date->format('d/m/Y') : '-',
            ucfirst($borrowing->status),
            $borrowing->condition ?? '-',
            number_format($borrowing->fine, 0, ',', '.'),
            $borrowing->notes ?? '-',
            $borrowing->created_at->format('d/m/Y H:i'),
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
