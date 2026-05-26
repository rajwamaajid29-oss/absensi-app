<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shift extends Model
{
   protected $fillable = [
    'karyawan_id',
    'date',
    'shift_name',
    'start_time',
    'end_time',
];
     public function karyawan()
    {
        return $this->belongsTo(Karyawan::class, 'karyawan_id');
    }
}
