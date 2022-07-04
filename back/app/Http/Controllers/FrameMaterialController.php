<?php

namespace App\Http\Controllers;

use App\Models\FrameMaterial;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class FrameMaterialController extends Controller
{

    public function index(Request $req)
    {
        return FrameMaterial::when($req->query("q"), function (Builder $q, string $search) {
            return $q->where("name", "like", "%$search%");
        })
            ->when($req->has('deleted'), function (Builder $q) {
                return $q->withTrashed();
            })
            ->paginate(10);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:frame_materials,name',
        ]);
        $frameMaterial = FrameMaterial::create([
            "name" => strtolower(trim($request->name)),
        ]);
        $frameMaterial->save();
        return response()->json($frameMaterial);
    }

    public function edit(Request $request, int $id)
    {
        $frameMaterial = FrameMaterial::find($id);
        if (!$frameMaterial) {
            return response()->json(['message' => 'Frame material not found'], 404);
        }
        $request->validate([
            'name' => ['required', 'string', 'max:255',  'unique:frame_materials,name'],
        ]);
        $frameMaterial->update([
            "name" => strtolower(trim($request->name)),
        ]);
        $frameMaterial->save();
        return response()->json($frameMaterial);
    }

    public function destroy(Request $request, int $id)
    {
        $frameMaterial = FrameMaterial::find($id);
        if (!$frameMaterial) {
            return response()->json(['message' => 'Frame material not found'], 404);
        }
        $frameMaterial->delete();
        return response()->json($frameMaterial);
    }

    public function restore(Request $request, int $id)
    {
        $frameMaterial = FrameMaterial::onlyTrashed()->find($id);
        if (!$frameMaterial) {
            return response()->json(['message' => 'Frame material not found'], 404);
        }
        $frameMaterial->restore();
        return response()->json($frameMaterial);
    }

}
