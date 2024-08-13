<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function paywalls(): BelongsToMany
    {
        return $this->belongsToMany(Paywall::class);
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
