<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Provider extends Model
{
    use HasFactory, SoftDeletes;
    public $timestamps = false;
    protected $fillable = ["name"];

    public function glasses()
    {
        return $this->belongsToMany(Glasses::class, "purchase_links");
    }
}
