<?php

namespace App\Http\Controllers;

use App\Http\Requests\Campaign\CreateCampaignRequest;
use App\Models\Campaign;
use App\Models\Project;

class CampaignController extends Controller
{
    public function index(Project $project)
    {
        return $project->campaigns()->paginate();
    }

    public function store(Project $project, CreateCampaignRequest $request)
    {
        return $project->campaigns()->create($request->validated());
    }

    public function show(Project $project, Campaign $campaign)
    {
        return $campaign;
    }

    public function attachPaywall(Project $project, Campaign $campaign)
    {
        // $campaign->paywalls()->syncWithoutDetaching([$paywall->id]);
    }
}
