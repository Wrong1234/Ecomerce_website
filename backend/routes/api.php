<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (authentication required)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
});


//Products route
Route::get('/create', [ProductController::class, 'create'])->name('create');
Route::get('/viewAllProducts', [ProductController::class, 'view'])->name('viewAllProducts');
Route::post('/store', [ProductController::class, 'store'])->name('store');
Route::get('/products', [ProductController::class, 'products']);
Route::get('/product/{id}', [ProductController::class, 'product']);

Route::get('/dashboard', [ProductController::class, 'dashboard'])->name('dashboard');

//orders route
Route::post('/store', [OrderController::class, 'store'])->name('store');
Route::get('/ordersManagement', [OrderController::class, 'getOrders'])->name('ordersManagement');