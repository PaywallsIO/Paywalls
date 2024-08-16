<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PublishPaywallRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'html' => 'string|required',
            'css' => 'string|nullable',
            'js' => 'string|nullable',
            'version' => 'required|integer|min:1',
        ];
    }
}
