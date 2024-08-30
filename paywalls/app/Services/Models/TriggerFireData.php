<?php

namespace App\Services\Models;

use App\Enums\EventName;
use App\Enums\PropertyName;
use App\Enums\TriggerFireProperty;
use App\Http\Requests\TriggerRequest;
use App\Models\AppUser;
use Illuminate\Support\Facades\DB;

final class TriggerFireData
{
    private array $data;

    public function __construct(TriggerRequest $request)
    {
        $eventName = $request->validated('name');

        // dd($request->validated());
        // dd($request->validated('distinct_id'));
        // This is nieve don't do this
        // find app user by distinct id has many relationship:
        $appUser = AppUser::whereHas('distinctIds', function ($query) use ($request) {
            $query->where('distinct_id', $request->validated('distinct_id'));
        })->first();
        $properties = collect($request->validated('properties'));

        // dd($appUser->properties);
        if ($appUser) {
            $userFirstSeen = $appUser->created_at->timestamp;
            $paywallVisitQuery = $appUser->events()->where('name', EventName::paywallVisit)->latest();
            $lastPaywallEvent = $paywallVisitQuery->first();
            $totalSeenPaywalls = $paywallVisitQuery->count();
            $totalSessions = $appUser->events()
                ->select(DB::raw('COUNT(DISTINCT jsonb_extract_path_text(properties, \'$session_id\')) AS unique_count'))
                ->value('unique_count');
        } else {
            $userFirstSeen = $request->validated('timestamp');
            $lastPaywallEvent = null;
            $totalSessions = 1; // only this current session
            $totalSeenPaywalls = 0;
        }

        // dd($lastPaywallEvent);

        if ($properties->get(PropertyName::networkWifi) === true) {
            $networkMode = 'wifi';
        } elseif ($properties->get(PropertyName::networkCellular) === true) {
            $networkMode = 'cellular';
        } else {
            $networkMode = 'unknown';
        }

        $this->data = [
            TriggerFireProperty::userFirstSeen => $userFirstSeen,
            TriggerFireProperty::userIsIdentified => $appUser->is_identified || $eventName == EventName::identify,

            TriggerFireProperty::userTotalSessions => $totalSessions,
            TriggerFireProperty::userSecondsSinceLastSeenPaywall => time() - ($lastPaywallEvent->created_at->timestamp ?? 0),
            TriggerFireProperty::userTotalSeenPaywalls => $totalSeenPaywalls,
            TriggerFireProperty::userLastPaywallId => $lastPaywallEvent->properties[PropertyName::paywallId] ?? null,
            TriggerFireProperty::sessionDurationSeconds => $properties->get(PropertyName::sessionDurationSeconds),

            TriggerFireProperty::totalSessionCountInclusive => $totalSessions,

            TriggerFireProperty::appVersion => $properties->get(PropertyName::appVersion),
            TriggerFireProperty::appBuildNumber => $properties->get(PropertyName::appBuildNumber),
            TriggerFireProperty::appNamespace => $properties->get(PropertyName::appNamespace),

            TriggerFireProperty::deviceScreenWidth => $properties->get(PropertyName::screenWidth),
            TriggerFireProperty::deviceScreenHeight => $properties->get(PropertyName::screenHeight),
            TriggerFireProperty::deviceOsVersion => $properties->get(PropertyName::osVersion),
            TriggerFireProperty::deviceManufacturer => $properties->get(PropertyName::manufacturer),
            TriggerFireProperty::deviceType => $properties->get(PropertyName::deviceType),
            TriggerFireProperty::deviceOs => $properties->get(PropertyName::os),
            TriggerFireProperty::networkMode => $networkMode,
            TriggerFireProperty::deviceName => $properties->get(PropertyName::deviceName),
        ];

        dd($this->data);
    }
}
