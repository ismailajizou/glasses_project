<?php

namespace App\Http\Controllers;

use App\Models\Snapshot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;
use Intervention\Image\Facades\Image;
use Nette\Utils\Random;


class SnapshotsController extends Controller
{
    public function __construct()
    {
        $this->middleware("json")->except('image');
    }

    public function index()
    {
        $snapshots = Snapshot::with('glasses')->all();
        return view('snapshots.index', compact('snapshots'));
    }

    public function show(Snapshot $snapshot)
    {
        $snapshot = Snapshot::with('glasses')->find($snapshot->id);
        return response()->json($snapshot);
    }

    public function stats()
    {
        $snapshots = Snapshot::with('glasses')->get();
        $glasses_aggregated = $snapshots->groupBy('glasses_id');
        $glasses_count = $glasses_aggregated->count();
        $glasses_most_used = $glasses_aggregated->sort()->reverse()->take(5);
        // unuesd glasses
        $glasses_unused = $snapshots->whereNotIn('glasses_id', $glasses_aggregated->keys());
        return response()->json([
            // count of snapshots
            'count' => $snapshots->count(),
            'glasses_count' => $glasses_count,
            'top_glasses' => $glasses_most_used,
            'unused_glasses' => $glasses_unused,
        ]);
    }

    public function destroy(Request $request, int $id)
    {
        $snapshot = Snapshot::findOrFail($id);
        $path = storage_path('app/public/screenshots/' . $snapshot->name);
        if (!File::exists($path)) {
            abort(404);
        }
        // delete from database
        $snapshot->delete();
        // delete from filesystem
        File::delete($path);
        return response()->json(['success' => 'Screenshot deleted successfully.']);
    }

    public function destroyAll()
    {
        $snapshots = Snapshot::all();
        foreach ($snapshots as $snapshot) {
            $path = storage_path('app/public/screenshots/' . $snapshot->name);
            if (!File::exists($path)) {
                abort(404);
            }
            // delete from database
            $snapshot->delete();
            // delete from filesystem
            File::delete($path);
        }
        return response()->json(['success' => 'All screenshots deleted successfully.']);
    }

    public function store(Request $request)
    {
        $request->validate([
            'screenshot' => 'required|string',
            'glasses_id' => 'required|integer',
        ]);

        $screenshot = request()->input('screenshot');
        try {
            $screenshot = Image::make($screenshot)->encode('png');
            $logo = Image::make(storage_path('app/public/logo.png'))->resize(200, null, fn ($constraint) => $constraint->aspectRatio());
            $screenshot->insert($logo, 'top-left', 10, 10);
            $filename = Random::generate(15) . '.png';
            $path = storage_path('app/public/screenshots/' . $filename);
            if (!File::exists(storage_path('app/public/screenshots'))) {
                File::makeDirectory(storage_path('app/public/screenshots'), 0777, true, true);
            }
            $screenshot->save($path, 100, "png");
            // store in database
            $snapshot = new Snapshot;
            $snapshot->name = $filename;
            $snapshot->glasses_id = request()->input('glasses_id');
            $snapshot->save();
        } catch (\Exception $e) {
            $path = storage_path('app/public/screenshots/' . $filename);
            if (File::exists($path)) {
                File::delete($path);
            }
            return response()->json(['error' => 'Error uploading screenshot.']);
        }
        return response()->json([
            'success' => 'Screenshot uploaded successfully.',
            'snapshot' => $snapshot,
        ]);
    }

    public function image(Request $req, string $filename)
    {
        $path = storage_path('app/public/screenshots/' . $filename);
        if (!File::exists($path)) {
            abort(404);
        }
        $file = File::get($path);
        $type = File::mimeType($path);
        $response = Response::make($file, 200);
        $response->header("Content-Type", $type);
        return $response;
    }
}
