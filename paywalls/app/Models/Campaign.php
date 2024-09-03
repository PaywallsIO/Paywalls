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

    protected $with = [
        'triggers',
        'audiences',
        'paywalls:id,name,preview_image_url',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function paywalls(): belongsToMany
    {
        return $this->belongsToMany(Paywall::class, CampaignPaywall::class)->withPivot('percentage');
    }

    public function publishedPaywalls(): belongsToMany
    {
        return $this->paywalls()->whereNotNull('published_uuid');
    }

    public function triggers(): HasMany
    {
        return $this->hasMany(CampaignTrigger::class)->orderBy('created_at', 'asc');
    }

    public function audiences(): HasMany
    {
        return $this->hasMany(CampaignAudience::class)->orderBy('sort_order', 'asc');
    }
}
