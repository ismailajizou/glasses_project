<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\{Schema, DB};

class CreateFrameShapesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('frame_shapes', function (Blueprint $table) {
            $table->id();
            $table->string("name")->unique();
        });
        DB::table('frame_shapes')->insert([
            ["id" => 1, "name" => "rectangle"],
            ["id" => 2, "name" => "square"],
            ["id" => 3, "name" => "rounded"],
            ["id" => 4, "name" => "cateye"],
            ["id" => 5, "name" => "browline"],
            ["id" => 6, "name" => "aviator"],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('frame_shapes');
    }
}
