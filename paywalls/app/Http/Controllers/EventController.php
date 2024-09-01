<?php

namespace App\Http\Controllers;

use App\Http\Requests\IngestEventsRequest;
use App\Jobs\Models\ProcessEvent;
use App\Jobs\ProcessEventJob;

class EventController extends Controller
{
    public function ingest(IngestEventsRequest $request)
    {
        foreach ($request->safe()->events as $event) {
            ProcessEventJob::dispatch(authApp(), new ProcessEvent($event));
        }
    }
}
