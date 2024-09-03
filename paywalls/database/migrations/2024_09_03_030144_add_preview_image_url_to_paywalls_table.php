<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('paywalls', function (Blueprint $table) {
            $table->string('preview_image_url')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('paywalls', function (Blueprint $table) {
            $table->dropColumn('preview_image_url');
        });
    }
};
