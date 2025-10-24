<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrackingEvent extends Model
{
    protected $fillable = [
        'pixel_id',
        'session_id',
        'user_id',
        'event_type',
        'event_data',
        'browser_info',
        'referrer_info',
        'ip_address',
        'user_agent',
        'event_timestamp'
    ];

    protected $casts = [
        'event_data' => 'array',
        'browser_info' => 'array',
        'referrer_info' => 'array',
        'event_timestamp' => 'datetime'
    ];

    public function pixel()
    {
        return $this->belongsTo(Pixel::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
