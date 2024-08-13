<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function paywalls(): HasManyThrough
    {
        return $this->hasManyThrough(Paywall::class, CampaignPaywall::class);
    }

    public function triggers(): HasMany
    {
        return $this->hasMany(CampaignTrigger::class);
    }

    public function audiences(): HasMany
    {
        return $this->hasMany(CampaignAudience::class);
    }
}
