<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'user_id',
        'agenda_id',
        'check_in_time',
        'latitude',
        'longitude',
        'distance',
        'verification_method',
    ];

    protected $casts = [
        'check_in_time' => 'datetime',
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'distance' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function agenda()
    {
        return $this->belongsTo(JadwalRapat::class, 'agenda_id');
    }
}
