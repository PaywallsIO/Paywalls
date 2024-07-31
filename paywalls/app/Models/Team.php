<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Team extends Model
{
    use HasFactory;

    protected $fillable = [
        'name'
    ];

    public function users(): HasManyThrough {
        return $this->hasManyThrough(User::class, TeamUser::class);
    }

    public function paywalls(): HasMany {
        return $this->hasMany(Paywall::class);
    }
}
