<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class IngestEventsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return authApp() != null;
    }

    public function rules(): array
    {
        return [
            'events' => 'array',
            'events.*.distinct_id' => 'required|string|max:255',
            'events.*.old_distinct_id' => 'nullable|string|max:255',
            'events.*.name' => 'required|string|max:255',
            'events.*.properties' => 'required|array',
            'events.*.timestamp' => 'required|integer',
            'events.*.uuid' => 'required|uuid',
        ];
    }
}
