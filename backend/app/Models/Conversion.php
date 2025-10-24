<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversion extends Model
{
    protected $fillable = [
        'pixel_id',
        'session_id',
        'user_id',
        'conversion_type',
        'value',
        'currency',
        'conversion_data'
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'conversion_data' => 'array'
    ];

    public function pixel()
    {
        return $this->belongsTo(Pixel::class);
    }
}

