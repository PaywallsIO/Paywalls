<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CampaignAudienceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'string|max:255',
            'filters' => [function ($attribute, $value, $fail) {
                if (! is_array($value) && ! is_bool($value)) {
                    $fail('filters must be an array or a boolean');
                }
            }],
            'match_limit' => 'nullable|integer',
            'match_period' => 'nullable|integer',
        ];
    }
}
