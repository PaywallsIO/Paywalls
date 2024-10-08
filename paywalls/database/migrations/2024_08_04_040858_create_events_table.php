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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('app_id')->nullable()->constrained()->nullOnDelete();
            $table->uuid('uuid');
            $table->string('distinct_id');
            $table->dateTime('timestamp'); // when the event happened in real life
            $table->jsonb('properties')->default('{}');
            $table->timestamps();

            $table->index('distinct_id');
            $table->index('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropForeign(['app_id']);
        });
        Schema::dropIfExists('events');
    }
};
