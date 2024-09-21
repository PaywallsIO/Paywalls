<?php

namespace App\Http\Requests\Campaign;

use App\Models\Project;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AttachCampaignPaywallRequest extends FormRequest
{
    public function __construct(Project $project) {}

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'paywall_id' => [
                'required',
                Rule::exists('paywalls', 'id')->where('project_id', $this->project->id),
            ],
        ];
    }
}
