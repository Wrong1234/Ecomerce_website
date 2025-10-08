<?php

use Illuminate\Support\Facades\Route;
use Modules\ChatApp\Http\Controllers\MessageController;
use Illuminate\Http\Request;

// Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
//     Route::apiResource('chatapps', ChatAppController::class)->names('chatapp');
// });

//debug token
Route::middleware('auth:sanctum')->get('/debug-auth', function (Request $request) {
    return response()->json([
        'authenticated' => true,
        'user' => $request->user()
    ]);
});

//Message Management
Route::prefix("/messages")->middleware('auth:sanctum')->group(function(){
    Route::get("/", [MessageController::class, "index"]);
    Route::post("/", [MessageController::class, "store"]);
    Route::get("/{id}", [MessageController::class, "show"]);
    Route::put("/{id}", [MessageController::class, "update"]);
    Route::delete("/{id}", [MessageController::class, "destroy"]);
    Route::put("/read-at/{id}", [MessageController::class, 'markAsRead']);
});