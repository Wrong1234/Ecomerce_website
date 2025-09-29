<?php

namespace Modules\ChatApp\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
// use Modules\ChatApp\Database\Factories\MessageFactory;

class Message extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'sender_id',
        'receiver_id',
        'message',
        'file'
    ];

    // protected static function newFactory(): MessageFactory
    // {
    //     // return MessageFactory::new();
    // }

    public function sender(){
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver(){
        return $this->belongsTo(User::class , 'receiver_id');
    }
}
