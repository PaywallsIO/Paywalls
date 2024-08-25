<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\CampaignAudience;
use App\Models\Portal;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AudiencesTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected Portal $portal;

    protected Project $project;

    protected Campaign $campaign;

    public function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();

        $this->project = Project::factory()->for($this->user->portal)->create();
        $this->campaign = Campaign::factory()->for($this->project)->create();
    }

    public function test_update_sort_order(): void
    {
        // reset db:
        $this->refreshTestDatabase();

        // Given
        $audience1 = CampaignAudience::factory()->for($this->campaign)->create(['sort_order' => 0]);
        $audience2 = CampaignAudience::factory()->for($this->campaign)->create(['sort_order' => 1]);
        $audience3 = CampaignAudience::factory()->for($this->campaign)->create(['sort_order' => 2]);

        $payload = [
            'audiences' => [
                ['id' => $audience1->id, 'sort_order' => 2],
                ['id' => $audience2->id, 'sort_order' => 0],
                ['id' => $audience3->id, 'sort_order' => 1],
            ],
        ];

        // When
        $response = $this->actingAs($this->user)->patchJson(route('audiences.updateSortOrder', [$this->project, $this->campaign]), $payload);

        // then
        $response->assertStatus(200);

        $this->assertDatabaseHas('campaign_audiences', [
            'id' => $audience1->id,
            'sort_order' => 2,
        ]);

        $this->assertDatabaseHas('campaign_audiences', [
            'id' => $audience2->id,
            'sort_order' => 0,
        ]);

        $this->assertDatabaseHas('campaign_audiences', [
            'id' => $audience3->id,
            'sort_order' => 1,
        ]);
    }

    public function test_update_sort_order_fail(): void
    {
        // Given
        $payload = [
            'audiences' => [
                ['id' => 0, 'sort_order' => 'should not be a string'],
            ],
        ];

        // When
        $response = $this->actingAs($this->user)
            ->patchJson(route('audiences.updateSortOrder', [$this->project, $this->campaign]), $payload);

        // Then
        $response->assertStatus(422);
        $response->assertJsonValidationErrors('audiences.0.id');
        $response->assertJsonValidationErrors('audiences.0.sort_order');
    }
}
