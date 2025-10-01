<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\User;
use Illuminate\Support\Facades\Log;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('chat-channel.{userId}', function(User $user, $userId){
     Log::info('Auth check for user', ['user_id' => $user->id, 'channel' => $userId]);
    return (int) $user->id === (int) $userId;
});
