<?php

namespace Database\Factories;

use App\Models\Portal;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'restore_behavior' => 'transferToNewPersonId',
            'portal_id' => Portal::factory(),
        ];
    }
}
