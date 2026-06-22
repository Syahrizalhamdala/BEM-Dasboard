<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $fillable = [
        'type',
        'message',
        'user_id',
        'user_name',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];
}
