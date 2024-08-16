<?php

namespace App\Http\Controllers;

use App\Http\Requests\PublishPaywallRequest;
use App\Http\Requests\StorePaywallRequest;
use App\Http\Requests\UpdatePaywallRequest;
use App\Models\Paywall;
use App\Models\PublishedPaywall;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaywallController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->portal->paywalls()->paginate();
    }

    public function store(StorePaywallRequest $request): Paywall
    {
        return $request->user()->portal->paywalls()->create([
            'name' => $request->validated('name'),
        ]);
    }

    public function show(Paywall $paywall)
    {
        return $paywall;
    }

    public function showPublished(PublishedPaywall $paywall)
    {
        return view('paywall', [
            'published' => $paywall,
        ]);
    }

    public function update(UpdatePaywallRequest $request, Paywall $paywall)
    {
        DB::transaction(function () use ($request, $paywall) {
            $paywall->lastModifiedBy()->associate($request->user());
            $paywall->update($request->validated());
            $paywall->increment('version');
        });

        return $paywall;
    }

    public function publish(Paywall $paywall, PublishPaywallRequest $request)
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

    public function destroy(Paywall $paywall)
    {
        //
    }
}
