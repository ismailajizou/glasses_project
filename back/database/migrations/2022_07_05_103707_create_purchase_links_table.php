<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePurchaseLinksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('purchase_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('glasses_id')->constrained()->onDelete('cascade');
            $table->foreignId("provider_id")->constrained()->onDelete('cascade');
            $table->string("link");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('purchase_links');
    }
}
