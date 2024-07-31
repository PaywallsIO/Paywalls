<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/*
name: models.CharField = models.CharField(max_length=255, null=True)
    team: models.ForeignKey = models.ForeignKey(Team, on_delete=models.CASCADE)
    content: models.JSONField = models.JSONField(default=dict)
    version: models.IntegerField = models.IntegerField(default=0)
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True, blank=True)
    created_by: models.ForeignKey = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    deleted_at: models.DateTimeField = models.DateTimeField(null=True, blank=True)
    last_modified_at: models.DateTimeField = models.DateTimeField(default=timezone.now)
    last_modified_by: models.ForeignKey = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="modified_paywalls",
    )
        */

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
            $table->foreignId('team_id')
                ->constrained()
                ->onDelete('cascade');
            $table->jsonb('content')->default('{}');
            $table->integer('version')->default(0);
            $table->dateTime('last_modified_at')->nullable();
            $table->foreignId('last_modified_by')
                ->nullable()
                ->constrained()
                ->references('id')
                ->on('users')
                ->onDelete('set null');
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
