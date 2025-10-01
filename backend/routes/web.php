<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

// Route::get('/', function () {
//     return view('dashboard');
// });

// Broadcasting routes with Sanctum authentication
// Broadcast::routes(['middleware' => ['auth:sanctum']]);

// // Custom broadcasting auth route with detailed logging
// Route::post('/broadcasting/auth', function (Request $request) {
//     Log::info('=== Broadcasting Auth Request START ===');
    
//     // Check if user is authenticated
//     $token = $request->bearerToken();
//     Log::info('Token check', [
//         'has_token' => !empty($token),
//         'token_preview' => $token ? substr($token, 0, 20) . '...' : 'none'
//     ]);
    
//     // Authenticate user with Sanctum
//     if ($token) {
//         $user = \Laravel\Sanctum\PersonalAccessToken::findToken($token)?->tokenable;
        
//         if (!$user) {
//             Log::error('Invalid token - user not found');
//             return response()->json(['error' => 'Unauthenticated'], 401);
//         }
        
//         // Manually authenticate the user
//         auth()->setUser($user);
        
//         Log::info('User authenticated', [
//             'user_id' => $user->id,
//             'user_email' => $user->email
//         ]);
//     } else {
//         Log::error('No bearer token provided');
//         return response()->json(['error' => 'No token provided'], 401);
//     }
    
//     Log::info('Broadcasting auth data', [
//         'socket_id' => $request->input('socket_id'),
//         'channel_name' => $request->input('channel_name'),
//         'user_id' => auth()->id()
//     ]);
    
//     try {
//         // Perform the actual broadcast authentication
//         $response = Broadcast::auth($request);
        
//         Log::info('Broadcasting auth SUCCESSFUL', [
//             'user_id' => auth()->id(),
//             'channel' => $request->input('channel_name')
//         ]);
        
//         Log::info('=== Broadcasting Auth Request END (SUCCESS) ===');
        
//         return $response;
        
//     } catch (\Exception $e) {
//         Log::error('Broadcasting auth FAILED', [
//             'error' => $e->getMessage(),
//             'user_id' => auth()->id(),
//             'channel' => $request->input('channel_name'),
//             'trace' => $e->getTraceAsString()
//         ]);
        
//         Log::info('=== Broadcasting Auth Request END (FAILED) ===');
        
//         return response()->json([
//             'error' => $e->getMessage()
//         ], 403);
//     }
// })->middleware('throttle:60,1');

