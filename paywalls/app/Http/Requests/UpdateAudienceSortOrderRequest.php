<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAudienceSortOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'audiences' => 'required|array',
            'audiences.*.id' => 'required|exists:campaign_audiences,id',
            'audiences.*.sort_order' => 'required|integer',
        ];
    }
}
