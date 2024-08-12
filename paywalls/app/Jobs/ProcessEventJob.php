<?php

namespace App\Jobs;

use App\Jobs\Models\ProcessEvent;
use App\Models\App;
use App\Services\ProcessAppUserService;
use App\Services\ProcessEventService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessEventJob implements ShouldQueue
{
    use Queueable;

    protected ProcessAppUserService $appUserService;

    protected ProcessEventService $eventService;

    /**
     * Create a new job instance.
     */
    public function __construct(
        protected App $app,
        protected ProcessEvent $event
    ) {
        $this->appUserService = new ProcessAppUserService(
            $this->app,
            $this->event
        );
        $this->eventService = new ProcessEventService(
            $this->app,
            $this->event
        );
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->appUserService->run();
        $this->eventService->run();
    }
}
