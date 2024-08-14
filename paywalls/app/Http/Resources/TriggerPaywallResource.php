<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TriggerPaywallResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->name,
            'paywall_url' => 'https://paywalls.io',
            'offers' => TriggerOfferResource::collection($this->offers),
        ];
    }
}

class TriggerOfferResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->name,
            'identifier' => $this->identifier,
        ];
    }
}
