<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Paywall extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'content'
    ];

    public function team(): BelongsTo {
        return $this->belongsTo(Team::class);
    }

    public function lastModifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'last_modified_by');
    }
}
