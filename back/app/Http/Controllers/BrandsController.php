<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;


class BrandsController extends Controller
{
    public function __construct()
    {
        $this->middleware("json");
    }
    
    public function index(Request $req)
    {
        return Brand::when($req->query("q"), function (Builder $q, string $search) {
            return $q->where("name", "like", "%$search%");
        })
        ->when($req->has('deleted'), function (Builder $q) {
            return $q->withTrashed();
        })
        ->paginate(10);
    }

    public function edit(Request $request, int $id)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:brands,name',
        ]);
        $brand = Brand::find($id);
        if (!$brand) {
            return response()->json(['message' => 'Brand not found'], 404);
        }
        $brand->update([
            "name" => trim($request->name)
        ]);
        $brand->save();
        return response()->json($brand);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:brands,name',
        ]);
        $brand = Brand::create([
            "name" => trim($request->name)
        ]);
        $brand->save();
        return response()->json($brand);
    }

    public function destroy(Request $req, int $id){
        $brand = Brand::findOrFail($id);
        $brand->delete();
        return response()->noContent();
    }

    public function restore(Request $req, int $id){
        $brand = Brand::onlyTrashed()->findOrFail($id);
        $brand->restore();
        return response()->noContent();
    }
}
