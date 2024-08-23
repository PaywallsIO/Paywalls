<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Called from FE
Route::scopeBindings()->middleware('auth:sanctum')->group(function () {
    Route::get('user', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('projects', App\Http\Controllers\ProjectController::class);
});

Route::scopeBindings()->prefix('projects/{project}')->middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('apps', App\Http\Controllers\AppController::class)
        ->middleware([
            'can:view,project',
        ]);
    Route::apiResource('paywalls', App\Http\Controllers\PaywallController::class)
        ->middleware([
            'can:view,project',
        ]);
    Route::apiResource('campaigns', App\Http\Controllers\CampaignController::class)
        ->middleware([
            'can:view,project',
        ]);
    Route::patch('paywalls/{paywall}/publish', [App\Http\Controllers\PaywallController::class, 'publish'])
        ->middleware([
            'can:update,project',
        ]);

    Route::scopeBindings()->prefix('campaigns/{campaign}')->middleware(['auth:sanctum', 'can:update,project'])->group(function () {
        Route::apiResource('audiences', App\Http\Controllers\AudienceController::class);
    });
});

// Called from clients
Route::middleware('auth:app')->group(function () {
    Route::get('app_users/{distinct_id}', [App\Http\Controllers\AppUserController::class, 'show']);
    Route::post('events/ingest', [App\Http\Controllers\EventController::class, 'ingest']);
    Route::post('events/trigger', [App\Http\Controllers\EventController::class, 'trigger']);
});
