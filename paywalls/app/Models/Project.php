<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

enum RestoreBehavior
{
    case transferToNewPersonId;
    case transferIfCurrentPersonHasNoActiveSubscriptions;
    case keepWithOriginalPerson;
}

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'restore_behavior',
    ];

    protected $appends = [
        'avatar_url',
    ];

    public function portal(): BelongsTo
    {
        return $this->belongsTo(Portal::class);
    }

    public function apps(): HasMany
    {
        return $this->hasMany(App::class);
    }

    public function paywalls(): HasMany
    {
        return $this->hasMany(Paywall::class);
    }

    public function campaigns(): HasMany
    {
        return $this->hasMany(Campaign::class);
    }

    public function getAvatarUrlAttribute(): ?string
    {
        $bundle_id = optional($this->apps()->whereNotNull('bundle_id')->first())->bundle_id;
        if ($bundle_id) {
            return 'https://www.appatar.io/'.$bundle_id;
        }

        return null;
    }
}
