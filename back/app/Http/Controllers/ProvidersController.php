<?php

namespace App\Http\Controllers;

use App\Models\Provider;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class ProvidersController extends Controller
{
    
    public function index(Request $req){
        return Provider::when($req->query("q"), function (Builder $q, string $search) {
            return $q->where("name", "like", "%$search%");
        })
        ->when($req->has('deleted'), function (Builder $q) {
            return $q->withTrashed();
        })
        ->paginate(10);
    }

    public function edit(Request $request, int $id){
        $request->validate([
            'name' => 'required|string|max:255|unique:providers,name',
        ]);
        $provider = Provider::findOrFail($id);
        $provider->update([
            "name" => strtolower(trim($request->name))
        ]);
        $provider->save();
        return response()->json($provider);
    }

    public function store(Request $request){
        $request->validate([
            'name' => 'required|string|max:255|unique:providers,name',
        ]);
        $provider = Provider::create([
            "name" => strtolower(trim($request->name))
        ]);
        $provider->save();
        return response()->json($provider);
    }

    public function destroy(Request $req, int $id){
        $provider = Provider::findOrFail($id);
        $provider->delete();
        return response()->noContent();
    }

    public function restore(Request $req, int $id){
        $provider = Provider::onlyTrashed()->findOrFail($id);
        $provider->restore();
        return response()->noContent();
    }
}
