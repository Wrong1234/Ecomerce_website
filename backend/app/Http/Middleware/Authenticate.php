<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        // If request expects JSON (API), return null so it responds with 401
        if ($request->expectsJson()) {
            return null;
        }

        // Otherwise, redirect to web login route
        return route('login'); // Make sure you have a named 'login' route in web.php
    }

    /**
     * Handle unauthenticated user for API routes properly.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  array  $guards
     * @return void
     *
     * @throws \Illuminate\Auth\AuthenticationException
     */
    protected function unauthenticated($request, array $guards)
    {
        // API request: return JSON
        if ($request->expectsJson()) {
            abort(response()->json([
                'message' => 'Unauthenticated.'
            ], 401));
        }

        // Web request: use default redirect
        parent::unauthenticated($request, $guards);
    }
}
