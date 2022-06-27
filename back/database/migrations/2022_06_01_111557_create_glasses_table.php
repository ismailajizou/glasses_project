<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGlassesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('glasses', function (Blueprint $table) {
            $table->id();
            $table->string("ref")->unique();
            $table->text("description");
            $table->double("price");
            $table->enum('gender', ["male", "female"]);
            $table->string("feature_image")->unique();
            $table->string("model3d")->unique();
            // Foreign keys
            $table->foreignId('brand_id')->constrained();
            $table->foreignId('collection_id')->constrained();

            // frame columns
            $table->enum("frame_type", ["full rim", "half rim", "rimless"]);
            $table->foreignId('frame_color_id')->constrained();
            // $table->foreignId('frame_type_id')->constrained();
            $table->foreignId('frame_shape_id')->constrained();
            $table->foreignId('frame_material_id')->constrained();
            // lens columns
            $table->enum("lens_type", ["", "mirror"]);
            // $table->foreignId('lens_type_id')->constrained();
            $table->foreignId('lens_color_id')->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('glasses');
    }
}
