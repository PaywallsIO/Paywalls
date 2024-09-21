<?php

namespace App\Enums;

final class TriggerFireProperty
{
    public const userFirstSeen = 'user_first_seen';

    public const timeSinceFirstSeen = 'user_time_since_first_seen';

    public const userType = 'user_user_type';

    public const totalSessionsCount = 'session_total_session_count';

    public const userSecondsSinceLastSeenPaywall = 'user_time_since_last_seen_paywall';

    public const userTotalSeenPaywalls = 'user_total_seen_paywalls';

    public const userLastPaywallId = 'user_last_paywall_id';

    public const sessionDurationSeconds = 'session_duration_seconds';

    public const appVersion = 'app_version';

    public const appBuildNumber = 'app_build_number';

    public const appNamespace = 'app_namespace';

    public const deviceScreenWidth = 'device_screen_width';

    public const deviceScreenHeight = 'device_screen_height';

    public const deviceOsVersion = 'device_os_version';

    public const deviceManufacturer = 'device_manufacturer';

    public const deviceType = 'device_type';

    public const iosDeviceModel = 'ios_device_model';

    public const deviceOs = 'device_os';

    public const networkMode = 'device_network_mode';
}
