<?php

namespace App\Http\Controllers;

use App\Models\Glasses;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    // make a constructor that will be used to abort if the request doesn't want json


    public function index(Request $request)
    {
        $queryParams = $request->query();
        unset($queryParams['page']);
        $values = [];
        foreach ($queryParams as $key => $param) {
            if ($param)
            $values[$key] = explode(",", $param);
        }
        $glasses = Glasses::with([
            "brand",
            "collection",
            "lensColor",
            "frameColor",
            "frameMaterial",
            "frameShape",
            "providers",
        ])
            ->when($values["gender"]?? [], fn(Builder $q, array $gender) => $q->whereIn('gender', $gender))
            ->when($values['price'] ?? [], function ($q, $price) {
                return $q->whereBetween("price", $price);
            })
            ->when($values['brand_id'] ?? [], function (Builder $q, array $brand) {
                return $q->whereHas("brand", function (Builder $q) use ($brand) {
                    $q->whereIn("id", $brand);
                });
            })
            ->when($values['collection_id'] ?? [], function (Builder $q, array $collection) {
                return $q->whereHas("collection", function (Builder $q) use ($collection) {
                    $q->whereIn("id", $collection);
                });
            })
            ->when($values['lens_color_id'] ?? [], function (Builder $q, array $lensColor) {
                return $q->whereHas("lensColor", function (Builder $q) use ($lensColor) {
                    $q->whereIn("id", $lensColor);
                });
            })
            ->when($values['frame_color_id'] ?? [], function (Builder $q, array $frameColor) {
                return $q->whereHas("frameColor", function (Builder $q) use ($frameColor) {
                    $q->whereIn("id", $frameColor);
                });
            })
            ->when($values['frame_material_id'] ?? [], function (Builder $q, array $frameMaterial) {
                return $q->whereHas("frameMaterial", function (Builder $q) use ($frameMaterial) {
                    $q->whereIn("id", $frameMaterial);
                });
            })
            ->when($values['frame_shape_id'] ?? [], function (Builder $q, array $frameShape) {
                return $q->whereHas("frameShape", function (Builder $q) use ($frameShape) {
                    $q->whereIn("id", $frameShape);
                });
            })
            ->when($values['frame_type'] ?? [], function (Builder $q, array $frameType) {
                return $q->whereIn("frame_type", $frameType);
            })
            ->latest()
            ->paginate(5);
        return response()->json($glasses);
    }
}
