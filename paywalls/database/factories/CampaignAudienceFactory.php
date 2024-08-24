<?php

namespace Database\Factories;

use App\Models\Campaign;
use Illuminate\Database\Eloquent\Factories\Factory;

class CampaignAudienceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->name,
            'campaign_id' => Campaign::factory(),
            'sort_order' => $this->faker->numberBetween(0, 100),
            'filters' => [],
            'match_limit' => $this->faker->numberBetween(0, 100),
            'match_period' => $this->faker->numberBetween(0, 100),
        ];
    }
}
