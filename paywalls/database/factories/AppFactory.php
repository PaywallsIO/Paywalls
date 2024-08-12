<?php

namespace Database\Factories;

use App\Models\Portal;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class AppFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'platform' => 'apple',
            'bundle_id' => 'io.paywalls.ios',
            'portal_id' => Portal::factory(),
            'project_id' => Project::factory(),
        ];
    }
}
