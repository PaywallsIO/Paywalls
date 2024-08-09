<?php

namespace App\Http\Controllers;

use App\Http\Requests\IngestEventsRequest;
use App\Jobs\ProcessEvent;

class EventController extends Controller
{
    public function ingest(IngestEventsRequest $request)
    {
        foreach ($request->safe()->events as $event) {
            ProcessEvent::dispatch(authApp(), $event);
        }
    }
}
