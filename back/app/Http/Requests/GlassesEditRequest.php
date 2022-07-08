<?php

namespace App\Http\Requests;

use App\Models\Glasses;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GlassesEditRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    // public function authorize()
    // {
    //     return false;
    // }

    protected function prepareForValidation()
    {
        $this->merge([
            'purchase_links' => json_decode($this->purchase_links, true),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $glasses = Glasses::findOrFail($this->id);
        return [
            "ref" => ["required", Rule::unique("glasses", "ref")->ignore($glasses->ref, "ref")],
            "title" => ["required"],
            "description" => ["required"],
            "price" => ["required", "numeric", "min:1"],
            "price_with_discount" => ["nullable", "numeric"],
            "gender" => ["required"],
            "feature_image" => ["file", "image", "mimes:png,jpg,jpeg"],
            "model3d" => ["file", "mimetypes:application/json"],
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
