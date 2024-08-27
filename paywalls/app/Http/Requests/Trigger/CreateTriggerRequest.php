<?php

namespace App\Http\Requests\Trigger;

use App\Models\Project;
use Illuminate\Foundation\Http\FormRequest;

class CreateTriggerRequest extends FormRequest
{
    public function __construct(Project $project) {}

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'event_name' => ['required', 'string', 'max:255', function ($attribute, $submittedEventName, $fail) {
                if ($this->project->triggers()->where('event_name', $submittedEventName)->exists()) {
                    $fail('That trigger is already in use in another campaign.');
                }
            }],
        ];
    }
}
