<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Glasses extends Model
{
    use HasFactory;
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'glasses';

        /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        "ref", "description", "title", "price", "price_with_discount",
        "gender",	"feature_image",	
        "model3d",	"brand_id",	"collection_id",	
        "frame_type",	"frame_color_id",	"frame_shape_id",	
        "frame_material_id",	"lens_type",	"lens_color_id",
        "score"
    ];

    // defining relationships
    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }
    public function collection()
    {
        return $this->belongsTo(Collection::class);
    }
    public function frameColor()
    {
        return $this->belongsTo(FrameColor::class);
    }
    public function frameShape()
    {
        return $this->belongsTo(FrameShape::class);
    }
    public function frameMaterial()
    {
        return $this->belongsTo(FrameMaterial::class);
    }
    public function lensColor()
    {
        return $this->belongsTo(LensColor::class);
    }

    public function providers()
    {
        return $this->belongsToMany(Provider::class, "purchase_links")  
        ->withPivot(["link"])
        ->using(PurchaseLink::class)
        ->as("purchase_link");
    }
}
