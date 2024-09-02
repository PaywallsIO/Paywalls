<?php

namespace Tests\Feature;

use App\Models\App as AppModel;
use App\Models\Campaign;
use App\Models\Paywall;
use App\Models\Portal;
use App\Models\Project;
use App\Models\PublishedPaywall;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TriggerFireTest extends TestCase
{
    use RefreshDatabase;

    protected AppModel $appModel;

    protected Portal $portal;

    protected Project $project;

    protected Campaign $campaign;

    public function setUp(): void
    {
        parent::setUp();

        $this->portal = Portal::factory()->create();
        $this->project = Project::factory()->for($this->portal)->create();
        $this->appModel = AppModel::factory()->for($this->portal)->create();
        $this->campaign = Campaign::factory()->for($this->project)->create();
    }

    public function test_paywall_presents(): void
    {
        // Given
        $eventData = <<<'EOF'
{
    "properties": {
        "$device_type": "Mobile",
        "$app_build_number": "1",
        "$manufacturer": "Apple",
        "$ip": "192.168.0.12",
        "$screen_height": "852",
        "$session_id": "628C6DB6-F5B6-47EF-8CB0-297794E9E3E0",
        "$network_cellular": false,
        "test": "value",
        "$os_version": "17.4",
        "$lib_version": "0.1.0",
        "$app_namespace": "io.paywalls.PaywallsExample",
        "$network_wifi": true,
        "$os": "iOS",
        "$screen_width": "393",
        "$device_model": "arm64",
        "$device_name": "iPhone",
        "$app_name": "PaywallsExample",
        "$session_duration_seconds": 15,
        "$lib": "swift",
        "$app_version": "1.0",
        "$locale": "en"
    },
    "name": "$app_opened",
    "distinct_id": "$annon:9833a605-ef6b-438a-93ac-a853609fcd44",
    "uuid": "CD6B5322-8282-4927-B497-1A90217D7FFE",
    "timestamp": 1724990755
}
EOF;
        $filtersJson = '{"and": [{"==": [{"var": "user_user_type"}, "Anonymous"]}]}';
        $this->campaign->triggers()->forceCreate([
            'event_name' => '$app_opened',
            'is_active' => true,
        ]);
        $this->campaign->audiences()->forceCreate([
            'name' => 'test',
            'sort_order' => 0,
            'match_limit' => null,
            'match_period' => null,
            'filters' => json_decode($filtersJson, true),
        ]);
        $paywall = $this->buildPaywall();
        $expectedPaywall = [
            'name' => $paywall->name,
            'url' => route('paywall.showPublished', $paywall->published_uuid),
            'offers' => $paywall->offers->map(fn ($o) => ['name' => $o->name, 'identifier' => $o->identifier])->toArray(),
        ];

        // When
        $response = $this->be($this->appModel, 'app')->postJson(route('trigger.fire'), json_decode($eventData, true));

        // Then
        $response->assertOk();
        $response->assertJson([
            'paywall' => $expectedPaywall,
        ]);
    }

    private function buildPaywall(): Paywall
    {
        $paywall = Paywall::factory()->for($this->project)->create();
        $this->campaign->paywalls()->attach($paywall, ['percentage' => 100]);
        $publishedPaywall = PublishedPaywall::factory()->for($paywall)->create();
        $paywall->forceFill(['published_uuid' => $publishedPaywall->uuid])->save();

        return $paywall;
    }
}
