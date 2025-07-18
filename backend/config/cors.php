<?php
// return [
//   'paths' => ['api/*', 'sanctum/csrf-cookie'],
//   'allowed_methods' => ['*'],
//   'allowed_origins' => [' http://localhost:3000/'], 
//   'allowed_headers' => ['*'],
//   'supports_credentials' => true,
// ];

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:5173'],  // ✅ Vite dev server

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true, // ✅ if you're sending cookies or sessions

];

