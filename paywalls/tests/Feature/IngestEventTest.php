<?php

namespace Tests\Feature;

use Tests\TestCase;

class IngestEventTest extends TestCase
{
    public function test_ingest_events(): void
    {
        // Given
        $eventData = <<<'EOF'
{
  "events": [
    {
      "distinct_id": "$annon:92369b7b-31a7-4483-a706-bf4110109b83",
      "properties": {
        "$app_version": "1.0",
        "test": "value",
        "$os_version": "17.4",
        "$identifier": "io.paywalls.PaywallsExample",
        "$lib": "swift",
        "$lib_version": "0.1.0",
        "$app_build_number": "1",
        "$manufacturer": "Apple",
        "$device_model": "arm64",
        "$screen_height": "852",
        "$screen_width": "393",
        "$os": "iOS"
      },
      "event_name": "Test Event",
      "timestamp": 1723178013,
      "uuid": "235254C8-A136-45D2-8E8B-41E9B4809B41"
    },
    {
      "uuid": "DC3271B4-C2DA-44D6-88E6-B8A6218D3D27",
      "timestamp": 1723178013,
      "properties": {
        "$manufacturer": "Apple",
        "$set": {},
        "$device_model": "arm64",
        "$app_version": "1.0",
        "$identifier": "io.paywalls.PaywallsExample",
        "$os": "iOS",
        "$unset": [],
        "$screen_height": "852",
        "$set_once": {},
        "$lib": "swift",
        "$os_version": "17.4",
        "$screen_width": "393",
        "$app_build_number": "1",
        "$lib_version": "0.1.0"
      },
      "old_distinct_id": "$annon:92369b7b-31a7-4483-a706-bf4110109b83",
      "distinct_id": "TestUser",
      "event_name": "$identify"
    }
  ]
}
EOF;

        // When
        // TODO this does not work. Gives 401
        $response = $this
            ->withHeaders([
                'Authorization' => 'Bearer 1|ci3D6KbbqPsEC22gAbziyiznwL6HK41aI7Hr6GGH70c1946e',
            ])
            ->postJson(
                '/api/events/ingest',
                []
            );

        // Then
        $response->assertStatus(200);
    }
}
