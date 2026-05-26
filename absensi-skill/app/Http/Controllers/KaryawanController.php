<?php

namespace App\Http\Controllers;

use App\Models\Karyawan;
use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

use Inertia\Inertia;

class KaryawanController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | INDEX
    |--------------------------------------------------------------------------
    */

    public function index()
    {
        return Inertia::render('Profile/Karyawan', [

            'karyawans' => Karyawan::latest()->get()

        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | STORE
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
{
    $request->validate([

        'name' => 'required|string|max:255',

        'email' =>
            'required|email|unique:karyawans,email|unique:users,email',

        'password' => 'required|min:6',

        'role' => 'required',

        'phone' => 'nullable',

        'jabatan' => 'required',

        'department' => 'required',
    ]);

    DB::transaction(function () use ($request) {

        Karyawan::create([

            'employee_id' =>
                'EMP-' . rand(1000, 9999),

            'name' => $request->name,

            'email' => $request->email,

            'password' =>
                Hash::make($request->password),

            'phone' => $request->phone,

            'jabatan' => $request->jabatan,

            'department' => $request->department,

            'status' => 'active',

            'join_date' => now(),
        ]);

        User::create([

            'name' => $request->name,

            'email' => $request->email,

            'password' =>
                Hash::make($request->password),

            'role' => $request->role,
        ]);
    });

    return redirect()->back()->with([

        'success' =>
            'Karyawan berhasil ditambahkan'
    ]);


        DB::transaction(function () use ($request) {

            /*
            |--------------------------------------------------------------------------
            | SIMPAN KARYAWAN
            |--------------------------------------------------------------------------
            */

            Karyawan::create([

                'employee_id' =>
                    'EMP-' . rand(1000, 9999),

                'name'       => $request->name,

                'email'      => $request->email,

                'phone'      => $request->phone,

                'jabatan'    => $request->jabatan,

                'department' => $request->department,

                'status'     => 'active',

                'join_date'  => now(),
            ]);

            /*
            |--------------------------------------------------------------------------
            | BUAT USER LOGIN
            |--------------------------------------------------------------------------
            */

            User::create([

                'name' => $request->name,

                'email' => $request->email,

                'password' =>
                    Hash::make($request->password),

                // ✅ role default
                'role' => 'karyawan',
            ]);
        });

        return redirect()->back()->with([

            'success' =>
                'Karyawan berhasil ditambahkan'
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE
    |--------------------------------------------------------------------------
    */

    public function update(Request $request, $id)
    {
        $karyawan = Karyawan::findOrFail($id);

        $request->validate([

            'name'       => 'required|string|max:255',

            'email'      =>
                'required|email|unique:karyawans,email,' . $id,

            'phone'      => 'nullable',

            'jabatan'    => 'required',

            'department' => 'required',
        ]);

        DB::transaction(function () use (
            $request,
            $karyawan
        ) {

            $oldEmail = $karyawan->email;

            /*
            |--------------------------------------------------------------------------
            | UPDATE KARYAWAN
            |--------------------------------------------------------------------------
            */

            $karyawan->update([

                'name'       => $request->name,

                'email'      => $request->email,

                'phone'      => $request->phone,

                'jabatan'    => $request->jabatan,

                'department' => $request->department,
            ]);

            /*
            |--------------------------------------------------------------------------
            | UPDATE USER LOGIN
            |--------------------------------------------------------------------------
            */

            $user = User::where(
                'email',
                $oldEmail
            )->first();

            if ($user) {

                $user->update([

                    'name'  => $request->name,

                    'email' => $request->email,
                ]);

                // ✅ kalau password diisi
                if ($request->password) {

                    $user->update([

                        'password' =>
                            Hash::make($request->password)
                    ]);
                }
            }
        });

        return redirect()->back()->with([

            'success' =>
                'Karyawan berhasil diupdate'
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE
    |--------------------------------------------------------------------------
    */

    public function destroy($id)
    {
        $karyawan = Karyawan::findOrFail($id);

        DB::transaction(function () use (
            $karyawan
        ) {

            /*
            |--------------------------------------------------------------------------
            | HAPUS USER LOGIN
            |--------------------------------------------------------------------------
            */

            User::where(
                'email',
                $karyawan->email
            )->delete();

            /*
            |--------------------------------------------------------------------------
            | HAPUS KARYAWAN
            |--------------------------------------------------------------------------
            */

            $karyawan->delete();
        });

        return redirect()->back()->with([

            'success' =>
                'Karyawan berhasil dihapus'
        ]);
    }
}
