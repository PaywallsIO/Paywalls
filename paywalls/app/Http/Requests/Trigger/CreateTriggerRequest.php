<?php

namespace App\Http\Requests\Trigger;

use Illuminate\Foundation\Http\FormRequest;

class CreateTriggerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'event_name' => 'string|max:255',
        ];
    }
}
