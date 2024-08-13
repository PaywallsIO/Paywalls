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
        Schema::create('apps', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('platform');
            $table->string('bundle_id');
            $table->foreignId('portal_id')
                ->constrained();
            $table->foreignId('project_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('apps', function (Blueprint $table) {
            $table->dropForeign(['portal_id']);
            $table->dropForeign(['project_id']);
        });
        Schema::dropIfExists('apps');
    }
};
