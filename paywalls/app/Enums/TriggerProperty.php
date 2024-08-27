<?php

namespace App\Enums;

enum TriggerProperty: string
{
    case userFirstSeen = 'user.first_seen';
    case userIsIdentified = 'user.is_identified';
    case userTotalSessions = 'user.total_sessions';
    case userSecondsSinceLastSeenPaywall = 'user.time_since_last_seen_paywall';
    case userTotalSeenPaywalls = 'user.total_seen_paywalls';
    case userLastPaywallId = 'user.last_paywall_id';
    case userTimesinceSessionStart = 'user.timesince_session_start';

    case sessionDurationSeconds = 'session.duration_seconds';

    case appVersion = 'app.version';
    case appBuildNumber = 'app.build_number';
    case appBundleId = 'app.bundle_id';
    case appBuildNumber = 'app.build_number';

    case deviceScreenWidth = 'device.screen_width';
    case deviceScreenHeight = 'device.screen_height';
    case deviceOsVersion = 'device.os_version';
    case deviceManufacturer = 'device.manufacturer';
    case deviceModel = 'device.model';
    case deviceOs = 'device.os';
}
