<?php

namespace App\Services;

use App\Jobs\Models\ProcessEvent;
use App\Models\App;

class ProcessEventService
{
    public function __construct(
        protected App $app,
        protected ProcessEvent $event
    ) {}

    public function run(): void
    {
        $this->app->events()->create($this->event->toArray());
    }
}
