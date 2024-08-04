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
        Schema::create('paywalls', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('portal_id')
                ->constrained()
                ->onDelete('cascade');
            $table->jsonb('content')->default('{}');
            $table->integer('version')->default(0);
            $table->foreignId('last_modified_by')
                ->nullable()
                ->constrained()
                ->references('id')
                ->on('users')
                ->nullOnDelete();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paywalls');
    }
};
