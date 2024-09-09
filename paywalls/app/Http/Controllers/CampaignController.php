<?php

namespace App\Http\Controllers;

use App\Http\Requests\Campaign\AttachCampaignPaywallRequest;
use App\Http\Requests\Campaign\CreateCampaignRequest;
use App\Http\Requests\Campaign\PaywallPercentagesRequest;
use App\Models\Campaign;
use App\Models\Paywall;
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

    public function attachPaywall(Project $project, Campaign $campaign, AttachCampaignPaywallRequest $request)
    {
        $paywall = Paywall::findOrFail($request->validated('paywall_id'));
        $campaign->paywalls()->attach($paywall, [
            'percentage' => 0,
        ]);
    }

    public function paywallPercentages(Project $project, Campaign $campaign, PaywallPercentagesRequest $request)
    {
        $paywalls = collect($request->validated('paywalls'))
            ->mapWithKeys(function ($paywall) {
                return [$paywall['id'] => ['percentage' => $paywall['percentage']]];
            })
            ->toArray();

        $campaign->paywalls()->sync($paywalls);
    }
}
