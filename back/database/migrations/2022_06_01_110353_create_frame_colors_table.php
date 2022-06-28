<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\{Schema, DB};

class CreateFrameColorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('frame_colors', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string("code");
            $table->softDeletes();
        });
        DB::table("frame_colors")->insert([
            ["id" => 1, "name" => "blue", "code" => "#0A91F8"],
            ["id" => 2, "name" => "grey", "code" => "#666666"],
            ["id" => 3, "name" => "pink", "code" => "#FF33B8"],
            ["id" => 4, "name" => "orange", "code" => "#FF9A1D"],
            ["id" => 5, "name" => "copper", "code" => "#B87333"],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('frame_colors');
    }
}
