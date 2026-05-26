<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Office extends Model
{

    protected $fillable = [
        'name',
        'lat',
        'lng',
        'radius_m',
    ];
}
