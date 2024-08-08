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
        Schema::create('app_user_distinct_ids', function (Blueprint $table) {
            $table->id();
            $table->string('distinct_id');
            $table->foreignId('app_user_id')->constrained(
                table: 'app_users', indexName: 'app_user_distinct_ids_app_user_id'
            )->cascadeOnDelete();
            $table->foreignId('portal_id')->constrained()->cascadeOnDelete();

            $table->index('app_user_id');
            $table->index('distinct_id');
            $table->unique(['distinct_id', 'portal_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('person_distinct_ids');
    }
};
