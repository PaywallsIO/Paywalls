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
        Schema::create('published_paywalls', function (Blueprint $table) {
            $table->uuid('uuid')->primary();
            $table->foreignId('paywall_id')->constrained()->cascadeOnDelete();
            $table->text('html')->nullable();
            $table->text('js')->nullable();
            $table->text('css')->nullable();
            $table->integer('paywall_version')->nullable();
            $table->foreignId('published_by')
                ->nullable()
                ->constrained()
                ->references('id')
                ->on('users')
                ->nullOnDelete();
            $table->timestamps();
        });

        Schema::table('paywalls', function (Blueprint $table) {
            // foreighn key to pyblished paywall based on uuid
            $table->foreignUuid('published_uuid')
                ->nullable()
                ->constrained()
                ->references('uuid')
                ->on('published_paywalls');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('paywalls', function (Blueprint $table) {
            $table->dropForeign(['published_uuid']);
            $table->dropColumn('published_uuid');
        });
        Schema::table('published_paywalls', function (Blueprint $table) {
            $table->dropForeign(['paywall_id']);
            $table->dropForeign(['published_by']);
        });
        Schema::dropIfExists('published_paywalls');
    }
};
