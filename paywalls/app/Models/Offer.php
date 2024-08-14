<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Offer extends Model
{
    use HasFactory;

    public function paywalls(): BelongsToMany
    {
        return $this->belongsToMany(Paywall::class, 'paywall_offer');
    }
}
