<?php

use App\Http\Controllers\{AdminDashboardController, GlassesController, BrandsController, CollectionsController, FrameColorController, FrameMaterialController, LensColorController};
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

// administrative routes
Route::get("/admin/dashboard", [AdminDashboardController::class, "index"])->middleware("auth");

// Glasses routes
Route::get("/glasses", [GlassesController::class, "index"]);
Route::post("/glasses/add", [GlassesController::class, "store"])->middleware("auth");
Route::get("/glasses/{id}", [GlassesController::class, "show"]);
Route::delete("/glasses/{id}", [GlassesController::class, "destroy"])->middleware("auth");
Route::post("/glasses/{id}", [GlassesController::class, "edit"])->middleware("auth");
Route::get("glasses/{ref}/model", [GlassesController::class, "model"]);

// Brand routes
Route::get("/brands", [BrandsController::class, "index"]);
Route::post("/brands/add", [BrandsController::class, "store"])->middleware("auth");
Route::post("/brands/{id}", [BrandsController::class, "edit"])->middleware("auth");
Route::delete("/brands/{id}", [BrandsController::class, "destroy"])->middleware("auth");
Route::post("/brands/{id}/restore", [BrandsController::class, "restore"])->middleware("auth");

// collections routes
Route::get("/collections", [CollectionsController::class, "index"]);
Route::post("/collections/add", [CollectionsController::class, "store"])->middleware("auth");
Route::get("/collections/{id}", [CollectionsController::class, "show"]);
Route::post("/collections/{id}", [CollectionsController::class, "edit"])->middleware("auth");
Route::delete("/collections/{id}", [CollectionsController::class, "destroy"])->middleware("auth");
Route::post("/collections/{id}/restore", [CollectionsController::class, "restore"])->middleware("auth");

// Manipulate frames colors
Route::get("/frames/colors", [FrameColorController::class, "index"])->middleware("auth");
Route::post("/frames/colors/add", [FrameColorController::class, "store"])->middleware("auth");
Route::post("/frames/colors/{id}", [FrameColorController::class, "edit"])->middleware("auth");
Route::delete("/frames/colors/{id}", [FrameColorController::class, "destroy"])->middleware("auth");
Route::post("/frames/colors/{id}/restore", [FrameColorController::class, "restore"])->middleware("auth");

// manipulate lens colors
Route::get("/lens/colors", [LensColorController::class, "index"])->middleware("auth");
Route::post("/lens/colors/add", [LensColorController::class, "store"])->middleware("auth");
Route::post("/lens/colors/{id}", [LensColorController::class, "edit"])->middleware("auth");
Route::delete("/lens/colors/{id}", [LensColorController::class, "destroy"])->middleware("auth");
Route::post("/lens/colors/{id}/restore", [LensColorController::class, "restore"])->middleware("auth");


// manipulate frames materials
Route::get("/frames/materials", [FrameMaterialController::class, "index"])->middleware("auth");
Route::post("/frames/materials/add", [FrameMaterialController::class, "store"])->middleware("auth");
Route::post("/frames/materials/{id}", [FrameMaterialController::class, "edit"])->middleware("auth");
Route::delete("/frames/materials/{id}", [FrameMaterialController::class, "destroy"])->middleware("auth");
Route::post("/frames/materials/{id}/restore", [FrameMaterialController::class, "restore"])->middleware("auth");




require __DIR__ . '/auth.php';
require __DIR__ . '/assets.php';
