<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Paywall extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'content',
    ];

    protected $casts = [
        'content' => 'json',
    ];

    protected $with = [
        'offers',
    ];

    public function portal(): BelongsTo
    {
        return $this->belongsTo(Portal::class);
    }

    public function offers(): BelongsToMany
    {
        return $this->belongsToMany(Offer::class, 'paywall_offer');
    }

    public function lastModifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'last_modified_by');
    }

    public function publishedPaywalls(): HasMany
    {
        return $this->hasMany(PublishedPaywall::class, 'paywall_id', 'id');
    }

    public function publishedPaywall(): HasOne
    {
        return $this->hasOne(PublishedPaywall::class, 'uuid', 'published_uuid');
    }
}
