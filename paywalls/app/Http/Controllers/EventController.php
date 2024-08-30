<?php

namespace App\Http\Controllers;

use App\Enums\TriggerFireProperty;
use App\Http\Requests\IngestEventsRequest;
use App\Http\Requests\TriggerRequest;
use App\Http\Resources\TriggerPaywallResource;
use App\Jobs\Models\ProcessEvent;
use App\Jobs\ProcessEventJob;
use App\Models\Paywall;

class EventController extends Controller
{
    public function ingest(IngestEventsRequest $request)
    {
        foreach ($request->safe()->events as $event) {
            ProcessEventJob::dispatch(authApp(), new ProcessEvent($event));
        }
    }

    public function trigger(TriggerRequest $request)
    {
        $data = [
            TriggerFireProperty::userFirstSeen->value => 'user.first_seen',
            TriggerFireProperty::userIsIdentified->value => 'user.is_identified',
            TriggerFireProperty::userTotalSessions->value => 'user.total_sessions',
            TriggerFireProperty::userSecondsSinceLastSeenPaywall->value => 'user.time_since_last_seen_paywall',
            TriggerFireProperty::userTotalSeenPaywalls->value => 'user.total_seen_paywalls',
            TriggerFireProperty::userLastPaywallId->value => 'user.last_paywall_id',
            TriggerFireProperty::userTimesinceSessionStart->value => 'user.timesince_session_start',

            TriggerFireProperty::sessionDurationSeconds->value => 'session.duration_seconds',

            TriggerFireProperty::appVersion->value => 'app.version',
            TriggerFireProperty::appBuildNumber->value => 'app.build_number',
            TriggerFireProperty::appBundleId->value => 'app.bundle_id',
            TriggerFireProperty::appBuildNumber->value => 'app.build_number',

            TriggerFireProperty::deviceScreenWidth->value => 'device.screen_width',
            TriggerFireProperty::deviceScreenHeight->value => 'device.screen_height',
            TriggerFireProperty::deviceOsVersion->value => 'device.os_version',
            TriggerFireProperty::deviceManufacturer->value => 'device.manufacturer',
            TriggerFireProperty::deviceModel->value => 'device.model',
            TriggerFireProperty::deviceOs->value => 'device.os',
        ];

        return [
            'paywall' => new TriggerPaywallResource(Paywall::first()),
        ];
    }
}
