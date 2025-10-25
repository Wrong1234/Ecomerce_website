// File: app/Models/TrackingSession.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrackingSession extends Model
{
    protected $fillable = [
        'pixel_id',
        'session_id',
        'user_id',
        'page_views',
        'events_count',
        'first_seen_at',
        'last_seen_at',
        'duration_seconds',
        'landing_page',
        'exit_page',
        'referrer'
    ];

    protected $casts = [
        'first_seen_at' => 'datetime',
        'last_seen_at' => 'datetime'
    ];

    public function pixel()
    {
        return $this->belongsTo(Pixel::class);
    }

    public function events()
    {
        return $this->hasMany(TrackingEvent::class, 'session_id', 'session_id');
    }
}
