<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class CollectionsController extends Controller
{

    public function index(Request $req)
    {
        return Collection::when($req->query("q"), function (Builder $q, string $search) {
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
            'name' => 'required|string|max:255|unique:collections,name',
        ]);
        $collection = Collection::find($id);
        if (!$collection) {
            return response()->json(['message' => 'Collection not found'], 404);
        }
        $collection->update([
            "name" => trim($request->name)
        ]);
        $collection->save();
        return response()->json($collection);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:collections,name',
        ]);
        $collection = Collection::create([
            "name" => trim($request->name)
        ]);
        $collection->save();
        return response()->json($collection);
    }

    public function destroy(Request $req, int $id){
        $collection = Collection::findOrFail($id);
        $collection->delete();
        return response()->noContent();
    }

    public function restore(Request $req, int $id){
        $collection = Collection::onlyTrashed()->findOrFail($id);
        $collection->restore();
        return response()->noContent();
    }
}
