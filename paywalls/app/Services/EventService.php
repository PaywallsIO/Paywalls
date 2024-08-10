<?php

namespace App\Services;

use App\Models\App;

class EventService
{
    public function __construct() {}

    public function processEvent(App $app, array $event): void
    {
        $app->events()->create($event);
    }
}
