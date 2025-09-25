<?php

use Illuminate\Support\Facades\Route;
use Modules\ChatApp\Http\Controllers\ChatAppController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('chatapps', ChatAppController::class)->names('chatapp');
});
