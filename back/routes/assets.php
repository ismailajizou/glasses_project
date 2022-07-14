<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Route;
use Intervention\Image\Facades\Image;
use Nette\Utils\Random;

Route::get('features/{filename}', function ($filename)
{
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
Route::get('models/{filename}', function ($filename)
{
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
Route::get('logo.png', function ()
{
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
Route::post('upload/logo', function (Request $req)
{
    // validate request logo
    $req->validate([
        'logo' => 'required|image|mimes:jpeg,png,jpg|max:2048',
    ]);
    $logo = request()->file('logo');
    $logo->storeAs('public', "logo.png");
    return response()->json(['success' => 'Logo uploaded successfully.']);
});

// get favicon
Route::get('favicon.png', function ()
{
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

// upload favicon
Route::post('upload/favicon', function (Request $req)
{
    // validate request logo
    $req->validate([
        'favicon' => 'required|image|mimes:jpeg,png,jpg,|max:2048',
    ]);
    $favicon = request()->file('favicon');
    $favicon->storeAs('public', "favicon.png");
    return response()->json(['success' => 'Favicon uploaded successfully.']);
});

// handle screenshots upload by getting a base64 string and converting it to a file
Route::post('screenshot/', function (Request $req)
{
    $req->validate([
        'screenshot' => 'required|string',
    ]);
    
    $screenshot = request()->input('screenshot');    
    // convert screenshot from base64 to png
    $screenshot = Image::make($screenshot)->encode('png');
    $path = storage_path('app/public/screenshots/' . Random::generate(15) . '.png');
    $screenshot->save($path);
    return response()->json(['success' => 'Screenshot uploaded successfully.']);
    
});

// get screenshot
Route::get('screenshot/{filename}', function ($filename)
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
});

// delete screenshot
Route::delete('screenshot/{filename}', function ($filename)
{
    $path = storage_path('app/public/screenshots/' . $filename);
    if (!File::exists($path)) {
        abort(404);
    }
    File::delete($path);
    return response()->json(['success' => 'Screenshot deleted successfully.']);
});