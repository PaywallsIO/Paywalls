<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaywallRequest;
use App\Http\Requests\UpdatePaywallRequest;
use App\Models\Paywall;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaywallController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return $request->user()->portal->paywalls()->paginate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePaywallRequest $request): Paywall
    {
        return $request->user()->portal->paywalls()->create([
            'name' => $request->validated('name'),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Paywall $paywall)
    {
        return $paywall;
    }

    /**
     * Update the specified resource in storage.
     */
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Paywall $paywall)
    {
        //
    }
}
