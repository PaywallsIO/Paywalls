<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AudienceUserMatch extends Model
{
    protected $table = 'audience_user_match';

    use HasFactory;

    public function campaignAudience(): BelongsTo
    {
        return $this->belongsTo(CampaignAudience::class);
    }

    public function appUser(): BelongsTo
    {
        return $this->belongsTo(AppUser::class);
    }
}
