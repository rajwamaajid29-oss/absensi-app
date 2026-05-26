<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'karyawan_id',
        'date',
        'check_in',
        'check_out',
        'latitude',
        'longitude',
        'photo',
        'qr',
        'status',
        'checkout_note',
    ];

    public function karyawan()
    {
        return $this->belongsTo(Karyawan::class);
    }
}
