<?php

namespace Database\Factories;

use App\Models\Paywall;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PublishedPaywallFactory extends Factory
{
    public function definition(): array
    {
        return [
            'uuid' => $this->faker->uuid(),
            'paywall_id' => Paywall::factory(),
            'html' => null,
            'css' => null,
            'js' => null,
            'paywall_version' => 1,
            'published_by' => User::factory(),
        ];
    }
}
