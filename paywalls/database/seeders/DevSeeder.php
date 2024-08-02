<?php

namespace Database\Seeders;

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
            'email' => 'davidmoreen@gmail.com',
            'name' => 'David',
            'password' => 'DevPassword',
        ]);

        $project = $user->portal->projects()->create([
            'name' => 'Progress Pic',
            'restore_behavior' => 'transferToNewPersonId',
            'portal_id' => 1,
        ]);

        $app = $project->apps()->make([
            'name' => 'Progress Pic',
            'platform' => 'appstore',
            'bundle_id' => 'com.legacybits.ProgressPicRelease',
        ]);
        $app->portal()->associate($user->portal);
        $app->save();
    }
}
