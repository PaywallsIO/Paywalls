<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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

    public function users(): HasManyThrough
    {
        return $this->hasManyThrough(User::class, PortalUser::class);
    }

    public function appUsers(): HasMany
    {
        return $this->hasMany(AppUser::class);
    }

    public function appUserDistinctIds(): HasMany
    {
        return $this->hasMany(AppUserDistinctId::class);
    }

    public function paywalls(): HasMany
    {
        return $this->hasMany(Paywall::class);
    }
}
