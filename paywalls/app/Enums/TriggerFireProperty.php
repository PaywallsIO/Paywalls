<?php

namespace App\Enums;

final class TriggerFireProperty
{
    public const userFirstSeen = 'user.first_seen';

    public const userIsIdentified = 'user.is_identified';

    public const userTotalSessions = 'user.total_sessions';

    public const userSecondsSinceLastSeenPaywall = 'user.time_since_last_seen_paywall';

    public const userTotalSeenPaywalls = 'user.total_seen_paywalls';

    public const userLastPaywallId = 'user.last_paywall_id';

    public const sessionDurationSeconds = 'session.duration_seconds';

    public const totalSessionCountInclusive = 'session.total_session_count';

    public const appVersion = 'app.version';

    public const appBuildNumber = 'app.build_number';

    public const appNamespace = 'app.namespace';

    public const deviceScreenWidth = 'device.screen_width';

    public const deviceScreenHeight = 'device.screen_height';

    public const deviceOsVersion = 'device.os_version';

    public const deviceManufacturer = 'device.manufacturer';

    public const deviceType = 'device.type';

    public const deviceName = 'device.name';

    public const deviceOs = 'device.os';

    public const networkMode = 'device.network_mode';
}
