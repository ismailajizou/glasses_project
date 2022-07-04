<?php

namespace App\Http\Controllers;

use App\Models\{Glasses, Collection, Brand};
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class GlassesController extends Controller
{

    public function show(Request $req, int $id)
    {
        return Glasses::with([
            "brand",
            "collection",
            "lensColor",
            "frameColor",
            "frameMaterial",
            "frameShape",
        ])->findOrFail($id);
    }

    public function index(Request $req)
    {
        $res = Glasses::with([
            "brand",
            "collection",
            // "lensColor",
            // "frameColor",
            // "frameMaterial",
            // "frameShape",
        ])
            ->when($req->query("ref"), function ($q, $ref) {
                return $q->where("ref", $ref);
            })
            ->when($req->query("price"), function ($q, $price) {
                list($min, $max) = explode("-", $price);
                return $q->whereBetween("price", [$min, $max]);
            })
            ->when($req->query("brand"), function (Builder $q, string $brand) {
                return $q->whereHas("brand", function (Builder $q) use ($brand) {
                    $q->where("name", $brand);
                });
            })
            ->when($req->query("collection"), function (Builder $q, string $collection) {
                return $q->whereHas("collection", function (Builder $q) use ($collection) {
                    $q->where("name", $collection);
                });
            });
        // send response
        return response()->json($res->latest()->paginate(10));
    }

    public function store(Request $req)
    {
        $req->validate([
            "ref" => ["required", "unique:glasses,ref"],
            "description" => ["required"],
            "price" => ["required", "numeric", "min:1"],
            "gender" => ["required"],
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
        ]);
        // generate unique random id
        $random = $req->input("ref") . Str::random(10);
        $feature = $random . "." . $req->file("feature_image")->extension();
        $model3d = $random . "." . $req->file("model3d")->getClientOriginalExtension();
        try {
            $req->file("feature_image")->storeAs("public/features", $feature);
            $req->file("model3d")->storeAs("public/models", $model3d);
            $glasses = Glasses::create([
                "ref" => $req->ref,
                "description" => $req->description,
                "price" => $req->price,
                "gender" => $req->gender,
                "feature_image" => $feature,
                "model3d" => $model3d,
                "brand_id" => $req->brand_id,
                "collection_id" => $req->collection_id,
                "lens_type" => $req->lens_type ?? "",
                "lens_color_id" => $req->lens_color_id,
                "frame_color_id" => $req->frame_color_id,
                "frame_type" => $req->frame_type,
                "frame_shape_id" => $req->frame_shape_id,
                "frame_material_id" => $req->frame_material_id,
            ]);
            $glasses->save();
        } catch (Exception $e) {
            return response($e->getMessage(), 500);
        }
        return response()->noContent();
    }
    public function edit(Request $req, int $id)
    {
        $glasses = Glasses::findOrFail($id);
        $req->validate([
            // validate ref if it is changed
            "ref" => ["required", Rule::unique("glasses", "ref")->ignore($glasses->ref, "ref")],
            "description" => ["required"],
            "price" => ["required", "numeric", "min:1"],
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
        ]);
        // handle feature image change
        if ($req->hasFile("feature_image")) {
            // delete old image
            Storage::delete("public/features/" . $glasses->feature_image);
            $feature = explode(".", $glasses->feature_image)[0] . "." . $req->file("feature_image")->extension();
            $glasses->feature_image = $feature;
            $glasses->save();
            $req->file("feature_image")->storeAs("public/features", $feature);
        }
        // handle model3d change
        if ($req->hasFile("model3d")) {
            // delete old image 
            Storage::delete("public/models/" . $glasses->model3d);
            $model3d = explode(".", $glasses->feature_image)[0] . "." . $req->file("model3d")->getClientOriginalExtension();
            // update field
            $glasses->model3d = $model3d;
            $req->file("model3d")->storeAs("public/models", $model3d);
        }
        // update all fields
        $glasses->update([
            "ref" => $req->ref,
            "description" => $req->description,
            "price" => $req->price,
            "gender" => $req->gender,
            "brand_id" => $req->brand_id,
            "collection_id" => $req->collection_id,
            "lens_type" => $req->lens_type ?? "",
            "lens_color_id" => $req->lens_color_id,
            "frame_color_id" => $req->frame_color_id,
            "frame_type" => $req->frame_type,
            "frame_shape_id" => $req->frame_shape_id,
            "frame_material_id" => $req->frame_material_id,
        ]);
        // save changes
        $glasses->save();
        return response()->noContent();
    }

    public function destroy(Request $req, int $id)
    {
        $glasses = Glasses::findOrFail($id);
        // delete images
        Storage::delete("public/features/" . $glasses->feature_image);
        Storage::delete("public/models/" . $glasses->model3d);
        // delete glasses
        $glasses->delete();
        return response()->noContent();
    }

    public function formInfo(Request $req)
    {
        $res = [
            "brands" => Brand::all(),
            "collections" => Collection::all(),
            "lens" => LensController::getAllInfo(),
            "frames" => FrameController::getAllInfo(),
        ];

        return response($res);
    }

    public function model(Request $req, string $ref)
    {
        $glasses = Glasses::where("ref", $ref)->firstOrFail();

        return response()->json($glasses->model3d);
    }
}
