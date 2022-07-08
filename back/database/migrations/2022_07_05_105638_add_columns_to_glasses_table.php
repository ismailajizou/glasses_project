<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToGlassesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('glasses', function (Blueprint $table) {
            $table->double('price_with_discount')->nullable();
            $table->string("title");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('glasses', function (Blueprint $table) {
            $table->dropColumn(['price_with_discount', 'title']);
        });
    }
}
