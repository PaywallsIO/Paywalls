<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TriggerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return authApp() != null;
    }

    public function rules(): array
    {
        return [
            'distinct_id' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'properties' => 'required|array',
            'timestamp' => 'required|integer',
            'uuid' => 'required|uuid',
        ];
    }
}
