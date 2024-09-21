<?php

namespace App\Http\Requests\Campaign;

use App\Models\Campaign;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PaywallPercentagesRequest extends FormRequest
{
    public function __construct(Campaign $campaign) {}

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'paywalls' => 'required|array',
            'paywalls.*.id' => [
                'required',
                Rule::exists('campaign_paywall', 'paywall_id')->where('campaign_id', $this->campaign->id),
            ],
            'paywalls.*.percentage' => [
                'required',
                'integer',
                'min:0',
                'max:100',

            ],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $paywalls = $this->input('paywalls');
            $totalPercentage = collect($paywalls)->sum('percentage');

            if ($totalPercentage > 100) {
                $validator->errors()->add('paywalls', 'The total percentage should be 100 or less');
            }
        });
    }
}
