<?php

namespace App\Http\Requests\Trigger;

use Illuminate\Foundation\Http\FormRequest;

class EditTriggerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
