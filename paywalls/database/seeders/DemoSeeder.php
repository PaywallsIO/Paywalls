<?php

namespace Database\Seeders;

use App\Enums\EventName;
use App\Models\Offer;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::create([
            'email' => 'demo@paywalls.io',
            'name' => 'Demo Account',
            'password' => 'DemoPassword',
            'is_admin' => false,
        ]);

        // portals get created automatically when a user is created via the Events/UserCreated.php

        $project = $user->portal->projects()->create([
            'name' => 'Demo Project',
            'restore_behavior' => 'transferToNewPersonId',
            'portal_id' => 1,
        ]);

        $app = $project->apps()->make([
            'name' => 'Demo App',
            'platform' => 'apple',
            'bundle_id' => 'com.legacybits.ProgressPicRelease',
        ]);
        $app->portal()->associate($user->portal);
        $app->save();

        $paywall = $project->paywalls()->create([
            'name' => 'Demo Paywall',
        ]);

        $offers = Offer::factory(3)->create();
        $paywall->offers()->saveMany($offers);

        $this->createCampaigns($project);
    }

    private function createCampaigns(Project $project): void
    {
        $campaign = $project->campaigns()->create([
            'name' => 'App Opened',
        ]);

        $campaign->triggers()->create([
            'event_name' => EventName::appOpened,
        ]);

        $campaign->paywalls()->save($project->paywalls()->first(), [
            'percentage' => 100,
        ]);
        // $campaign->audiences()->create();
    }
}
