<?php

use App\Http\Controllers\TriggerFireController;
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
        Route::patch('audiences/sort_order', [App\Http\Controllers\AudienceController::class, 'updateSortOrder'])->name('audiences.updateSortOrder');
        Route::patch('audiences/{audience}/restore', [App\Http\Controllers\AudienceController::class, 'restore'])->withTrashed();
        Route::apiResource('audiences', App\Http\Controllers\AudienceController::class);

        Route::patch('triggers/{trigger}/restore', [App\Http\Controllers\TriggerController::class, 'restore'])->withTrashed();
        Route::apiResource('triggers', App\Http\Controllers\TriggerController::class);
    });
});

// Called from clients who send a bearer token
Route::middleware('auth:app')->group(function () {
    Route::get('app_users/{distinct_id}', [App\Http\Controllers\AppUserController::class, 'show']);
    Route::post('events/ingest', [App\Http\Controllers\EventController::class, 'ingest']);

    Route::post('trigger', TriggerFireController::class)->name('trigger.fire');
});
