<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('messages', function (Blueprint $table) {
        
            // For Reply feature
            $table->foreignId('reply_to_id')->nullable()->constrained('messages')->onDelete('set null');
            
            // For Edit feature
            $table->boolean('is_edited')->default(false);
            $table->timestamp('edited_at')->nullable();
            
            // For Delete feature
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->string('deleted_by')->nullable(); // 'sender' or 'everyone' 
            $table->enum('deleted_scope', ['none', 'everyone', 'me'])->default('none');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropForeign(['reply_to_id']);
            $table->dropColumn(['reply_to_id', 'is_edited', 'edited_at', 'is_deleted', 'deleted_at', 'deleted_by', 'deleted_scope']);
        });
    }
};
