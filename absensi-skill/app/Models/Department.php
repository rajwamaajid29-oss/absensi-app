<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = [
        'name',
        'icon',
        'color'
    ];

    public function karyawans()
    {
        return $this->hasMany(Karyawan::class);
    }
}
