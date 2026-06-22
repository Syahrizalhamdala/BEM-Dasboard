<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Anggota extends Model
{
    protected $table = 'kabinets';

    protected $fillable = [
        'nim',
        'jabatan',
        'nama',
        'angkatan',
        'foto',
        'status',
    ];
}
