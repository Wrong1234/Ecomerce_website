<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Ecomerce Website</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/navber.css') }}">
    @vite(['resources/css/app.css', 'resources/js/app.js'])

 </head>
<body>
    <!-- Fixed Sidebar -->
    <aside class="sidebar">
        <div class="brand">
            <span>Ecomerce</span>
        </div>
        <div class="nav-menu">
            <a href="{{route('dashboard')}}" class="active">
                <i class="fas fa-tachometer-alt me-2"></i>Dashboard
            </a>
            <a href="{{route('viewAllProducts')}}">
                <i class="fas fa-box me-2"></i>Products Management
            </a>
             <a href="#">
                <i class="fas fa-box me-2"></i>Order Management
            </a>
        </div>
    </aside>

    <!-- Fixed Top Navigation -->
    <nav class="top-navbar">
        <div class="hidden sm:flex sm:items-center sm:ms-6 space-x-4">
            @auth
                <div>
                    <a href="#" class="text-sm text-gray-700 hover:text-gray-900">
                        <i class="fas fa-user-circle me-1"></i>{{ Auth::user()->name }}
                    </a>

                <form method="POST" action="" class="inline">
                    @csrf
                    <button type="submit" class="text-sm text-gray-700 hover:text-gray-900 bg-transparent border-none cursor-pointer">
                        <i class="fas fa-sign-out-alt me-1"></i> Logout
                    </button>
                </form>
                </div>
         @endauth
        </div>
    </nav>


     @yield('content')