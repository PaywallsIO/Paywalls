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

    public function __construct(?AppUser $appUser, TriggerRequest $request)
    {
        $eventName = $request->validated('name');

        $properties = collect($request->validated('properties'));

        if ($appUser) {
            $userFirstSeen = $appUser->created_at->timestamp;
            $paywallVisitQuery = $appUser->events()->where('name', EventName::paywallVisit)->latest();
            $lastPaywallEvent = $paywallVisitQuery->first();
            $totalSeenPaywalls = $paywallVisitQuery->count();
            $userIsIdentified = $appUser->is_identified || $eventName == EventName::identify;
            $totalSessions = $appUser->events()
                ->select(DB::raw('COUNT(DISTINCT jsonb_extract_path_text(properties, \'$session_id\')) AS unique_count'))
                ->value('unique_count');
        } else {
            $userFirstSeen = $request->validated('timestamp');
            $lastPaywallEvent = null;
            $userIsIdentified = $eventName == EventName::identify;
            $totalSessions = 1; // only this current session
            $totalSeenPaywalls = 0;
        }

        if ($properties->get(PropertyName::networkWifi) === true) {
            $networkMode = 'Wifi';
        } elseif ($properties->get(PropertyName::networkCellular) === true) {
            $networkMode = 'Cellular';
        } else {
            $networkMode = 'Unknown';
        }

        // for backwards compatability only additive changes should be made
        $this->data = [
            TriggerFireProperty::timeSinceFirstSeen => time() - $userFirstSeen,
            TriggerFireProperty::userFirstSeen => $userFirstSeen,
            TriggerFireProperty::userType => $userIsIdentified ? 'Identified' : 'Anonymous',

            TriggerFireProperty::totalSessionsCount => $totalSessions,
            TriggerFireProperty::userSecondsSinceLastSeenPaywall => time() - ($lastPaywallEvent->created_at->timestamp ?? 0),
            TriggerFireProperty::userTotalSeenPaywalls => $totalSeenPaywalls,
            TriggerFireProperty::userLastPaywallId => $lastPaywallEvent->properties[PropertyName::paywallId] ?? null,
            TriggerFireProperty::sessionDurationSeconds => $properties->get(PropertyName::sessionDurationSeconds),

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
            TriggerFireProperty::iosDeviceModel => $properties->get(PropertyName::iosDeviceModel),
        ];
    }

    public function toArray(): array
    {
        return $this->data;
    }
}
