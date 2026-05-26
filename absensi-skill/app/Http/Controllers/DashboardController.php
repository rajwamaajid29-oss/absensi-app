<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Karyawan;
use App\Models\Attendance;
use App\Models\Shift;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        /*
        |--------------------------------------------------------------------------
        | ADMIN DASHBOARD
        |--------------------------------------------------------------------------
        */

        if ($user->role === 'admin') {

            return Inertia::render('Dashboard', [

                'role' => 'admin',

                'totalKaryawan' => Karyawan::count(),

                'checkInToday' => Attendance::whereDate('date', today())->count(),

                'lateEmployees' => Attendance::where('status', 'late')
                    ->whereDate('date', today())
                    ->count(),

                'leaveRequests' => 0,

                'autoCheckout' => Attendance::where('status', 'auto checkout')
                    ->whereDate('date', today())
                    ->count(),

                'notCheckedOut' => Attendance::whereNull('check_out')
                    ->whereDate('date', today())
                    ->count(),

                'attendances' => Attendance::with('karyawan')
                    ->latest()
                    ->take(10)
                    ->get(),

                'monthlyAttendance' => Attendance::selectRaw('
                        MONTH(date) as month_number,
                        MONTHNAME(date) as month,
                        COUNT(*) as total
                    ')
                    ->groupBy('month_number', 'month')
                    ->orderBy('month_number')
                    ->get()
                    ->map(function ($item) {

                        return [
                            'month' => substr($item->month, 0, 3),
                            'total' => $item->total,
                        ];
                    }),

                'todayShifts' => Shift::with('karyawan')
                    ->whereDate('date', today())
                    ->take(4)
                    ->get(),
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | KARYAWAN DASHBOARD
        |--------------------------------------------------------------------------
        */

        $karyawan = Karyawan::where('email', $user->email)->first();

        if (!$karyawan) {
            abort(403);
        }

        return Inertia::render('Dashboard', [

            'role' => 'karyawan',

            'employeeName' => $karyawan->name,

            'checkInToday' => Attendance::where('karyawan_id', $karyawan->id)
                ->whereDate('date', today())
                ->count(),

            'lateEmployees' => Attendance::where('karyawan_id', $karyawan->id)
                ->where('status', 'late')
                ->whereDate('date', today())
                ->count(),

            'leaveRequests' => Attendance::where('karyawan_id', $karyawan->id)
                ->where('status', 'leave')
                ->count(),

            'autoCheckout' => Attendance::where('karyawan_id', $karyawan->id)
                ->where('status', 'auto checkout')
                ->count(),

            'notCheckedOut' => Attendance::where('karyawan_id', $karyawan->id)
                ->whereNull('check_out')
                ->whereDate('date', today())
                ->count(),

            'attendances' => Attendance::where('karyawan_id', $karyawan->id)
                ->latest()
                ->take(10)
                ->get(),

            'monthlyAttendance' => Attendance::where('karyawan_id', $karyawan->id)
                ->selectRaw('
                    MONTH(date) as month_number,
                    MONTHNAME(date) as month,
                    COUNT(*) as total
                ')
                ->groupBy('month_number', 'month')
                ->orderBy('month_number')
                ->get()
                ->map(function ($item) {

                    return [
                        'month' => substr($item->month, 0, 3),
                        'total' => $item->total,
                    ];
                }),

            'todayShifts' => Shift::where('karyawan_id', $karyawan->id)
                ->whereDate('date', today())
                ->get(),
        ]);
    }
}
