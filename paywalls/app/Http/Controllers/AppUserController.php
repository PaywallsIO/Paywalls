<?php

namespace App\Http\Controllers;

class AppUserController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show($distinctId)
    {
        return authPortal()->fetchAppUser($distinctId);
    }
}
