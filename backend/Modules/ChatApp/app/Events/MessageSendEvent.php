<?php

// MessageSendEvent - FIXEd

namespace Modules\ChatApp\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class MessageSendEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message; // MUST be public for broadcasting

    public function __construct($transformedMessage) {
        $this->message = $transformedMessage;
    }

    public function broadcastOn(): array
    {
        
        return [
            new PrivateChannel('chat-channel.' . (int)$this->message['sender_id']),
            new PrivateChannel('chat-channel.' . (int)$this->message['receiver_id']),
        ];
    }

    public function broadcastWith(): array
    {
        return ['message' => $this->message];
    }

    public function broadcastAs(): string
    {
        return 'MessageSendEvent';
    }
}
