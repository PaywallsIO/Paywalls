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
        Schema::create('person_distinct_ids', function (Blueprint $table) {
            $table->id();
            $table->uuid('distinct_id');
            $table->foreignId('person_id')->constrained(
                table: 'person', indexName: 'person_distinct_ids_person_id'
            )->cascadeOnDelete();
            $table->foreignId('portal_id')->constrained()->cascadeOnDelete();

            $table->index('person_id');
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
