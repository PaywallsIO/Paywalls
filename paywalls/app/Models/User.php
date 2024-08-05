<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Events\UserCreated;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements FilamentUser
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_recovery_codes',
        'two_factor_secret',
    ];

    protected $with = [
        'portal',
    ];

    protected $appends = [
        'avatar_url',
    ];

    protected $dispatchesEvents = [
        'created' => UserCreated::class,
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function portals(): BelongsToMany
    {
        return $this->belongsToMany(Portal::class, PortalUser::class);
    }

    public function paywalls(): HasMany
    {
        return $this->hasMany(Paywall::class);
    }

    public function portal(): BelongsTo
    {
        return $this->belongsTo(Portal::class, 'current_portal_id');
    }

    public function getAvatarUrlAttribute(): ?string
    {
        return 'https://www.gravatar.com/avatar/'.md5(strtolower(trim($this->email)));
    }

    // Filament methods
    public function canAccessPanel(Panel $panel): bool
    {
        return $this->is_admin;
    }
}
