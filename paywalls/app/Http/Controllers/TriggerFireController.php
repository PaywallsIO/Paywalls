<?php

namespace App\Http\Controllers;

use App\Http\Requests\TriggerRequest;
use App\Http\Resources\TriggerPaywallResource;
use App\Models\AudienceUserMatch;
use App\Services\Models\TriggerFireData;
use Composer\Semver\Comparator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use JWadhams\JsonLogic;

class TriggerFireController extends Controller
{
    public function __construct()
    {
        JsonLogic::add_operation('semver_gt', function ($a, $b) {
            return Comparator::greaterThan($a, $b);
        });

        JsonLogic::add_operation('semver_gte', function ($a, $b) {
            return Comparator::greaterThanOrEqualTo($a, $b);
        });

        JsonLogic::add_operation('semver_lt', function ($a, $b) {
            return Comparator::lessThan($a, $b);
        });

        JsonLogic::add_operation('semver_lte', function ($a, $b) {
            return Comparator::lessThanOrEqualTo($a, $b);
        });

        JsonLogic::add_operation('semver_eq', function ($a, $b) {
            return Comparator::equalTo($a, $b);
        });

        JsonLogic::add_operation('semver_neq', function ($a, $b) {
            return Comparator::notEqualTo($a, $b);
        });
    }

    public function __invoke(TriggerRequest $request)
    {
        $correlationId = Str::uuid()->toString();

        try {
            $appUser = authPortal()->appUserDistinctIds()->where('distinct_id', $request->validated('distinct_id'))->first()?->appUser;
            $triggerData = new TriggerFireData($appUser, $request);

            Log::debug('trigger_fire_start', [
                'correlation_id' => $correlationId,
                'app_user' => $appUser,
                'trigger_data' => $triggerData->toArray(),
            ]);

            $campaignTrigger = authPortal()->campaignTriggers()->where('event_name', $request->validated('name'))->firstOrFail();
            Log::debug('trigger_fire_trigger', [
                'correlation_id' => $correlationId,
                'campaign_trigger' => $campaignTrigger,
            ]);

            $campaign = $campaignTrigger->campaign;
            $audience = $campaign->audiences->firstOrFail(function ($audience) use ($triggerData, $correlationId, $appUser) {
                Log::debug('trigger_fire_audience_eval', [
                    'correlation_id' => $correlationId,
                    'audience_id' => $audience->id,
                    'filters' => $audience->filters,
                ]);

                if (! JsonLogic::apply($audience->filters, $triggerData->toArray())) {
                    return false;
                }

                // @davidmoreen a possible improvement could be to fetch counts for all audience user matches
                // in one query initially then we can check the array vs running a query
                if ($audience->match_limit && $audience->match_period) {
                    $matchesCount = AudienceUserMatch::where([
                        'campaign_audience_id' => $audience->id,
                        'app_user_id' => $appUser->id,
                    ])
                        ->whereBetween('created_at', [now()->subSeconds($audience->match_period), now()])
                        ->count();

                    Log::debug('trigger_fire_matches', [
                        'correlation_id' => $correlationId,
                        'matches_count' => $matchesCount,
                    ]);
                    if ($matchesCount >= $audience->match_limit) {
                        throw new \Exception('Match limit reached');
                    }
                } else {
                    Log::debug('trigger_fire_matches_skip', [
                        'correlation_id' => $correlationId,
                        'match_limit' => $audience->match_limit,
                        'match_period' => $audience->match_period,
                    ]);
                }

                // @davidmoreen, keeping this here for now, in reality there should always be an app user,
                // even if they are anonymous
                if ($appUser) {
                    AudienceUserMatch::forceCreate([
                        'campaign_audience_id' => $audience->id,
                        'app_user_id' => $appUser->id,
                    ]);
                }

                return true;
            });
            Log::debug('trigger_fire_audience', [
                'correlation_id' => $correlationId,
                'audience' => $audience,
            ]);

            $seed = mt_rand(0, 100);
            $cumulative = 0;
            $selectedPaywall = null;

            foreach ($campaign->publishedPaywalls as $paywall) {
                $cumulative += $paywall->pivot->percentage;
                if ($seed <= $cumulative) {
                    $selectedPaywall = $paywall;
                    break;
                }
            }

            if (! $selectedPaywall) {
                throw new \Exception('TriggerFire Holdout');
            }

            Log::debug('trigger_fire_paywall', [
                'correlation_id' => $correlationId,
                'paywall_id' => $selectedPaywall?->id,
            ]);

            return [
                'paywall' => new TriggerPaywallResource($selectedPaywall),
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
