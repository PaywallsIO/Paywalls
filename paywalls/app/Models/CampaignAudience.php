<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class CampaignAudience extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'filters',
        'sort_order',
        'match_limit',
        'match_period',
    ];

    protected $casts = [
        'filters' => 'array',
    ];

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }
}
