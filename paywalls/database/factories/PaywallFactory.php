<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaywallFactory extends Factory
{
    public function definition(): array
    {
        // create a published paywall with this is set as the paywall_id in the published_paywalls table
        return [
            'name' => $this->faker->name(),
            'content' => [],
            'project_id' => Project::factory(),
            'version' => 1,
        ];
    }
}
