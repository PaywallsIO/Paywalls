<?php

namespace App\Http\Controllers;

use App\Http\Requests\CampaignAudienceRequest;
use App\Http\Requests\CreateAudienceRequest;
use App\Models\Campaign;
use App\Models\CampaignAudience;
use App\Models\Project;

class AudienceController extends Controller
{
    public function index(Campaign $campaign)
    {
        //
    }

    public function store(Project $project, Campaign $campaign, CreateAudienceRequest $request)
    {
        return $campaign->audiences()->create($request->only(['name']));
    }

    public function update(CampaignAudienceRequest $request, Project $project, Campaign $campaign, CampaignAudience $audience)
    {
        $audience->update($request->validated());

        return $audience->fresh();
    }

    public function destroy(CampaignAudience $campaignAudience)
    {
        //
    }
}
