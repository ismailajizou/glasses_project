<?php

use App\Http\Controllers\{GlassesController, BrandsController, CollectionsController};
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

// Glasses routes
Route::post("/glasses/add", [GlassesController::class, "store"])
    ->middleware("auth")
    ->name('glasses.store');
Route::get("/glasses", [GlassesController::class, "index"])
    ->name("glasses.index");
Route::get("/glasses/{id}", [GlassesController::class, "show"])
    ->name("glasses.show");
Route::delete("/glasses/{id}", [GlassesController::class, "destroy"])
    ->middleware("auth")
    ->name("glasses.destroy");
Route::post("/glasses/{id}", [GlassesController::class, "edit"])
    ->middleware("auth")
    ->name("glasses.edit");

// Brand routes
Route::get("/brands", [BrandsController::class, "index"])
    ->name("brands.index");
Route::post("/brands/{id}", [BrandsController::class, "edit"])
    ->middleware("auth")
    ->name("brands.edit");

Route::post("/brands/add", [BrandsController::class, "store"])
    ->middleware("auth")
    ->name('brands.store');

Route::delete("/brands/{id}", [BrandsController::class, "destroy"])
    ->middleware("auth")
    ->name("brands.destroy");

Route::post("/brands/{id}/restore", [BrandsController::class, "restore"])
    ->middleware("auth")
    ->name("brands.restore");

// collections routes
Route::get("/collections", [CollectionsController::class, "index"])
    ->name("collections.index");

Route::post("/collections/add", [CollectionsController::class, "store"])
    ->middleware("auth")
    ->name('collections.store');
    
Route::get("/collections/{id}", [CollectionsController::class, "show"])
    ->name("collections.show");

Route::post("/collections/{id}", [CollectionsController::class, "edit"])
    ->middleware("auth")
    ->name("collections.edit");


Route::delete("/collections/{id}", [CollectionsController::class, "destroy"])
    ->middleware("auth")
    ->name("collections.destroy");

Route::post("/collections/{id}/restore", [CollectionsController::class, "restore"])
    ->middleware("auth")
    ->name("collections.restore");



require __DIR__ . '/auth.php';
require __DIR__ . '/assets.php';
