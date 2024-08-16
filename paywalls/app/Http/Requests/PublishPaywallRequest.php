<?php

namespace App\Http\Requests;

use App\Models\Paywall;
use Illuminate\Foundation\Http\FormRequest;

class PublishPaywallRequest extends FormRequest
{
    public function __construct(Paywall $paywall) {}

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
            'version' => ['required', 'integer', 'min:1', 'version' => function ($attribute, $submittedVersion, $fail) {
                if ($submittedVersion != $this->paywall->version) {
                    $fail('Paywall was edited by someone else. Your edits would override those edits.');
                }
            }],
        ];
    }
}
