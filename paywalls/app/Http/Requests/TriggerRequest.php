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
            'event' => 'required|string|max:255',
        ];
    }
}
