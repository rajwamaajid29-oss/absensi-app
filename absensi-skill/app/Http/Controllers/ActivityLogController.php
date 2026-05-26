<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Karyawan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        /*
        |--------------------------------------------------------------------------
        | ADMIN
        |--------------------------------------------------------------------------
        */
        if ($user->role === 'admin') {

            $query = Attendance::with('karyawan');

            // FILTER DATE
            if ($request->start_date && $request->end_date) {
                $query->whereBetween('date', [
                    $request->start_date,
                    $request->end_date
                ]);
            }

            // FILTER STATUS
            if ($request->status && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            // SEARCH
            if ($request->search) {
                $query->whereHas('karyawan', function ($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%');
                });
            }

            $attendances = $query
                ->latest()
                ->paginate(10)
                ->withQueryString();

            return Inertia::render('ActivityLogs', [
                'role' => 'admin',
                'attendances' => $attendances,
                'stats' => [
                    'present' => Attendance::whereIn('status', ['on_time', 'late'])->count(),
                    'late' => Attendance::where('status', 'late')->count(),
                    'alpha' => Attendance::where('status', 'alpha')->count(),
                    'leave' => Attendance::where('status', 'leave')->count(),
                ],
                'filters' => [
                    'start_date' => $request->start_date,
                    'end_date' => $request->end_date,
                    'status' => $request->status,
                    'search' => $request->search,
                ]
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | KARYAWAN (FIX ANTI 403)
        |--------------------------------------------------------------------------
        */

        // 🔥 AMAN: cari karyawan berdasarkan email
        $karyawan = Karyawan::where('email', $user->email)->first();

        if (!$karyawan) {
            return response()->json([
                'error' => 'Karyawan tidak ditemukan',
                'user_email' => $user->email
            ], 403);
        }

        $query = Attendance::with('karyawan')
            ->where('karyawan_id', $karyawan->id);

        // FILTER DATE
        if ($request->start_date && $request->end_date) {
            $query->whereBetween('date', [
                $request->start_date,
                $request->end_date
            ]);
        }

        // FILTER STATUS
        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $attendances = $query
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('ActivityLogs', [
            'role' => 'karyawan',

            // ✅ NAMA KARYAWAN
            'employeeName' => $karyawan->name,

            'attendances' => $attendances,

            'stats' => [
                'present' => Attendance::where('karyawan_id', $karyawan->id)
                    ->whereIn('status', ['on_time', 'late'])
                    ->count(),

                'late' => Attendance::where('karyawan_id', $karyawan->id)
                    ->where('status', 'late')
                    ->count(),

                'alpha' => Attendance::where('karyawan_id', $karyawan->id)
                    ->where('status', 'alpha')
                    ->count(),

                'leave' => Attendance::where('karyawan_id', $karyawan->id)
                    ->where('status', 'leave')
                    ->count(),
            ],

            'filters' => [
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'status' => $request->status,
            ]
        ]);
    }
}
