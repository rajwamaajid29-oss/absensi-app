<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use App\Models\Karyawan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShiftController extends Controller
{
    public function index()
    {
        $shifts = Shift::with('karyawan')
            ->orderBy('date', 'asc')
            ->get();

        $karyawans = Karyawan::all();

        return Inertia::render('ShiftManagement', [
            'shifts' => $shifts,
            'karyawans' => $karyawans,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'karyawan_id' => 'required',
            'selected_dates' => 'required|array',

            'shift_type' => 'required',

            'start_time' => 'nullable',
            'end_time' => 'nullable',
        ]);

        foreach ($request->selected_dates as $date) {

            Shift::create([

                'karyawan_id' => $request->karyawan_id,

                'date' => $date,

                // karena DB lu shift_name
                'shift_name' => $request->shift_type,

                'start_time' =>
                    $request->shift_type === 'libur'
                        ? null
                        : $request->start_time,

                'end_time' =>
                    $request->shift_type === 'libur'
                        ? null
                        : $request->end_time,
            ]);
        }

        return redirect()->back();
    }
}
