<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kabinet extends Model
{
    protected $fillable = ['nim', 'nama', 'prodi', 'divisi', 'jabatan', 'angkatan', 'foto', 'status', 'password'];

    protected $hidden = ['password'];
}
