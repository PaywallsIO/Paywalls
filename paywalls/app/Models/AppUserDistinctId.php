<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AppUserDistinctId extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'distinct_id',
        'app_user_id',
    ];

    public function appUser(): BelongsTo
    {
        return $this->belongsTo(AppUser::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class, 'distinct_id');
    }
}
