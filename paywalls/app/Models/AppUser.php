<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AppUser extends Model
{
    use HasFactory;

    protected $fillable = [
        'properties',
    ];

    protected $casts = [
        'properties' => 'array',
    ];

    public function distinctIds(): HasMany
    {
        return $this->hasMany(AppUserDistinctId::class);
    }
}
