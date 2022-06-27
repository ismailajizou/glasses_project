<?php

namespace Database\Factories;

use App\Models\{Brand, Collection, FrameColor, FrameMaterial, FrameShape, LensColor};
use Illuminate\Database\Eloquent\Factories\Factory;

class GlassesFactory extends Factory
{
    
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $ref = $this->faker->unique()->randomNumber(7, true);
        return [
            "ref" => $ref,
            "description" => $this->faker->sentence(10),
            "price" => $this->faker->randomNumber(3),
            "gender" => $this->faker->randomElement(["male", "female"]),
            "feature_image" => $ref.".png",
            "model3d" => $ref.".glb",
            "brand_id" => $this->faker->randomElement(Brand::pluck("id")),
            "collection_id" => $this->faker->randomElement(Collection::pluck("id")),
            "frame_color_id" => $this->faker->randomElement(FrameColor::pluck("id")),
            "frame_type" => $this->faker->randomElement(["rimless", "full rim", "half rim"]),
            "lens_type" => $this->faker->randomElement(["", "mirror"]),
            "frame_shape_id" => $this->faker->randomElement(FrameShape::pluck("id")),
            "frame_material_id" =>$this->faker->randomElement(FrameMaterial::pluck("id")),
            "lens_color_id" => $this->faker->randomElement(LensColor::pluck("id")),
        ];
    }
}
