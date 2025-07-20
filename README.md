# Product Cart & Checkout System

# Tech Stack

## Backend:

- Laravel 10.x
- PHP 8.2+
- MySQL/PostgreSQL
- Laravel Sanctum (for API authentication)

## Frontend:

- React 18.x
- Vite
- Tailwind CSS
- Bootstrap

# Prerequisites
Before running this project, make sure you have the following installed:

- PHP >= 8.2
- Composer
- Node.js >= 16.x
- npm or yarn
- MySQL

# Installation
## 1. Clone the repository
 - git clone https://github.com/yourusername/your-project-name.git
 - cd your-project-name

## 2. Backend Setup (Laravel)
 -  Install PHP dependencies
 - composer install

# Copy environment file
cp .env.example .env

## Generate application key
 - php artisan key:generate

 - Configure your database in .env file
 - DB_CONNECTION=mysql
 - DB_HOST=127.0.0.1
 - DB_PORT=3306
 - DB_DATABASE=ecomerce
 - DB_USERNAME=root
 - DB_PASSWORD=""

## Run database migrations
php artisan migrate

## (Optional) Seed the database
  - php artisan db:seed
  - 
# 3. Frontend Setup (React)
 - Install Node dependencies
 - npm install

# Development Mode

## Terminal 1 - Laravel Backend:
 - php artisan serve
 - This will start the Laravel development server at http://localhost:8000
## Terminal 2 - React Frontend:
 - npm run dev
 - This will start the Vite development server at http://localhost:5173

## Production Build
 - Build React assets
 - npm run build

# Serve Laravel in production
 - php artisan serve --env=production
 - API Documentation
 - The API endpoints are available at:

 - Base URL: http://localhost:8000/api
 - Authentication: Laravel Sanctum

Main Endpoints
 - GET    /api/users          - Get all users
 - POST   /api/users          - Create new user
 - POST   /api/store           - Create Product
 - GET   /api/products         - Get all Products
 - GET   /api/ordersManagement - Get all Orders

# Environment Variables
Create a .env file in the root directory with the following variables:
 - envAPP_NAME="Your App Name"
 - APP_ENV=local
 - APP_KEY=
 - APP_DEBUG=true
 - APP_URL=http://localhost:8000

 - DB_CONNECTION=mysql
 - DB_HOST=127.0.0.1
 - DB_PORT=3306
 - DB_DATABASE=ecomerce
 - DB_USERNAME=root
 - DB_PASSWORD=""

 - SANCTUM_STATEFUL_DOMAINS=localhost:5173
 - SESSION_DOMAIN=localhost

# Project Structure
 - ├── app/                   # Laravel application files
 - ├── database/              # Database migrations and seeders
 - ├── resources/
 - │   ├── js/               # React components and assets
 - │   │   ├── components/   # Reusable React components
 - │   │   ├── pages/        # Page components
 - │   │   └── app.jsx       # Main React app
 - │   └── views/            # Laravel Blade templates
 - ├── routes/
 - │   ├── api.php           # API routes
 - │   └── web.php           # Web routes
 - ├── public/               # Public assets
 - └── package.json          # Node.js dependencies
