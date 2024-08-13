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
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('project_id')->constrained();
            $table->integer('last_edited_by')->nullable();
            $table->date('archived_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        // Pivot table
        Schema::create('campaign_paywall', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained();
            $table->foreignId('paywall_id')->constrained();
            $table->integer('percentage');
            $table->timestamps();
        });

        Schema::create('campaign_triggers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained();
            $table->string('event_name');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('campaign_audiences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained();
            $table->integer('sort_order')->default(0);
            $table->jsonb('filters')->default('{}');
            $table->integer('match_limit')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
        });
        Schema::table('campaign_paywall', function (Blueprint $table) {
            $table->dropForeign(['campaign_id']);
            $table->dropForeign(['paywall_id']);
        });
        Schema::table('campaign_triggers', function (Blueprint $table) {
            $table->dropForeign(['campaign_id']);
        });
        Schema::table('campaign_audiences', function (Blueprint $table) {
            $table->dropForeign(['campaign_id']);
        });

        Schema::dropIfExists('campaigns');
        Schema::dropIfExists('campaign_paywall');
        Schema::dropIfExists('campaign_triggers');
        Schema::dropIfExists('campaign_audiences');
    }
};
