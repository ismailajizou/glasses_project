<?php

namespace App\Http\Controllers;

use Exception;
use App\Http\Requests\GlassesEditRequest;
use App\Http\Requests\GlassesStoreRequest;
use App\Models\{Glasses, Collection, Brand, Provider};
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class GlassesController extends Controller
{
    public function __construct()
    {
        $this->middleware("json");
    }

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

    public function select(Request $req, int $id){
        // increase the score of the glasses
        $glasses = Glasses::findOrFail($id);
        $glasses->score++;
        $glasses->save();
        // return the glasses
        return $glasses;
    }

    public function index(Request $req)
    {
        $res = Glasses::with([
            "brand",
            "collection",
            "lensColor",
            "frameColor",
            "frameMaterial",
            "frameShape",
            "providers",
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

    public function store(GlassesStoreRequest $req)
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
            $glasses->price_with_discount = $values->price_with_discount;
            $glasses->gender = $values->gender;
            $glasses->feature_image = $feature;
            $glasses->model3d = $model3d;
            $glasses->brand_id = $values->brand_id;
            $glasses->collection_id = $values->collection_id;
            $glasses->frame_type = $values->frame_type;
            $glasses->frame_color_id = $values->frame_color_id;
            $glasses->frame_shape_id = $values->frame_shape_id;
            $glasses->frame_material_id = $values->frame_material_id;
            $glasses->lens_type = $values->lens_type;
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
    public function edit(GlassesEditRequest $req, int $id)
    {
        $glasses = Glasses::find($id);
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
        DB::beginTransaction();
        try {
            $glasses->update(
                $req->safe()->except(["feature_image", "model3d", "purchase_links"])
            );
            $glasses->providers()->sync(((object)$req->safe()->only(["purchase_links"]))->purchase_links);
            $glasses->save();
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            return response($e->getMessage(), 500);
        }
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
