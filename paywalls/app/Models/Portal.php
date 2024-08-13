<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Portal extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    protected $with = [
        'projects',
    ];

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    public function appUsers(): HasMany
    {
        return $this->hasMany(AppUser::class);
    }

    public function appUserDistinctIds(): HasMany
    {
        return $this->hasMany(AppUserDistinctId::class);
    }

    public function events(): HasManyThrough
    {
        return $this->hasManyThrough(Event::class, App::class);
    }

    public function paywalls(): HasMany
    {
        return $this->hasMany(Paywall::class);
    }

    public function fetchAppUser(string $distinctId): ?AppUser
    {
        return $this->appUserDistinctIds()->where('distinct_id', $distinctId)->first()?->appUser;
    }
}
