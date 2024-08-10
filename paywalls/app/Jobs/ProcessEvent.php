<?php

namespace App\Jobs;

use App\Models\App;
use App\Services\AppUserService;
use App\Services\EventService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessEvent implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        protected App $app,
        protected array $event
    ) {}

    /**
     * Execute the job.
     */
    public function handle(
        AppUserService $appUserService,
        EventService $eventService
    ): void {
        $appUserService->processAppUserFromEvent($this->app, $this->event);
        $eventService->processEvent($this->app, $this->event);
    }
}
