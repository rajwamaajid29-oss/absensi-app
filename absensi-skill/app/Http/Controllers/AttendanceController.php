<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Karyawan;
use App\Models\ActivityLog;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $today = now()->toDateString();

        /*
        |--------------------------------------------------------------------------
        | CARI KARYAWAN BERDASARKAN USER LOGIN
        |--------------------------------------------------------------------------
        */

        $karyawan = Karyawan::where(
            'name',
            $user->name
        )->first();

        return Inertia::render('Attendance', [

            'todayAttendance' => $karyawan
                ? Attendance::where(
                    'karyawan_id',
                    $karyawan->id
                )->whereDate('date', $today)->first()
                : null,

            'karyawan' => $karyawan,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | CHECK IN
    |--------------------------------------------------------------------------
    */

    public function checkIn(Request $request)
    {
        $request->validate([

            'lat' => 'required',

            'lng' => 'required',

            'check_in_time' => 'required',
        ]);

        $user = Auth::user();

        $today = now()->toDateString();

        /*
        |--------------------------------------------------------------------------
        | CARI KARYAWAN BERDASARKAN USER LOGIN
        |--------------------------------------------------------------------------
        */

        $karyawan = Karyawan::where(
            'name',
            $user->name
        )->first();

        /*
        |--------------------------------------------------------------------------
        | DEBUG
        |--------------------------------------------------------------------------
        */

        if (!$karyawan) {

            return back()->withErrors([

                'message' =>
                    'Data karyawan tidak ditemukan. '
                    . 'Pastikan nama user login sama dengan nama di tabel karyawans.'
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | CEK SUDAH ABSEN
        |--------------------------------------------------------------------------
        */

        $already = Attendance::where(
            'karyawan_id',
            $karyawan->id
        )
        ->whereDate('date', $today)
        ->first();

        if ($already) {

            return back()->withErrors([

                'message' => 'Sudah check in hari ini'
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | STATUS TELAT
        |--------------------------------------------------------------------------
        */

        $status =
            $request->check_in_time > '08:00:00'
            ? 'late'
            : 'on_time';

        /*
        |--------------------------------------------------------------------------
        | SIMPAN ABSEN
        |--------------------------------------------------------------------------
        */

        $attendance = Attendance::create([

            'karyawan_id' => $karyawan->id,

            'date' => $today,

            'check_in' => $request->check_in_time,

            'latitude' => $request->lat,

            'longitude' => $request->lng,

            'photo' => $request->photo,

            'qr' => $request->qr,

            'status' => $status,
        ]);

        /*
        |--------------------------------------------------------------------------
        | ACTIVITY LOG
        |--------------------------------------------------------------------------
        */

        ActivityLog::create([

            'karyawan_id' => $karyawan->id,

            'activity' => 'Check In',

            'description' =>
                $karyawan->name .
                ' melakukan check in jam ' .
                $request->check_in_time,
        ]);

        return back()->with([

            'success' => 'Check in berhasil'
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | CHECK OUT
    |--------------------------------------------------------------------------
    */

    public function checkOut(Request $request, $id)
    {
        $request->validate([

            'checkout_time' => 'required',
        ]);

        $attendance = Attendance::findOrFail($id);

        if ($attendance->check_out) {

            return back()->withErrors([

                'message' => 'Sudah check out'
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | UPDATE CHECKOUT
        |--------------------------------------------------------------------------
        */

        $attendance->update([

            'check_out' => $request->checkout_time,

            'checkout_note' => $request->checkout_note,
        ]);

        /*
        |--------------------------------------------------------------------------
        | ACTIVITY LOG
        |--------------------------------------------------------------------------
        */

        ActivityLog::create([

            'karyawan_id' => $attendance->karyawan_id,

            'activity' => 'Check Out',

            'description' =>
                'Karyawan melakukan check out jam '
                . $request->checkout_time,
        ]);

        return back()->with([

            'success' => 'Check out berhasil'
        ]);
    }
}
