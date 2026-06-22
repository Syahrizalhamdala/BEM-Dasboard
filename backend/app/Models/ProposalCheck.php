<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProposalCheck extends Model
{
    protected $fillable = [
        'guideline_id',
        'nama_file',
        'konten_proposal',
        'hasil_check',
        'jumlah_issues',
        'status',
        'admin_notes',
        'reviewed_by',
        'reviewed_at',
        'signed_at',
        'signed_by',
        'signature_path',
    ];

    protected function casts(): array
    {
        return [
            'hasil_check' => 'array',
            'reviewed_at' => 'datetime',
            'signed_at' => 'datetime',
        ];
    }

    public function guideline()
    {
        return $this->belongsTo(ProposalGuideline::class, 'guideline_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function signer()
    {
        return $this->belongsTo(User::class, 'signed_by');
    }

    public function isLulusAi(): bool
    {
        return $this->jumlah_issues === 0;
    }

    public function canReview(): bool
    {
        return $this->status === 'lulus_ai';
    }

    public function canSign(): bool
    {
        return $this->status === 'approved';
    }
}
