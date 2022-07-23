<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Snapshot extends Model
{
    use HasFactory;


    protected $fillable = [
        'name',
        'glasses_id',
        'created_at',
    ];

    public function glasses()
    {
        return $this->belongsTo(Glasses::class);
    }
}
