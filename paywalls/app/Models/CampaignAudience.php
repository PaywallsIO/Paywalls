<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CampaignAudience extends Model
{
    use HasFactory;

    protected $fillable = [
        'filters',
        'sort_order',
        'match_limit',
    ];

    protected $casts = [
        'filters' => 'array',
    ];

    protected $appends = [
        'name',
    ];

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function getNameAttribute(): string
    {
        return json_encode($this->filters, JSON_UNESCAPED_UNICODE);
    }
}
