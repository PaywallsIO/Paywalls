<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Called from FE
Route::middleware('auth:sanctum')->group(function () {
    Route::get('user', function (Request $request) {
        return $request->user();
    });

    Route::resource('paywalls', App\Http\Controllers\PaywallController::class);
    Route::resource('campaigns', App\Http\Controllers\CampaignController::class);
    Route::patch('paywalls/publish/{paywall}', [App\Http\Controllers\PaywallController::class, 'publish']);
    Route::resource('projects', App\Http\Controllers\ProjectController::class);
});

// Called from clients
Route::middleware('auth:app')->group(function () {
    Route::get('app_users/{distinct_id}', [App\Http\Controllers\AppUserController::class, 'show']);
    Route::post('events/ingest', [App\Http\Controllers\EventController::class, 'ingest']);
    Route::post('events/trigger', [App\Http\Controllers\EventController::class, 'trigger']);
});
