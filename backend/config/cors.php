<?php
// config/cors.php
// return [
//     'paths' => ['api/*', 'sanctum/csrf-cookie'],
    
//     'allowed_methods' => ['*'],
    
//     'allowed_origins' => [
//         'http://localhost:3000',  // React dev server
//         'http://127.0.0.1:3000',
//         'http://localhost:5173',  // Vite dev server
//         'http://127.0.0.1:5174',
//         // Add your production URLs here
//     ],
    
//     'allowed_origins_patterns' => [],
    
//     'allowed_headers' => ['*'],
    
//     'exposed_headers' => [],
    
//     'max_age' => 0,
    
//     'supports_credentials' => true,
// ];

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    
    'allowed_methods' => ['*'],
    
    'allowed_origins' => [
        'http://localhost:5174', // Add your React dev server
        'http://localhost:3000',  // Common React port
    ],
    
    'allowed_origins_patterns' => [],
    
    'allowed_headers' => ['*'],
    
    'exposed_headers' => [],
    
    'max_age' => 0,
    
    'supports_credentials' => false,
];