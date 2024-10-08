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
        Schema::table('campaign_audiences', function (Blueprint $table) {
            $table->string('name');
            $table->integer('match_period')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('campaign_audiences', function (Blueprint $table) {
            $table->dropColumn('name');
            $table->dropColumn('match_period');
        });
    }
};
