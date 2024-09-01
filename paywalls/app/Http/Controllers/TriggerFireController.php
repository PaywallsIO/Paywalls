<?php

namespace App\Http\Controllers;

use App\Http\Requests\TriggerRequest;
use App\Http\Resources\TriggerPaywallResource;
use App\Models\AudienceUserMatch;
use App\Services\Models\TriggerFireData;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use JWadhams\JsonLogic;

class TriggerFireController extends Controller
{
    public function __invoke(TriggerRequest $request)
    {
        $correlationId = Str::uuid()->toString();
        $appUser = authPortal()->appUserDistinctIds()->where('distinct_id', $request->validated('distinct_id'))->first();
        $triggerData = new TriggerFireData($appUser, $request);

        Log::debug('trigger_fire_start', [
            'correlation_id' => $correlationId,
            'app_user' => $appUser,
            'trigger_data' => $triggerData->toArray(),
        ]);

        try {
            $campaignTrigger = authPortal()->campaignTriggers()->where('event_name', $request->validated('name'))->firstOrFail();
            Log::debug('trigger_fire_trigger', [
                'correlation_id' => $correlationId,
                'campaign_trigger' => $campaignTrigger,
            ]);

            $campaign = $campaignTrigger->campaign;
            $audience = $campaign->audiences->firstOrFail(function ($audience) use ($triggerData, $correlationId) {
                Log::debug('trigger_fire_audience_eval', [
                    'correlation_id' => $correlationId,
                    'audience_id' => $audience->id,
                    'filters' => $audience->filters,
                ]);

                return JsonLogic::apply($audience->filters, $triggerData->toArray());
            });
            Log::debug('trigger_fire_audience', [
                'correlation_id' => $correlationId,
                'audience' => $audience,
            ]);

            // check match limits
            if ($appUser && $audience->match_limit > 0 && $audience->match_period > 0) {
                $matchesCount = AudienceUserMatch::where([
                    'campaign_audience_id' => $audience->id,
                    'app_user_id' => $appUser->id,
                ])
                    ->whereBetween('created_at', [now()->subHours($audience->match_period), now()])
                    ->count();

                Log::debug('trigger_fire_matches', [
                    'correlation_id' => $correlationId,
                    'matches_count' => $matchesCount,
                ]);
                if ($matchesCount >= $audience->match_limit) {
                    throw new \Exception('Match limit reached');
                }

                AudienceUserMatch::forgeCreate([
                    'campaign_audience_id' => $audience->id,
                    'app_user_id' => $appUser->id,
                ]);
            } else {
                Log::debug('trigger_fire_match_limit_skipped', [
                    'correlation_id' => $correlationId,
                    'audience' => $audience,
                ]);
            }

            // TODO determine correct paywall to show. Showing the first one for now

            $paywall = $campaign->publishedPaywalls()->firstOrFail();
            Log::debug('trigger_fire_paywall', [
                'correlation_id' => $correlationId,
                'paywall_id' => $paywall->id,
            ]);

            return [
                'paywall' => new TriggerPaywallResource($paywall),
            ];
        } catch (\Exception $e) {
            Log::debug('trigger_fire_exception', [
                'correlation_id' => $correlationId,
                'error' => $e,
            ]);
            abort(404);
        }
    }
}
