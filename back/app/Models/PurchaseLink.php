<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class PurchaseLink extends Pivot
{
    use HasFactory;
    protected $table = 'purchase_links';

    public $timestamps = false;
    protected $fillable = ["link", "glasses_id", "provider_id"];
}
