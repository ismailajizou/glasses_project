<?php

namespace App\Http\Controllers;

use App\Models\LensColor;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class LensColorController extends Controller
{
    public function index(Request $req)
    {
        return LensColor::when($req->query("q"), function (Builder $q, string $search) {
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
            'name' => 'required|string|max:255|unique:lens_colors,name',
            'code' => 'required|string|max:7|unique:lens_colors,code',
        ]);
        $lensColor = LensColor::create([
            "name" => strtolower(trim($request->name)),
            "code" => trim($request->code)
        ]);
        $lensColor->save();
        return response()->json($lensColor);
    }

    public function edit(Request $request, int $id)
    {
        $lensColor = LensColor::find($id);
        if (!$lensColor) {
            return response()->json(['message' => 'Lens color not found'], 404);
        }
        $request->validate([
            'name' => ['required', 'string', 'max:255',  Rule::unique("lens_colors", "name")->ignore($lensColor->name, "name")],
            'code' => ['required', 'string', 'max:7',  Rule::unique("lens_colors", "code")->ignore($lensColor->code, "code")],
        ]);
        $lensColor->update([
            "name" => strtolower(trim($request->name)),
            "code" => trim($request->code)
        ]);
        $lensColor->save();
        return response()->json($lensColor);
    }

    public function destroy(Request $request, int $id)
    {
        $lensColor = LensColor::find($id);
        if (!$lensColor) {
            return response()->json(['message' => 'Lens color not found'], 404);
        }
        $lensColor->delete();
        return response()->json($lensColor);
    }

    public function restore(Request $request, int $id)
    {
        $lensColor = LensColor::withTrashed()->find($id);
        if (!$lensColor) {
            return response()->json(['message' => 'Lens color not found'], 404);
        }
        $lensColor->restore();
        return response()->json($lensColor);
    }
}
