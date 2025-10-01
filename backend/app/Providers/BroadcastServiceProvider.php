<?php
// app/Providers/BroadcastServiceProvider.php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Broadcast;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // 1. UNCOMMENT and ensure Broadcast::routes() is called.
        // 2. Specify the 'auth:sanctum' middleware for API token authentication.
        // 3. (Optional but recommended for API): Add a 'prefix' => 'api'
        // Broadcast::routes(['prefix' => 'api', 'middleware' => ['auth:sanctum']]);

        require base_path('routes/channels.php');
    }
    
}