<?php

namespace Modules\ChatApp\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\ChatApp\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    /**
     * Display paginated messages between authenticated user and another user
     */
    public function index(Request $request): JsonResponse
    {
        // $user = Auth::user();
        // return response()->json([
        //     'data'=> $user,
        //     'token' => $request->all(),
        // ]);
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'per_page' => 'integer|min:1|max:100'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $userId = $request->user_id;
        $perPage = $request->get('per_page', 20);
        $authUserId = Auth::id();

        $messages = Message::where(function($query) use ($authUserId, $userId) {
            $query->where('sender_id', $authUserId)
                  ->where('receiver_id', $userId);
        })->orWhere(function($query) use ($authUserId, $userId) {
            $query->where('sender_id', $userId)
                  ->where('receiver_id', $authUserId);
        })
        ->with(['sender:id,name,avatar', 'receiver:id,name,avatar'])
        ->orderBy('created_at', 'desc')
        ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $messages
        ]);
    }

    /**
     * Store a new message
     */
    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();
        $validator = Validator::make($request->all(), [
            'receiver_id' => 'required|exists:users,id|different:' . $user->id,
            'message' => 'required_without:file|string|max:1000',
            'file' => 'required_without:message|file|mimes:jpg,jpeg,png,pdf,doc,docx|max:10240'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        
        try {
            $user = Auth::user();
            $messageData = [
                'sender_id' => $user->id,
                'receiver_id' => $request->receiver_id,
                'message' => $request->message
            ];

            // Handle file upload if present
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $filePath = $file->storeAs('chat-files', $fileName, 'public');
                $messageData['file'] = $filePath;
            }

            $message = Message::create($messageData);
            
            // Load relationships
            $message->load(['sender:id,name', 'receiver:id,name']);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Message sent successfully',
                'data' => $message
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to send message',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display a specific message
     */
    public function show($id): JsonResponse
    {
        $user = Auth::user();
        $authUserId = $user->id;
        
        $message = Message::where('id', $id)
            ->where(function($query) use ($authUserId) {
                $query->where('sender_id', $authUserId)
                      ->orWhere('receiver_id', $authUserId);
            })
            ->with(['sender:id,name,avatar', 'receiver:id,name,avatar'])
            ->first();

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Message not found or access denied'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $message
        ]);
    }

    /**
     * Update message (only sender can edit their own messages)
     */
    public function update(Request $request, $id): JsonResponse
    {
        $message = Message::where('id', $id)
            ->where('sender_id', Auth::id())
            ->first();

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Message not found or access denied'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:1000'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $message->update([
            'message' => $request->message
        ]);

        $message->load(['sender:id,name', 'receiver:id,name']);

        return response()->json([
            'success' => true,
            'message' => 'Message updated successfully',
            'data' => $message
        ]);
    }

    /**
     * Delete message (only sender can delete their own messages)
     */
    public function destroy($id): JsonResponse
    {
        $user = Auth::user();
        $message = Message::where('id', $id)
            ->where('sender_id', $user->id)
            ->first();

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Message not found or access denied'
            ], 404);
        }

        // Delete associated file if exists
        if ($message->file && Storage::disk('public')->exists($message->file)) {
            Storage::disk('public')->delete($message->file);
        }

        $message->delete();

        return response()->json([
            'success' => true,
            'message' => 'Message deleted successfully'
        ]);
    }

    /**
     * Get conversation list for authenticated user
     */
    public function conversations(): JsonResponse
    {
       $user = Auth::user();

       $authUserId = $user->id;

        $conversations = Message::select('messages.*')
            ->where(function($query) use ($authUserId) {
                $query->where('sender_id', $authUserId)
                      ->orWhere('receiver_id', $authUserId);
            })
            ->with(['sender:id,name,avatar', 'receiver:id,name,avatar'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy(function($message) use ($authUserId) {
                return $message->sender_id == $authUserId 
                    ? $message->receiver_id 
                    : $message->sender_id;
            })
            ->map(function($messages) {
                return $messages->first();
            })
            ->values();

        return response()->json([
            'success' => true,
            'data' => $conversations
        ]);
    }

    /**
     * Mark messages as read (if implementing read status)
     */
    public function markAsRead(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $userId = $request->user_id;
        $user = Auth::user();
        $authUserId = $user->id;

        // This assumes you have a 'read_at' column in messages table
        Message::where('sender_id', $userId)
            ->where('receiver_id', $authUserId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'Messages marked as read'
        ]);
    }

    /**
     * Get unread message count
     */
    public function unreadCount(): JsonResponse
    {
       $user = Auth::user();

       $authUserId = $user->id;

       $count = Message::where('receiver_id', $authUserId)
            ->whereNull('read_at')
            ->count();

        return response()->json([
            'success' => true,
            'data' => ['unread_count' => $count]
        ]);
    }

    /**
     * Search messages
     */
    public function search(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'query' => 'required|string|min:2',
            'user_id' => 'nullable|exists:users,id',
            'per_page' => 'integer|min:1|max:100'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $query = $request->query;
        $userId = $request->user_id;
        $perPage = $request->get('per_page', 20);
        $user = Auth::user();

        $authUserId = $user->id;

        $messagesQuery = Message::where(function($q) use ($authUserId) {
            $q->where('sender_id', $authUserId)
              ->orWhere('receiver_id', $authUserId);
        })
        ->where('message', 'LIKE', "%{$query}%");

        if ($userId) {
            $messagesQuery->where(function($q) use ($authUserId, $userId) {
                $q->where(function($subQ) use ($authUserId, $userId) {
                    $subQ->where('sender_id', $authUserId)
                         ->where('receiver_id', $userId);
                })->orWhere(function($subQ) use ($authUserId, $userId) {
                    $subQ->where('sender_id', $userId)
                         ->where('receiver_id', $authUserId);
                });
            });
        }

        $messages = $messagesQuery
            ->with(['sender:id,name,avatar', 'receiver:id,name,avatar'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $messages
        ]);
    }

    /**
     * Download file attachment
     */
    public function downloadFile($id): JsonResponse|\Symfony\Component\HttpFoundation\BinaryFileResponse
    {
       $user = Auth::user();

       $authUserId = $user->id;
        
        $message = Message::where('id', $id)
            ->where(function($query) use ($authUserId) {
                $query->where('sender_id', $authUserId)
                      ->orWhere('receiver_id', $authUserId);
            })
            ->first();

        if (!$message || !$message->file) {
            return response()->json([
                'success' => false,
                'message' => 'File not found or access denied'
            ], 404);
        }

        $filePath = storage_path('app/public/' . $message->file);
        
        if (!file_exists($filePath)) {
            return response()->json([
                'success' => false,
                'message' => 'File not found on server'
            ], 404);
        }

        return response()->download($filePath);
    }
}