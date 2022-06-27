<?php

use App\Http\Controllers\GlassesController;
use App\Models\{Collection, Brand, FrameColor, FrameMaterial, FrameShape, LensColor};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get("/glasses/form/all", [GlassesController::class, "formInfo"])->name("form.info");

Route::get("/brands", function (){return Brand::all();})->name("brands");
Route::get("/collections", function (){return Collection::all();})->name("collections");
// Frame routes
Route::get("/frame/shapes",function(){return FrameShape::all();})->name("frame.shapes");
Route::get("/frame/colors",function(){return FrameColor::all();})->name("frame.colors");
Route::get("/frame/materials",function(){return FrameMaterial::all();})->name("frame.materials");
// Lens routes
Route::get("/lens/colors",function(){return LensColor::all();})->name("lens.colors");



