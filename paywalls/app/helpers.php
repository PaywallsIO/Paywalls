<?php

use Illuminate\Support\Facades\Auth;

function authApp(): ?App\Models\App
{
    return Auth::guard('app')->user();
}

function authPortal(): ?App\Models\Portal
{
    return authApp()->portal;
}
