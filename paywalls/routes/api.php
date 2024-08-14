<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('user', function (Request $request) {
        return $request->user();
    });

    Route::resource('paywalls', App\Http\Controllers\PaywallController::class);
    Route::resource('projects', App\Http\Controllers\ProjectController::class);
});

Route::middleware('auth:app')->group(function () {
    Route::get('app_users/{distinct_id}', [App\Http\Controllers\AppUserController::class, 'show']);
    Route::post('events/ingest', [App\Http\Controllers\EventController::class, 'ingest']);
    Route::post('events/trigger', [App\Http\Controllers\EventController::class, 'trigger']);
});
