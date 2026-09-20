<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MagangApplication extends Model
{
    protected $fillable = [
        'magang_id',
        'nama_lengkap',
        'nim',
        'email',
        'no_hp',
        'universitas',
        'prodi',
        'semester',
        'cv_path',
        'motivasi',
        'status_pendaftaran',
    ];

    protected $hidden = ['cv_path'];

    public function magang()
    {
        return $this->belongsTo(Magang::class, 'magang_id');
    }
}
