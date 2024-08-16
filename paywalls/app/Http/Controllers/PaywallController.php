<?php

namespace App\Http\Controllers;

use App\Http\Requests\PublishPaywallRequest;
use App\Http\Requests\StorePaywallRequest;
use App\Http\Requests\UpdatePaywallRequest;
use App\Models\Paywall;
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

    public function showPublished(Paywall $paywall)
    {
        return view('paywall', [
            'paywall' => $paywall,
        ]);
    }

    public function update(UpdatePaywallRequest $request, Paywall $paywall)
    {
        $request->validate([
            'version' => function ($attribute, $submittedVersion, $fail) use ($paywall) {
                if ($submittedVersion != $paywall->version) {
                    $fail('Paywall was edited by someone else. Your edits would override those edits.');
                }
            },
        ]);

        DB::transaction(function () use ($request, $paywall) {
            $paywall->lastModifiedBy()->associate($request->user());
            $paywall->update($request->validated());
            $paywall->increment('version');
        });

        return $paywall;
    }

    public function publish(Paywall $paywall, PublishPaywallRequest $request)
    {
        $request->validate([
            'version' => function ($attribute, $submittedVersion, $fail) use ($paywall) {
                if ($submittedVersion != $paywall->version) {
                    $fail('Paywall was edited by someone else. Your edits would override those edits.');
                }
            },
        ]);

        DB::transaction(function () use ($request, $paywall) {
            $paywall->update($request->safe(['html', 'css', 'js']));
            $paywall->forceFill(['published_version' => $paywall->version])->save();
        });

        return response()->noContent(200);
    }

    public function destroy(Paywall $paywall)
    {
        //
    }
}
