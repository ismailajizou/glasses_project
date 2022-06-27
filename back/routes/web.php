<?php

use App\Http\Controllers\GlassesController;
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
Route::post("/glasses/{id}/edit", [GlassesController::class, "edit"])
    ->middleware("auth")
    ->name("glasses.edit");


require __DIR__ . '/auth.php';
require __DIR__.'/assets.php';
