<?php

namespace App\Listeners;

use App\Events\UserCreated;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Pluralizer;

class NewUserSetup
{
    public function __construct()
    {
    }

    public function handle(UserCreated $event): void
    {
        $user = $event->user;
        $team = $user->teams()->create([
            'name' => "{$event->user->name}'s Team",
        ]);
    }
}
