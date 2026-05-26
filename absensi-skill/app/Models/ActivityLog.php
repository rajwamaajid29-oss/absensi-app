<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $fillable = [
        'karyawan_id',
        'department_id',
        'activity',
        'description',
    ];

    public function karyawan()
    {
        return $this->belongsTo(Karyawan::class);
    }
}
