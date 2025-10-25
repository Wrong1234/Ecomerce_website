<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Pixels table - stores tracking pixel configurations
        Schema::create('pixels', function (Blueprint $table) {
            $table->id();
            $table->string('pixel_id')->unique();
            $table->string('name');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->boolean('is_active')->default(true);
            $table->json('settings')->nullable();
            $table->timestamps();
            
            $table->index('pixel_id');
            $table->index('user_id');
        });

        // Tracking events table - stores all tracked events
        Schema::create('tracking_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pixel_id')->constrained('pixels')->onDelete('cascade');
            $table->string('session_id')->index();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('event_type')->index();
            $table->json('event_data')->nullable();
            $table->json('browser_info')->nullable();
            $table->json('referrer_info')->nullable();
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('event_timestamp');
            $table->timestamps();
            
            $table->index(['pixel_id', 'event_type']);
            $table->index(['pixel_id', 'session_id']);
            $table->index('event_timestamp');
        });

        // Sessions table - aggregated session data
        Schema::create('tracking_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pixel_id')->constrained('pixels')->onDelete('cascade');
            $table->string('session_id')->unique();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->integer('page_views')->default(0);
            $table->integer('events_count')->default(0);
            $table->timestamp('first_seen_at')->useCurrent();
            $table->timestamp('last_seen_at')->nullable();
            $table->integer('duration_seconds')->nullable();
            $table->string('landing_page')->nullable();
            $table->string('exit_page')->nullable();
            $table->string('referrer')->nullable();
            $table->timestamps();
            
            $table->index(['pixel_id', 'session_id']);
        });

        // Conversions table - tracks important conversions
        Schema::create('conversions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pixel_id')->constrained('pixels')->onDelete('cascade');
            $table->string('session_id')->index();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('conversion_type')->index(); // purchase, signup, etc.
            $table->decimal('value', 10, 2)->nullable();
            $table->string('currency', 3)->default('USD');
            $table->json('conversion_data')->nullable();
            $table->timestamps();
            
            $table->index(['pixel_id', 'conversion_type']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('conversions');
        Schema::dropIfExists('tracking_sessions');
        Schema::dropIfExists('tracking_events');
        Schema::dropIfExists('pixels');
    }
};