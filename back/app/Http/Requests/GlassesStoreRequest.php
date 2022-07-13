<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GlassesStoreRequest extends FormRequest
{
    
    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        $this->merge([
            'purchase_links' => json_decode($this->purchase_links, true),
            "price_with_discount" => $this->price_with_discount > 0 ? $this->price_with_discount : null,
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            "ref" => ["required", "unique:glasses,ref"],
            "title" => ["required"],
            "description" => ["required"],
            "price" => ["required", "numeric", "min:1"],
            "price_with_discount" => ["nullable", "numeric"],
            "gender" => ["required", Rule::in(["male", "female"])],
            "feature_image" => ["required", "file", "image", "mimes:png,jpg,jpeg"],
            "model3d" => ["required", "file", "mimetypes:application/json"],
            "brand_id" => ["required", "numeric", "exists:brands,id"],
            "collection_id" => ["required", "numeric", "exists:collections,id"],
            "frame_color_id" => ["required", "numeric", "exists:frame_colors,id"],
            "frame_type" => ["required", Rule::in(["rimless", "full rim", "half rim"])],
            "lens_type" => [Rule::in(["", "mirror"])],
            "frame_shape_id" => ["required", "numeric", "exists:frame_shapes,id"],
            "frame_material_id" => ["required", "numeric", "exists:frame_materials,id"],
            "lens_color_id" => ["required", "numeric", "exists:lens_colors,id"],
            "purchase_links" => 'required|array|min:1',
            "purchase_links.*.provider_id" => "numeric|exists:providers,id",
            "purchase_links.*.link" => "url",
        ];
    }
}
