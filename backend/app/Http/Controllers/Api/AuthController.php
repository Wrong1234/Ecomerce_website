<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function index(){

        $users = User::get();
        return response()->json([
            'success' => true,
            'message' => 'Get all user successfully',
            'users'   => $users,
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


//hello world