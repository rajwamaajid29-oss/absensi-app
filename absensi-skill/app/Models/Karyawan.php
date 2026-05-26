<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Karyawan extends Authenticatable
{
    protected $fillable = [

        'employee_id',
        'name',
        'email',
        'password',
        'phone',
        'jabatan',
        'department',
        'status',
        'join_date',
        'avatar',

    ];

    protected $hidden = [
        'password',
    ];

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function shifts()
    {
        return $this->hasMany(Shift::class);
    }

    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class);
    }
}
