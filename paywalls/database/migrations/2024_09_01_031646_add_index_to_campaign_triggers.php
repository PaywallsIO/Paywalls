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
        Schema::table('campaign_triggers', function (Blueprint $table) {
            $table->index(['campaign_id', 'event_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('campaign_triggers', function (Blueprint $table) {
            $table->dropIndex(['campaign_id', 'event_name']);
        });
    }
};
