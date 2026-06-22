<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgramKerja extends Model
{
    protected $fillable = ['kementerian', 'program_kerja', 'bidang', 'bulan', 'tanggal', 'lokasi', 'deskripsi', 'status'];
}
