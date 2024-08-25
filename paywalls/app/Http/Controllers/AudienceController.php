<?php

namespace App\Http\Controllers;

use App\Http\Requests\CampaignAudienceRequest;
use App\Http\Requests\CreateAudienceRequest;
use App\Http\Requests\UpdateAudienceSortOrderRequest;
use App\Models\Campaign;
use App\Models\CampaignAudience;
use App\Models\Project;
use Illuminate\Support\Facades\DB;

class AudienceController extends Controller
{
    public function store(Project $project, Campaign $campaign, CreateAudienceRequest $request)
    {
        return $campaign->audiences()->forceCreate([
            ...$request->only(['name']),
            'sort_order' => $campaign->audiences()->count(), // sort_order is zero based
        ]);
    }

    public function update(CampaignAudienceRequest $request, Project $project, Campaign $campaign, CampaignAudience $audience)
    {
        $audience->update($request->validated());

        return $audience->fresh();
    }

    public function updateSortOrder(Project $project, Campaign $campaign, UpdateAudienceSortOrderRequest $request)
    {
        try {
            DB::beginTransaction();

            foreach ($request->validated(['audiences']) as $audience) {
                $campaign->audiences()
                    ->where('id', $audience['id'])
                    ->update(['sort_order' => $audience['sort_order']]);
            }

            DB::commit();

            return $campaign->fresh();
        } catch (\Exception $exception) {
            DB::rollBack();

            throw $exception;
        }
    }

    public function destroy(Project $project, Campaign $campaign, CampaignAudience $audience)
    {
        $audience->delete();
    }

    public function restore(Project $project, Campaign $campaign, CampaignAudience $audience)
    {
        $audience->restore();
    }
}
