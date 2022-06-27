<?php

namespace App\Http\Controllers;

use App\Models\LensColor;
use Illuminate\Http\Request;

class LensController extends Controller
{
    //
    public static function getAllInfo(){
        $info = [
            "colors" => LensColor::all(),
        ];
        return $info ;
    }
}
