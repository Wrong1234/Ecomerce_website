<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;



Route::get('/test', function(){
    return "test";
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (authentication required)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
});