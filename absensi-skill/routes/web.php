<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\KaryawanController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ShiftController;

/*
|--------------------------------------------------------------------------
| LANDING
|--------------------------------------------------------------------------
*/

Route::get('/', function () {

    return Inertia::render('Welcome');

});

require __DIR__.'/auth.php';

/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | DASHBOARD
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/dashboard',
        [DashboardController::class, 'index']
    );

    /*
    |--------------------------------------------------------------------------
    | ADMIN ONLY
    |--------------------------------------------------------------------------
    */

    Route::middleware(['admin'])->group(function () {

        /*
        |--------------------------------------------------------------------------
        | KARYAWAN
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/karyawan',
            [KaryawanController::class, 'index']
        );

        Route::post(
            '/karyawan',
            [KaryawanController::class, 'store']
        );

        Route::put(
            '/karyawan/{id}',
            [KaryawanController::class, 'update']
        );

        Route::delete(
            '/karyawan/{id}',
            [KaryawanController::class, 'destroy']
        );

        /*
        |--------------------------------------------------------------------------
        | DEPARTMENTS
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/departments',
            [DepartmentController::class, 'index']
        );

        /*
        |--------------------------------------------------------------------------
        | SHIFT
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/shift-management',
            [ShiftController::class, 'index']
        );

        Route::post(
            '/shift-management',
            [ShiftController::class, 'store']
        );

        Route::put(
            '/shift-management/{id}',
            [ShiftController::class, 'update']
        );

        Route::delete(
            '/shift-management/{id}',
            [ShiftController::class, 'destroy']
        );
    });

    /*
    |--------------------------------------------------------------------------
    | KARYAWAN ONLY
    |--------------------------------------------------------------------------
    */

    Route::middleware(['karyawan'])->group(function () {

        Route::get(
            '/attendance',
            [AttendanceController::class, 'index']
        );

        Route::post(
            '/attendance/check-in',
            [AttendanceController::class, 'checkIn']
        );

        Route::post(
            '/attendance/check-out/{id}',
            [AttendanceController::class, 'checkOut']
        );
    });

    /*
    |--------------------------------------------------------------------------
    | ADMIN + KARYAWAN
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/activity-logs',
        [ActivityLogController::class, 'index']
    );
});
