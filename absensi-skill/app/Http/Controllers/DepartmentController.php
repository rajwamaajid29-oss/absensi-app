<?php

namespace App\Http\Controllers;

use App\Models\Karyawan;
use App\Models\Attendance;

use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function index()
    {
        $today = now()->toDateString();
        $departments = Karyawan::select('department')
            ->selectRaw('COUNT(*) as total')
            ->groupBy('department')
            ->get();
        $totalUsers = Karyawan::count();
        $checkInToday = Attendance::whereDate('date', $today)
            ->whereNotNull('check_in')
            ->distinct('karyawan_id')
            ->count('karyawan_id');
        $belumCheckIn = max(
            0,
            $totalUsers - $checkInToday
        );
        $lateEmployees = Attendance::whereDate('date', $today)
            ->where('status', 'late')
            ->count();
        $leaveRequests = Attendance::whereDate('date', $today)
            ->where('status', 'leave')
            ->count();
        return Inertia::render('Departments', [

            'departments'     => $departments,
            'totalUsers'      => $totalUsers,
            'checkInToday'    => $checkInToday,
            'belumCheckIn'    => $belumCheckIn,
            'lateEmployees'   => $lateEmployees,
            'leaveRequests'   => $leaveRequests,
        ]);
    }
}
