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
    Route::post('app_users', [App\Http\Controllers\AppUserController::class, 'bulk']);
    Route::resource('events', App\Http\Controllers\EventController::class);
});
