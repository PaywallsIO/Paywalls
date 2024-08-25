<?php

namespace App\Http\Controllers;

use App\Http\Requests\Trigger\CreateTriggerRequest;
use App\Http\Requests\Trigger\EditTriggerRequest;
use App\Models\Campaign;
use App\Models\CampaignTrigger;
use App\Models\Project;

class TriggerController extends Controller
{
    public function store(Project $project, Campaign $campaign, CreateTriggerRequest $request)
    {
        $campaign->triggers()->create($request->validated());
    }

    public function update(Project $project, Campaign $campaign, CampaignTrigger $trigger, EditTriggerRequest $request)
    {
        $trigger->update($request->validated());
    }

    public function destroy(Project $project, Campaign $campaign, CampaignTrigger $trigger)
    {
        $trigger->delete();
    }

    public function restore(Project $project, Campaign $campaign, CampaignTrigger $trigger)
    {
        $trigger->restore();
    }
}
