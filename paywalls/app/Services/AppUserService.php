<?php

namespace App\Services;

use App\Models\App;

class AppUserService
{
    public function __construct() {}

    public function processAppUserFromEvent(App $app, array $event): void
    {
        $app->portal->appUsers()->create();
    }
}
