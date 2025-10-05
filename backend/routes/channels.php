<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('chat-channel.{userId}', function(?User $user, int $userId){
     return (int) $user->id === (int) $userId;
});

//check online
Broadcast::channel('presence.chat', function($user){
    return [
        'id' => $user->id,
        'name' => $user->name,
    ];
});
