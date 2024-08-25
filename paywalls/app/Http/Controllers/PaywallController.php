<?php

namespace App\Http\Controllers;

use App\Http\Requests\PublishPaywallRequest;
use App\Http\Requests\StorePaywallRequest;
use App\Http\Requests\UpdatePaywallRequest;
use App\Models\Paywall;
use App\Models\Project;
use App\Models\PublishedPaywall;
use Illuminate\Support\Facades\DB;

class PaywallController extends Controller
{
    public function index(Project $project)
    {
        return $project->paywalls()->paginate();
    }

    public function store(Project $project, StorePaywallRequest $request): Paywall
    {
        return $project->paywalls()->create($request->validated());
    }

    public function show(Project $project, Paywall $paywall)
    {
        return $paywall;
    }

    public function showPublished(PublishedPaywall $paywall)
    {
        return view('paywall', [
            'published' => $paywall,
        ]);
    }

    public function update(Project $project, Paywall $paywall, UpdatePaywallRequest $request)
    {
        DB::transaction(function () use ($request, $paywall) {
            $paywall->lastModifiedBy()->associate($request->user());
            $paywall->update($request->validated());
            $paywall->increment('version');
        });

        return $paywall;
    }

    public function publish(Project $project, Paywall $paywall, PublishPaywallRequest $request)
    {
        DB::transaction(function () use ($request, $paywall) {
            $published = $paywall->publishedPaywalls()->forceCreate([
                'html' => $request->validated('html'),
                'css' => $request->validated('css'),
                'js' => $request->validated('js'),
                'paywall_version' => $paywall->version,
                'published_by' => $request->user()->id,
            ]);
            $paywall->forceFill([
                'published_uuid' => $published->uuid,
            ])
                ->save();
        });

        return response()->noContent(200);
    }
}
