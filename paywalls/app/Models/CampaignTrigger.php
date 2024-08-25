<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CampaignTrigger extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'event_name',
        'is_active',
    ];
}
