<?php

namespace App\Jobs;

use App\Models\App;
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
    public function handle(): void
    {
        $this->app->events()->create($this->event);
    }
}
