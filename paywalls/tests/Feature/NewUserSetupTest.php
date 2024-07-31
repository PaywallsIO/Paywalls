<?php

namespace Tests\Feature;

use App\Events\UserCreated;
use App\Listeners\NewUserSetup;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;


class NewUserSetupTest extends TestCase
{
    use RefreshDatabase;

    public function test_UserCreated_events(): void
    {
        // Given
        Event::fake([
            UserCreated::class,
        ]);

        // When
        $user = User::factory()->create();


        // Then
        Event::assertDispatched(UserCreated::class);
        Event::assertListening(UserCreated::class, NewUserSetup::class);
    }

    public function test_newUserSetup_handled()
    {
        // Given
        $user = User::factory()->create();
        $listener = new NewUserSetup($user);
        $event = new UserCreated($user);

        // When
        $listener->handle($event);

        // Then
        $this->assertNotEmpty($user->teams);
    }
}
