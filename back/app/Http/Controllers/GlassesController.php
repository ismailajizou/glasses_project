<?php

namespace App\Http\Controllers;

use App\Http\Requests\GlassesRequest;
use App\Models\{Glasses, Collection, Brand, Provider, PurchaseLink};
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
            "providers",
        ])->findOrFail($id);
    }

    public function index(Request $req)
    {
        $res = Glasses::with([
            "brand",
            "collection",
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

    public function store(GlassesRequest $req)
    {
        $values = (object)$req->safe()->all();
        $random = $values->ref . Str::random(10);
        try {
            $feature = $random . "." . $values->feature_image->extension();
            $model3d = $random . "." . $values->model3d->getClientOriginalExtension();
            $glasses = new Glasses;
            $glasses->ref = $values->ref;
            $glasses->description = $values->description;
            $glasses->title = $values->title;
            $glasses->price = $values->price;
            $glasses->price_with_discount = $values->price_with_discount ?? null;
            $glasses->gender = $values->gender;
            $glasses->feature_image = $feature;
            $glasses->model3d = $model3d;
            $glasses->brand_id = $values->brand_id;
            $glasses->collection_id = $values->collection_id;
            $glasses->frame_type = $values->frame_type;
            $glasses->frame_color_id = $values->frame_color_id;
            $glasses->frame_shape_id = $values->frame_shape_id;
            $glasses->frame_material_id = $values->frame_material_id;
            $glasses->lens_type = $values->lens_type ?? "";
            $glasses->lens_color_id = $values->lens_color_id;
            DB::beginTransaction();
            $glasses->save();
            $glasses->providers()->attach($values->purchase_links);
            DB::commit();
            $req->file("feature_image")->storeAs("public/features", $feature);
            $req->file("model3d")->storeAs("public/models", $model3d);
        } catch (Exception $e) {
            DB::rollBack();
            return response($e->getMessage(), 500);
        }
        return response()->noContent();
    }
    public function edit(Request $req, int $id)
    {
        $glasses = Glasses::findOrFail($id);
        $req->validate([
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
            "providers" => Provider::all(),
        ];

        return response($res);
    }

    public function model(Request $req, string $ref)
    {
        $glasses = Glasses::where("ref", $ref)->firstOrFail();

        return response()->json($glasses->model3d);
    }
}
