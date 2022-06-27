<?php

namespace Database\Seeders;

use App\Models\Glasses;
use Database\Factories\GlassesFactory;
use Illuminate\Database\Seeder;

class GlassesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Glasses::factory()->count(32)->create();
    }
}
