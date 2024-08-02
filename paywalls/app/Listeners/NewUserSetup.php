<?php

namespace App\Listeners;

use App\Events\UserCreated;

class NewUserSetup
{
    public function __construct() {}

    public function handle(UserCreated $event): void
    {
        $user = $event->user;
        $portal = $user->portals()->create([
            'name' => "{$event->user->name}'s Portal",
        ]);

        $user->current_portal_id = $portal->id;
        $user->save();
    }
}
