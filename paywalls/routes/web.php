<?php

use Illuminate\Support\Facades\Route;

Route::get('paywalls/{paywall}', [App\Http\Controllers\PaywallController::class, 'showPublished'])->name('paywall.showPublished');

Route::get('/', function () {
    return view('index');
});

Route::get('/{any}', function () {
    return redirect('/');
})->where('any', '^(?!api).*');
