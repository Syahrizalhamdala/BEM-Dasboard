<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class JadwalRapat extends Model
{
    protected $fillable = [
        'agenda', 'lingkup', 'waktu', 'tanggal', 'waktu_mulai',
        'waktu_selesai', 'tempat', 'pemimpin', 'deskripsi',
        'qr_token', 'qr_code_url', 'is_qr_active',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'is_qr_active' => 'boolean',
    ];

    protected $appends = ['qr_status'];

    protected static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->qr_token)) {
                $model->qr_token = (string) Str::uuid();
            }
        });
    }

    public function getQrStatusAttribute(): string
    {
        if ($this->tanggal && $this->tanggal->isBefore(now()->startOfDay())) {
            return 'expired';
        }
        if ($this->is_qr_active) {
            return 'active';
        }
        return 'inactive';
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'agenda_id');
    }

    public function scopeActive($query)
    {
        return $query->whereDate('tanggal', '>=', now());
    }

    public function scopeQrActive($query)
    {
        return $query->where('is_qr_active', true);
    }
}
