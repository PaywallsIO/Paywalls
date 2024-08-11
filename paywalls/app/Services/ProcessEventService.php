<?php

namespace App\Services;

use App\Jobs\Models\ProcessEvent;
use App\Models\App;

class ProcessEventService
{
    public function __construct() {}

    public function processEvent(App $app, ProcessEvent $event): void
    {
        $app->events()->create($event->toArray());
    }
}
