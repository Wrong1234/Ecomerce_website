<?php

// app/Services/ChatService.php
namespace App\Services;

use Modules\ChatApp\Models\Message;
use Illuminate\Http\Request;

class ChatService
{
    public function unreadCount($authUserId)
    {

       $count = Message::where('receiver_id', $authUserId)
            ->where('read_at', 0)
            ->count();

       return $count;
    }
}
