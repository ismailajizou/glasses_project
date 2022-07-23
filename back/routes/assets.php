<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Route;

Route::get('features/{filename}', function ($filename) {
    $path = storage_path('app/public/features/' . $filename);
    if (!File::exists($path)) {
        abort(404);
    }

    $file = File::get($path);
    $type = File::mimeType($path);

    $response = Response::make($file, 200);
    $response->header("Content-Type", $type);

    return $response;
});
Route::get('models/{filename}', function ($filename) {
    $path = storage_path('app/public/models/' . $filename);

    if (!File::exists($path)) {
        abort(404);
    }

    $file = File::get($path);
    $type = File::mimeType($path);

    $response = Response::make($file, 200);
    $response->header("Content-Type", $type);

    return $response;
});

// get logo
Route::get('logo.png', function () {
    $path = storage_path('app/public/logo.png');

    if (!File::exists($path)) {
        abort(404);
    }

    $file = File::get($path);
    $type = File::mimeType($path);

    $response = Response::make($file, 200);
    $response->header("Content-Type", $type);

    return $response;
});

// upload logo
Route::post('upload/logo', function (Request $req) {
    // validate request logo
    $req->validate([
        'logo' => 'required|image|mimes:jpeg,png,jpg|max:2048',
    ]);
    $logo = request()->file('logo');
    $logo->storeAs('public', "logo.png");
    return response()->json(['success' => 'Logo uploaded successfully.']);
});

// get favicon
Route::get('favicon.png', function () {
    $path = storage_path('app/public/favicon.png');

    if (!File::exists($path)) {
        abort(404);
    }
    $file = File::get($path);
    $type = File::mimeType($path);
    $response = Response::make($file, 200);
    $response->header("Content-Type", $type);
    return $response;
});

Route::post('upload/favicon', function (Request $req) {
    $req->validate([
        'favicon' => 'required|image|mimes:jpeg,png,jpg,|max:2048',
    ]);
    $favicon = request()->file('favicon');
    $favicon->storeAs('public', "favicon.png");
    return response()->json(['success' => 'Favicon uploaded successfully.']);
});


