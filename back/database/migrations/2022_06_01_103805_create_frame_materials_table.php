<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\{Schema, DB};

class CreateFrameMaterialsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('frame_materials', function (Blueprint $table) {
            $table->id();
            $table->string("name")->unique();
        });
        DB::table('frame_materials')->insert([
            ["id" => 1, "name" => "aluminium"],
            ["id" => 2, "name" => "wood"],
            ["id" => 3, "name" => "leather"],
            ["id" => 4, "name" => "metal"],
            ["id" => 5, "name" => "fabric"],
            ["id" => 6, "name" => "carbon"],
            ["id" => 7, "name" => "plastic"],
            ["id" => 8, "name" => "titanium"],
            ["id" => 9, "name" => "cardboard"],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('frame_materials');
    }
}
