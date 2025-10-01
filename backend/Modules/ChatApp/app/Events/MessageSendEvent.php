<?php

// namespace Modules\ChatApp\Events;

// use Illuminate\Broadcasting\Channel;
// use Illuminate\Broadcasting\InteractsWithSockets;
// use Illuminate\Broadcasting\PresenceChannel;
// use Illuminate\Broadcasting\PrivateChannel;
// use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
// use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
// use Illuminate\Foundation\Events\Dispatchable;
// use Illuminate\Queue\SerializesModels;
// use Illuminate\Support\Facades\Log;

// class MessageSendEvent implements ShouldBroadcastNow
// {
//     use Dispatchable, InteractsWithSockets, SerializesModels;

//     /**
//      * Create a new event instance.
//      */

//     private $transformedMessage;

//     public function __construct($transformedMessage) {
//         $this->transformedMessage = $transformedMessage;
//     }

//     /**
//      * Get the channels the event should be broadcast on.
//      */
//     public function broadcastOn(): array
//     {
//         Log:info($this->transformedMessage);
//         return [
//             new PrivateChannel('chat-channel.' . $this->transformedMessage->receiver_id),
//         ];
//     }
// }

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
        // Access as array, not object
        Log::info('Broadcasting message', ['message' => $this->message]);
        
        return [
            new PrivateChannel('chat-channel.' . $this->message['sender_id']),
            new PrivateChannel('chat-channel.' . $this->message['receiver_id']),
        ];
    }

    public function broadcastWith(): array
    {
        return ['message' => $this->message];
    }
}
