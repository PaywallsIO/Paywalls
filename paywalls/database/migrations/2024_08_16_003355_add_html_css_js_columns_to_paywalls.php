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
        Schema::table('paywalls', function (Blueprint $table) {
            $table->text('html')->nullable();
            $table->text('js')->nullable();
            $table->text('css')->nullable();
            $table->integer('published_version')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('paywalls', function (Blueprint $table) {
            $table->dropColumn('html');
            $table->dropColumn('css');
            $table->dropColumn('js');
        });
    }
};
