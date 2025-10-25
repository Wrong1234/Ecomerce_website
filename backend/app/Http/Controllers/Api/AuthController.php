<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Modules\ChatApp\Models\Message;
use App\Services\ChatService;

class AuthController extends Controller
{

    protected $chatService;
    
    public function __construct(ChatService $chatService){
        $this->chatService = $chatService;
    }

    public function index(){

            $authUserId = Auth::id();

            // Get all users except authenticated user
            $users = User::where('id', '!=', $authUserId)->get();

            $chats = $users->map(function ($user) use ($authUserId) {

                // Get last message between auth user and this user
                $lastMessage = Message::where(function ($q) use ($authUserId, $user) {
                    $q->where('sender_id', $authUserId)
                    ->where('receiver_id', $user->id);
                })->orWhere(function ($q) use ($authUserId, $user) {
                    $q->where('sender_id', $user->id)
                    ->where('receiver_id', $authUserId);
                })
                ->latest()
                ->first();
                $count =  $this->chatService->unreadCount($user->id);
                // $unReadMessage = Message::where(function($q) use ($authUserId), $user){

                // }

                return [
                    'id'            => $user->id,
                    'name'          => $user->name,
                    'image'         => $user->image,
                    'lastMessage'   => $lastMessage ? $lastMessage->message : 'No messages yet',
                    'lastMessageAt' => $lastMessage ? $lastMessage->created_at->toDateTimeString() : null,
                    'unread'        => $count,
                    'online'        => false, // presence will update this
                ];
            });

            // Sort chats by last message time (latest first)
            $chats = $chats->sortByDesc(fn($chat) => $chat['lastMessageAt'] ?? now())->values();

            return response()->json([
                'success' => true,
                'users'    => $chats
            ]);
    }

    // Register new user
    public function register(Request $request)
    {
        // dd($request->all());
        // Validate input data
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role'    => 'nullable|string',
        ]);

        // Create new user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        // Create token for user
        // $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            // 'token' => $token,
        ], 201);

    }
     public function update(Request $request, $id)
    {

        $user = User::findOrFail($id);
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|string|email|max:255|unique:users',
            'role'    => 'nullable|string',
            'image'   => 'nullable|file|max:20480',
        ]);

        
        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('users', 'public');
        }

        $user->update($validated);

        // Create token for user
        // $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            // 'token' => $token,
        ], 201);

    }

    // Login user
    public function login(Request $request)
    {
        // Validate input data
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Check if user exists and password is correct
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        // Create token for user
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ], 200);
    }

    public function show($id){

        $user = User::findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Get specific user successfully',
            'user'    => $user,
        ]);
    }

    // Logout user
    public function destroy(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ], 200);
    }

    // Get user profile
    public function profile(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
        ], 200);
    }
}

