<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('chat-channel.{userId}', function(?User $user, int $userId){
    Log::info('Channel authorization check', [
        'authenticated_user_id' => $user->id,
        'authenticated_user_email' => $user->email,
        'requested_channel_user_id' => $userId,
        'match' => (int) $user->id === (int) $userId
    ]);
    
    return (int) $user->id === (int) $userId;
});

// Broadcast::channel('chat-channel', function($user){
//     return $user;
// });