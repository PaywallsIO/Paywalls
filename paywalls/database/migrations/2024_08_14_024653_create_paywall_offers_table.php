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
        Schema::create('paywall_offer', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paywall_id')->constrained()->onDelete('cascade');
            $table->foreignId('offer_id')->constrained()->onDelete('cascade');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('paywall_offer', function (Blueprint $table) {
            $table->dropForeign(['paywall_id']);
            $table->dropForeign(['offer_id']);
        });
        Schema::dropIfExists('paywall_offer');
    }
};
