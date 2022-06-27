<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\{DB, Schema};

class CreateBrandsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('brands', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); 
        });
        DB::table('brands')->insert([
            ["id" => 1, "name" => "Ray-BanAdd"],
            ["id" => 2, "name" => "CarreraAdd"],
            ["id" => 3, "name" => "OakleyAdd"],
            ["id" => 4, "name" => "AliExpressAdd"],
            ["id" => 5, "name" => "OthersAdd"],
            ["id" => 6, "name" => "PersolAdd"],
            ["id" => 7, "name" => "Polaroid"],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('brands');
    }
}
