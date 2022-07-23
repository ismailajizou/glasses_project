<?php

namespace App\Http\Controllers;

use App\Models\FrameColor;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class FrameColorController extends Controller
{
    public function __construct()
    {
        $this->middleware("json");
    }
    
    public function index(Request $req)
    {
        return FrameColor::when($req->query("q"), function (Builder $q, string $search) {
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
            'name' => 'required|string|max:255|unique:frame_colors,name',
            'code' => 'required|string|max:7|unique:frame_colors,code',
        ]);
        $frameColor = FrameColor::create([
            "name" => strtolower(trim($request->name)),
            "code" => trim($request->code)
        ]);
        $frameColor->save();
        return response()->json($frameColor);
    }

    public function edit(Request $request, int $id)
    {
        $frameColor = FrameColor::find($id);
        if (!$frameColor) {
            return response()->json(['message' => 'Frame color not found'], 404);
        }
        $request->validate([
            'name' => ['required', 'string', 'max:255',  Rule::unique("frame_colors", "name")->ignore($frameColor->name, "name")],
            'code' => ['required', 'string', 'max:7',  Rule::unique("frame_colors", "code")->ignore($frameColor->code, "code")],
        ]);
        $frameColor->update([
            "name" => strtolower(trim($request->name)),
            "code" => trim($request->code)
        ]);
        $frameColor->save();
        return response()->json($frameColor);
    }

    public function destroy(Request $request, int $id)
    {
        $frameColor = FrameColor::find($id);
        if (!$frameColor) {
            return response()->json(['message' => 'Frame color not found'], 404);
        }
        $frameColor->delete();
        return response()->json(['message' => 'Frame color deleted']);
    }

    public function restore(Request $request, int $id)
    {
        $frameColor = FrameColor::onlyTrashed()->find($id);
        if (!$frameColor) {
            return response()->json(['message' => 'Frame color not found'], 404);
        }
        $frameColor->restore();
        return response()->json(['message' => 'Frame color restored']);
    }

}
