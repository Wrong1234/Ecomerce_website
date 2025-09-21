<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
   protected $middleware = [
    // ... other middleware
    \App\Http\Middleware\CorsMiddleware::class,
];

    protected $middlewareGroups = [
        'web' => [
            // ... web middleware
        ],

        'api' => [
            'throttle:api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
    ];
}
