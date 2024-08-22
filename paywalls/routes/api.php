<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Called from FE
Route::middleware('auth:sanctum')->group(function () {
    Route::get('user', function (Request $request) {
        return $request->user();
    });

    Route::resource('projects', App\Http\Controllers\ProjectController::class);
})->scopeBindings();

Route::prefix('projects/{project}')->middleware(['auth:sanctum'])->group(function () {
    Route::resource('apps', App\Http\Controllers\AppController::class)
        ->middleware([
            'can:view,project',
        ]);
    Route::resource('paywalls', App\Http\Controllers\PaywallController::class)
        ->middleware([
            'can:view,project',
        ]);
    Route::resource('campaigns', App\Http\Controllers\CampaignController::class)
        ->middleware([
            'can:view,project',
        ]);
    Route::patch('paywalls/{paywall}/publish', [App\Http\Controllers\PaywallController::class, 'publish'])
        ->middleware([
            'can:update,project',
        ]);

    Route::prefix(('campaigns/{campaign}'))->group(function () {
        Route::resource('audiences', App\Http\Controllers\CampaignController::class)
            ->middleware([
                'can:view,project',
            ]);
    });
})->scopeBindings();

// Called from clients
Route::middleware('auth:app')->group(function () {
    Route::get('app_users/{distinct_id}', [App\Http\Controllers\AppUserController::class, 'show']);
    Route::post('events/ingest', [App\Http\Controllers\EventController::class, 'ingest']);
    Route::post('events/trigger', [App\Http\Controllers\EventController::class, 'trigger']);
});
