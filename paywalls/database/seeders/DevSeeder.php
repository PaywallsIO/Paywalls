<?php

namespace Database\Seeders;

use App\Enums\EventName;
use App\Models\Offer;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class DevSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::create([
            'email' => 'david@paywalls.io',
            'name' => 'David',
            'password' => 'password',
            'is_admin' => true,
        ]);

        // portals get created automatically when a user is created via the Events/UserCreated.php

        $project = $user->portal->projects()->create([
            'name' => 'Progress Pic',
            'restore_behavior' => 'transferToNewPersonId',
            'portal_id' => 1,
        ]);

        $app = $project->apps()->make([
            'name' => 'Progress Pic',
            'platform' => 'apple',
            'bundle_id' => 'com.legacybits.ProgressPicRelease',
        ]);
        $app->portal()->associate($user->portal);
        $app->save();

        $paywall = $app->portal->paywalls()->create([
            'name' => 'Progress Pic',
        ]);

        $offers = Offer::factory(3)->create();
        $paywall->offers()->saveMany($offers);

        $this->createCampaigns($project);

        echo $app->createToken('Dev Token')->plainTextToken;
    }

    private function createCampaigns(Project $project): void
    {
        $campaign = $project->campaigns()->create([
            'name' => 'App Opened',
        ]);

        $campaign->triggers()->create([
            'event_name' => EventName::appOpened->value,
        ]);

        $campaign->paywalls()->save($project->portal->paywalls()->first(), [
            'percentage' => 100,
        ]);
        $campaign->audiences()->create();
    }
}
